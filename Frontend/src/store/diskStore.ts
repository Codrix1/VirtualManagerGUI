
import { create } from 'zustand';

export type DiskFormat = 'raw' | 'qcow2' | 'vmdk' | 'vdi';
export type DiskType = 'fixed' | 'dynamic';

export interface VirtualDisk {
  id: string;
  name: string;
  size: number; // In GB
  type: DiskType;
  format: DiskFormat;
  createdAt: Date;
}

interface DiskStore {
  disks: VirtualDisk[];
  addDisk: (disk: Omit<VirtualDisk, 'id' | 'createdAt'>) => void;
  getDisk: (id: string) => VirtualDisk | undefined;
  convertDiskFormat: (id: string, newFormat: DiskFormat) => void;
  resizeDisk: (id: string, newSize: number) => void;
}

export const useDiskStore = create<DiskStore>((set, get) => ({
  disks: [],
  addDisk: (disk) => {
    const newDisk: VirtualDisk = {
      ...disk,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    set((state) => ({ disks: [...state.disks, newDisk] }));
  },
  getDisk: (id) => {
    return get().disks.find((disk) => disk.id === id);
  },
  convertDiskFormat: (id, newFormat) => {
    set((state) => ({
      disks: state.disks.map((disk) =>
        disk.id === id ? { ...disk, format: newFormat } : disk
      ),
    }));
  },
  resizeDisk: (id, newSize) => {
    set((state) => ({
      disks: state.disks.map((disk) =>
        disk.id === id ? { ...disk, size: newSize } : disk
      ),
    }));
  },
}));
