# Generated by Django 5.1 on 2024-09-09 15:57

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0009_budget_month'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='budget',
            name='month',
        ),
    ]
