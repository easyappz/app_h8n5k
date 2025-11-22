from django.db import models


class Member(models.Model):
    email = models.EmailField(unique=True, db_index=True)
    password_hash = models.CharField(max_length=255)
    display_name = models.CharField(max_length=150, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Member {self.email}"


class MemberToken(models.Model):
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name="tokens")
    key = models.CharField(max_length=64, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_used = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Token for {self.member.email}"


class ChatMessage(models.Model):
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name="messages")
    text = models.CharField(max_length=1000)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Message by {self.member.email} at {self.created_at:%Y-%m-%d %H:%M:%S}"
