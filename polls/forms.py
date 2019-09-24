from django.forms import ModelForm
from .models import Species, Observation, POI
from django.contrib.gis.forms import OSMWidget, PointField
from django import forms

from django.contrib.admin import widgets  

class DateInput(forms.DateInput):
    input_type = 'date'

class ObservationForm(ModelForm):
     
    class Meta:
        model = Observation
        fields = ['description','date', 'photo']
       
       # widgets = {'date': forms.DateTimeInput(attrs={'class': 'datetime-input'})}

        widgets = {
            'date': DateInput(),
        }
    
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
            attrs={'map_width': 800,
                   'map_height': 600,
                   'template_name': 'name.html',
                   'default_lat': 46.7833,
                   'default_lon': 6.65}))