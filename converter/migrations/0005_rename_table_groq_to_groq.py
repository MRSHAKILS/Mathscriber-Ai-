# Generated manually to migrate data from table_groq to groq

from django.db import migrations


def rename_task_type(apps, schema_editor):
    """Rename all 'table_groq' task types to 'groq'"""
    UploadedImage = apps.get_model('converter', 'UploadedImage')
    UploadedImage.objects.filter(task='table_groq').update(task='groq')


def reverse_rename_task_type(apps, schema_editor):
    """Reverse operation: rename 'groq' back to 'table_groq'"""
    UploadedImage = apps.get_model('converter', 'UploadedImage')
    UploadedImage.objects.filter(task='groq').update(task='table_groq')


class Migration(migrations.Migration):

    dependencies = [
        ('converter', '0004_alter_uploadedimage_task'),
    ]

    operations = [
        migrations.RunPython(rename_task_type, reverse_rename_task_type),
    ]
