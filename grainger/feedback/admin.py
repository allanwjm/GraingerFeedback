# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin

from . import models

admin.site.register(models.Music, list_display=[
    '__str__',
    'order',
    'composer',
    'url',
    'duration',
])
admin.site.register(models.Keyword, list_display=[
    '__str__',
    'weight',
    'related_to_moments_of_congruence',
    'related_to_ceiling_of_clouds',
    'related_to_in_transition',
])
admin.site.register(models.Bullet, list_display=[
    '__str__',
    'music',
    'position',
    'color',
    'source',
])
