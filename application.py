from flask import Flask, request, render_template, jsonify
import requests
import json

with open('config.json') as f:
    config = json.load(f)

# declare app
application = Flask(__name__)

# serve main page
@application.route("/", methods=["POST", "GET"])

def index():
    return render_template(["index.html", "app.js", "style.css"])


@application.route("/submit", methods=["POST"])
def submit():
    data = request.get_json()  # Get JSON data from the request
    
    url = data.get('url')      # Get URL from the JSON data
    json_data = data.get('json')  # Get JSON object from the JSON data
    print(json_data)
    json_data['xKey'] = config['xkey']
    json_data['xversion'] = config['xversion']
    json_data['xsoftwarename'] = config['xsoftwarename']
    json_data['xsoftwareversion'] = config['xsoftwareversion']
    json_data['xvendorid'] = '183537'
    


        # Check if both URL and JSON object are present in the request
    if url is None or json_data is None:
        return jsonify({"error": "Invalid JSON data"}), 400
        
        # Send JSON object as a POST request to the specified URL
      
    headers = {"Content-Type": "application/json"}
    apiCall = requests.request("POST", url, headers = headers, data = json.dumps(json_data))
    response = apiCall.json()   
    print(response) 
    return json.dumps({"Status": 200, "Response": response})


# parameters to run with
if __name__ == "__main__":
    application.run(debug=True)
