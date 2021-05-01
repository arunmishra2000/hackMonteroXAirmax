from detector import rooftop_detection as rd
from flask import Flask, request, jsonify, render_template


lat = 7.721321321313
lon = 7.721321321313
sol = 3.121
response = rd.get_roof_data(lat, lon)
image = response['image']
#response.pop('image', None)
coeffecient = {
    "prism": 0.75,
    "flat": 1,
    "slantedprism": 0.6,
    "pyramid": 0.5,
    "complex": 0.4
}
response["adjusted"] = coeffecient[response["name"]] * sol
print(jsonify(response))
