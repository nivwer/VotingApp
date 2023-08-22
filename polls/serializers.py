from rest_framework import serializers


class PollSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=113, required=True)
    description = serializers.CharField(max_length=513, required=False)
    privacy = serializers.CharField(max_length=14, required=False)
    category = serializers.CharField(max_length=50, required=False)

class OptionsSerializer(serializers.Serializer):
    options = serializers.ListField(
        child=serializers.CharField(max_length=100, required=True),
        required=True
    )

class OptionSerializer(serializers.Serializer):
    option_text = serializers.CharField(max_length=100, required=True)
