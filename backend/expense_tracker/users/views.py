from rest_framework import generics, status            #edit               
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from .serializers import RegisterSerializer, LoginSerializer
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from rest_framework.permissions import BasePermission , IsAuthenticated
from .models import CustomUser
from rest_framework.views import APIView    #edit
from rest_framework.authentication import TokenAuthentication


User = get_user_model()

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == CustomUser.ADMIN

class SomeAdminView(APIView):
    permission_classes = [IsAdmin]
    
    def get(self, request):
        # Your logic here
        return Response({"message": "Admin access granted"}, status=status.HTTP_200_OK)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'email': user.email,
            'role': user.role,
        })