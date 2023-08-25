from django.contrib.auth.models import User
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

    def validate_username(self, value):
        if len(value) < 3:  
            raise serializers.ValidationError("Min 3 digits.")
        if len(value) > 32:  
            raise serializers.ValidationError("Max 32 digits.")
        return value

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Min 8 digits.")
        if len(value) > 98:
            raise serializers.ValidationError("Max 96 digits.")
        return value
    
    def validate_first_name(self, value):
        if len(value) < 3:  
            raise serializers.ValidationError("Min 3 digits.")
        if len(value) > 32:  
            raise serializers.ValidationError("Max 32 digits.")
        return value