from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import UserChangeForm, UserCreationForm, AdminPasswordChangeForm
from django import forms
from .models import CustomUser
import logging
import traceback

logger = logging.getLogger(__name__)

class CustomUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = CustomUser
        fields = ('username', 'email', 'password1', 'password2')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['email'].required = True
        if 'user_type' in self.fields:
            del self.fields['user_type']
        if 'is_staff' in self.fields:
            del self.fields['is_staff']
        if 'is_active' in self.fields:
            del self.fields['is_active']

    def save(self, commit=True):
        try:
            user = super().save(commit=False)
            user.is_active = True
            user.user_type = 'student'
            if commit:
                user.save()
            return user
        except Exception as e:
            logger.error(f"Error in CustomUserCreationForm.save: {str(e)}")
            logger.error(traceback.format_exc())
            raise

class CustomUserDetailsForm(forms.ModelForm):
    class Meta:
        model = CustomUser
        fields = ('first_name', 'last_name', 'telephone', 'bio', 'user_type', 'forum_access', 'is_staff', 'is_active')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.fields.values():
            field.required = False

class CustomUserAdmin(BaseUserAdmin):
    add_form = CustomUserCreationForm
    form = UserChangeForm
    change_password_form = AdminPasswordChangeForm
    model = CustomUser
    list_display = ('username', 'email', 'first_name', 'last_name', 'user_type', 'is_staff')
    list_filter = ('is_staff', 'is_active', 'user_type')
    
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email', 'telephone', 'bio', 'profile_picture')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Type', {'fields': ('user_type', 'forum_access')}),
    )

    add_fieldsets = (
        ('Basic Information', {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2'),
            'description': 'Please enter the basic user information. Additional details can be added in the next step.'
        }),
    )
    
    search_fields = ('email', 'username', 'first_name', 'last_name')
    ordering = ('email',)

    def get_form(self, request, obj=None, **kwargs):
        try:
            defaults = {}
            if obj is None:
                defaults['form'] = self.add_form
            defaults.update(kwargs)
            return super().get_form(request, obj, **defaults)
        except Exception as e:
            logger.error(f"Error in get_form: {str(e)}")
            logger.error(traceback.format_exc())
            raise

    def response_add(self, request, obj, post_url_continue=None):
        try:
            if '_addanother' not in request.POST and '_continue' not in request.POST:
                request.POST._mutable = True
                request.POST['_continue'] = 1
                request.POST._mutable = False
            return super().response_add(request, obj, post_url_continue)
        except Exception as e:
            logger.error(f"Error in response_add: {str(e)}")
            logger.error(traceback.format_exc())
            raise

    def save_model(self, request, obj, form, change):
        try:
            if not change:  # If this is a new user being created
                obj.is_active = True
                if not hasattr(obj, 'user_type') or not obj.user_type:
                    obj.user_type = 'student'
                # Set default values for required fields
                if not obj.telephone:
                    obj.telephone = ''  # Set empty string as default
                if not obj.bio:
                    obj.bio = ''  # Set empty string as default
            if obj.pk is None:  # New user
                obj.set_password(obj.password)
            elif 'password' in form.changed_data:  # Password changed
                obj.set_password(obj.password)
            super().save_model(request, obj, form, change)
        except Exception as e:
            logger.error(f"Error in save_model: {str(e)}")
            logger.error(traceback.format_exc())
            raise

admin.site.register(CustomUser, CustomUserAdmin)