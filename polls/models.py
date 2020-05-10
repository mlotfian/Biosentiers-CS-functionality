from django.db import models
from django.contrib.gis.db import models

from django.forms import ModelForm
from django.contrib.admin import widgets
from geoposition.fields import GeopositionField
from django.contrib.auth.models import AbstractUser
from django.contrib.auth import get_user_model
from django.conf import settings
import datetime



class Species(models.Model):
    species_choices = [
    ('tree', 'Tree'),
    ('bird', 'Bird'),
    ('flower','Flower'),
    ('butterfly','Butterfly'),
]

    name = models.CharField(max_length=255, verbose_name="Name",)
    obs_type = models.CharField(max_length=255, choices = species_choices,default='none' )
    def __str__(self):
        return '{} {}'.format(self.name, self.obs_type)

class POI(models.Model):

    geometry = models.PointField(srid=4326)
    def __str__(self):
        return "Point(%s)"%(self.geometry)


class Observation(models.Model):
    species = models.ForeignKey(Species, on_delete=models.CASCADE, verbose_name="Species",)
    poi = models.ForeignKey(POI, on_delete=models.CASCADE, verbose_name="POI",)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,)
    description = models.CharField(max_length=255, default='SOME STRING',)
    date = models.DateField(verbose_name="Date", default=datetime.date.today)
    photo = models.ImageField(upload_to='media', default='no image')
    Flagtime = models.BooleanField(default=False)



class CustomUser(AbstractUser):
    pass
    # add additional fields in here

    def __str__(self):
        return self.username
