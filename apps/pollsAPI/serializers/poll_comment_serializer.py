from rest_framework import serializers


class PollCommentSerializer(serializers.Serializer):
    comment = serializers.CharField(max_length=143, required=True)
