from rest_framework import serializers

# Poll serializer.
class PollSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=113, required=True)
    description = serializers.CharField(
        max_length=313, required=False, allow_blank=True)
    privacy = serializers.CharField(max_length=14, required=True)
    category = serializers.CharField(max_length=50, required=True)

    def validate_privacy(self, value):
        # If privacy is not valid or undefined.
        privacy_list = ['public', 'private', 'friends_only']
        if not value in privacy_list:
            raise serializers.ValidationError('This field is required.')

        return value


# Options serializer.
class OptionsSerializer(serializers.Serializer):
    options = serializers.ListField(
        child=serializers.CharField(max_length=113, required=True),
        required=True
    )

    def validate_options(self, value):
        if len(value) <= 1:
            raise serializers.ValidationError('Minimum 2 options allowed.')
        elif len(value) >= 18:
            raise serializers.ValidationError('Maximum 18 options allowed.')

        return value
    
# Option serializer.
class OptionSerializer(serializers.Serializer):
    option_text = serializers.CharField(max_length=113, required=True)
