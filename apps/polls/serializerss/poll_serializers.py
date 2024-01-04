from datetime import datetime
from rest_framework import serializers


class PollSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=113, required=True)
    description = serializers.CharField(max_length=313, required=False, allow_blank=True)
    privacy = serializers.CharField(max_length=14, required=True)
    category = serializers.CharField(max_length=50, required=True)

    def create(self, validated_data):
        validated_data["user_id"] = self.context["user_id"]
        validated_data["created_at"] = datetime.now()

        validated_data["voters"] = []
        validated_data["votes_counter"] = 0
        validated_data["shares_counter"] = 0
        validated_data["bookmarks_counter"] = 0
        validated_data["comments_counter"] = 0

        return validated_data

    def validate_privacy(self, value):
        privacy_list = ["public", "private"]
        if not value in privacy_list:
            message: str = "Field 'privacy' is required."
            raise serializers.ValidationError(message)

        return value


class OptionsSerializer(serializers.Serializer):
    options = serializers.ListField(
        child=serializers.CharField(max_length=113, required=True), required=True
    )

    def validate_options(self, value):
        if len(value) <= 1:
            message: str = "Minimum 2 options allowed."
            raise serializers.ValidationError(message)
        elif len(value) >= 18:
            message: str = "Maximum 18 options allowed."
            raise serializers.ValidationError(message)

        return value


class OptionSerializer(serializers.Serializer):
    option_text = serializers.CharField(max_length=113, required=True)
