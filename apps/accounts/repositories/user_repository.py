from django.contrib.auth.models import User

class UserRepository:
    def create_user(self, username: str, password: str):
        instance: User = User.objects.create_user(username=username, password=password)
        return instance

    def get_by_id(self, id: int):
        instance: User = User.objects.get(id=id)
        return instance

    def get_by_username(self, username: str):
        instance: User = User.objects.get(username=username)
        return instance

    def get_by_email(self, email: str):
        instance: User = User.objects.get(email=email)
        return instance

    def username_exists(self, username: str):
        exists: bool = User.objects.filter(username=username).exists()
        return exists

    def email_exists(self, email: str):
        exists: bool = User.objects.filter(email=email).exists()
        return exists

    def check_password(self, instance: User, password: str):
        is_valid: bool = instance.check_password(password)
        return is_valid

    def update_username(self, instance: User, username: str):
        instance.username = username
        instance.save()
        return instance

    def update_password(self, instance: User, password: str):
        instance.set_password(raw_password=password)
        instance.save()
        return instance
