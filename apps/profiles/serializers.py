from .models import UserProfile
from rest_framework import serializers


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'

    # def validate_username(self, value):
    #     if len(value) < 3:
    #         raise serializers.ValidationError("Min 3 digits.")
    #     if len(value) > 32:
    #         raise serializers.ValidationError("Max 32 digits.")
    #     return value
