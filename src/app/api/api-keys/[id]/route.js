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

// PUT /api/api-keys/[id]
export async function PUT(req, { params }) {
  const { name, email } = await req.json();
  if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });

  const userId = await getUserIdFromEmail(email);

  const { data, error } = await supabase
    .from('api_keys')
    .update({ name })
    .eq('id', params.id)
    .eq('user_id', userId)
    .select();

  if (error) return NextResponse.json({ error: 'Failed to update API key' }, { status: 500 });
  if (data.length === 0) return NextResponse.json({ error: 'API key not found' }, { status: 404 });
  return NextResponse.json(data[0]);
}

// DELETE /api/api-keys/[id]
export async function DELETE(req, { params }) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });

  const userId = await getUserIdFromEmail(email);

  const { error } = await supabase
    .from('api_keys')
    .delete()
    .eq('id', params.id)
    .eq('user_id', userId);

  if (error) return NextResponse.json({ error: 'Failed to delete API key' }, { status: 500 });
  return NextResponse.json({ message: 'API key deleted successfully' });
}