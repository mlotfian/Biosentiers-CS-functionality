from django.contrib import admin

from .models import Species, Observation, POI, CustomUser


from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin

from .forms import CustomUserCreationForm, CustomUserChangeForm

# Register your models here.

class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    list_display = ['id', 'email', 'username',]

admin.site.register(Species)
admin.site.register(Observation)
admin.site.register(POI)

admin.site.register(CustomUser, CustomUserAdmin)
