from django.core.management.base import BaseCommand
from django.contrib.sites.models import Site
from allauth.socialaccount.models import SocialApp
import os


class Command(BaseCommand):
    help = 'Setup Google OAuth application'

    def handle(self, *args, **options):
        # Get or create the default site
        site = Site.objects.get_or_create(
            id=1,
            defaults={
                'domain': 'localhost:8000',
                'name': 'Mathscriber AI'
            }
        )[0]

        # Get Google credentials from environment
        client_id = os.getenv('GOOGLE_CLIENT_ID')
        client_secret = os.getenv('GOOGLE_CLIENT_SECRET')

        if not client_id or not client_secret:
            self.stdout.write(
                self.style.ERROR('GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set in .env file')
            )
            return

        # Create or update Google Social App
        social_app, created = SocialApp.objects.get_or_create(
            provider='google',
            defaults={
                'name': 'Google',
                'client_id': client_id,
                'secret': client_secret,
            }
        )

        if not created:
            # Update existing app
            social_app.client_id = client_id
            social_app.secret = client_secret
            social_app.save()
            self.stdout.write(
                self.style.SUCCESS('Updated existing Google OAuth application')
            )
        else:
            self.stdout.write(
                self.style.SUCCESS('Created new Google OAuth application')
            )

        # Add site to the social app
        if site not in social_app.sites.all():
            social_app.sites.add(site)
            self.stdout.write(
                self.style.SUCCESS(f'Added site "{site.domain}" to Google OAuth app')
            )

        self.stdout.write(
            self.style.SUCCESS('✓ Google OAuth setup complete!')
        )
        self.stdout.write(
            self.style.WARNING('\nMake sure to add these redirect URIs in Google Cloud Console:')
        )
        self.stdout.write('  - http://localhost:8000/accounts/google/login/callback/')
        self.stdout.write('  - http://127.0.0.1:8000/accounts/google/login/callback/')
