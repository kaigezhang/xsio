# -*- coding: utf-8 -*-
# Generated by Django 1.11.10 on 2018-03-29 17:19
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('profiles', '0001_initial'),
        ('annotations', '0001_initial'),
        ('papers', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='channel',
            name='members',
            field=models.ManyToManyField(related_name='joined_by', to='profiles.Profile'),
        ),
        migrations.AddField(
            model_name='channel',
            name='owner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='channles', to='profiles.Profile'),
        ),
        migrations.AddField(
            model_name='annotation',
            name='author',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='annotations', to='profiles.Profile'),
        ),
        migrations.AddField(
            model_name='annotation',
            name='channel',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='annotations.Channel'),
        ),
        migrations.AddField(
            model_name='annotation',
            name='file',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='annotations', to='papers.File'),
        ),
    ]
