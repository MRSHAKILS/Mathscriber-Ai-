from django import forms
from .models import Project, Document, Folder, BinaryFile


class ProjectForm(forms.ModelForm):
    """Form for creating/editing projects"""
    latex_code = forms.CharField(required=False, widget=forms.HiddenInput())
    latex_filename = forms.CharField(required=False, widget=forms.HiddenInput())
    
    class Meta:
        model = Project
        fields = ['name', 'description']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'input input-bordered w-full', 'placeholder': 'My LaTeX Project'}),
            'description': forms.Textarea(attrs={'class': 'textarea textarea-bordered w-full', 'rows': 3, 'placeholder': 'Optional description'}),
        }


class DocumentForm(forms.ModelForm):
    """Form for editing document content"""
    class Meta:
        model = Document
        fields = ['content', 'is_main']
        widgets = {
            'content': forms.Textarea(attrs={'id': 'latex-content', 'class': 'hidden'}),
            'is_main': forms.CheckboxInput(attrs={'class': 'checkbox'}),
        }


class NewDocumentForm(forms.Form):
    """Form for creating new documents"""
    name = forms.CharField(
        max_length=200,
        widget=forms.TextInput(attrs={'class': 'input input-bordered w-full', 'placeholder': 'document.tex'})
    )
    folder_id = forms.IntegerField(required=False, widget=forms.HiddenInput())


class NewFolderForm(forms.Form):
    """Form for creating new folders"""
    name = forms.CharField(
        max_length=200,
        widget=forms.TextInput(attrs={'class': 'input input-bordered w-full', 'placeholder': 'folder-name'})
    )
    folder_id = forms.IntegerField(required=False, widget=forms.HiddenInput())


class UploadBinaryFileForm(forms.Form):
    """Form for uploading binary files (supports multiple files in view)"""
    file = forms.FileField(
        widget=forms.FileInput(attrs={'class': 'file-input file-input-bordered w-full'})
    )
    folder_id = forms.IntegerField(required=False, widget=forms.HiddenInput())
