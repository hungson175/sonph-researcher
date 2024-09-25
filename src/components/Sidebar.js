'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HomeIcon, KeyIcon, CreditCardIcon, UserIcon, DocumentTextIcon, BeakerIcon, ArrowRightStartOnRectangleIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`bg-white h-screen shadow-md flex flex-col transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'}`}>
      <div className="p-4 flex justify-between items-center">
        {isOpen && <h2 className="text-2xl font-bold text-gray-800">SonPH AI</h2>}
        <button onClick={() => setIsOpen(!isOpen)} className="p-1 rounded-full hover:bg-gray-200">
          {isOpen ? <ChevronLeftIcon className="h-5 w-5" /> : <ChevronRightIcon className="h-5 w-5" />}
        </button>
      </div>
      <nav className="mt-6 flex-grow">
        <Link href="/dashboard" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
          <HomeIcon className="h-5 w-5 mr-2" />
          {isOpen && <span>Dashboard</span>}
        </Link>
        <Link href="/research-assistant" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
          <BeakerIcon className="h-5 w-5 mr-2" />
          {isOpen && <span>Research Assistant</span>}
        </Link>
        <Link href="/research-reports" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
          <DocumentTextIcon className="h-5 w-5 mr-2" />
          {isOpen && <span>Research Reports</span>}
        </Link>
        <Link href="/playground" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
          <KeyIcon className="h-5 w-5 mr-2" />
          {isOpen && <span>API Playground</span>}
        </Link>
        <Link href="/invoices" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
          <CreditCardIcon className="h-5 w-5 mr-2" />
          {isOpen && <span>Invoices</span>}
        </Link>
        <Link href="/documentation" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
          <DocumentTextIcon className="h-5 w-5 mr-2" />
          {isOpen && <span>Documentation</span>}
        </Link>
      </nav>
      <div className="mt-auto p-4 border-t border-gray-200">
        <Link href="/profile" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
          <UserIcon className="h-5 w-5 mr-2" />
          {isOpen && <span>Hung Son Pham</span>}
        </Link>
        <button className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full">
          <ArrowRightStartOnRectangleIcon className="h-5 w-5 mr-2" />
          {isOpen && <span>Sign out</span>}
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
