from rest_framework import generics, permissions, status
from rest_framework.parsers import FormParser, MultiPartParser, JSONParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import CandidateProfile, User
from .serializers import (
    CandidateProfileSerializer,
    CandidateProfileUpdateSerializer,
    ProfileUpdateSerializer,
    RegisterSerializer,
    UserSerializer,
)
from .tokens import CustomTokenObtainPairSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = (permissions.AllowAny,)


class MeView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        return Response(UserSerializer(request.user).data)

    def patch(self, request):
        serializer = ProfileUpdateSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(UserSerializer(request.user).data)


class CandidateProfileView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def _get_or_create_profile(self, user):
        profile, _ = CandidateProfile.objects.get_or_create(user=user)
        return profile

    def get(self, request):
        profile = self._get_or_create_profile(request.user)
        return Response({
            'user': UserSerializer(request.user).data,
            'profile': CandidateProfileSerializer(profile, context={'request': request}).data,
        })

    def patch(self, request):
        profile = self._get_or_create_profile(request.user)

        user_data = {}
        for field in ('first_name', 'last_name', 'phone', 'password'):
            if field in request.data and request.data[field]:
                user_data[field] = request.data[field]
        if user_data:
            user_serializer = ProfileUpdateSerializer(request.user, data=user_data, partial=True)
            user_serializer.is_valid(raise_exception=True)
            user_serializer.save()

        profile_serializer = CandidateProfileUpdateSerializer(
            profile, data=request.data, partial=True, context={'request': request},
        )
        profile_serializer.is_valid(raise_exception=True)
        profile_serializer.save()

        return Response({
            'user': UserSerializer(request.user).data,
            'profile': CandidateProfileSerializer(profile, context={'request': request}).data,
        })


class IsRecruiter(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_recruiter


class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_admin_rh
