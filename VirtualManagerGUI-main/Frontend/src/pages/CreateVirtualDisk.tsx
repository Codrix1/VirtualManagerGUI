import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from '@/components/ui/card';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { 
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel 
} from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useForm } from 'react-hook-form';
import { HardDrive, Info, Sliders } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import * as z from 'zod'; // <-- Add zod for schema validation
import { zodResolver } from '@hookform/resolvers/zod'; // <-- Hook form with zod

type DiskFormat = 'raw' | 'qcow2' | 'vmdk' | 'vdi' | 'qed' | 'qcow' | 'luks'  | 'vpc' | 'VHDX';
type DiskType = 'fixed' | 'dynamic';

interface DiskInfo {
  image: string;
  fileFormat: string;
  virtualSize: string;
  diskSize: string;
}

// Schema for validation
const createDiskSchema = z.object({
  name: z.string().min(1, 'Disk name is required'),
  size: z.coerce.number().min(1, 'Size must be at least 1 GB'),
  type: z.enum(['fixed', 'dynamic']),
  format: z.enum(['raw', 'qcow2', 'vmdk', 'vdi', 'qed', 'qcow', 'luks', 'vpc', 'VHDX'])
});

const CreateVirtualDisk = () => {
  const [disks, setDisks] = useState<string[]>([]);
  const [selectedDisk, setSelectedDisk] = useState<string>('');
  const [selectedAction, setSelectedAction] = useState<string>('info');
  const [diskInfo, setDiskInfo] = useState<DiskInfo | null>(null);
  const [newFormat, setNewFormat] = useState<DiskFormat>('qcow2');
  const [newSize, setNewSize] = useState<number>(20);

  const form = useForm<z.infer<typeof createDiskSchema>>({
    resolver: zodResolver(createDiskSchema), // <-- Connect schema to form
    defaultValues: {
      name: '',
      size: 20,
      type: 'dynamic',
      format: 'qcow2'
    }
  });

  const fetchDisks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/virtual-disk');
      if (!response.ok) throw new Error('Failed to fetch disks');
      const data = await response.json();
      setDisks(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load available disks');
    }
  };

  const fetchDiskInfo = async (diskName: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/virtual-disk/info/${diskName}`);
      if (!response.ok) throw new Error('Failed to fetch disk info');
      const data = await response.json();
      setDiskInfo({
        image: data.image || '',
        fileFormat: data['file_format'] || '',
        virtualSize: data['virtual_size'] || '',
        diskSize: data['disk_size'] || ''
      });
    } catch (error) {
      console.error(error);
      setDiskInfo(null);
      toast.error('Failed to fetch disk info');
    }
  };

  useEffect(() => {
    fetchDisks();
  }, []);

  useEffect(() => {
    if (selectedDisk && selectedAction === 'info') {
      fetchDiskInfo(selectedDisk);
    }
  }, [selectedDisk, selectedAction]);

  const onSubmit = async (values: z.infer<typeof createDiskSchema>) => {
    // Extra Validation: Check if name already exists
    if (disks.includes(values.name)) {
      toast.error('A disk with this name already exists.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/virtual-disk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name,
          size: Number(values.size),
          type: values.type,
          format: values.format
        })
      });
      if (!response.ok) throw new Error('Failed to create disk');
      toast.success('Virtual disk created successfully!');
      form.reset();
      fetchDisks();
    } catch (error) {
      console.error(error);
      toast.error('Error creating virtual disk');
    }
  };

  const handleConvert = async () => {
    if (!selectedDisk) return;
    try {
      const response = await fetch(`http://localhost:5000/api/virtual-disk/convert/${selectedDisk}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newFormat })
      });
      if (!response.ok) throw new Error('Failed to convert disk format');
      toast.success('Disk format converted successfully!');
      fetchDisks();
    } catch (error) {
      console.error(error);
      toast.error('Error converting disk format');
    }
  };

  const handleResize = async () => {
    if (!selectedDisk) return;
    try {
      const response = await fetch(`http://localhost:5000/api/virtual-disk/resize/${selectedDisk}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newSize })
      });
      if (!response.ok) throw new Error('Failed to resize disk');
      toast.success('Disk resized successfully!');
      fetchDisks();
    } catch (error) {
      console.error(error);
      toast.error('Error resizing disk');
    }
  };

  return (
    <Layout title="Virtual Machine Manager">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Virtual Disk Management</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Create Disk Section */}
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
                  {/* Disk Name */}
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

                  {/* Disk Size */}
                  <FormField
                    control={form.control}
                    name="size"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Size (GB)</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" step="1" {...field} />
                        </FormControl>
                        <FormDescription>
                          Size of the disk in gigabytes
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  {/* Disk Type and Format */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Disk Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                              <SelectItem value="qed">qed</SelectItem>
                              <SelectItem value="qcow">qcow</SelectItem>
                              <SelectItem value="vpc">vpc</SelectItem>
                              <SelectItem value="VHDX">VHDX</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            File format for the disk
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" className="w-full bg-[#3B46B2] hover:bg-[#2A3BAB]">
                    Create Disk
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Manage Disks Section */}
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
                  <Label>Select Disk</Label>
                  <Select onValueChange={setSelectedDisk} value={selectedDisk}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a disk" />
                    </SelectTrigger>
                    <SelectContent>
                      {disks.length > 0 ? (
                        disks.map((diskId) => (
                          <SelectItem key={diskId} value={diskId}>
                            {diskId}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>No disks available</SelectItem>
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
                    >
                      <TabsList className="grid grid-cols-3 mb-4">
                        <TabsTrigger value="info">Disk Info</TabsTrigger>
                        <TabsTrigger value="convert">Convert</TabsTrigger>
                        <TabsTrigger value="resize">Resize</TabsTrigger>
                      </TabsList>

                      <TabsContent value="info">
                        {diskInfo ? (
                          <div className="bg-gray-50 p-4 rounded-md text-left space-y-2 break-words">
                          <p className="break-words"><strong>Image:</strong> {diskInfo.image}</p>
                          <p className="break-words"><strong>File Format:</strong> {diskInfo.fileFormat}</p>
                          <p className="break-words"><strong>Virtual Size:</strong> {diskInfo.virtualSize}</p>
                          <p className="break-words"><strong>Disk Size:</strong> {diskInfo.diskSize}</p>
                        </div>
                        
                        ) : (
                          <div className="text-gray-500 text-center">Loading disk info...</div>
                        )}
                      </TabsContent>

                      <TabsContent value="convert" className="space-y-4">
                        <div>
                          <Label>New Format</Label>
                          <Select onValueChange={(v) => setNewFormat(v as DiskFormat)} value={newFormat}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select new format" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="raw">raw</SelectItem>
                              <SelectItem value="qcow2">qcow2</SelectItem>
                              <SelectItem value="vmdk">vmdk</SelectItem>
                              <SelectItem value="vdi">vdi</SelectItem>
                              <SelectItem value="qed">qed</SelectItem>
                              <SelectItem value="qcow">qcow</SelectItem>
                              <SelectItem value="luks">luks</SelectItem>
                              <SelectItem value="vpc">vpc</SelectItem>
                              <SelectItem value="VHDX">VHDX</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button onClick={handleConvert} className="w-full">
                          Convert Format
                        </Button>
                      </TabsContent>

                      <TabsContent value="resize" className="space-y-4">
                        <div>
                          <Label>Add {newSize}(GB)</Label>
                          <Input
                            type="number"
                            min="1"
                            step="1"
                            value={newSize}
                            onChange={(e) => setNewSize(Number(e.target.value))}
                          />
                        </div>
                        <Button onClick={handleResize} className="w-full">
                          Resize Disk
                        </Button>
                      </TabsContent>
                    </Tabs>
                  </>
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
