
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, RefreshCw, Play, Square, Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DockerContainer {
  id: string;
  name: string;
  image: string;
  status: 'running' | 'stopped' | 'exited';
  created: string;
  ports: string;
}

const DockerContainersTab = () => {
  const [containers, setContainers] = useState<DockerContainer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyRunning, setShowOnlyRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchContainers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/api/docker/containers');
      if (!response.ok) throw new Error('Failed to fetch containers');
      const data = await response.json();
      setContainers(data);
      toast.success('Container list refreshed');
    } catch (error) {
      console.error('Error fetching Docker containers:', error);
      toast.error('Failed to fetch Docker containers');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleStartContainer = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/docker/containers/${id}/start`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to start container');
  
      await fetchContainers();
      toast.success('Container started');
    } catch (error) {
      console.error('Error starting container:', error);
      toast.error('Failed to start container');
    }
  };

  const handleStopContainer = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/docker/containers/${id}/stop`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to stop container');
  
      await fetchContainers();
      toast.success('Container stopped');
    } catch (error) {
      console.error('Error stopping container:', error);
      toast.error('Failed to stop container');
    }
  };

  const handleDeleteContainer = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/docker/containers/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete container');
  
      await fetchContainers();
      toast.success('Container removed');
    } catch (error) {
      console.error('Error removing container:', error);
      toast.error('Failed to remove container');
    }
  };

  useEffect(() => {
    fetchContainers();
  }, []);
  

  const filteredContainers = containers
    .filter(container => 
      (showOnlyRunning ? container.status === 'running' : true) &&
      (container.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      container.image.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>Docker Containers</CardTitle>
        <CardDescription>
          List and manage Docker containers on your local machine
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between mb-4 gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search containers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="show-running"
                checked={showOnlyRunning}
                onCheckedChange={setShowOnlyRunning}
              />
              <Label htmlFor="show-running">Running only</Label>
            </div>
            <Button 
              variant="outline"
              onClick={fetchContainers}
              disabled={isLoading}
              className="whitespace-nowrap"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Ports</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContainers.length > 0 ? (
                filteredContainers.map((container) => (
                  <TableRow key={container.id}>
                    <TableCell className="font-medium">{container.name}</TableCell>
                    <TableCell>{container.image}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={container.status === 'running' ? 'default' : 'secondary'} 
                        className={
                          container.status === 'running' 
                            ? 'bg-green-500 hover:bg-green-600' 
                            : 'bg-gray-500 hover:bg-gray-600'
                        }
                      >
                        {container.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{container.created}</TableCell>
                    <TableCell>{container.ports}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {container.status !== 'running' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleStartContainer(container.id)}
                            title="Start"
                          >
                            <Play className="h-4 w-4 text-green-500" />
                          </Button>
                        )}
                        {container.status === 'running' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleStopContainer(container.id)}
                            title="Stop"
                          >
                            <Square className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteContainer(container.id)}
                          title="Remove"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                    {searchTerm ? 'No containers match your search' : 'No Docker containers found'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DockerContainersTab;
