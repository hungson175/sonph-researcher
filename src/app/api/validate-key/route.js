import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';

export async function POST(request) {
  try {
    if (!supabase) {
      throw new Error('Supabase client is not initialized');
    }

    const { apiKey } = await request.json();

    if (!apiKey) {
      return NextResponse.json({ valid: false, message: 'API key is required' }, { status: 400 });
    }

    // Query the database for the API key
    const { data, error } = await supabase
      .from('api_keys')
      .select('id, usage')
      .eq('value', apiKey)
      .single();

    if (error) {
      console.error('Error querying API key:', error);
      return NextResponse.json({ valid: false, message: 'Error validating API key' }, { status: 500 });
    }

    const isValid = !!data;

    if (isValid) {
      // Increment the usage count
      const { error: updateError } = await supabase
        .from('api_keys')
        .update({ usage: data.usage + 1 })
        .eq('id', data.id);

      if (updateError) {
        console.error('Error updating API key usage:', updateError);
      }
    }

    return NextResponse.json({ valid: isValid }, { status: isValid ? 200 : 401 });
  } catch (error) {
    console.error('Error validating API key:', error);
    return NextResponse.json({ valid: false, message: 'Internal server error' }, { status: 500 });
  }
}