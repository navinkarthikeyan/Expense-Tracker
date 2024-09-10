from django.contrib.auth.models import AbstractUser,PermissionsMixin
from django.db import models
from .managers import CustomUserManager
from django.conf import settings



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

class Category(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='categories')
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Expense(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='expenses')
    amount = models.IntegerField(max_length=10)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='expenses')
    date = models.DateField()
    
    def __str__(self):
        return f"{self.category} - {self.amount}"

class Budget(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='budgets')
    amount = models.IntegerField(max_length=10)

    def _tr__(self):
        return f"{self.user.username} - {self.amount}"

from django.db import models
from django.conf import settings

class BudgetMonthly(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='budget_monthly')
    
    # Monthly budget fields
    january = models.IntegerField(max_length=10, default=0)
    february = models.IntegerField(max_length=10, default=0)
    march = models.IntegerField(max_length=10, default=0)
    april = models.IntegerField(max_length=10, default=0)
    may = models.IntegerField(max_length=10, default=0)
    june = models.IntegerField(max_length=10, default=0)
    july = models.IntegerField(max_length=10, default=0)
    august = models.IntegerField(max_length=10, default=0)
    september = models.IntegerField(max_length=10, default=0)
    october = models.IntegerField(max_length=10, default=0)
    november = models.IntegerField(max_length=10, default=0)
    december = models.IntegerField(max_length=10, default=0)
    
    # Total amount field
    total_amount = models.IntegerField(max_length=12)

    def cculate_total(self):
        # Method to calculate the total amount
        self.total_amount = (
            self.january + self.february + self.march + self.april +
            self.may + self.june + self.july + self.august +
            self.september + self.october + self.november + self.december
        )
        self.save()

    def __str__(self):
        return f"{self.user.username} - Total Budget: {self.total_amount}"


    
