from rest_framework import generics, status, permissions, viewsets, serializers                   
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView    
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import BasePermission , IsAuthenticated, IsAdminUser
from django.contrib.auth import get_user_model , authenticate
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.template.loader import render_to_string
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.contrib.auth.models import User
from .models import CustomUser, Expense, Category, Budget, BudgetMonthly
from .serializers import RegisterSerializer, LoginSerializer, PasswordResetSerializer, PasswordResetConfirmSerializer, ExpenseSerializer, CategorySerializer, BudgetSerializer, CustomUserSerializer,BudgetMonthlySerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from django.db.models import Sum
from .permissions import IsMemberOrAdmin


User = get_user_model()

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == CustomUser.ADMIN

class SomeAdminView(APIView):
    permission_classes = [IsAdmin]
    
    def get(self, request):
        return Response({"message": "Admin access granted"}, status=status.HTTP_200_OK)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    refresh['user_id'] = user.pk
    refresh['email'] = user.email
    refresh['role'] = user.role
    return str(refresh.access_token)


class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        # token, created = Token.objects.get_or_create(user=user)
        token = get_tokens_for_user(user)
        response = Response({
            'token': token,
            'user_id': user.pk,
            'email': user.email,
            'role': user.role,
        })
        # response.set_cookie('token', token, max_age=3600*24*7, secure=False, httponly=False, samesite='None')
        return response 

class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        serializer = PasswordResetSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data['email']
        user = User.objects.filter(email=email).first()
        
        if user:
            
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            mail_subject = 'Password Reset Request'
            message = render_to_string('password_reset_email.html', {
                'user': user,
                'uid': uid,
                'token': token,
                'protocol': 'http',
                'domain': request.get_host(),
            })
            send_mail(mail_subject, message, 'from@example.com', [email])
        
        return Response({'message': 'Password reset email sent (if the email is registered).'}, status=status.HTTP_200_OK)
  
class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        uidb64 = serializer.validated_data['uidb64']
        token = serializer.validated_data['token']
        new_password = serializer.validated_data['new_password']
        print(new_password,uidb64,token)
        
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user and default_token_generator.check_token(user, token):
            user.set_password(new_password)
            user.save()
            return Response({'message': 'Password has been reset successfully.'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid token or user ID.'}, status=status.HTTP_400_BAD_REQUEST)
        
class ExpenseCreateView(generics.CreateAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        user = self.request.user
        amount = serializer.validated_data['amount']
        date = serializer.validated_data['date']
        month = date.strftime('%B').lower() 

       
        try:
            budget_monthly = BudgetMonthly.objects.get(user=user)
        except BudgetMonthly.DoesNotExist:
            raise ValidationError({"error": "No monthly budget set for this user."})

       
        monthly_budget = getattr(budget_monthly, month)

       
        total_expenses_for_month = Expense.objects.filter(user=user, date__month=date.month).aggregate(Sum('amount'))['amount__sum'] or 0

        
        if total_expenses_for_month + amount > monthly_budget:
            remaining_budget = monthly_budget - total_expenses_for_month
            raise ValidationError({"error": f"Expense exceeds the budget for {date.strftime('%B')}. Remaining budget: {remaining_budget}"})

       
        serializer.save(user=user)


class ExpenseListView(generics.ListAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        # Check if the user is an admin
        if user.is_superuser or (hasattr(user, 'role') and user.role == 'admin'):
            # If the user is admin, return all expenses
            return Expense.objects.all()
        else:
            # If the user is not admin, return only their own expenses
            return Expense.objects.filter(user=user)

class ExpenseUpdateView(generics.UpdateAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user)

class ExpenseDeleteView(generics.DestroyAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user)

class CategoryListCreateView(generics.ListCreateAPIView):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class CategoryRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)


class SetBudgetView(generics.CreateAPIView):
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        username = self.request.data.get('username')
        user = get_object_or_404(CustomUser, username=username)
        budget = serializer.save(user=user)
        
      
        if self.request.user: 
            amount_per_month = budget.amount / 12
            total_amount = budget.amount  

            
            BudgetMonthly.objects.create(
                user=user,
                january=amount_per_month,
                february=amount_per_month,
                march=amount_per_month,
                april=amount_per_month,
                may=amount_per_month,
                june=amount_per_month,
                july=amount_per_month,
                august=amount_per_month,
                september=amount_per_month,
                october=amount_per_month,
                november=amount_per_month,
                december=amount_per_month,
                total_amount=total_amount
            )




class ViewBudgetView(generics.ListAPIView):
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)
    
class BudgetUpdateView(generics.UpdateAPIView):
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer
    permission_classes = [permissions.IsAdminUser]  

    def get_object(self):
        username = self.kwargs.get('username')  
        user = get_object_or_404(get_user_model(), username=username)
        return get_object_or_404(Budget, user=user)  

    def perform_update(self, serializer):
        budget = serializer.save()  
        
       
        try:
            budget_monthly = BudgetMonthly.objects.get(user=budget.user)
            amount_per_month = budget.amount / 12
            total_amount = budget.amount 
            
            
            budget_monthly.january = amount_per_month
            budget_monthly.february = amount_per_month
            budget_monthly.march = amount_per_month
            budget_monthly.april = amount_per_month
            budget_monthly.may = amount_per_month
            budget_monthly.june = amount_per_month
            budget_monthly.july = amount_per_month
            budget_monthly.august = amount_per_month
            budget_monthly.september = amount_per_month
            budget_monthly.october = amount_per_month
            budget_monthly.november = amount_per_month
            budget_monthly.december = amount_per_month
            budget_monthly.total_amount = total_amount  
            
          
            budget_monthly.save()
        except BudgetMonthly.DoesNotExist:
           
            pass


class BudgetDeleteView(generics.DestroyAPIView):
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer
    permission_classes = [IsAdminUser]  

    def get_object(self):
        username = self.kwargs.get('username') 
        user = get_object_or_404(get_user_model(), username=username)
        return get_object_or_404(Budget, user=user)
    
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.IsAdminUser]

    @action(detail=True, methods=['patch'], permission_classes=[permissions.IsAdminUser])
    def change_role(self, request, pk=None):
        user = self.get_object()
        new_role = request.data.get('role')
        
        if new_role == 'admin':
            user.role = 'admin'
            user.is_staff = True
            user.is_superuser = True
            user.is_active = True  
        elif new_role == 'user':
            user.role = 'user'
            user.is_staff = False
            user.is_superuser = False
        else:
            return Response({'error': 'Invalid role'}, status=status.HTTP_400_BAD_REQUEST)
        
       
        user.is_active = request.data.get('is_active', user.is_active)
        user.is_staff = request.data.get('is_staff', user.is_staff)
        user.is_superuser = request.data.get('is_superuser', user.is_superuser)

        user.save()
        serializer = self.get_serializer(user)
        return Response(serializer.data)

class SetBudgetMonthlyView(generics.CreateAPIView):
    queryset = BudgetMonthly.objects.all()
    serializer_class = BudgetMonthlySerializer
    permission_classes = [permissions.IsAdminUser] 

    def perform_create(self, serializer):
        budget = get_object_or_404(Budget, user=self.request.user)
        amount_per_month = budget.amount / 12

      
        budget_monthly = BudgetMonthly.objects.create(
            user=User,
            january=amount_per_month,
            february=amount_per_month,
            march=amount_per_month,
            april=amount_per_month,
            may=amount_per_month,
            june=amount_per_month,
            july=amount_per_month,
            august=amount_per_month,
            september=amount_per_month,
            october=amount_per_month,
            november=amount_per_month,
            december=amount_per_month,
        )
        
       
        budget_monthly.total_amount = (
            budget_monthly.january + budget_monthly.february + budget_monthly.march +
            budget_monthly.april + budget_monthly.may + budget_monthly.june +
            budget_monthly.july + budget_monthly.august + budget_monthly.september +
            budget_monthly.october + budget_monthly.november + budget_monthly.december
        )
        
        
        budget_monthly.save()



class ViewBudgetMonthlyView(generics.ListAPIView):
    serializer_class = BudgetMonthlySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return BudgetMonthly.objects.filter(user=self.request.user)



class UpdateBudgetMonthlyView(generics.UpdateAPIView):
    queryset = BudgetMonthly.objects.all()
    serializer_class = BudgetMonthlySerializer
    permission_classes = [permissions.IsAuthenticated, IsMemberOrAdmin]  

    def get_object(self):
        username = self.kwargs.get('username')
        user = get_object_or_404(get_user_model(), username=username)

        # Ensure that the authenticated user is the same as the requested user
        if self.request.user != user:
            raise serializers.ValidationError("You are not allowed to update another user's budget.")
        
        return get_object_or_404(BudgetMonthly, user=user)

    def perform_update(self, serializer):
        budget_monthly = self.get_object()
        budget = get_object_or_404(Budget, user=budget_monthly.user)

        monthly_data = {
            'january': self.request.data.get('january', budget_monthly.january),
            'february': self.request.data.get('february', budget_monthly.february),
            'march': self.request.data.get('march', budget_monthly.march),
            'april': self.request.data.get('april', budget_monthly.april),
            'may': self.request.data.get('may', budget_monthly.may),
            'june': self.request.data.get('june', budget_monthly.june),
            'july': self.request.data.get('july', budget_monthly.july),
            'august': self.request.data.get('august', budget_monthly.august),
            'september': self.request.data.get('september', budget_monthly.september),
            'october': self.request.data.get('october', budget_monthly.october),
            'november': self.request.data.get('november', budget_monthly.november),
            'december': self.request.data.get('december', budget_monthly.december),
        }

        total_provided = sum(monthly_data.values())

        # Ensure the total matches the budget amount
        if total_provided != budget.amount:
            raise serializers.ValidationError(
                f"The sum of monthly amounts ({total_provided}) does not equal the budget amount ({budget.amount})."
            )

        serializer.save(**monthly_data)




class DeleteBudgetMonthlyView(generics.DestroyAPIView):
    queryset = BudgetMonthly.objects.all()
    serializer_class = BudgetMonthlySerializer
    permission_classes = [permissions.IsAdminUser]

    def get_object(self):
        username = self.kwargs.get('username')
        user = get_object_or_404(get_user_model(), username=username)
        return get_object_or_404(BudgetMonthly, user=user)
