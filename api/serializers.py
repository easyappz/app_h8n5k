from django.contrib.auth.hashers import check_password, make_password
from rest_framework import serializers

from .models import ChatMessage, Member


class MemberProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = ["id", "email", "display_name", "created_at", "updated_at"]
        read_only_fields = ["id", "email", "display_name", "created_at", "updated_at"]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    display_name = serializers.CharField(required=False, allow_blank=True, max_length=150)

    class Meta:
        model = Member
        fields = ["id", "email", "password", "display_name", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate_email(self, value):
        email = value.strip().lower()
        if Member.objects.filter(email=email).exists():
            raise serializers.ValidationError("Email is already registered.")
        return email

    def validate_display_name(self, value):
        return value.strip()

    def create(self, validated_data):
        password = validated_data.pop("password")
        validated_data["password_hash"] = make_password(password)
        validated_data.setdefault("display_name", "")
        return Member.objects.create(**validated_data)


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get("email", "").strip().lower()
        password = attrs.get("password")
        try:
            member = Member.objects.get(email=email)
        except Member.DoesNotExist:
            raise serializers.ValidationError("Invalid credentials.")
        if not check_password(password, member.password_hash):
            raise serializers.ValidationError("Invalid credentials.")
        attrs["member"] = member
        return attrs


class ChatMessageSerializer(serializers.ModelSerializer):
    member = MemberProfileSerializer(read_only=True)

    class Meta:
        model = ChatMessage
        fields = ["id", "member", "text", "created_at"]
        read_only_fields = ["id", "member", "created_at"]

    def validate_text(self, value):
        text = value.strip()
        if not text:
            raise serializers.ValidationError("Message text cannot be empty.")
        return text
