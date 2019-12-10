from django.shortcuts import render

from django.template import loader
from django.urls import reverse

from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404, render
#from django.http import Http404

from .models import Species, Observation

from .forms import SpeciesForm, ObservationForm, POIForm

from clarifai.rest import ClarifaiApp
from clarifai.rest import Image as ClImage

def index(request):
    template = loader.get_template('polls/index.html')
    return render(request,'polls/index.html')

# Create your views here.

def detail(request):
    #specie = get_object_or_404(Species, pk=species_id)
    return render(request, 'polls/detail.html')




def observe(request):
    context = {
    'observation_form': ObservationForm(),
    'species_form': SpeciesForm(),
    'poi_form': POIForm()
    }

    if request.method == 'POST':
        obs_type = request.POST['obs_type']
        geometry = request.POST['geometry']
        photo = request.FILES['photo']

        species_form = SpeciesForm(request.POST, request.FILES)
        poi_form = POIForm(request.POST)
        observation_form = ObservationForm(request.POST, request.FILES)

        #checking image with clarifai API>>> move this to the frontend

        if observation_form.is_valid() and species_form.is_valid() and poi_form.is_valid():
            if identifyPhoto(photo, obs_type):
                obs = observation_form.save(commit=False)
                obs.poi = poi_form.save()
                obs.species = species_form.save()
                obs.save()

                return HttpResponseRedirect(reverse('polls:index'))
            else:
                observation_form = ObservationForm()
                species_form = SpeciesForm()
                poi_form = POIForm()

                return render(request, 'polls/name.html', {'form': context, 'invalidPhoto': True})
    else:
        observation_form = ObservationForm()
        species_form = SpeciesForm()
        poi_form = POIForm()


    return render(request, 'polls/name.html', context)

def identifyPhoto(photo, obs_type):
    app = ClarifaiApp(api_key='366cc97df9c14f50b0ec95e98724b3e8')

    model = app.models.get('general-v1.3')
    image = ClImage(file_obj=photo)
    response_data = model.predict([image])

    tag_urls = []
    prob = []
    for concept in response_data['outputs'][0]['data']['concepts']:
        tag_urls.append(concept['name'])
        prob.append(concept['value'])

    predic = dict(zip(tag_urls, prob))
    listS=[]
    for my_key, my_value in predic.items():
        if predic[my_key]>0.90:
            listS.append(my_key)

    if obs_type in listS:
        print('The image correspond with the right species type')
        return True
    else:
        print('The photo does not look like a ' + obs_type)
