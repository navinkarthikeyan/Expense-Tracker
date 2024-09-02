from rest_framework import generics, status                         
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView    
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import BasePermission , IsAuthenticated
from django.contrib.auth import get_user_model , authenticate
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.template.loader import render_to_string
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.contrib.auth.models import User
from .models import CustomUser, Expense
from .serializers import RegisterSerializer, LoginSerializer, PasswordResetSerializer, PasswordResetConfirmSerializer, ExpenseSerializer
from rest_framework_simplejwt.tokens import RefreshToken


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
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer


class ExpenseListView(generics.ListAPIView):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer

