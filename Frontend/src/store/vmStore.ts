
import { create } from 'zustand';

export interface VirtualMachine {
  id: string;
  name: string;
  cpu: number;
  memory: number; // In GB
  diskId: string;
  isoFile: string | null; // Added isoFile property
  createdAt: Date;
}

interface VMStore {
  vms: VirtualMachine[];
  addVM: (vm: Omit<VirtualMachine, 'id' | 'createdAt'>) => void;
}

export const useVMStore = create<VMStore>((set) => ({
  vms: [],
  addVM: (vm) => {
    const newVM: VirtualMachine = {
      ...vm,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    set((state) => ({ vms: [...state.vms, newVM] }));
  },
}));
