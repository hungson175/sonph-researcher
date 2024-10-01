import { supabase } from './supabaseClient';

export function generateRandomKey() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export async function fetchApiKeys() {
  const { data, error } = await supabase.from('api_keys').select('*');
  if (error) {
    console.error('Error fetching API keys:', error);
    throw error;
  }
  return data;
}

export async function addApiKey(keyName) {
  const newApiKey = { name: keyName, value: generateRandomKey(), usage: 0 };
  const { data, error } = await supabase.from('api_keys').insert([newApiKey]).select();
  if (error) {
    console.error('Error adding API key:', error);
    throw error;
  }
  return data[0];
}

export async function editApiKey(id, keyName) {
  const { data, error } = await supabase.from('api_keys').update({ name: keyName }).eq('id', id).select();
  if (error) {
    console.error('Error editing API key:', error);
    throw error;
  }
  return data[0];
}

export async function deleteApiKey(id) {
  const { error } = await supabase.from('api_keys').delete().eq('id', id);
  if (error) {
    console.error('Error deleting API key:', error);
    throw error;
  }
}