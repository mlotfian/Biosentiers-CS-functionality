from django.forms import ModelForm
from .models import Species, Observation, POI, CustomUser
#from django.contrib.gis.forms import OSMWidget, PointField
from leaflet.forms.fields import PointField
from django import forms
from leaflet.forms.widgets import LeafletWidget

from django.contrib.admin import widgets

from django.contrib.auth.forms import UserCreationForm, UserChangeForm


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

class YourMapWidget(LeafletWidget):
    geometry_field_class = 'YourGeometryField'


class POIForm(ModelForm):
    class Meta:
        model = POI
        fields = ('geometry',)
        # widgets = {'geometry': YourMapWidget()}
        widgets = {'geometry': LeafletWidget(attrs={
        'map_height': '91%',
        'map_width': '100%',
        'DEFAULT_CENTER': (46.7833,6.65),
        'DEFAULT_ZOOM': 16,
        })}
        # widgets = {'geometry': LeafletWidget()}

    # geometry = PointField(
    #     widget=OSMWidget(
    #         attrs={'map_width': 800,
    #                'map_height': 600,
    #                'template_name': 'name.html',
    #                'default_lat': 46.7833,
    #                'default_lon': 6.65}))
class CustomUserCreationForm(UserCreationForm):

    class Meta:
        model = CustomUser
        fields = ('id','username', 'email', 'password1', 'password2')

class CustomUserChangeForm(UserChangeForm):

    class Meta:
        model = CustomUser
        fields = ('id','username', 'email')
