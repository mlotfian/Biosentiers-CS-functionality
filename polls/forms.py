from django.forms import ModelForm
from .models import Species, Observation
from django.contrib.gis.forms import OSMWidget, PointField
from django import forms

from django.contrib.admin import widgets  

class SpeciesForm(ModelForm):
     
    class Meta:
        model = Species
        fields = ['name', 'description', 'obs_type', 'date', 'photo', 'geometry']
        widgets = {'date': forms.DateTimeInput(attrs={'class': 'datetime-input'})}
         
    geometry = PointField(
        widget=OSMWidget(
            attrs={'map_width': 600,
                   'map_height': 400,
                   'template_name': 'name.html',
                   'default_lat': 57,
                   'default_lon': 12}))

         