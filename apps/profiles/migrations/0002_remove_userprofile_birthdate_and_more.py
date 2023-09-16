# Generated by Django 4.2.4 on 2023-09-10 23:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userprofile',
            name='birthdate',
        ),
        migrations.RemoveField(
            model_name='userprofile',
            name='gender',
        ),
        migrations.AddField(
            model_name='userprofile',
            name='pronouns',
            field=models.CharField(blank=True, choices=[('they/them', 'They/Them'), ('she/her', 'She/Her'), ('he/him', 'He/Him')], max_length=10),
        ),
    ]