from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import DepartmentViewSet, JobOfferViewSet

router = DefaultRouter()
router.register('departments', DepartmentViewSet, basename='department')
router.register('jobs', JobOfferViewSet, basename='job')

urlpatterns = [
    path('', include(router.urls)),
]
