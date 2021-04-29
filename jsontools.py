import pandas as pd
import json
from logtools import readFile

#class for getting json data
class Data:
    @staticmethod
    def get_data():
        data = readFile('measurements')
        return data

#prepares dictionary of relevant variables from json
def organize_nodes(data):
    organized_nodes = {}
    for result_set in data:
        id = result_set['locationId']
        loc = result_set['location']
        country = result_set['country']
        city = result_set['city']
        coords = (result_set['coordinates']['latitude'], result_set['coordinates']['longitude'])
        location = {'id': id, 'loc': loc, 'country': country, 'city': city, 'coords': coords}

        parameters = [result_set['parameter']]
        values = result_set['value']
        date = result_set['date']['utc']

        #preparing an organized sample
        sample = {'location': location, 'params': parameters, 'values': values, 'date': date}

        organized_nodes[id] = sample

    return organized_nodes

#gets unique parameters in data. the first element of parameters is always its length
#The second element is to revert to default display
def get_info(org_nodes):
    parameters = []

    #getting parameters of every sample
    for id in org_nodes:
        param = org_nodes[id]['params'][0]
        if param not in parameters:
            parameters.append(param)
    length = len(parameters) + 1 #adding 1 to account for 'all'

    parameters = [length] + ['all'] + parameters
    json_params = dict(enumerate(parameters))

    return json_params

#writes organized_data as json format in file
def writeJSON(organized_data):
    f = open('datalog/clean_data.json', 'w')
    json.dump(organized_data, f)
    f.close()

data = Data.get_data()
org_data = organize_nodes(data)
