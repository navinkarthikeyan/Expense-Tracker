# Expensify
Expensify is an Expense Tracker Application , where users can log daily expenses , sort them , categorize them, and gain insights through analytics and reports. 
Admins can set budgets and users can track their expenses against these limits.

## Features
- **Expense Logging**: Users can log daily expenses with categories.
- **Budget Management**: Admins can set and manage budgets.
- **Expense Tracking**: Users can track expenses against their budgets.
- **Analytics and Reports**: Visualize expense data and generate reports.

## Getting Started
### **Roles in Expensify**

Expensify supports different roles to manage and interact with expenses effectively. Each role has specific permissions and functionalities:

#### **1. Users**

- **Expense Logging**: Users can log their daily expenses, ensuring that all spending is recorded accurately.
- **Category Management**: Users can set and manage expense categories to organize their expenses better.
- **Budget Tracking**: Users can view their allocated budget and track how their expenses align with their budgetary limits.

#### **2. Members**

- **Expense Logging**: Similar to Users, Members can log their daily expenses.
- **Category Management**: Members can also set and manage expense categories.
- **Budget Tracking**: Members can view their allocated budgets and track their expenses against these budgets.
- **Monthly Budget Modification**: Members have the ability to modify their monthly budget within the limits set by an Admin.
- **Analytics Page**: Members can access and view analytics and reports to gain insights into their spending patterns.

#### **3. Admins**

- **Role Management**: Admins can manage user roles and permissions, ensuring that each user or member has the appropriate access.
- **Budget Allocation**: Admins can allocate budgets for different users
- **Overall Reports**: Admins can generate overall reports
 

### **Prerequisites**

To get started with Expensify, ensure you have the following prerequisites:

- **[Yarn](https://yarnpkg.com/)**: A package manager for JavaScript that you'll need to install dependencies.
- **Database Migrations**: Run the following commands to set up your database:
  ```bash
  python manage.py makemigrations
  python manage.py migrate




