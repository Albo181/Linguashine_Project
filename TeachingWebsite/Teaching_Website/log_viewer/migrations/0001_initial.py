# Generated by Django 5.1.3 on 2024-12-04 12:06

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='APILog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('method', models.CharField(max_length=10)),
                ('path', models.CharField(max_length=255)),
                ('status_code', models.IntegerField()),
                ('duration', models.CharField(max_length=20)),
                ('user', models.CharField(max_length=150)),
                ('ip_address', models.GenericIPAddressField()),
                ('level', models.CharField(max_length=20)),
            ],
            options={
                'verbose_name': 'API Log',
                'verbose_name_plural': 'API Logs',
                'ordering': ['-timestamp'],
            },
        ),
    ]
