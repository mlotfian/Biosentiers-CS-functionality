from django.forms import ModelForm
from .models import Species, Observation, POI
from django.contrib.gis.forms import OSMWidget, PointField
from django import forms

from django.contrib.admin import widgets  



class ObservationForm(ModelForm):
     
    class Meta:
        model = Observation
        fields = ['description','date', 'photo']
       
        widgets = {'date': forms.DateTimeInput(attrs={'class': 'datetime-input'})}
    
class SpeciesForm(ModelForm):
     
    class Meta:
        model = Species
        fields = ['obs_type','name']
        #obs_type = forms.ChoiceField(choices=Species.species_choices)
        


class POIForm(ModelForm):
     
    class Meta:
        model = POI
        fields = ['geometry']      
    
    geometry = PointField(
        widget=OSMWidget(
            attrs={'map_width': 600,
                   'map_height': 400,
                   'template_name': 'name.html',
                   'default_lat': 57,
                   'default_lon': 12}))

         