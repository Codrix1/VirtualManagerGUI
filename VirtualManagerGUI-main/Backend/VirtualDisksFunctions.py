import os
import subprocess


def create_disk(name, size, type, format):
    folder_path = os.path.join(os.getcwd(), 'Backend/VImgs') 
    
    os.makedirs(folder_path, exist_ok=True)

    img_path = os.path.join(folder_path, f"{name}.img")

    if type == "dynamic":
        pass  

    command = [
        "qemu-img", "create",
        "-f", format,
        img_path,      
        f"{size}G"
    ]

    try:
        result = subprocess.run(
            command,
            capture_output=True,
            text=True,
            check=True
        )
        return f"output: {result.stdout}"
    except subprocess.CalledProcessError as e:
        return f"error: {e.stderr}"

def edit_format(disk, format):
    folder_path = os.path.join(os.getcwd(), 'Backend/VImgs')  
    
    os.makedirs(folder_path, exist_ok=True)
    img_path = os.path.join(folder_path, f"{disk}")
    command = [
        "qemu-img", "convert",
        "-O", format,
        img_path, img_path
    ]

    try:
        result = subprocess.run(
            command,
            capture_output=True,
            text=True,
            check=True
        )
        return f"output: {result.stdout}"
    except subprocess.CalledProcessError as e:
        return f"error: {e.stderr}"
    
def resize(disk, Newsize):
    folder_path = os.path.join(os.getcwd(), 'Backend/VImgs')  
    
    os.makedirs(folder_path, exist_ok=True)
    img_path = os.path.join(folder_path, f"{disk}")
    command = [
        "qemu-img", "resize",
        img_path,f"+{Newsize}G"
    ]

    try:
        result = subprocess.run(
            command,
            capture_output=True,
            text=True,
            check=True
        )
        return f"output: {result.stdout}"
    except subprocess.CalledProcessError as e:
        return f"error: {e.stderr}"

def get_info(disk: str):
    folder_path = os.path.join(os.getcwd(), 'Backend', 'VImgs')
    os.makedirs(folder_path, exist_ok=True)

    img_path = os.path.join(folder_path, disk)

    if not os.path.isfile(img_path):
        return {"error": f"Disk image '{disk}' not found."}

    command = ["qemu-img", "info", img_path]

    try:
        result = subprocess.run(
            command,
            capture_output=True,
            text=True,
            check=True
        )

        lines = result.stdout.strip().splitlines()
        parsed = {}

        for line in lines:
            if ':' in line:
                key, value = line.split(':', 1)
                parsed[key.strip().lower()] = value.strip()

        parsed = {
            'image': parsed.get('image', ''),
            'file_format': parsed.get('file format', ''),
            'virtual_size': parsed.get('virtual size', ''),
            'disk_size': parsed.get('disk size', ''),
        }

        return parsed

    except subprocess.CalledProcessError as e:
        return {"error": e.stderr.strip()}
    except Exception as e:
        return {"error": str(e)}

def run_qemu_vm(name, cpu, memory_gb, disk_name, iso_path=None):
    try:
        disk_path = os.path.join(os.getcwd(), 'Backend', 'VImgs', disk_name)

        memory_mb = int(memory_gb * 1024)

        cmd = [
            "qemu-system-x86_64",
            "-name", name,
            "-m", str(memory_mb),
            "-smp", str(cpu),
            "-hda", disk_path,
            "-boot", "menu=on",
            "-display", "sdl"
        ]

        # If you want to boot from an ISO too
        if iso_path:
            cmd += ["-cdrom", iso_path]

        print("Running command:", ' '.join(cmd))

        subprocess.run(cmd, check=True)

        print(f"✅ VM '{name}' created and running.")

    except Exception as e:
        print(f"❌ Error: {e}")
