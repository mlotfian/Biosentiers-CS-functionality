from django.db import models
from django.contrib.gis.db import models

from django.forms import ModelForm
from django.contrib.admin import widgets  
from geoposition.fields import GeopositionField

species_choices = [
    ('tree', 'Tree'),
    ('bird', 'Bird'),
    ('flower','Flower'),
    ('buterfly','Butterfly'),
]


class Species(models.Model):
    name = models.CharField(max_length=255, verbose_name="Name",)
    #species_type= models.CharField(max_length=255, verbose_name="Type", default='Unknown',)
    description = models.CharField(max_length=255, default='SOME STRING',)
    obs_type = models.CharField(max_length=255, choices = species_choices,default='none' )
    date = models.DateField(verbose_name="Date")
    photo = models.ImageField(upload_to='media', default='no image')
    def __str__(self):
        return self.name
    
class Observation(models.Model):
    species = models.ForeignKey(Species, on_delete=models.CASCADE, verbose_name="Species",)
    
    #date = models.DateField(verbose_name="Date")
    geometry = models.PointField(srid=4326)
    
class POI(models.Model):

    position = GeopositionField()
        





# Create your models here.
