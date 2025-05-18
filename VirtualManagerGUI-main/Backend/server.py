from flask_cors import CORS
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
import docker
import requests
from VirtualDisksFunctions import *

UPLOAD_FOLDER = os.path.join(os.getcwd(),'Backend', 'isofiles') 
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app = Flask(__name__)
CORS(app)
client = docker.from_env()

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
            return jsonify(parsed_info), 400 
        
        return jsonify(parsed_info), 200  
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500 

@app.route('/api/vms', methods=['POST'])
def createVirtualmachine():
    name = request.form.get('name')
    cpu = request.form.get('cpu')
    memory = request.form.get('memory')
    disk_name = request.form.get('diskName')

    if not all([name, cpu, memory, disk_name]):
        return jsonify({'error': 'Missing required fields'}), 400

    iso_file = request.files.get('isoFile')
    iso_filepath = None

    if iso_file:
        filename = iso_file.filename
        iso_filepath = os.path.abspath(os.path.join(UPLOAD_FOLDER, filename))  # Absolute path
        try:
            iso_file.save(iso_filepath)
        except Exception as save_err:
            return jsonify({'error': f'File saving failed: {str(save_err)}'}), 500

    try:
        run_qemu_vm(
            name=name,
            cpu=int(cpu),
            memory_gb=float(memory),
            disk_name=disk_name,
            iso_path=iso_filepath  
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

    entries = os.listdir(folder_path)
    print("All entries:", entries)

    files = [f for f in entries if os.path.isfile(os.path.join(folder_path, f))]
    print("Files only:", files)
    return jsonify(files)
       

@app.route('/api/docker/info', methods=['GET'])
def get_docker_info():
    try:
        info = client.info()
        return jsonify(info), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#-------Dockerfile-----------

@app.route('/api/dockerfile', methods=['POST'])
def save_dockerfile():
    data = request.json
    content = data.get('content')
    path = data.get('path')

    if not content or not path:
        return jsonify({'error': 'Missing content or path'}), 400

    try:
        # Ensure directory exists
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, 'w') as f:
            f.write(content)

        return jsonify({'message': 'Dockerfile saved successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/docker/folders', methods=['GET'])
def list_docker_folders():
    base_dir = os.path.join(os.path.dirname(__file__), 'dockerfiles')
    os.makedirs(base_dir, exist_ok=True)

    folders = []
    for folder_name in os.listdir(base_dir):
        full_path = os.path.join(base_dir, folder_name)
        if os.path.isdir(full_path):
            folders.append({'name': folder_name, 'path': full_path})

    return jsonify(folders)

#--------Dockerfile----------


#--------Build Image--------

@app.route('/api/docker/build', methods=['POST'])
def build_image():
    data = request.json
    dockerfile_path = data.get('dockerfilePath')
    image_name = data.get('imageName')
    if not dockerfile_path or not image_name:
        return jsonify({'error': 'Missing Dockerfile path or image name'}), 400

    dockerfile_dir = os.path.dirname(dockerfile_path)
    dockerfile_name = os.path.basename(dockerfile_path)
    try:
        image, logs = client.images.build(
            path=dockerfile_dir,
            dockerfile=dockerfile_name,
            tag=image_name,
            rm=True # Get logs as dictionaries
        )

        # Extract readable output
        build_output = "".join(
            [entry.get("stream", "") for entry in logs if "stream" in entry]
        )

        return jsonify({
            'message': f'Image {image_name} built successfully',
            'logs': build_output
        }), 200

    except docker.errors.BuildError as e:
        error_output = "".join(
            [entry.get("stream", "") for entry in e.build_log if "stream" in entry]
        )
        return jsonify({
            'error': 'Build failed',
            'logs': error_output
        }), 500

    except Exception as e:
        print(str(e))
        return jsonify({'error': str(e)}), 500
    
#--------Build Image--------    

#--------List Image--------

@app.route('/api/docker/images', methods=['GET'])
def list_docker_images():
    try:
        images = client.images.list()
        image_data = []

        for img in images:
            tags = img.tags[0] if img.tags else "<none>:<none>"
            repository, tag = tags.split(':') if ':' in tags else (tags, "<none>")
            image_data.append({
                'id': img.short_id.replace("sha256:", ""),
                'repository': repository,
                'tag': tag,
                'created': img.attrs['Created'],
                'size': f"{round(img.attrs['Size'] / (1024 * 1024), 2)}MB"
            })

        return jsonify(image_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/docker/images/<image_id>', methods=['DELETE'])
def delete_docker_image(image_id):
    try:
        client.images.remove(image=image_id, force=True)
        return jsonify({'message': 'Image deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/docker/containers/create', methods=['POST'])
def create_container():
    data = request.get_json()
    image_id = data.get('imageId')
    container_name = data.get('containerName')

    if not image_id:
        return jsonify({"error": "Image ID is required"}), 400

    try:
        container = client.containers.create(
            image=image_id,
            name=container_name if container_name else None,
            detach=True
        )
        return jsonify({"message": "Container created", "containerId": container.id}), 201
    except docker.errors.APIError as e:
        return jsonify({"error": str(e)}), 500


#--------List Image--------

#--------List containers --------

@app.route('/api/docker/containers', methods=['GET'])
def list_containers():
    containers = client.containers.list(all=True)
    result = []
    for c in containers:
        result.append({
            "id": c.short_id,
            "name": c.name,
            "image": c.image.tags[0] if c.image.tags else c.image.short_id,
            "status": c.status,
            "created": c.attrs['Created'],
            "ports": parse_ports(c.attrs['NetworkSettings']['Ports'])
        })
    return jsonify(result)

@app.route('/api/docker/containers/<string:container_id>/start', methods=['POST'])
def start_container(container_id):
    try:
        container = client.containers.get(container_id)
        container.start()
        return jsonify({'message': 'Container started'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/docker/containers/<string:container_id>/stop', methods=['POST'])
def stop_container(container_id):
    try:
        container = client.containers.get(container_id)
        container.stop()
        return jsonify({'message': 'Container stopped'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/docker/containers/<string:container_id>', methods=['DELETE'])
def delete_container(container_id):
    try:
        container = client.containers.get(container_id)
        container.remove(force=True)
        return jsonify({'message': 'Container removed'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def parse_ports(ports_dict):
    if not ports_dict:
        return ""
    ports = []
    for container_port, bindings in ports_dict.items():
        if bindings:
            for binding in bindings:
                host_port = binding.get("HostPort")
                ports.append(f"{host_port}:{container_port}")
    return ", ".join(ports)

#--------List containers --------

#--------Docker hub ---------

@app.route('/api/docker/search', methods=['GET'])
def search_images():
    term = request.args.get('term')
    limit = int(request.args.get('limit', 10))
    page = int(request.args.get('page', 1))

    if not term:
        return jsonify({'error': 'Missing search term'}), 400

    try:
        response = requests.get(
            'https://hub.docker.com/v2/search/repositories/',
            params={
                'query': term,
                'page_size': limit,
                'page': page,
            },
            headers={
                'Accept': 'application/json',
            }
        )

        if response.status_code != 200:
            print('[ERROR] Docker Hub API returned:', response.status_code)
            return jsonify({'error': 'Failed to fetch from Docker Hub'}), 500

        data = response.json()

        results = []
        for item in data.get('results', []):
            name = f"{item.get('namespace')}/{item.get('name')}"
            results.append({
                'name' : item.get('repo_name', 'unknown/unknown'),
                'description': item.get('description', ''),
                'star_count': item.get('star_count', 0),
                'is_official': item.get('is_official', False),
                'pull_count': item.get('pull_count', 0),
            })

        return jsonify({'results': results})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Docker Pull
@app.route('/api/docker/pull', methods=['POST'])
def pull_image():
    data = request.get_json()
    image_name = data.get('imageName')

    if not image_name:
        return jsonify({'error': 'Image name is required'}), 400

    try:
        client.images.pull(image_name)
        return jsonify({'message': f'Image {image_name} pulled successfully'}), 200
    except docker.errors.APIError as e:
        return jsonify({'error': str(e)}), 500

#------- Docker Hub ------------
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)


