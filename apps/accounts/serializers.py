from django.contrib.auth.models import User
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

    def validate_username(self, value):
        if len(value) < 3:
            raise serializers.ValidationError("Minimum 3 characters allowed.")
        if len(value) > 32:
            raise serializers.ValidationError("Maximum 32 characters allowed.")
        return value

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Minimum 8 characters allowed.")
        if len(value) > 10000:
            raise serializers.ValidationError("Maximum 96 characters allowed.")
        return value

    # def validate_first_name(self, value):
    #     if len(value) > 32:
    #         raise serializers.ValidationError("Maximum 32 characters allowed.")
    #     return value

    # def validate_last_name(self, value):
    #     if len(value) > 32:
    #         raise serializers.ValidationError("Maximum 32 characters allowed.")s
    #     return value
