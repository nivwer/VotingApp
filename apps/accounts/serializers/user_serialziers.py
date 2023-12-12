from django.contrib.auth.models import User
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"
        extra_kwargs = {
            "password": {"write_only": True},
        }

    def validate_username(self, value):
        if len(value) < 3:
            raise serializers.ValidationError("Minimum 3 characters allowed.")
        if len(value) > 32:
            raise serializers.ValidationError("Maximum 32 characters allowed.")
        return value

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Minimum 8 characters allowed.")
        if len(value) > 96:
            raise serializers.ValidationError("Maximum 96 characters allowed.")
        return value


class UserNewUsernameSerializer(serializers.Serializer):
    new_username = serializers.CharField(max_length=32, min_length=3, required=True)


class UserNewPasswordSerializer(serializers.Serializer):
    new_password = serializers.CharField(max_length=96, min_length=8, required=True)
    current_password = serializers.CharField(required=True)
