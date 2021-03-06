# -*- coding: utf-8 -*-
# Generated by Django 1.11.10 on 2018-03-29 17:19
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('annotations', '0001_initial'),
        ('papers', '0001_initial'),
        ('posts', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('id', models.UUIDField(default=uuid.uuid4, primary_key=True, serialize=False)),
                ('bio', models.TextField(blank=True)),
                ('image', models.URLField(blank=True)),
                ('collects', models.ManyToManyField(related_name='collected_by', to='posts.Post')),
                ('favorites', models.ManyToManyField(related_name='favorited_by', to='annotations.Annotation')),
                ('follows', models.ManyToManyField(related_name='followed_by', to='profiles.Profile')),
                ('owns', models.ManyToManyField(related_name='owned_by', to='papers.File')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-created_at', '-updated_at'],
                'abstract': False,
            },
        ),
    ]
