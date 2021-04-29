import requests, json
from logtools import logFile

SERVER = "https://docs.openaq.org"
LARGE_LIMIT = 50000 #point limit for deployment
LIMIT = 10000 #point limit for testing purposes

def getOpenAQMeasurements(limit=LIMIT, country='US'):
    #preparing path
    query = f'?limit={limit}&country={country}'
    rel_path = '/v2/measurements'
    path = f'{SERVER}{rel_path}{query}'

    print(path)
    req = requests.get(path)
    logFile(req, 'measurements')
    return req.json()

def getOpenAQAverages(limit=LIMIT, country='US'):
    #preparing path
    query = f'?limit={limit}&country={country}'
    rel_path = '/v2/averages'
    path = f'{SERVER}{rel_path}{query}'

    req = requests.get(path)
    logFile(req, 'averages')
    return req.json()

def getOpenAQLocations(limit=LIMIT, country='US'):
    #preparing path
    query = f'?limit={limit}&country={country}'
    rel_path = '/v2/locations'
    path = f'{SERVER}{rel_path}{query}'

    req = requests.get(path)
    logFile(req, 'locations')
    return req.json()

def getOpenAQCountries(limit=100):
    #preparing path
    query = f'?limit={limit}'
    rel_path = '/v2/countries'
    path = f'{SERVER}{rel_path}{query}'

    req = requests.get(path)
    logFile(req, 'countries')
    return req.json()
