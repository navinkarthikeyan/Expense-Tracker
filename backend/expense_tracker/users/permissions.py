from rest_framework import permissions

class IsMemberOrAdmin(permissions.BasePermission):
    """
    Custom permission to only allow users with the 'member' or 'admin' role to update the budget.
    """

    def has_permission(self, request, view):
        
        return request.user.is_authenticated and request.user.role in ['member', 'admin']
