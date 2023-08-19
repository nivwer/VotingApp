from rest_framework import serializers


class PollSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=100, required=True)
    description = serializers.CharField(max_length=500, required=False)
    options = serializers.ListField(
        child=serializers.CharField(max_length=100, required=True),
        required=True
    )
    category = serializers.CharField(max_length=50, required=False)


class OptionSerializer(serializers.Serializer):
    option = serializers.CharField(max_length=100, required=True)
