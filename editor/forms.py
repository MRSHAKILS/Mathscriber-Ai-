# editor/forms.py
from django import forms
from .models import Project, Document, Folder
# editor/forms.py
from django import forms
from .models import Project, Document, Folder

# --- ADD THIS NEW WIDGET CLASS ---
class MultipleFileInput(forms.FileInput):
    def __init__(self, attrs=None):
        # We must skip the FileInput.__init__ and go to its parent
        # This bypasses the 'multiple' check
        super(forms.widgets.Input, self).__init__(attrs)
# ------------------------------------
class ProjectForm(forms.ModelForm):
    class Meta:
        model = Project
        fields = ['name', 'description']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'My New Project'}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'rows': 3}),
        }

class DocumentForm(forms.ModelForm):
    class Meta:
        model = Document
        fields = ['name', 'content', 'is_main']
        widgets = {
            'content': forms.Textarea(attrs={
                'rows': 30,
                'class': 'form-control font-monospace',
                'id': 'editor-textarea'
            }),
            'is_main': forms.CheckboxInput(attrs={
                'class': 'form-check-input',
                'id': 'is-main-checkbox'
            }),
        }

class NewDocumentForm(forms.Form):
    name = forms.CharField(label="File Name", max_length=200, widget=forms.TextInput(attrs={
        'class': 'form-control', 'placeholder': 'e.g., chapter1.tex'
    }))
    folder_id = forms.IntegerField(widget=forms.HiddenInput(), required=False)
# ... (your other forms) ...

class NewFolderForm(forms.Form):
    name = forms.CharField(label="Folder Name", max_length=200, widget=forms.TextInput(attrs={
        'class': 'form-control', 'placeholder': 'e.g., images'
    }))
    folder_id = forms.IntegerField(widget=forms.HiddenInput(), required=False)

# ... (your other form classes) ...

class UploadBinaryFileForm(forms.Form):
    file = forms.FileField(
        label="File(s)", 
        widget=MultipleFileInput(attrs={  # <-- USE THE NEW WIDGET
            'class': 'form-control', 
            'multiple': True
        })
    )
    folder_id = forms.IntegerField(widget=forms.HiddenInput(), required=False)