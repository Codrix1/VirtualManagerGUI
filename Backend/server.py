from flask_cors import CORS
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
from VirtualDisksFunctions import *
app = Flask(__name__)
CORS(app)


@app.route('/api/virtual-disk', methods=['POST'])
def create_virtual_disk():
    data = request.get_json()

    required_fields = ['name', 'size', 'type', 'format']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400
    try:
        print(create_disk(data['name'] , data['size'] , "" , data['format']))
        
        return jsonify({
            'message': 'Virtual disk created successfully',
        }), 201
    except:
        return jsonify({
            'message': 'Error creating virtual disk',
        }), 401


@app.route('/api/virtual-disk/convert/<disk_id>', methods=['POST'])
def convert_virtual_disk(disk_id):
    data = request.get_json()
    if not data or 'newFormat' not in data:
        return jsonify({"error": "Missing 'newFormat' in request body"}), 400
   
    try:
        print(data['newFormat'])
        print(edit_format(disk_id , data['newFormat']))
        
        return jsonify({
            'message': 'Virtual disk type changed successfully',
        }), 201
    except:
        return jsonify({
            'message': 'Error changing file virtual disk',
        }), 401
    
 
@app.route('/api/virtual-disk/info/<disk_id>', methods=['GET'])
def get_disk_info(disk_id):
    try:
        parsed_info = get_info(disk_id)
        print(parsed_info)
        if 'error' in parsed_info:
            return jsonify(parsed_info), 400  # Bad Request
        
        return jsonify(parsed_info), 200  # Success
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500  # Internal Server Error


@app.route('/api/vms', methods=['POST'])
def createVirtualmachine():
    # Check required fields
    name = request.form.get('name')
    cpu = request.form.get('cpu')
    memory = request.form.get('memory')
    disk_name = request.form.get('diskName')

    if not all([name, cpu, memory, disk_name]):
        return jsonify({'error': 'Missing required fields'}), 400

    
    try:
        # Run the VM
        run_qemu_vm(
            name=name,
            cpu=int(cpu),
            memory_gb=int(memory),
            disk_name=disk_name,
            # iso_path=iso_filepath
        )
    except Exception as e:
        return jsonify({'error': str(e)}), 502

    return jsonify({'message': f"Virtual machine '{name}' started successfully."})        


@app.route('/api/virtual-disk/resize/<disk_id>', methods=['POST'])
def resize_virtual_disk(disk_id):
    data = request.get_json()
    if not data or 'newSize' not in data:
        return jsonify({"error": "Missing 'newSize' in request body"}), 400
   
    try:
        print(data['newSize'])
        print(f"cmd output: {resize(disk_id , data['newSize'])}")
        
        return jsonify({
            'message': 'Virtual disk type changed successfully',
        }), 201
    except:
        return jsonify({
            'message': 'Error changing file virtual disk',
        }), 401
       
    

@app.route('/api/virtual-disk', methods=['GET'])
def get_disks():
    folder_path = os.path.join(os.getcwd(), 'Backend/VImgs')
    print("Folder path:", folder_path)
    if not os.path.exists(folder_path):
        return jsonify([])

    # Just print all entries in the folder
    entries = os.listdir(folder_path)
    print("All entries:", entries)

    files = [f for f in entries if os.path.isfile(os.path.join(folder_path, f))]
    print("Files only:", files)
    return jsonify(files)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)


