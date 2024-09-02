from django.urls import path
from .views import RegisterView, LoginView, PasswordResetRequestView, PasswordResetConfirmView, ExpenseCreateView, ExpenseListView, ExpenseUpdateView, ExpenseDeleteView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('expenses/', ExpenseListView.as_view(), name='expense-list'),
    path('expenses/create/', ExpenseCreateView.as_view(), name='expense-create'),
    path('expenses/update/<int:pk>/', ExpenseUpdateView.as_view(), name='expense-update'),
    path('expenses/delete/<int:pk>/', ExpenseDeleteView.as_view(), name='expense-delete'),
]
