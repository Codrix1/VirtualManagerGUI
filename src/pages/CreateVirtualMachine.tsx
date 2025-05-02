
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useVMStore } from '../store/vmStore';
import { useDiskStore } from '../store/diskStore';
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { Cpu, HardDrive } from 'lucide-react';

const CreateVirtualMachine = () => {
  const { addVM } = useVMStore();
  const { disks } = useDiskStore();
  const [isoFile, setIsoFile] = useState<File | null>(null);

  const form = useForm({
    defaultValues: {
      name: '',
      cpu: 2,
      memory: 4,
      diskId: ''
    }
  });

  const onSubmit = (values: any) => {
    if (!values.diskId) {
      toast.error('Please select a disk for the virtual machine');
      return;
    }

    addVM({
      name: values.name,
      cpu: values.cpu,
      memory: values.memory,
      diskId: values.diskId,
      isoFile: isoFile ? isoFile.name : null
    });
    
    toast.success('Virtual machine created successfully!');
    form.reset();
    setIsoFile(null);
  };

  const handleIsoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setIsoFile(files[0]);
      toast.success(`ISO file selected: ${files[0].name}`);
    }
  };

  return (
    <Layout title="Virtual Machine Manager">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Create Virtual Machine</h1>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5" />
              Virtual Machine Configuration
            </CardTitle>
            <CardDescription>
              Configure CPU, memory and disk for your new virtual machine
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
                      <FormLabel>VM Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter virtual machine name" {...field} />
                      </FormControl>
                      <FormDescription>
                        A unique name for your virtual machine
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="cpu"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPU Cores: {field.value}</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-4">
                          <Cpu className="h-4 w-4 text-gray-500" />
                          <Slider
                            defaultValue={[field.value]}
                            min={1}
                            max={16}
                            step={1}
                            onValueChange={(value) => field.onChange(value[0])}
                            className="flex-1"
                          />
                          <span className="w-12 text-center font-medium">{field.value}</span>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Number of CPU cores to allocate
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="memory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Memory (GB): {field.value}</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-4">
                          <Cpu className="h-4 w-4 text-gray-500" />
                          <Slider
                            defaultValue={[field.value]}
                            min={1}
                            max={64}
                            step={1}
                            onValueChange={(value) => field.onChange(value[0])}
                            className="flex-1"
                          />
                          <span className="w-12 text-center font-medium">{field.value} GB</span>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Amount of RAM to allocate in gigabytes
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="diskId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Virtual Disk</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a disk" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {disks.length > 0 ? (
                            disks.map(disk => (
                              <SelectItem key={disk.id} value={disk.id}>
                                {disk.name} ({disk.size}GB, {disk.format})
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="none" disabled>
                              No disks available. Please create a disk first.
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select a virtual disk for this machine
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                {/* New ISO file selection field */}
                <FormItem>
                  <FormLabel>Boot ISO Image</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input 
                        type="file" 
                        accept=".iso"
                        onChange={handleIsoFileChange}
                        className="cursor-pointer"
                      />
                    </FormControl>
                    {isoFile && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        type="button"
                        onClick={() => setIsoFile(null)}
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                  <FormDescription className="flex items-center gap-2">
                    <HardDrive className="h-4 w-4 text-gray-500" />
                    Select an ISO file to boot from (optional)
                  </FormDescription>
                  {isoFile && (
                    <p className="text-sm font-medium text-emerald-600 mt-1">
                      Selected: {isoFile.name}
                    </p>
                  )}
                </FormItem>
                
                <Button 
                  type="submit" 
                  className="w-full bg-[#7673FA] hover:bg-[#5D5AD5]"
                  disabled={disks.length === 0}
                >
                  Create Virtual Machine
                </Button>
                
                {disks.length === 0 && (
                  <p className="text-center text-sm text-amber-600">
                    You need to create a virtual disk first before creating a virtual machine.
                  </p>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CreateVirtualMachine;
