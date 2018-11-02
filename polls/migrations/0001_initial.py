# Generated by Django 2.1.1 on 2018-10-15 15:32

import django.contrib.gis.db.models.fields
from django.db import migrations, models
import django.db.models.deletion
import geoposition.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Observation',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='POI',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('position', geoposition.fields.GeopositionField(max_length=42)),
            ],
        ),
        migrations.CreateModel(
            name='Species',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, verbose_name='Name')),
                ('description', models.CharField(default='SOME STRING', max_length=255)),
                ('obs_type', models.CharField(choices=[('tree', 'Tree'), ('bird', 'Bird'), ('flower', 'Flower'), ('buterfly', 'Butterfly')], default='none', max_length=255)),
                ('date', models.DateField(verbose_name='Date')),
                ('photo', models.ImageField(default='no image', upload_to='media')),
                ('geometry', django.contrib.gis.db.models.fields.PointField(srid=4326)),
            ],
        ),
        migrations.AddField(
            model_name='observation',
            name='species',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='polls.Species', verbose_name='Species'),
        ),
    ]
