from django.contrib import admin

from .models import Species, Observation, POI
# Register your models here.
admin.site.register(Species)
admin.site.register(Observation)
admin.site.register(POI)