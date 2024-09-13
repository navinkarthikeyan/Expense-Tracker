from django.contrib.auth.models import AbstractUser,PermissionsMixin
from django.db import models
from .managers import CustomUserManager
from django.conf import settings



class CustomUser(AbstractUser,PermissionsMixin):
    USER = 'user'
    ADMIN = 'admin'
    MEMBER = 'member'
    ROLE_CHOICES = [
        (USER, 'User'),
        (ADMIN, 'Admin'),
        (MEMBER, 'Member')
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
    amount = models.IntegerField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='expenses')
    date = models.DateField()
    
    def __str__(self):
        return f"{self.category} - {self.amount}"

class Budget(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='budgets')
    amount = models.IntegerField()

    def _tr__(self):
        return f"{self.user.username} - {self.amount}"


class BudgetMonthly(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='budget_monthly')
    
    # Monthly budget fields
    january = models.IntegerField(default=0)
    february = models.IntegerField(default=0)
    march = models.IntegerField(default=0)
    april = models.IntegerField(default=0)
    may = models.IntegerField(default=0)
    june = models.IntegerField(default=0)
    july = models.IntegerField(default=0)
    august = models.IntegerField(default=0)
    september = models.IntegerField(default=0)
    october = models.IntegerField(default=0)
    november = models.IntegerField(default=0)
    december = models.IntegerField(default=0)
    
    # Total amount field
    total_amount = models.IntegerField()

    def caculate_total(self):
        # Method to calculate the total amount
        self.total_amount = (
            self.january + self.february + self.march + self.april +
            self.may + self.june + self.july + self.august +
            self.september + self.october + self.november + self.december
        )
        self.save()

    def __str__(self):
        return f"{self.user.username} - Total Budget: {self.total_amount}"


    
