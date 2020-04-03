from django.shortcuts import render

from django.template import loader
from django.urls import reverse

from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404, render
#from django.http import Http404

from .models import Species, Observation, CustomUser, POI

from .forms import SpeciesForm, ObservationForm, POIForm, CustomUserCreationForm

from clarifai.rest import ClarifaiApp
from clarifai.rest import Image as ClImage

## for signup

from django.urls import reverse_lazy
from django.views.generic.edit import CreateView
######
from django.shortcuts import render
import json
import psycopg2

from django.http import JsonResponse
from django.core.serializers import serialize


# ### checking if the user already exits , jquery
# from django.contrib.auth.models import User
# from django.http import JsonResponse
#
# ### user existenc validation
#
# def validate_username(request):
#     username = request.GET.get('username', None)
#     data = {
#         'is_taken': User.objects.filter(username__iexact=username).exists()
#     }
#     return JsonResponse(data)

# displaying all observation points

def all_obs(request, *args, **kwargs):

    connection = psycopg2.connect(database="NewBio",user="postgres", password="mary3000", host='localhost')
    cursor = connection.cursor()
    query = """SELECT a.obs_type, a.name, b.photo, b.description, b.date, st_AsGeoJSON(c.geometry)
FROM polls_species a
JOIN polls_observation b
ON a.id = b.species_id
JOIN polls_poi c
ON c.id = b.poi_id"""
    cursor.execute(query)
    rows=cursor.fetchall()


    arrJson=[]
    for row in rows:
        geo = {"type": "Feature",
        "properties": {"obs_type": row[0],
        "name": row[1],
        "photo": row[2],
        "description": row[3],
        "date": str(row[4])},
        "geometry": json.loads(row[5]),}
        arrJson.append(geo)

    points_json = {
    "type": "FeatureCollection",
    "features": arrJson
    }



    return render(request ,'map.html', {'points_json':points_json})

######
def pointstest(request):
    points_obs=serialize('geojson',POI.objects.all())
    return HttpResponse(points_obs,content_type='json')



# filter observation based on logged it user

def my_obs(request):

    obs_tst = Observation.objects.filter(user_id__in=CustomUser.objects.filter(username=request.user))
    arrGeo = []

    for obs in obs_tst:
        arrGeo.append(obs.poi)

    arrGeojson = serialize('geojson', arrGeo)
    res = json.loads(arrGeojson)
    for feature in res["features"]:
        for obs in obs_tst:
            if(str(obs.id) == feature["properties"]["pk"]):
                feature["properties"]["name"] = str(obs.species.name)
                feature["properties"]["obs_type"] = obs.species.obs_type
                feature["properties"]["description"] = obs.description
                feature["properties"]["date"] = str(obs.date)
                feature["properties"]["photo"] = str(obs.photo).split(' ')[0]


    return render(request, 'obs.html', {'res': res})

#for signup view

class SignUpView(CreateView):
    form_class = CustomUserCreationForm
    success_url = reverse_lazy('login')
    template_name = 'signup.html'

###

def index(request):
    template = loader.get_template('index.html')
    # points = POI.objects.all()
    # print(points)
    return render(request,'index.html')

# Create your views here.

def detail(request):
    #specie = get_object_or_404(Species, pk=species_id)
    return render(request, 'detail.html')



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
                obs.user = CustomUser.objects.get(username=request.user)
                obs.poi = poi_form.save()
                obs.species = species_form.save()
                obs.save()

                return HttpResponseRedirect(reverse('index'))
            else:
                observation_form = ObservationForm()
                species_form = SpeciesForm()
                poi_form = POIForm()

                return render(request, 'name.html', {'form': context, 'invalidPhoto': True})
    else:
        observation_form = ObservationForm()
        species_form = SpeciesForm()
        poi_form = POIForm()


    return render(request, 'name.html', context)

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
