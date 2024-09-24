import Link from 'next/link';
import { HomeIcon, DocumentTextIcon, CodeIcon, CreditCardIcon, BookOpenIcon, CogIcon } from '@heroicons/react/24/outline';

const Sidebar = ({ user }) => {
  return (
    <div className="h-screen w-64 bg-white shadow-md flex flex-col justify-between">
      <div>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">Tavily AI</h1>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href="/overview">
            <a className="flex items-center p-2 text-gray-600 hover:bg-gray-200 rounded">
              <HomeIcon className="h-6 w-6 mr-2" />
              Overview
            </a>
          </Link>
          <Link href="/research-assistant">
            <a className="flex items-center p-2 text-gray-600 hover:bg-gray-200 rounded">
              <DocumentTextIcon className="h-6 w-6 mr-2" />
              Research Assistant
            </a>
          </Link>
          <Link href="/research-reports">
            <a className="flex items-center p-2 text-gray-600 hover:bg-gray-200 rounded">
              <DocumentTextIcon className="h-6 w-6 mr-2" />
              Research Reports
            </a>
          </Link>
          <Link href="/api-playground">
            <a className="flex items-center p-2 text-gray-600 hover:bg-gray-200 rounded">
              <CodeIcon className="h-6 w-6 mr-2" />
              API Playground
            </a>
          </Link>
          <Link href="/invoices">
            <a className="flex items-center p-2 text-gray-600 hover:bg-gray-200 rounded">
              <CreditCardIcon className="h-6 w-6 mr-2" />
              Invoices
            </a>
          </Link>
          <Link href="/documentation">
            <a className="flex items-center p-2 text-gray-600 hover:bg-gray-200 rounded">
              <BookOpenIcon className="h-6 w-6 mr-2" />
              Documentation
            </a>
          </Link>
        </nav>
      </div>
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <img src="/avatar.jpg" alt="User Avatar" className="h-10 w-10 rounded-full mr-2" />
          <div>
            <p className="text-gray-800 font-semibold">{user.name}</p>
            <Link href="/settings">
              <a className="text-gray-600 text-sm flex items-center">
                <CogIcon className="h-4 w-4 mr-1" />
                Settings
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;