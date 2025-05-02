
# Virtual Machine Manager

## Overview
Virtual Machine Manager is a web-based graphical interface for managing QEMU virtual machines. This application allows you to create and manage virtual disks and virtual machines through an intuitive and user-friendly interface.

## Features

### Virtual Disk Management
- Create virtual disks with customizable size, format, and allocation type
- View detailed information about existing disks
- Convert disks between different formats (raw, qcow2, vmdk, vdi)
- Resize existing disks

### Virtual Machine Management
- Create virtual machines with configurable CPU cores and memory
- Attach virtual disks to your virtual machines
- Select ISO files for booting virtual machines
- Simple and intuitive interface for VM configuration

## Installation

### Prerequisites
- Node.js v16 or higher
- npm v7 or higher

### Getting Started

#### Option 1: Clone the Repository
```bash
# Clone the repository
git clone <YOUR_REPOSITORY_URL>

# Navigate to the project directory
cd virtual-machine-manager

# Install dependencies
npm install

# Start the development server
npm run dev
```

#### Option 2: Download from Lovable
1. Navigate to your project in Lovable
2. Click on the project name at the top
3. Select "Download" option to get a ZIP file
4. Extract the ZIP file
5. Open a terminal in the extracted directory
6. Run `npm install` to install dependencies
7. Run `npm run dev` to start the application

#### Option 3: Using GitHub Integration
1. In your Lovable project, click on the GitHub button in the top right corner
2. Connect your GitHub account if not already connected
3. Transfer the project to GitHub
4. Clone the repository from GitHub
5. Follow the standard setup process (install dependencies and start the server)

## Usage Guide

### Main Dashboard
Upon launching the application, you'll be presented with the main dashboard containing two main options:
- **Virtual Disk Management** - For creating and managing virtual disks
- **Virtual Machine Creation** - For creating and configuring virtual machines

### Creating and Managing Virtual Disks

1. **Navigate to Disk Management**:
   - From the main dashboard, click on "Create Virtual Disk"

2. **Create a New Virtual Disk**:
   - Fill in the "Create Virtual Disk" form with the following details:
     - **Disk Name**: A descriptive name for your disk
     - **Size (GB)**: Size of the disk in gigabytes
     - **Disk Type**:
       - **Fixed**: Pre-allocates the entire disk size (better performance)
       - **Dynamic**: Grows as needed (saves disk space)
     - **Disk Format**:
       - **raw**: Basic disk image format
       - **qcow2**: QEMU's native format with advanced features
       - **vmdk**: VMware's disk format
       - **vdi**: VirtualBox's disk format
   - Click "Create Disk" to create your virtual disk

3. **Manage Existing Disks**:
   - Select a disk from the dropdown in the "Manage Virtual Disks" section
   - View disk information by selecting the "Disk Info" tab
   - Convert disk format by selecting the "Convert" tab:
     - Choose a new format
     - Click "Convert Format"
   - Resize a disk by selecting the "Resize" tab:
     - Enter a new size in GB
     - Click "Resize Disk"

### Creating Virtual Machines

1. **Navigate to VM Creation**:
   - From the main dashboard, click on "Create Virtual Machine"

2. **Configure Your Virtual Machine**:
   - Complete the form with the following information:
     - **VM Name**: A descriptive name for your virtual machine
     - **CPU Cores**: Use the slider to select the number of CPU cores (1-16)
     - **Memory (GB)**: Use the slider to select the amount of RAM (1-64 GB)
     - **Virtual Disk**: Select a previously created virtual disk
     - **Boot ISO Image** (Optional): Select an ISO file to boot from

3. **Create the Virtual Machine**:
   - After configuring your VM, click the "Create Virtual Machine" button
   - A success message will appear once the VM is created

## Important Notes

1. **Virtual Disk Requirement**:
   - You must create at least one virtual disk before creating a virtual machine
   - The VM creation form will be disabled until at least one disk exists

2. **ISO Files**:
   - For optimal compatibility, ensure your ISO files are properly formatted
   - After selecting an ISO file, a preview of the selected file name will appear
   - You can clear your ISO selection using the "Clear" button

3. **Disk Format Considerations**:
   - **raw**: Best performance but uses the most space
   - **qcow2**: QEMU's native format with features like snapshots
   - **vmdk**: Best for compatibility with VMware products
   - **vdi**: Best for compatibility with VirtualBox

## Technical Details

### Data Persistence
- This application uses client-side storage to persist your virtual disk and machine configurations
- Data is stored in memory while the application is running
- In a production environment, you would want to integrate with a backend system for persistent storage

### Compatibility
- The application is designed to work with QEMU/KVM virtualization
- The disk formats supported (raw, qcow2, vmdk, vdi) are compatible with most virtualization platforms

### Resource Recommendations
- For optimal performance when running virtual machines:
  - Assign no more than 75% of your host's CPU cores
  - Assign no more than 75% of your host's available RAM
  - Ensure sufficient free disk space for virtual disks

## Troubleshooting

### Common Issues and Solutions

1. **Cannot Create Virtual Machine**:
   - Ensure you have created at least one virtual disk
   - Check that all required fields are filled out correctly

2. **Performance Issues**:
   - Reduce the number of CPU cores or amount of RAM allocated
   - Consider using the qcow2 format for better performance with QEMU

3. **File Selection Issues**:
   - Make sure the ISO file is accessible and not corrupted
   - Check that the file has a valid .iso extension

### Getting Support

If you encounter issues not covered in this documentation, please:
1. Check the project's GitHub repository for known issues
2. Submit a new issue describing your problem in detail
3. For urgent support, contact the project maintainers directly

## Development and Customization

### Project Structure
- `/src/components`: UI components
- `/src/pages`: Application pages
- `/src/store`: Data stores (Zustand)

### Extending the Application
- To add new disk formats, update the `DiskFormat` type in `/src/store/diskStore.ts`
- To add new VM options, extend the `VirtualMachine` interface in `/src/store/vmStore.ts`

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements
- Built with React, TypeScript, and Tailwind CSS
- Uses Zustand for state management
- UI components from shadcn/ui library
