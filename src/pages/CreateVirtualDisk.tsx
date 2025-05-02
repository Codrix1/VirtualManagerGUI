
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useDiskStore, type DiskFormat, type DiskType } from '../store/diskStore';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { HardDrive, Info, Sliders } from 'lucide-react';
import { Label } from '@/components/ui/label';

const CreateVirtualDisk = () => {
  const { disks, addDisk, convertDiskFormat, resizeDisk } = useDiskStore();
  const [selectedDisk, setSelectedDisk] = useState<string>('');
  const [selectedAction, setSelectedAction] = useState<string>('info');
  const [newFormat, setNewFormat] = useState<DiskFormat>('qcow2');
  const [newSize, setNewSize] = useState<number>(20);

  const form = useForm({
    defaultValues: {
      name: '',
      size: 20,
      type: 'dynamic',
      format: 'qcow2'
    }
  });
  
  // Create a separate form for disk management
  const manageDiskForm = useForm({
    defaultValues: {
      diskId: '',
      newFormat: 'qcow2',
      newSize: 20
    }
  });

  const onSubmit = (values: any) => {
    addDisk({
      name: values.name,
      size: Number(values.size),
      type: values.type as DiskType,
      format: values.format as DiskFormat
    });
    
    toast.success('Virtual disk created successfully!');
    form.reset();
  };

  const handleConvert = () => {
    if (selectedDisk) {
      convertDiskFormat(selectedDisk, newFormat);
      toast.success('Disk format converted successfully!');
    }
  };

  const handleResize = () => {
    if (selectedDisk) {
      resizeDisk(selectedDisk, newSize);
      toast.success('Disk resized successfully!');
    }
  };

  const selectedDiskInfo = disks.find(disk => disk.id === selectedDisk);

  return (
    <Layout title="Virtual Machine Manager">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Virtual Disk Management</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Create Virtual Disk Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="h-5 w-5" />
                Create Virtual Disk
              </CardTitle>
              <CardDescription>
                Configure and create a new virtual disk
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Disk Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter disk name" {...field} />
                        </FormControl>
                        <FormDescription>
                          Give your disk a descriptive name
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="size"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Size (GB)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1" 
                            step="1" 
                            placeholder="Enter disk size in GB"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Size of the disk in gigabytes
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Disk Type</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="fixed">Fixed</SelectItem>
                              <SelectItem value="dynamic">Dynamic</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Storage allocation type
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="format"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Disk Format</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select format" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="raw">raw</SelectItem>
                              <SelectItem value="qcow2">qcow2</SelectItem>
                              <SelectItem value="vmdk">vmdk</SelectItem>
                              <SelectItem value="vdi">vdi</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            File format for the disk
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-[#3B46B2] hover:bg-[#2A3BAB]"
                  >
                    Create Disk
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          {/* Manage Virtual Disks Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sliders className="h-5 w-5" />
                Manage Virtual Disks
              </CardTitle>
              <CardDescription>
                View and modify your existing virtual disks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="select-disk">Select Disk</Label>
                  <Select 
                    onValueChange={setSelectedDisk} 
                    value={selectedDisk}
                  >
                    <SelectTrigger id="select-disk">
                      <SelectValue placeholder="Select a disk" />
                    </SelectTrigger>
                    <SelectContent>
                      {disks.length > 0 ? (
                        disks.map(disk => (
                          <SelectItem key={disk.id} value={disk.id}>
                            {disk.name} ({disk.size}GB, {disk.format})
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>
                          No disks available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedDisk && (
                  <>
                    <Separator />
                    
                    <Tabs 
                      defaultValue="info"
                      value={selectedAction}
                      onValueChange={setSelectedAction}
                      className="w-full"
                    >
                      <TabsList className="grid grid-cols-3 mb-4">
                        <TabsTrigger value="info">Disk Info</TabsTrigger>
                        <TabsTrigger value="convert">Convert</TabsTrigger>
                        <TabsTrigger value="resize">Resize</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="info" className="space-y-4">
                        {selectedDiskInfo && (
                          <div className="bg-gray-50 p-4 rounded-md">
                            <h3 className="font-medium mb-2 flex items-center gap-1">
                              <Info className="h-4 w-4" />
                              Disk Information
                            </h3>
                            <div className="space-y-2 text-sm">
                              <p><span className="font-semibold">Name:</span> {selectedDiskInfo.name}</p>
                              <p><span className="font-semibold">Size:</span> {selectedDiskInfo.size} GB</p>
                              <p><span className="font-semibold">Type:</span> {selectedDiskInfo.type}</p>
                              <p><span className="font-semibold">Format:</span> {selectedDiskInfo.format}</p>
                              <p><span className="font-semibold">Created:</span> {selectedDiskInfo.createdAt.toLocaleString()}</p>
                            </div>
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="convert" className="space-y-4">
                        <div>
                          <Label htmlFor="new-format">New Format</Label>
                          <Select 
                            onValueChange={(value) => setNewFormat(value as DiskFormat)} 
                            value={newFormat}
                          >
                            <SelectTrigger id="new-format">
                              <SelectValue placeholder="Select new format" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="raw">raw</SelectItem>
                              <SelectItem value="qcow2">qcow2</SelectItem>
                              <SelectItem value="vmdk">vmdk</SelectItem>
                              <SelectItem value="vdi">vdi</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button 
                          onClick={handleConvert} 
                          className="w-full"
                        >
                          Convert Format
                        </Button>
                      </TabsContent>
                      
                      <TabsContent value="resize" className="space-y-4">
                        <div>
                          <Label htmlFor="new-size">New Size (GB)</Label>
                          <Input 
                            id="new-size"
                            type="number" 
                            min="1" 
                            step="1"
                            value={newSize} 
                            onChange={(e) => setNewSize(Number(e.target.value))} 
                          />
                        </div>
                        <Button 
                          onClick={handleResize} 
                          className="w-full"
                        >
                          Resize Disk
                        </Button>
                      </TabsContent>
                    </Tabs>
                  </>
                )}
                
                {disks.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <HardDrive className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <p>No virtual disks created yet</p>
                    <p className="text-sm mt-1">Create one in the form on the left</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default CreateVirtualDisk;
