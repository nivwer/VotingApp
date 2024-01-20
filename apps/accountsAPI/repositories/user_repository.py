from django.contrib.auth.models import User


class UserRepository:
    """
    Repository class for user-related database operations.

    This class encapsulates database interactions related to users.
    """

    def create_user(self, username: str, password: str):
        """
        Creates a user.
        """
        instance: User = User.objects.create_user(username=username, password=password)
        return instance

    def get_by_id(self, id: int):
        """
        Retrieves a user by user ID.
        """
        instance: User = User.objects.get(id=id)
        return instance

    def get_by_username(self, username: str):
        """
        Retrieves a user by username.
        """
        instance: User = User.objects.get(username=username)
        return instance

    def get_by_email(self, email: str):
        """
        Retrieves a user by email.
        """
        instance: User = User.objects.get(email=email)
        return instance

    def username_exists(self, username: str):
        """
        Checks if a username exists.
        """
        exists: bool = User.objects.filter(username=username).exists()
        return exists

    def email_exists(self, email: str):
        """
        Checks if an email exists.
        """
        exists: bool = User.objects.filter(email=email).exists()
        return exists

    def check_password(self, instance: User, password: str):
        """
        Checks if a password is valid for a user.
        """
        is_valid: bool = instance.check_password(password)
        return is_valid

    def update_username(self, instance: User, username: str):
        """
        Updates the username of a user.
        """
        instance.username = username
        instance.save()
        return instance

    def update_password(self, instance: User, password: str):
        """
        Updates the password of a user.
        """
        instance.set_password(raw_password=password)
        instance.save()
        return instance
