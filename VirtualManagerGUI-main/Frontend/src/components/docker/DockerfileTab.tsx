import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const DockerfileTab = () => {
  const [dockerfileContent, setDockerfileContent] = useState(
    'FROM node:18-alpine\nWORKDIR /app\nCOPY . .\nRUN npm install\nCMD ["npm", "start"]'
  );

  const [availableFolders, setAvailableFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/docker/folders')
      .then((res) => res.json())
      .then((data) => {
        setAvailableFolders(data);
        if (data.length > 0) setSelectedFolder(data[0].path);
      })
      .catch((err) => {
        console.error('Failed to load folders:', err);
        toast.error('Failed to load folder list from server');
      });
  }, []);

  const handleSaveDockerfile = async () => {
    const fullPath = `${selectedFolder}/Dockerfile`;

    try {
      const response = await fetch('http://localhost:5000/api/dockerfile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: dockerfileContent, path: fullPath }),
      });

      if (!response.ok) throw new Error('Failed to save');
      toast.success('Dockerfile saved successfully');
    } catch (error) {
      console.error('Error saving Dockerfile:', error);
      toast.error('Failed to save Dockerfile');
    }
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>Create Dockerfile</CardTitle>
        <CardDescription>
          Create and save a Dockerfile to build your Docker image
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Folder Selection */}
        <div className="mb-4">
          <label htmlFor="folderSelect" className="block mb-2 text-sm font-medium">
            Select Folder
          </label>
          <select
            id="folderSelect"
            className="w-full border px-2 py-1 rounded"
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
          >
            {availableFolders.map((folder) => (
              <option key={folder.path} value={folder.path}>
                {folder.name}
              </option>
            ))}
          </select>
        </div>

        {/* Dockerfile Content Input */}
        <div className="mb-4">
          <label htmlFor="dockerfile" className="block mb-2 text-sm font-medium">
            Dockerfile Content
          </label>
          <Textarea
            id="dockerfile"
            value={dockerfileContent}
            onChange={(e) => setDockerfileContent(e.target.value)}
            placeholder="Enter your Dockerfile content here"
            className="font-mono h-80"
          />
        </div>

        {/* Save Button */}
        <Button onClick={handleSaveDockerfile} className="bg-[#2496ED] hover:bg-[#1d7ac1]">
          <Save className="h-4 w-4 mr-2" />
          Save Dockerfile
        </Button>
      </CardContent>
    </Card>
  );
};

export default DockerfileTab;
