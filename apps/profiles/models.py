from django.contrib.auth.models import User
from django.db import models

# Create your models here.


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    profile_name = models.CharField(max_length=32, blank=True)
    website_link = models.URLField(max_length=200, blank=True)
    social_link_one = models.URLField(max_length=200, blank=True)
    social_link_two = models.URLField(max_length=200, blank=True)
    social_link_three = models.URLField(max_length=200, blank=True)

    profile_picture = models.URLField(max_length=200, blank=True)
    pronouns = models.CharField(max_length=10, choices=[
        ('they/them', 'They/Them'),
        ('she/her', 'She/Her'),
        ('he/him', 'He/Him'),
    ], blank=True)
    bio = models.TextField(max_length=513, blank=True)
    country = models.CharField(max_length=50, blank=True)
    city = models.CharField(max_length=50, blank=True)
    timezone = models.CharField(max_length=50, blank=True)
    interests = models.TextField(blank=True)

    def __str__(self):
        return self.user.usernames

    # preferred_language = models.CharField(max_length=20, blank=True)
    # theme_mode = models.CharField(max_length=20, blank=True)
    # theme_color = models.CharField(max_length=20, blank=True)
