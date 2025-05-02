
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { HardDrive, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  return (
    <Layout title="Virtual Machine Manager">
      <div className="flex flex-col items-center justify-center mt-16">
        <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">
          Welcome to Virtual Machine Manager
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl text-center mb-12">
          Create and manage virtual disks and machines with an intuitive interface
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          <Card className="transition-all hover:shadow-lg">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="bg-[#3B46B2]/10 p-5 rounded-full mb-4">
                <HardDrive className="h-12 w-12 text-[#3B46B2]" />
              </div>
              <h2 className="text-2xl font-semibold mb-4">Virtual Disk Management</h2>
              <p className="text-gray-500 mb-6">
                Create, convert, resize and manage virtual disks for your virtual machines
              </p>
              <Button asChild className="bg-[#3B46B2] hover:bg-[#2A3BAB] w-full">
                <Link to="/create-virtual-disk">Create Virtual Disk</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="transition-all hover:shadow-lg">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="bg-[#7673FA]/10 p-5 rounded-full mb-4">
                <Cpu className="h-12 w-12 text-[#7673FA]" />
              </div>
              <h2 className="text-2xl font-semibold mb-4">Virtual Machine Creation</h2>
              <p className="text-gray-500 mb-6">
                Deploy virtual machines with customizable CPU, memory and storage options
              </p>
              <Button asChild className="bg-[#7673FA] hover:bg-[#5D5AD5] w-full">
                <Link to="/create-virtual-machine">Create Virtual Machine</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
