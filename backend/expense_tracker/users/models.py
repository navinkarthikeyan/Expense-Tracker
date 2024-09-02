from django.contrib.auth.models import AbstractUser,PermissionsMixin
from django.db import models
from .managers import CustomUserManager


class CustomUser(AbstractUser,PermissionsMixin):
    USER = 'user'
    ADMIN = 'admin'
    ROLE_CHOICES = [
        (USER, 'User'),
        (ADMIN, 'Admin'),
    ]
    
    username = models.CharField(max_length=255, unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default=USER)
    # is_active = models.BooleanField(default=True)
    # is_staff = models.BooleanField(default=False)
    
    objects = CustomUserManager()

    USERNAME_FIELD = 'username'
    
    def __str__(self):
        return self.username

class Expense(models.Model):
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=255)
    date = models.DateField()
    
    def __str__(self):
        return f"{self.category} - {self.amount}"