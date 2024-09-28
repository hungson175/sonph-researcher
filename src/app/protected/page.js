'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export default function Protected() {
  const [isValid, setIsValid] = useState(null);
  const searchParams = useSearchParams();
  const apiKey = searchParams.get('key');

  useEffect(() => {
    async function validateApiKey() {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('value', apiKey)
        .single();

      if (error) {
        console.error('Error validating API key:', error);
        setIsValid(false);
      } else {
        setIsValid(true);
      }
    }

    if (apiKey) {
      validateApiKey();
    }
  }, [apiKey]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Protected Page</h1>
      {isValid === null ? (
        <p>Validating API key...</p>
      ) : isValid ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Correct API key!</strong>
          <span className="block sm:inline"> /protected can be accessed.</span>
        </div>
      ) : (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Invalid API key!</strong>
          <span className="block sm:inline"> Access denied.</span>
        </div>
      )}
    </div>
  );
}