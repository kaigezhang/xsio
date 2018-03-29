import random
import string
import os
import base64

DEFAULT_CHAR_STRING = string.ascii_lowercase + string.digits

def generate_random_string(chars=DEFAULT_CHAR_STRING, size=6):
    return ''.join(random.choice(chars) for _ in range(size))

def rand_id():
    return base64.urlsafe_b64encode(os.urandom(16))[:21].decode('utf-8')
