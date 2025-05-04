
import React from 'react';
import { Link } from 'react-router-dom';
import { HardDrive, Cpu } from 'lucide-react';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="bg-gradient-to-r from-[#3B46B2] to-[#7673FA] text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold flex items-center gap-2 hover:opacity-90 transition-opacity">
            <HardDrive className="h-6 w-6" />
            {title}
          </Link>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link to="/" className="hover:text-gray-200 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/create-virtual-disk" className="hover:text-gray-200 transition-colors">
                  Virtual Disks
                </Link>
              </li>
              <li>
                <Link to="/create-virtual-machine" className="hover:text-gray-200 transition-colors">
                  Virtual Machines
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
