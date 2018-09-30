"""grainger URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/api/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.api import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.api'))
"""

from django.conf.urls import url
from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.views.static import serve

from feedback import views
from grainger.settings import BASE_DIR

urlpatterns = [
    # Login
    url(r'^accounts/login/$', auth_views.login, name='login'),

    # Views
    url(r'^$', views.visitor_player),
    url(r'^player$', views.grainger_player),

    # GET APIs
    url(r'^get/status$', views.api_get_status),
    url(r'^get/lexicon$', views.api_get_lexicon),
    url(r'^get/bullets$', views.api_get_bullets),

    # POST APIs
    url(r'^post/new-bullet$', views.api_new_bullet, name='api_new_bullet'),
    url(r'^post/player-update$', views.api_player_update),

    # Admin
    url(r'^admin/', admin.site.urls),

    # Public folder files
    url(r'^tablet$', serve, {'document_root': BASE_DIR, 'path': 'react/index.html'}),
    url(r'^apple-touch-icon\.png$', serve, {'document_root': BASE_DIR, 'path': 'react/apple-touch-icon.png'}),
    url(r'^asset-manifest\.json$', serve, {'document_root': BASE_DIR, 'path': 'react/asset-manifest.json'}),
    url(r'^favicon\.ico$', serve, {'document_root': BASE_DIR, 'path': 'react/favicon.ico'}),
    url(r'^manifest\.json$', serve, {'document_root': BASE_DIR, 'path': 'react/manifest.json'}),
    url(r'^service-worker\.js$', serve, {'document_root': BASE_DIR, 'path': 'react/service-worker.js'}),
]
