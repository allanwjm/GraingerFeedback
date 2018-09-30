# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin

from . import models


def mark_as_hidden(modeladmin, request, queryset):
    queryset.update(hidden=True)


def mark_as_shown(modeladmin, request, queryset):
    queryset.update(hidden=False)


admin.site.register(models.Music, list_display=[
    '__str__',
    'order',
    'composer',
    'url',
    'duration',
])
admin.site.register(models.Keyword, list_display=[
    '__str__',
    'hidden',
    # 'weight',
    # 'related_to_moments_of_congruence',
    # 'related_to_ceiling_of_clouds',
    # 'related_to_in_transition',
], actions=[mark_as_hidden, mark_as_shown])

admin.site.register(models.Bullet, list_display=[
    '__str__',
    'music',
    'position',
    'color',
    'source',
    'hidden',
], actions=[mark_as_hidden, mark_as_shown])
