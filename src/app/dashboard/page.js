"use client";

import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { supabase } from '../../lib/supabaseClient';
import Sidebar from '../../components/Sidebar';
import ApiKeyList from '../../components/ApiKeyList';
import ApiKeyModal from '../../components/ApiKeyModal';
import { withAuth } from "../components/withAuth";

function generateRandomKey() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

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