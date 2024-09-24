"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { EyeIcon, EyeSlashIcon, ClipboardDocumentIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import Sidebar from '../../components/Sidebar';

function generateRandomKey() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export default function Dashboard() {
  const [apiKeys, setApiKeys] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [keyName, setKeyName] = useState('');
  const [limitUsage, setLimitUsage] = useState(false);
  const [usageLimit, setUsageLimit] = useState(1000);
  const [visibleKeys, setVisibleKeys] = useState({});
  const [notification, setNotification] = useState('');
  const [editKey, setEditKey] = useState(null);

  useEffect(() => {
    fetchApiKeys();
  }, []);

  async function fetchApiKeys() {
    const { data, error } = await supabase.from('api_keys').select('*');
    if (error) {
      console.error('Error fetching API keys:', error);
    } else {
      setApiKeys(data);
    }
  }

  async function handleAddKey() {
    const newApiKey = { name: keyName, value: generateRandomKey(), usage: 0 };
    const { data, error } = await supabase.from('api_keys').insert([newApiKey]).select();
    if (error) {
      console.error('Error adding API key:', error);
    } else {
      console.log('Inserted data:', data);
      if (data && data.length > 0) {
        setApiKeys([...apiKeys, data[0]]);
      }
      setKeyName('');
      setIsModalOpen(false);
    }
  }

  async function handleEditKey() {
    const { data, error } = await supabase.from('api_keys').update({ name: keyName }).eq('id', editKey.id).select();
    if (error) {
      console.error('Error editing API key:', error);
    } else {
      console.log('Updated data:', data);
      if (data && data.length > 0) {
        setApiKeys(apiKeys.map(key => (key.id === editKey.id ? data[0] : key)));
      }
      setKeyName('');
      setIsEditModalOpen(false);
      setEditKey(null);
    }
  }

  async function handleDeleteKey(id) {
    const { error } = await supabase.from('api_keys').delete().eq('id', id);
    if (error) {
      console.error('Error deleting API key:', error);
    } else {
      setApiKeys(apiKeys.filter(key => key.id !== id));
    }
  }

  function toggleKeyVisibility(id) {
    setVisibleKeys(prevState => ({ ...prevState, [id]: !prevState[id] }));
  }

  function handleCopyKey(key) {
    navigator.clipboard.writeText(key).then(() => {
      setNotification('API key copied to clipboard');
      setTimeout(() => setNotification(''), 5000);
    });
  }

  function openEditModal(key) {
    setEditKey(key);
    setKeyName(key.name);
    setIsEditModalOpen(true);
  }

  return (
    <div className='flex'>
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-lg text-white mb-8">
          <h1 className="text-2xl font-bold mb-2">Researcher</h1>
          <p className="mb-4">API Limit</p>
          <div className="relative w-full h-2 bg-gray-200 rounded-full">
            <div className="absolute top-0 left-0 h-2 bg-white rounded-full" style={{ width: '40%' }}></div>
          </div>
          <p className="mt-2">401 / 1,000 Requests</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">API Keys</h2>
          <div className="flex items-center mb-4">
            <button onClick={() => setIsModalOpen(true)} className="bg-blue-500 text-white p-2 rounded">
              Add Key
            </button>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="py-2">NAME</th>
                <th className="py-2">USAGE</th>
                <th className="py-2">KEY</th>
                <th className="py-2">OPTIONS</th>
              </tr>
            </thead>
            <tbody>
              {apiKeys.map((key) => (
                <tr key={key.id} className="border-t">
                  <td className="py-2">{key.name || 'default'}</td>
                  <td className="py-2">
                    <div className="relative w-8 h-8">
                      <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 36 36">
                        <path
                          className="text-gray-200"
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        />
                        <path
                          className="text-green-500"
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeDasharray="40, 100"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-xs">40%</div>
                    </div>
                  </td>
                  <td className="py-2">
                    <div className="bg-gray-100 p-2 rounded">
                      {visibleKeys[key.id] ? key.value : `${key.value.slice(0, 4)}-********************`}
                    </div>
                  </td>
                  <td className="py-2 flex space-x-2">
                    {visibleKeys[key.id] ? (
                      <EyeSlashIcon onClick={() => toggleKeyVisibility(key.id)} className="h-5 w-5 text-gray-500 cursor-pointer" />
                    ) : (
                      <EyeIcon onClick={() => toggleKeyVisibility(key.id)} className="h-5 w-5 text-gray-500 cursor-pointer" />
                    )}
                    <ClipboardDocumentIcon onClick={() => handleCopyKey(key.value)} className="h-5 w-5 text-gray-500 cursor-pointer" />
                    <PencilSquareIcon onClick={() => openEditModal(key)} className="h-5 w-5 text-gray-500 cursor-pointer" />
                    <TrashIcon onClick={() => handleDeleteKey(key.id)} className="h-5 w-5 text-red-500 cursor-pointer" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-bold mb-4">Create a new API key</h2>
              <p className="mb-4">Enter a name and limit for the new API key.</p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Key Name</label>
                <input
                  type="text"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  className="border p-2 w-full rounded"
                  placeholder="Key Name"
                />
              </div>
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={limitUsage}
                    onChange={(e) => setLimitUsage(e.target.checked)}
                    className="mr-2"
                  />
                  Limit monthly usage
                </label>
                {limitUsage && (
                  <input
                    type="number"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(e.target.value)}
                    className="border p-2 w-full rounded mt-2"
                    placeholder="1000"
                  />
                )}
              </div>
              <p className="text-sm text-gray-500 mb-4">
                * If the combined usage of all your keys exceeds your plan's limit, all requests will be rejected.
              </p>
              <div className="flex justify-end space-x-2">
                <button onClick={() => setIsModalOpen(false)} className="bg-gray-500 text-white p-2 rounded">
                  Cancel
                </button>
                <button onClick={handleAddKey} className="bg-blue-500 text-white p-2 rounded">
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        {isEditModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-bold mb-4">Edit API key</h2>
              <p className="mb-4">Update the name for the API key.</p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Key Name</label>
                <input
                  type="text"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  className="border p-2 w-full rounded"
                  placeholder="Key Name"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button onClick={() => setIsEditModalOpen(false)} className="bg-gray-500 text-white p-2 rounded">
                  Cancel
                </button>
                <button onClick={handleEditKey} className="bg-blue-500 text-white p-2 rounded">
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {notification && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg">
            {notification}
          </div>
        )}
      </div>
    </div>
  );
}