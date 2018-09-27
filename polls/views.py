from django.shortcuts import render

from django.template import loader
from django.urls import reverse

from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404, render
#from django.http import Http404

from .models import Species, Observation

from .forms import SpeciesForm

def index(request):
    template = loader.get_template('polls/index.html')
    return render(request,'polls/index.html')

# Create your views here.

def detail(request):
    #specie = get_object_or_404(Species, pk=species_id)
    return render(request, 'polls/detail.html')


def observe(request):
    if request.method == 'POST':
        form = SpeciesForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect(reverse('polls:index'))
    else:
        form = SpeciesForm()
    return render(request, 'polls/name.html', {'form': form})    

   