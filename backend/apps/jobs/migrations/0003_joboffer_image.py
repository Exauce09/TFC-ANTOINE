# Generated manually for job photo upload

import apps.jobs.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('jobs', '0002_joboffer_image_key'),
    ]

    operations = [
        migrations.AddField(
            model_name='joboffer',
            name='image',
            field=models.FileField(blank=True, upload_to=apps.jobs.models.job_image_upload_path),
        ),
    ]
