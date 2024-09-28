import { supabase } from '../../../lib/supabaseClient';

export async function validateApiKey(apiKey) {
  if (!supabase) {
    throw new Error('Supabase client is not initialized');
  }

  const { data, error } = await supabase
    .from('api_keys')
    .select('id, usage')
    .eq('value', apiKey)
    .single();

  if (error) {
    console.error('Error querying API key:', error);
    return null;
  }
  
  return data; // Return the full data object if found, null otherwise
}

export async function incrementApiKeyUsage(id, currentUsage) {
  const { error: updateError } = await supabase
    .from('api_keys')
    .update({ usage: currentUsage + 1 })
    .eq('id', id);

  if (updateError) {
    console.error('Error updating API key usage:', updateError);
    throw new Error('Failed to update API key usage');
  }
}