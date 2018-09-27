from django.contrib import admin

from .models import Species, Observation
# Register your models here.
admin.site.register(Species)
admin.site.register(Observation)