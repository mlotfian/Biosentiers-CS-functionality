# Generated by Django 2.2.5 on 2020-06-12 10:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('polls', '0006_observation_flagimage'),
    ]

    operations = [
        migrations.AlterField(
            model_name='observation',
            name='description',
            field=models.CharField(blank=True, default='SOME STRING', max_length=255),
        ),
    ]