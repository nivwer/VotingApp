from django.contrib.auth.models import User
from apps.accounts.serializers.user_serialziers import (
    UserSerializer,
    UserNewUsernameSerializer,
    UserNewPasswordSerializer,
)
from rest_framework.exceptions import NotFound, ValidationError


class UserRepository:
    def create_user(self, data: dict, raise_exception: bool = True):
        serializer = UserSerializer(data=data)

        if raise_exception:
            serializer.is_valid(raise_exception=raise_exception)
        elif not serializer.is_valid():
            return None

        username = serializer.validated_data.get("username")
        password = serializer.validated_data.get("password")
        user = User.objects.create_user(username=username, password=password)
        return user

    def get_user_by_id(self, id: int, raise_exception: bool = False):
        try:
            return User.objects.get(id=id)
        except User.DoesNotExist:
            if raise_exception:
                raise NotFound(detail=f"User with ID {id} does not exist.")
            return None

    def get_user_by_username(self, username: str, raise_exception: bool = False):
        try:
            return User.objects.get(username=username)
        except User.DoesNotExist:
            if raise_exception:
                raise NotFound(detail=f"User with username {username} does not exist.")
            return None

    def get_user_by_email(self, email: str, raise_exception: bool = False):
        try:
            return User.objects.get(email=email)
        except User.DoesNotExist:
            if raise_exception:
                raise NotFound(detail=f"User with email {email} does not exist.")
            return None

    def username_exists(self, username: str):
        return User.objects.filter(username=username).exists()

    def email_exists(self, email: str):
        return User.objects.filter(email=email).exists()

    def check_password(self, instance: User, password: str):
        return instance.check_password(password)

    def update_username(self, instance: User, data: dict, raise_exception: bool = True):
        serializer = UserNewUsernameSerializer(data=data)

        if raise_exception:
            serializer.is_valid(raise_exception=raise_exception)
        elif not serializer.is_valid():
            return None

        new_username = serializer.validated_data["new_username"]
        if self.username_exists(username=new_username):
            if raise_exception:
                raise ValidationError(
                    detail={"username": ["A user with that username already exists."]}
                )
            else:
                return None

        instance.username = new_username
        instance.save()
        return instance

    def update_password(self, instance: User, data: dict, raise_exception: bool = True):
        serializer = UserNewPasswordSerializer(data=data)

        if raise_exception:
            serializer.is_valid(raise_exception=raise_exception)
        elif not serializer.is_valid():
            return None

        if not self.check_password(user=instance, password=data["current_password"]):
            if raise_exception:
                raise ValidationError(
                    detail={"current_password": ["Incorrect current password."]}
                )
            return None

        instance.set_password(raw_password=serializer._validated_data["new_password"])
        instance.save()
        return instance
