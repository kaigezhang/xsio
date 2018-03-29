import logging

from django.conf import settings

from scholar.celery import app
from .models import File, Paper, Journal, Author
from .textProcessing.pdfReader import PdfReader

pdf_reader = PdfReader()
pdf_reader.connect()

log = logging.getLogger(__name__)


@app.task
def pdf_read(file_hashes):
    print('rest {}'.format(file_hashes))
    files = []
    blobs = []
    for hash in file_hashes:
        file = File.objects.get(hash=hash)
        if file.paper is None:
            file_path = settings.MEDIA_ROOT + hash
            files.append(file_path)
    print('files {}'.format(files))
    for path in files:
        with open(path, 'rb') as file_read:
            blobs.append(file_read.read())
    results = pdf_reader.covert_batch(blobs)
    print('results {}'.format(results))
    for re in results:
        for (key, value) in re.items():
            file = File.objects.get(hash=key)
            result = value.get('result', None)

            if result is not None:
                journal = result.pop('journal', None)
                authors = result.pop('authors', None)
                print('journal {} author {}'.format(journal, authors))
                # paper = Paper.objects.create(
                #     title=result.get('title', None),
                #     abstract=result.get('abstract', None),
                #     year=result.get('abstract', None),
                #     month=result.get('month', None),
                #     volume=result.get('volume', None),
                #     pages=result.get('pages', None),
                #     page_from=result.get('page_from', None),
                #     page_to=result.get('page_to', None)
                # )
                paper = Paper.objects.create(**result)
                paper.files.add(file)
                for author in authors:
                    # author = Author.objects.get_or_create(
                    #     forename=author.get('forename', None),
                    #     initials=author.get('initials', None),
                    #     lastname=author.get('lastname', None),
                    # )
                    author, created = Author.objects.get_or_create(**author)
                    paper.authors.add(author)

                if journal is not None:
                    journal, created = Journal.objects.get_or_create(
                        name=journal
                    )
                    paper.journal = journal
                    paper.save()




