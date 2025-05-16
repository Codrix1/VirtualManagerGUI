
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dock } from 'lucide-react';
import DockerfileTab from '../components/docker/DockerfileTab';
import DockerImageTab from '../components/docker/DockerImageTab';
import DockerImagesTab from '../components/docker/DockerImagesTab';
import DockerContainersTab from '../components/docker/DockerContainersTab';
import DockerHubTab from '../components/docker/DockerHubTab';

const Docker = () => {
  const [activeTab, setActiveTab] = useState("dockerfile");

  return (
    <Layout title="Docker Management">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Docker Management</h1>
        <p className="text-gray-600 mt-2">Build, manage, and deploy Docker containers</p>
      </div>
      
      <div className="flex flex-col md:flex-row h-full min-h-[calc(100vh-16rem)]">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-white shadow-md rounded-lg p-4 mb-4 md:mb-0 md:mr-4">
          <div className="flex items-center mb-6">
            <Dock className="h-8 w-8 text-[#2496ED] mr-2" />
            <h2 className="text-2xl font-bold">Docker</h2>
          </div>
          
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab} 
            orientation="vertical" 
            className="w-full"
          >
            <TabsList className="flex flex-col h-auto space-y-1 bg-transparent">
              <TabsTrigger 
                value="dockerfile" 
                className="justify-start text-left px-2 py-2 data-[state=active]:bg-[#2496ED]/10"
              >
                Dockerfile
              </TabsTrigger>
              <TabsTrigger 
                value="docker-image" 
                className="justify-start text-left px-2 py-2 data-[state=active]:bg-[#2496ED]/10"
              >
                Docker Image
              </TabsTrigger>
              <TabsTrigger 
                value="list-images" 
                className="justify-start text-left px-2 py-2 data-[state=active]:bg-[#2496ED]/10"
              >
                List Images
              </TabsTrigger>
              <TabsTrigger 
                value="list-containers" 
                className="justify-start text-left px-2 py-2 data-[state=active]:bg-[#2496ED]/10"
              >
                List Containers
              </TabsTrigger>
              <TabsTrigger 
                value="docker-hub" 
                className="justify-start text-left px-2 py-2 data-[state=active]:bg-[#2496ED]/10"
              >
                Docker Hub
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white shadow-md rounded-lg p-6">
          <Tabs value={activeTab} className="w-full">
            <TabsContent value="dockerfile">
              <DockerfileTab />
            </TabsContent>
            <TabsContent value="docker-image">
              <DockerImageTab />
            </TabsContent>
            <TabsContent value="list-images">
              <DockerImagesTab />
            </TabsContent>
            <TabsContent value="list-containers">
              <DockerContainersTab />
            </TabsContent>
            <TabsContent value="docker-hub">
              <DockerHubTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Docker;
