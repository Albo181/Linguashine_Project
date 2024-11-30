# Generated by Django 5.1.3 on 2024-11-24 13:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Documents', '0009_alter_privateaudio_sender_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='privatedocument',
            name='thumbnail',
            field=models.ImageField(blank=True, null=True, upload_to='private_docs/thumbnails/'),
        ),
        migrations.AddField(
            model_name='privateimage',
            name='thumbnail',
            field=models.ImageField(blank=True, null=True, upload_to='private_images/thumbnails/'),
        ),
    ]
