from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from compiler.models import Project, Folder, LatexFile
from compiler.services.latex_compiler import LatexCompiler


class Command(BaseCommand):
    help = 'Create sample LaTeX projects for testing'

    def handle(self, *args, **options):
        # Create test user
        user, created = User.objects.get_or_create(
            username='testuser',
            defaults={
                'email': 'test@example.com',
                'first_name': 'Test',
                'last_name': 'User'
            }
        )
        
        if created:
            user.set_password('testpass123')
            user.save()
            self.stdout.write(self.style.SUCCESS('Created test user: testuser / testpass123'))
        else:
            self.stdout.write(self.style.WARNING('Test user already exists'))

        # Create sample project
        project, created = Project.objects.get_or_create(
            name='Sample LaTeX Document',
            owner=user,
            defaults={
                'description': 'A sample project demonstrating LaTeX compilation',
                'is_public': True
            }
        )

        if created:
            self.stdout.write(self.style.SUCCESS(f'Created project: {project.name}'))

            # Create a main document
            main_file = LatexFile.objects.create(
                project=project,
                name='main',
                file_type='tex',
                content=LatexCompiler.get_default_template(),
                is_main=True
            )
            self.stdout.write(self.style.SUCCESS(f'Created main file: {main_file.name}'))

            # Create a folder
            sections_folder = Folder.objects.create(
                project=project,
                name='sections'
            )
            self.stdout.write(self.style.SUCCESS(f'Created folder: {sections_folder.name}'))

            # Create a section file
            intro_file = LatexFile.objects.create(
                project=project,
                folder=sections_folder,
                name='introduction',
                file_type='tex',
                content=r'''\section{Introduction}

This is a sample introduction section.

Here we can write about the purpose and scope of our document.

\subsection{Background}

Some background information can go here.
'''
            )
            self.stdout.write(self.style.SUCCESS(f'Created section file: {intro_file.name}'))

            # Create bibliography file
            bib_file = LatexFile.objects.create(
                project=project,
                name='references',
                file_type='bib',
                content=r'''@article{einstein1905,
    author = {Einstein, Albert},
    title = {On the Electrodynamics of Moving Bodies},
    journal = {Annalen der Physik},
    year = {1905},
    volume = {17},
    pages = {891-921}
}
'''
            )
            self.stdout.write(self.style.SUCCESS(f'Created bibliography: {bib_file.name}'))

        else:
            self.stdout.write(self.style.WARNING('Sample project already exists'))

        # Create another project
        thesis_project, created = Project.objects.get_or_create(
            name='My Thesis',
            owner=user,
            defaults={
                'description': 'PhD Thesis on Advanced Topics in Mathematics',
                'is_public': False
            }
        )

        if created:
            self.stdout.write(self.style.SUCCESS(f'Created project: {thesis_project.name}'))

            # Create chapters folder
            chapters_folder = Folder.objects.create(
                project=thesis_project,
                name='chapters'
            )

            # Create main thesis file
            thesis_file = LatexFile.objects.create(
                project=thesis_project,
                name='thesis',
                file_type='tex',
                content=r'''\documentclass[12pt,a4paper]{report}
\usepackage[utf8]{inputenc}
\usepackage{amsmath,amsfonts,amssymb}
\usepackage{graphicx}
\usepackage{hyperref}

\title{My PhD Thesis}
\author{Your Name}
\date{\today}

\begin{document}

\maketitle
\tableofcontents

\chapter{Introduction}

This thesis explores advanced topics in mathematics and their applications.

\section{Motivation}

The motivation for this research stems from...

\section{Research Questions}

We address the following questions:
\begin{enumerate}
    \item What are the fundamental properties?
    \item How can we apply these results?
    \item What are the implications?
\end{enumerate}

\chapter{Literature Review}

Previous work in this field includes...

\chapter{Methodology}

We employ the following methods...

\chapter{Results}

Our findings demonstrate...

\chapter{Conclusion}

In conclusion, we have shown...

\bibliographystyle{plain}
\bibliography{references}

\end{document}
''',
                is_main=True
            )
            self.stdout.write(self.style.SUCCESS(f'Created thesis file: {thesis_file.name}'))

        else:
            self.stdout.write(self.style.WARNING('Thesis project already exists'))

        self.stdout.write(self.style.SUCCESS('\n✅ Sample data created successfully!'))
        self.stdout.write(self.style.SUCCESS('You can now login with:'))
        self.stdout.write(self.style.SUCCESS('  Username: testuser'))
        self.stdout.write(self.style.SUCCESS('  Password: testpass123'))
