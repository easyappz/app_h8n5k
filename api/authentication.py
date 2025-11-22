from rest_framework import exceptions
from rest_framework.authentication import BaseAuthentication

from .models import MemberToken


class MemberTokenAuthentication(BaseAuthentication):
    keyword = "Token"

    def authenticate(self, request):
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return None
        parts = auth_header.split()
        if len(parts) != 2 or parts[0] != self.keyword:
            raise exceptions.AuthenticationFailed("Invalid authorization header.")
        token_key = parts[1]
        try:
            token = MemberToken.objects.select_related("member").get(key=token_key)
        except MemberToken.DoesNotExist:
            raise exceptions.AuthenticationFailed("Invalid token.")
        token.save(update_fields=["last_used"])
        return token.member, token
