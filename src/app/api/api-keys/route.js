import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { supabase } from '@/lib/supabaseClient';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Helper function to get or create user_id from email
async function getUserIdFromEmail(email) {
  let { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (error && error.code === 'PGRST116') {
    // User not found, create a new user
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({ email })
      .select('id')
      .single();

    if (createError) {
      console.error('Error creating user:', createError);
      throw new Error(`Failed to create user: ${createError.message}`);
    }

    return newUser.id;
  } else if (error) {
    console.error('Error getting user ID:', error);
    throw new Error(`Database error: ${error.message}`);
  }

  return data.id;
}

// GET /api/api-keys
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });

  const userId = await getUserIdFromEmail(email);

  const { data, error } = await supabase
    .from('api_keys')
    .select('*')
    .eq('user_id', userId);

  if (error) return NextResponse.json({ error: 'Failed to fetch API keys' }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/api-keys
export async function POST(req) {
  console.log('POST request received');
  try {
    const body = await req.json();
    console.log('Request body:', body);
    const { name, email } = body;
    console.log('Received request to add key for:', email);

    if (!email) {
      console.log('Email is required');
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    let userId;
    try {
      userId = await getUserIdFromEmail(email);
      console.log('User ID found:', userId);
    } catch (error) {
      console.error('Error getting user ID:', error);
      return NextResponse.json({ error: `Failed to get user ID: ${error.message}` }, { status: 500 });
    }

    const newApiKey = {
      name,
      value: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      usage: 0,
      user_id: userId
    };

    console.log('Inserting new API key:', newApiKey);
    let data, error;
    try {
      const result = await supabase
        .from('api_keys')
        .insert([newApiKey])
        .select();
      data = result.data;
      error = result.error;
    } catch (supabaseError) {
      console.error('Supabase error:', supabaseError);
      return NextResponse.json({ error: `Supabase error: ${supabaseError.message}` }, { status: 500 });
    }

    if (error) {
      console.error('Error adding API key:', error);
      return NextResponse.json({ error: `Failed to add API key: ${error.message}` }, { status: 500 });
    }

    if (!data || data.length === 0) {
      console.error('No data returned from Supabase');
      return NextResponse.json({ error: 'No data returned from database' }, { status: 500 });
    }

    console.log('API key added successfully:', data[0]);
    return NextResponse.json(data[0], { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: `Unexpected error: ${error.message}` }, { status: 500 });
  }
}