from apps.accounts.models.user_profile_model import UserProfile
from rest_framework import serializers


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = "__all__"

    def validate_name(self, value):
        if len(value) < 3:
            message: str = "Minimum 3 characters allowed."
            raise serializers.ValidationError(detail=message)
        if len(value) > 32:
            message: str = "Maximum 32 characters allowed."
            raise serializers.ValidationError(detail=message)
        return value
