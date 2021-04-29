import json

#writes a get request of json data to the file given
def logFile(request, filename):
    path = f'datalog/{filename}.json'
    f = open(path, 'w')
    json_content = json.dumps(request.json(), indent=3)
    f.write(json_content)
    f.close()

#reads from the json file and returns its dictionary form
def readFile(filename):
    path = f'datalog/{filename}.json'
    f = open(path,)
    json_content = json.load(f)
    f.close()
    content = dict(json_content)
    return content['results']
