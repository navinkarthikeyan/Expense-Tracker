# Generated by Django 5.1 on 2024-09-30 05:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0013_alter_customuser_role'),
    ]

    operations = [
        migrations.AlterField(
            model_name='budget',
            name='amount',
            field=models.IntegerField(),
        ),
        migrations.AlterField(
            model_name='budgetmonthly',
            name='april',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='budgetmonthly',
            name='august',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='budgetmonthly',
            name='december',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='budgetmonthly',
            name='february',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='budgetmonthly',
            name='january',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='budgetmonthly',
            name='july',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='budgetmonthly',
            name='june',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='budgetmonthly',
            name='march',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='budgetmonthly',
            name='may',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='budgetmonthly',
            name='november',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='budgetmonthly',
            name='october',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='budgetmonthly',
            name='september',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='budgetmonthly',
            name='total_amount',
            field=models.IntegerField(),
        ),
        migrations.AlterField(
            model_name='customuser',
            name='role',
            field=models.CharField(choices=[('user', 'User'), ('admin', 'Admin'), ('member', 'Member')], db_index=True, default='user', max_length=10),
        ),
        migrations.AlterField(
            model_name='customuser',
            name='username',
            field=models.CharField(db_index=True, max_length=255, unique=True),
        ),
        migrations.AlterField(
            model_name='expense',
            name='amount',
            field=models.IntegerField(),
        ),
    ]
