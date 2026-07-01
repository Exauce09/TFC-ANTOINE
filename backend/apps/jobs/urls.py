from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .reports import ReportSummaryView
from .views import DepartmentViewSet, JobOfferViewSet

router = DefaultRouter()
router.register('departments', DepartmentViewSet, basename='department')
router.register('jobs', JobOfferViewSet, basename='job')

urlpatterns = [
    path('reports/summary/', ReportSummaryView.as_view(), name='report-summary'),
    path('', include(router.urls)),
]
