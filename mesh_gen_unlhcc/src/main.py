from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import os
import sys
import shutil
from backports import tempfile
import json
import scipy
from scipy.spatial.transform import Rotation as R
from dotenv import load_dotenv
load_dotenv()
MESH_PORT= os.getenv('MESH_PORT')

app=Flask(__name__)
cors = CORS(app)

@app.route("/")
def home():
    return jsonify({"message": "This is the Python microservice to access the functions of DREAM3D."})

@app.route("/health")
def health():
    return jsonify({"value": "OK"})

@app.route("/generate_mesh", methods=["POST"])
def generate_mesh():
    mesh_constraints = request.json
    with tempfile.TemporaryDirectory() as tdir:
        file_loc = tdir + "/mesh.json"
        with open(file_loc, 'w') as f:
             mesh_constraints["7"]["OutputFile"] = tdir + "/mesh/mesh.dream3d"
             mesh_constraints["8"]["OutputPath"] = tdir + "/mesh/mesh"
             json.dump(mesh_constraints, f)
        # os.system("/usr/src/DREAM3D/DREAM3D-build-MinSizeRel/Bin/PipelineRunner -p " + file_loc)
        os.system("/opt/DREAM3D/bin/PipelineRunner -p " + file_loc)
        grain_count = 0

        # read number of grains
        with open(tdir + "/mesh/mesh/abqs_elset.inp") as f:
            lines = f.readlines()
            for line in lines:
                if "*Elset, elset=Grain" in line:
                    grain_count += 1

        # generate random Euler angles
        angles = []
        for i in range(0, grain_count):
            arr = R.random().as_euler('zxy', degrees=True)
            angles.append("\n{x}\t{y}\t{z}".format(x=arr[0], y=arr[1], z=arr[2]))
        with open(tdir + "/mesh/euler_angles.txt", 'w') as f:
            f.writelines(["0\t0\t0"] + angles)

        shutil.make_archive(tdir + "/mesh", 'zip', tdir + "/mesh")
        return send_file(tdir + "/mesh.zip")


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=MESH_PORT, debug=True)
