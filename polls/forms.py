from django.forms import ModelForm
from .models import Species, Observation

from django import forms

from django.contrib.admin import widgets  

class SpeciesForm(ModelForm):
    class Meta:
        model = Species
        fields = ['name', 'description', 'obs_type', 'date', 'photo']
        widgets = {'date': forms.DateTimeInput(attrs={'class': 'datetime-input'})}
        