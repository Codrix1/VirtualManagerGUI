import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ImageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const DockerImageTab = () => {
  const [dockerfiles, setDockerfiles] = useState([]);
  const [selectedDockerfile, setSelectedDockerfile] = useState('');
  const [imageName, setImageName] = useState('');
  const [isBuilding, setIsBuilding] = useState(false);

  useEffect(() => {
    const fetchDockerfileFolders = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/docker/folders');
        const data = await res.json();

        const dockerfileEntries = data.map((folder, index) => ({
          id: String(index),
          name: folder.name,
          path: `${folder.path}/Dockerfile`,
        }));

        setDockerfiles(dockerfileEntries);
        if (dockerfileEntries.length > 0) {
          setSelectedDockerfile(dockerfileEntries[0].path);
        }
      } catch (error) {
        console.error('Error fetching Dockerfile folders:', error);
        toast.error('Failed to fetch Dockerfile folders');
      }
    };

    fetchDockerfileFolders();
  }, []);
  
  const handleBuildImage = async () => {
    if (!selectedDockerfile) {
      toast.error('Please select a Dockerfile');
      return;
    }
  
    if (!imageName) {
      toast.error('Please enter an image name');
      return;
    }
  
    try {
      setIsBuilding(true);
  
      const response = await fetch('http://localhost:5000/api/docker/build', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dockerfilePath: selectedDockerfile,
          imageName: imageName
        })
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        toast.error(`❌ Build failed: ${result.error}`);
        if (result.logs) {
          console.error('Build logs:\n', result.logs);
          toast.message('🔧 Build logs', {
            description: result.logs.slice(-1000) // Limit long logs
          });
        }
        return;
      }
  
      toast.success(result.message || `Image ${imageName} built successfully`);
    } catch (error) {
      console.error('Request failed:', error);
      toast.error('Failed to contact backend');
    } finally {
      setIsBuilding(false);
    }
  };
   

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>Build Docker Image</CardTitle>
        <CardDescription>Select a Dockerfile and build a Docker image with a custom name.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="mb-4">
          <label htmlFor="dockerfile-select" className="block mb-2 text-sm font-medium">
            Select Dockerfile
          </label>
          <Select value={selectedDockerfile} onValueChange={setSelectedDockerfile}>
            <SelectTrigger id="dockerfile-select">
              <SelectValue placeholder="Select a Dockerfile" />
            </SelectTrigger>
            <SelectContent>
              {dockerfiles.map((file) => (
                <SelectItem key={file.id} value={file.path}>
                  {file.name} ({file.path})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4">
          <label htmlFor="image-name" className="block mb-2 text-sm font-medium">
            Image Name
          </label>
          <Input
            id="image-name"
            value={imageName}
            onChange={(e) => setImageName(e.target.value)}
            placeholder="e.g. myapp:latest"
          />
        </div>

        <Button
          onClick={handleBuildImage}
          className="bg-[#2496ED] hover:bg-[#1d7ac1]"
          disabled={isBuilding}
        >
          <ImageIcon className="h-4 w-4 mr-2" />
          {isBuilding ? 'Building...' : 'Build Image'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DockerImageTab;
