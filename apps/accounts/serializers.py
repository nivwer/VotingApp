from django.contrib.auth.models import User
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

    def validate_username(self, value):
        if len(value) < 3:  
            raise serializers.ValidationError("Minimum 18 options allowed.")
        if len(value) > 32:  
            raise serializers.ValidationError("Maximum 32 options allowed.")
        return value

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Minimum 8 options allowed.")
        if len(value) > 98:
            raise serializers.ValidationError("Maximum 96 options allowed.")
        return value
    
    def validate_first_name(self, value):
        if len(value) < 3:  
            raise serializers.ValidationError("Min 3 digits.")
        if len(value) > 32:  
            raise serializers.ValidationError("Max 32 digits.")
        return value