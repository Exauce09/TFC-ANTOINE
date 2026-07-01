from django.urls import path

from .views import CandidateProfileView, CustomTokenObtainPairView, MeView, RegisterView

urlpatterns = [
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register/', RegisterView.as_view(), name='register'),
    path('me/', MeView.as_view(), name='me'),
    path('profile/', CandidateProfileView.as_view(), name='candidate_profile'),
]
