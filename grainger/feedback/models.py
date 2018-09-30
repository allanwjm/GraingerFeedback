# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models


class Music(models.Model):
    class Meta:
        ordering = ['order']

    order = models.FloatField(default=0)
    title = models.CharField(max_length=255)
    composer = models.CharField(max_length=255)
    url = models.CharField(max_length=255)
    duration = models.FloatField()

    def __str__(self):
        return self.title


class PlayStatus(models.Model):
    music = models.ForeignKey(to=Music, on_delete=models.CASCADE, blank=True, null=True)
    paused = models.BooleanField(default=True)
    position = models.FloatField(default=-1)
    update_time = models.DateTimeField(auto_now=True)


class Bullet(models.Model):
    music = models.ForeignKey(to=Music, on_delete=models.CASCADE)
    position = models.FloatField(default=-1)
    text = models.CharField(blank=True, null=True, max_length=255)
    color = models.CharField(blank=True, null=True, max_length=255)
    source = models.IntegerField(default=0, choices=[
        (0, 'Tablet keyword'),
        (1, 'Tablet Input'),
        (2, 'QRcode Input'),
    ])
    creator = models.CharField(blank=True, null=True, max_length=255)
    create_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.text


class Keyword(models.Model):
    text = models.CharField(unique=True, blank=False, max_length=255)
    weight = models.FloatField(default=1.0)
    related_to_moments_of_congruence = models.BooleanField(default=True)
    related_to_ceiling_of_clouds = models.BooleanField(default=True)
    related_to_in_transition = models.BooleanField(default=True)

    def __str__(self):
        return self.text
