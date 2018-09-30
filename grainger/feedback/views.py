# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import json
from datetime import datetime
from datetime import timedelta

from django.contrib.auth.decorators import login_required
from django.contrib.staticfiles.templatetags.staticfiles import static
from django.http.response import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .models import Bullet
from .models import Keyword
from .models import Music
from .models import PlayStatus
import random


def context(request):
    return {
        'void': 'javascript:void(0);',
        'request_interval': 1000.0  # ms
    }


# ---------- ---------- ---------- ---------- ---------- ----------
#                               Views
# ---------- ---------- ---------- ---------- ---------- ----------

def visitor_player(request):
    musics = Music.objects.all()
    musics_json = json.dumps([{
        'id': music.id, 'url': static(music.url), 'title': music.title
    } for music in musics])
    return render(request, 'visitor_player.html', {
        'musics': musics, 'musics_json': musics_json})


@login_required
def grainger_player(request):
    musics = Music.objects.all()
    musics_json = json.dumps([{
        'id': music.id, 'url': static(music.url), 'title': music.title
    } for music in musics])
    return render(request, 'grainger_player.html', {
        'musics': musics, 'musics_json': musics_json})


# ---------- ---------- ---------- ---------- ---------- ----------
#                             GET APIs
# ---------- ---------- ---------- ---------- ---------- ----------


@require_http_methods(['GET'])
def api_get_status(request):
    status = PlayStatus.objects.first()
    current_time = status.position
    duration = status.music.duration
    if status.update_time < datetime.now() - timedelta(seconds=5):
        paused = True
    else:
        paused = status.paused

    if paused:
        music_id = 0
    else:
        music_id = status.music.id

    return JsonResponse({
        'musicId': music_id,
        'paused': paused,
        'currentTime': current_time,
        'duration': duration, })


@require_http_methods(['GET'])
def api_get_lexicon(request):
    return JsonResponse({'lexicon': [w.text for w in Keyword.objects.filter(hidden=False).all()]})


@require_http_methods(['GET'])
def api_get_bullets(request):
    try:
        music_id = int(request.GET['musicid'])
        position = float(request.GET['position'])
        node_uuid = request.GET.get('uuid', '<unknown>')
        bullets = Bullet.objects.filter(music_id=music_id, hidden=False, position__range=(position - 3, position))
        if bullets.count() > 30:
            bullets = random.sample(list(bullets), 30)
        bullets = [{
            'musicId': b.music_id,
            'position': b.position,
            'text': b.text,
            'color': b.color,
            'source': b.source}
            for b in bullets if
            b.creator != node_uuid or
            b.create_time < datetime.now() - timedelta(seconds=10)]
        return JsonResponse({'bullets': bullets})
    except Exception as e:
        return JsonResponse({'success': 0, 'error': str(e), 'message': e.message})


# ---------- ---------- ---------- ---------- ---------- ----------
#                            POST APIs
# ---------- ---------- ---------- ---------- ---------- ----------

@csrf_exempt
@require_http_methods(['POST'])
def api_new_bullet(request):
    bullet = Bullet()
    bullet.music_id = request.POST.get('musicId', None)
    bullet.position = request.POST.get('position', None)
    bullet.text = request.POST['text']
    bullet.color = request.POST['color']
    bullet.source = request.POST['source']
    bullet.creator = request.POST.get('creator', None)

    if bullet.music_id is None or bullet.position is None:
        status = PlayStatus.objects.first()
        bullet.music_id = status.music_id
        bullet.position = status.position

    bullet.save()
    return JsonResponse({'success': 1})


@csrf_exempt
@require_http_methods(['POST'])
def api_player_update(request):
    status = PlayStatus.objects.first()
    if status is None:
        status = PlayStatus()
    status.music_id = int(request.POST['music_id'])
    status.paused = request.POST['paused'] == 'true'
    status.position = float(request.POST['position'])
    status.save()
    return JsonResponse({'success': 1})
