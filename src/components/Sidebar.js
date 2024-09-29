import Link from 'next/link';
import { signOut } from "next-auth/react";

export default function Sidebar({ user }) {
  return (
    <div className="w-64 bg-gray-100 h-screen p-4">
      <Link href="/" className="block mb-4">
        <h1 className="text-2xl font-bold hover:text-gray-700 cursor-pointer">SonPH AI</h1>
      </Link>
      <nav>
        <ul className="space-y-2">
          <li><Link href="/dashboard" className="block p-2 hover:bg-gray-200 rounded">Dashboard</Link></li>
          <li><Link href="/research-assistant" className="block p-2 hover:bg-gray-200 rounded">Research Assistant</Link></li>
          <li><Link href="/research-reports" className="block p-2 hover:bg-gray-200 rounded">Research Reports</Link></li>
          <li><Link href="/api-playground" className="block p-2 hover:bg-gray-200 rounded">API Playground</Link></li>
          <li><Link href="/invoices" className="block p-2 hover:bg-gray-200 rounded">Invoices</Link></li>
          <li><Link href="/documentation" className="block p-2 hover:bg-gray-200 rounded">Documentation</Link></li>
        </ul>
      </nav>
      {user && (
        <div className="mt-auto pt-4 border-t border-gray-300">
          <p className="text-sm">{user.name}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
          <button 
            onClick={() => signOut()} 
            className="mt-2 w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
