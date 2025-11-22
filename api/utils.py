import secrets

from .models import MemberToken


def generate_token_key():
    return secrets.token_hex(32)


def create_member_token(member):
    key = generate_token_key()
    while MemberToken.objects.filter(key=key).exists():
        key = generate_token_key()
    return MemberToken.objects.create(member=member, key=key)
