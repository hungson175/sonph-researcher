import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useApiKeys() {
  const [apiKeys, setApiKeys] = useState([]);

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

  async function addApiKey(keyName) {
    const newApiKey = { name: keyName, value: generateRandomKey(), usage: 0 };
    const { data, error } = await supabase.from('api_keys').insert([newApiKey]).select();
    if (error) {
      console.error('Error adding API key:', error);
    } else {
      if (data && data.length > 0) {
        setApiKeys([...apiKeys, data[0]]);
      }
    }
  }

  async function editApiKey(id, newName) {
    const { data, error } = await supabase.from('api_keys').update({ name: newName }).eq('id', id).select();
    if (error) {
      console.error('Error editing API key:', error);
    } else {
      if (data && data.length > 0) {
        setApiKeys(apiKeys.map(key => (key.id === id ? data[0] : key)));
      }
    }
  }

  async function deleteApiKey(id) {
    const { error } = await supabase.from('api_keys').delete().eq('id', id);
    if (error) {
      console.error('Error deleting API key:', error);
    } else {
      setApiKeys(apiKeys.filter(key => key.id !== id));
    }
  }

  return { apiKeys, addApiKey, editApiKey, deleteApiKey };
}

function generateRandomKey() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}