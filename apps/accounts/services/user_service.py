from django.contrib.auth.models import User

from rest_framework.exceptions import NotFound, ValidationError

from apps.accounts.serializers.user_serialziers import (
    UserSerializer,
    UserNewUsernameSerializer,
    UserNewPasswordSerializer,
)

from apps.accounts.repositories.user_repository import UserRepository


class UserService:
    """
    Service class for user-related operations.

    This class encapsulates business logic related to user management.
    """
    repository = UserRepository()

    def create_user(self, data: dict, raise_exception: bool = True):
        """
        Creates a new user.
        """
        serializer = UserSerializer(data=data)
        is_valid: bool = serializer.is_valid(raise_exception=raise_exception)

        if (not raise_exception) and (not is_valid):
            return None

        username: str = serializer.validated_data["username"]
        password: str = serializer.validated_data["password"]

        instance: User = self.repository.create_user(username=username, password=password)

        return instance

    def get_by_id(self, id: int, raise_exception: bool = True):
        """
        Retrieves a user by user ID.
        """
        try:
            instance: User = self.repository.get_by_id(id=id)
        except User.DoesNotExist:
            if raise_exception:
                message: str = f"User with ID {id} does not exist."
                raise NotFound(detail=message)
            return None

        return instance

    def get_by_username(self, username: str, raise_exception: bool = True):
        """
        Retrieves a user by username.
        """
        try:
            instance: User = self.repository.get_by_username(username=username)
        except User.DoesNotExist:
            if raise_exception:
                message: str = f"User with username {username} does not exist."
                raise NotFound(detail=message)
            return None

        return instance

    def get_by_email(self, email: str, raise_exception: bool = True):
        """
        Retrieves a user by email.
        """
        try:
            instance: User = self.repository.get_by_email(email=email)
        except User.DoesNotExist:
            if raise_exception:
                message: str = f"User with email {email} does not exist."
                raise NotFound(detail=message)
            return None

        return instance

    def update_username(self, instance: User, data: dict, raise_exception: bool = True):
        """
        Updates the username of a user.
        """
        serializer = UserNewUsernameSerializer(data=data)
        is_valid: bool = serializer.is_valid(raise_exception=raise_exception)

        if (not raise_exception) and (not is_valid):
            return None

        new_username: str = serializer.validated_data["new_username"]
        username_exists: bool = self.repository.username_exists(username=new_username)

        if username_exists:
            if raise_exception:
                message: dict = {"username": ["A user with that username already exists."]}
                raise ValidationError(detail=message)

            return None

        instance: User = self.repository.update_username(instance=instance, username=new_username)
        
        return instance

    def update_password(self, instance: User, data: dict, raise_exception: bool = True):
        """
        Updates the password of a user.
        """
        serializer = UserNewPasswordSerializer(data=data)
        is_valid: bool = serializer.is_valid(raise_exception=raise_exception)

        if (not raise_exception) and (not is_valid):
            return None

        current_password: str = serializer._validated_data["current_password"]
        password_is_valid: bool = self.check_password(user=instance, password=current_password)

        if not password_is_valid:
            if raise_exception:
                message: dict = {"current_password": ["Incorrect current password."]}
                raise ValidationError(detail=message)

            return None

        new_password: str = serializer._validated_data["new_password"]
        instance: User = self.repository.update_password(instance=instance, password=new_password)

        return instance
