# -*- coding: utf-8 -*-
# Generated by Django 1.11.10 on 2018-03-29 17:19
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('profiles', '0001_initial'),
        ('contenttypes', '0002_remove_content_type_name'),
        ('papers', '0002_auto_20180329_1719'),
        ('posts', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='author',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='posts', to='profiles.Profile'),
        ),
        migrations.AddField(
            model_name='post',
            name='files',
            field=models.ManyToManyField(related_name='posts', to='papers.File'),
        ),
        migrations.AddField(
            model_name='comment',
            name='author',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comments', to='profiles.Profile'),
        ),
        migrations.AddField(
            model_name='comment',
            name='content_type',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='contenttypes.ContentType'),
        ),
    ]
