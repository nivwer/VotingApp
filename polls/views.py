# Standard.
import os
from datetime import datetime
# Virtualenv.
from dotenv import load_dotenv
from dotenv import load_dotenv
# Django.
from django.shortcuts import render
# MongoDB connection.
from utils.mongo_connection import MongoDBSingleton

# Load the virtual environment.
load_dotenv()

# Create your views here.
