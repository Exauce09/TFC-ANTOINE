from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = User.USERNAME_FIELD

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        token['email'] = user.email
        token['name'] = user.get_full_name()
        return token

    def _normalize_login_identifier(self, attrs):
        field = self.username_field
        value = attrs.get(field)
        if not value or not isinstance(value, str):
            return
        value = value.strip()
        if '@' not in value:
            user = User.objects.filter(username__iexact=value).first()
            if user:
                value = user.email
        else:
            value = value.lower()
        attrs[field] = value

    def validate(self, attrs):
        self._normalize_login_identifier(attrs)
        data = super().validate(attrs)
        data['user'] = {
            'id': self.user.id,
            'email': self.user.email,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
            'role': self.user.role,
            'phone': self.user.phone,
        }
        return data
