from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import ChatMessage
from .serializers import (
    ChatMessageSerializer,
    LoginSerializer,
    MemberProfileSerializer,
    RegisterSerializer,
)
from .utils import create_member_token


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        member = serializer.save()
        token = create_member_token(member)
        profile_data = MemberProfileSerializer(member).data
        return Response({"token": token.key, "member": profile_data}, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        member = serializer.validated_data["member"]
        token = create_member_token(member)
        profile_data = MemberProfileSerializer(member).data
        return Response({"token": token.key, "member": profile_data}, status=status.HTTP_200_OK)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = MemberProfileSerializer(request.user).data
        return Response(data)


class MessageListCreateView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        messages = list(
            ChatMessage.objects.select_related("member").order_by("-created_at")[:50]
        )
        messages.reverse()
        serializer = ChatMessageSerializer(messages, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ChatMessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        message = serializer.save(member=request.user)
        return Response(ChatMessageSerializer(message).data, status=status.HTTP_201_CREATED)
