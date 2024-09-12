from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.password_validation import validate_password
from .models import Expense, Category, Budget, BudgetMonthly

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'email','role')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})

        return attrs
    
    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            role=validated_data.get('role', 'user')        
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
    role = serializers.CharField(read_only=True)     

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        if username and password:
            user = authenticate(request=self.context.get('request'), username=username, password=password)

            if not user:
                raise serializers.ValidationError('Invalid credentials')
        else:
            raise serializers.ValidationError('Must include "username" and "password".')

        attrs['user'] = user
        return attrs

class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()
    
class PasswordResetConfirmSerializer(serializers.Serializer):
    uidb64 = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(max_length=16)
    
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']
    
class ExpenseSerializer(serializers.ModelSerializer):
    category = serializers.SlugRelatedField(
        slug_field='name',
        queryset=Category.objects.none()  # Default to an empty queryset
    )

    class Meta:
        model = Expense
        fields = ['id', 'user', 'amount', 'category', 'date']
        read_only_fields = ['id', 'user']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Ensure category queryset is restricted to the categories of the current user
        self.fields['category'].queryset = Category.objects.filter(user=self.context['request'].user)
    
    def validate_amount(self, value):
        if value < 0:
            raise serializers.ValidationError("Amount cannot be below 0.")
        return value

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data.pop('user', None)
        return Expense.objects.create(user=user, **validated_data)


class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = ['user', 'amount']
        read_only_fields = ['user']
    
    def validate_amount(self, value):
        if value < 0:
            raise serializers.ValidationError("The budget amount must be greater than or equal to zero.")
        return value
        
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'role', 'is_active', 'is_staff', 'is_superuser']

class BudgetMonthlySerializer(serializers.ModelSerializer):
    class Meta:
        model = BudgetMonthly
        fields = [
            'user', 
            'january', 
            'february', 
            'march', 
            'april', 
            'may', 
            'june', 
            'july', 
            'august', 
            'september', 
            'october', 
            'november', 
            'december', 
            'total_amount'
        ]
        read_only_fields = ['user', 'total_amount']