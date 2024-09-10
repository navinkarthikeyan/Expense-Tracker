from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView, 
    LoginView, 
    PasswordResetRequestView, 
    PasswordResetConfirmView, 
    ExpenseCreateView, 
    ExpenseListView, 
    ExpenseUpdateView, 
    ExpenseDeleteView, 
    CategoryListCreateView, 
    CategoryRetrieveUpdateDestroyView,
    SetBudgetView,        
    ViewBudgetView,       
    BudgetUpdateView,    
    BudgetDeleteView,
    UserViewSet,
    SetBudgetMonthlyView, ViewBudgetMonthlyView, UpdateBudgetMonthlyView, DeleteBudgetMonthlyView# Add the UserViewSet here
)

# Create a router for the UserViewSet
router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    
    path('expenses/', ExpenseListView.as_view(), name='expense-list'),
    path('expenses/create/', ExpenseCreateView.as_view(), name='expense-create'),
    path('expenses/update/<int:pk>/', ExpenseUpdateView.as_view(), name='expense-update'),
    path('expenses/delete/<int:pk>/', ExpenseDeleteView.as_view(), name='expense-delete'),
    
    path('categories/', CategoryListCreateView.as_view(), name='category-list-create'),
    path('categories/<int:pk>/', CategoryRetrieveUpdateDestroyView.as_view(), name='category-retrieve-update-destroy'),
    
    path('budgets/set/', SetBudgetView.as_view(), name='set-budget'), 
    path('budgets/view/', ViewBudgetView.as_view(), name='view-budget'),  
    path('budgets/update/<str:username>/', BudgetUpdateView.as_view(), name='update-budget'),  
    path('budgets/delete/<str:username>/', BudgetDeleteView.as_view(), name='delete-budget'),  
    
    path('budget-monthly/set/', SetBudgetMonthlyView.as_view(), name='set-budget-monthly'),
    path('budget-monthly/view/', ViewBudgetMonthlyView.as_view(), name='view-budget-monthly'),
    path('budget-monthly/update/<str:username>/', UpdateBudgetMonthlyView.as_view(), name='update-budget-monthly'),
    path('budget-monthly/delete/<str:username>/', DeleteBudgetMonthlyView.as_view(), name='delete-budget-monthly'),
    
   
    path('', include(router.urls)), 
]
