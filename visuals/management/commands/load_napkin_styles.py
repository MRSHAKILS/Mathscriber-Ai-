from django.core.management.base import BaseCommand
from visuals.models import VisualStyle
from visuals.services import get_available_styles


class Command(BaseCommand):
    help = 'Populate database with available Napkin AI styles'

    def handle(self, *args, **options):
        styles = get_available_styles()
        
        created_count = 0
        updated_count = 0
        
        for style_data in styles:
            style, created = VisualStyle.objects.update_or_create(
                style_id=style_data['id'],
                defaults={
                    'name': style_data['name'],
                    'description': style_data.get('description', ''),
                    'category': style_data['category'],
                    'is_active': True
                }
            )
            
            if created:
                created_count += 1
            else:
                updated_count += 1
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully loaded {created_count} new styles and updated {updated_count} existing styles'
            )
        )
