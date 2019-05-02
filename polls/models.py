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
    obs_type = models.CharField(max_length=255, choices = species_choices,default='none' )
    def __str__(self):
        return self.name

class POI(models.Model):

    geometry = models.PointField(srid=4326)
    def __str__(self):
        return "Point(%s)"%(self.geometry)

        
class Observation(models.Model):
    species = models.ForeignKey(Species, on_delete=models.CASCADE, verbose_name="Species",)
    poi = models.ForeignKey(POI, on_delete=models.CASCADE, verbose_name="POI",)
    description = models.CharField(max_length=255, default='SOME STRING',)
    date = models.DateField(verbose_name="Date")
    photo = models.ImageField(upload_to='media', default='no image')
    
    
    
    
    
    #date = models.DateField(verbose_name="Date")
    
    
        





# Create your models here.
