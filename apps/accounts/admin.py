from django.contrib import admin
from django.contrib.auth.models import User
from .models.user_profile_model import UserProfile


admin.site.register(UserProfile)
