from flask import Flask
from flask import request, url_for, render_template, jsonify, session
import jsontools
import apiget
import random

app = Flask(__name__)
app.secret_key = ''.join([random.choice([chr(i) for i in range(33, 127)]) for j in range(10)])
print(app.secret_key)

@app.route("/")
def main():
    apiget.getOpenAQMeasurements()
    json_content = jsontools.Data.get_data()
    json_content = jsontools.organize_nodes(json_content)
    json_info = jsontools.get_info(json_content)
    session['info'] = json_info
    return render_template("index.html", jsoncontent=json_content, jsoninfo=json_info)

@app.route("/data_table")
def data_table():
    json_content = jsontools.Data.get_data()
    json_content = jsontools.organize_nodes(json_content)
    json_info = jsontools.get_info(json_content)
    return render_template("datatable.html", jsoncontent=json_content, jsoninfo=json_info)


if __name__ == "__main__":
    app.run(debug=True)
