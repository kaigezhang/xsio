# -*- coding: utf-8 -*-
# Generated by Django 1.11.10 on 2018-03-29 17:19
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Author',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('initials', models.CharField(max_length=10, null=True)),
                ('forename', models.CharField(max_length=125, null=True)),
                ('lastname', models.CharField(max_length=125, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='File',
            fields=[
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('id', models.UUIDField(default=uuid.uuid4, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
                ('hash', models.CharField(max_length=128)),
            ],
            options={
                'ordering': ['-created_at', '-updated_at'],
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Journal',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Library',
            fields=[
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('id', models.UUIDField(default=uuid.uuid4, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
                ('description', models.TextField(null=True)),
                ('color', models.CharField(max_length=10, null=True)),
            ],
            options={
                'ordering': ['-created_at', '-updated_at'],
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Paper',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=1000, null=True)),
                ('abstract', models.TextField(null=True)),
                ('year', models.PositiveIntegerField(null=True)),
                ('month', models.PositiveIntegerField(null=True)),
                ('volume', models.CharField(max_length=10, null=True)),
                ('pages', models.CharField(max_length=20, null=True)),
                ('page_from', models.CharField(max_length=10, null=True)),
                ('page_to', models.CharField(max_length=10, null=True)),
                ('authors', models.ManyToManyField(related_name='papers', to='papers.Author')),
                ('journal', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='papers', to='papers.Journal')),
            ],
        ),
    ]