from apps.accounts.models.user_profile_model import UserProfile
from rest_framework import serializers


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = "__all__"

    def validate_name(self, value):
        if len(value) < 3:
            raise serializers.ValidationError("Minimum 3 characters allowed.")
        if len(value) > 32:
            raise serializers.ValidationError("Maximum 32 characters allowed.")
        return value
