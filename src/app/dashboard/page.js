"use client";

import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import Sidebar from '../../components/Sidebar';
import ApiKeyList from '../../components/ApiKeyList';
import ApiKeyModal from '../../components/ApiKeyModal';
import { withAuth } from "../components/withAuth";

export default withAuth(function Dashboard() {
  const { data: session } = useSession();
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
    if (session?.user?.email) {
      fetchAndSetApiKeys();
    }
  }, [session]);

  async function fetchAndSetApiKeys() {
    try {
      const response = await fetch(`/api/api-keys?email=${encodeURIComponent(session.user.email)}`);
      if (!response.ok) throw new Error('Failed to fetch API keys');
      const data = await response.json();
      setApiKeys(data);
    } catch (error) {
      console.error('Error fetching API keys:', error);
    }
  }

  async function handleAddKey() {
    try {
      console.log('Adding key for email:', session.user.email);
      const response = await fetch('/api/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: keyName, email: session.user.email })
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      const responseText = await response.text();
      console.log('Response text:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}...`);
      }
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      
      setApiKeys([...apiKeys, data]);
      setKeyName('');
      setIsModalOpen(false);
      setNotification('API key added successfully');
    } catch (error) {
      console.error('Error adding API key:', error);
      setNotification(`Error: ${error.message}`);
    }
  }

  async function handleEditKey() {
    try {
      const response = await fetch(`/api/api-keys/${editKey.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: keyName, email: session.user.email })
      });
      if (!response.ok) throw new Error('Failed to edit API key');
      const updatedKey = await response.json();
      setApiKeys(apiKeys.map(key => (key.id === editKey.id ? updatedKey : key)));
      setKeyName('');
      setIsEditModalOpen(false);
      setEditKey(null);
    } catch (error) {
      console.error('Error editing API key:', error);
    }
  }

  async function handleDeleteKey(id) {
    try {
      const response = await fetch(`/api/api-keys/${id}?email=${encodeURIComponent(session.user.email)}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete API key');
      setApiKeys(apiKeys.filter(key => key.id !== id));
    } catch (error) {
      console.error('Error deleting API key:', error);
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
      <Sidebar user={session?.user} />
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
          <ApiKeyList
            apiKeys={apiKeys}
            visibleKeys={visibleKeys}
            toggleKeyVisibility={toggleKeyVisibility}
            handleCopyKey={handleCopyKey}
            openEditModal={openEditModal}
            handleDeleteKey={handleDeleteKey}
          />
        </div>

        <ApiKeyModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddKey}
          keyName={keyName}
          setKeyName={setKeyName}
          limitUsage={limitUsage}
          setLimitUsage={setLimitUsage}
          usageLimit={usageLimit}
          setUsageLimit={setUsageLimit}
        />

        <ApiKeyModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditKey}
          keyName={keyName}
          setKeyName={setKeyName}
          isEdit={true}
        />

        {notification && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg">
            {notification}
          </div>
        )}
      </div>
    </div>
  );
});