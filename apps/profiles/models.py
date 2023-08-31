from django.contrib.auth.models import User
from django.db import models

# Create your models here.


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    social_links = models.URLField(max_length=200, blank=True)
    gender = models.CharField(max_length=10, choices=[(
        'male', 'Male'), ('female', 'Female'), ('other', 'Other')], blank=True)
    bio = models.TextField(max_length=513, blank=True)
    theme_mode = models.CharField(max_length=20, blank=True)
    theme_color = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return self.user.username
