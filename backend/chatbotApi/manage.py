#!/usr/bin/env python

import os
import sys
import time

from django.core.management import execute_from_command_line
from django.db import connections
from django.db.utils import OperationalError

def check_database_connection():
    print("Checking database connection...")
    for _ in range(30):  # Tente verificar a cada segundo, por até 30 segundos
        try:
            connections['default'].ensure_connection()
            print("Database is available!")
            return True
        except OperationalError as e:
            print("Database not available yet. Retrying in 1 second...")
            time.sleep(1)
    print("Database not available after 30 seconds. Exiting.")
    return False

def main():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chatbotApi.settings')
    if(not check_database_connection()):
        pass
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    
    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    main()
