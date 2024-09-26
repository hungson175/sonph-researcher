'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';

export default function ProtectedContent() {
  const searchParams = useSearchParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      // Your data fetching logic here
      // For example:
      // const { data, error } = await supabase.from('your_table').select('*');
      // if (data) setData(data);
    }
    fetchData();
  }, []);

  return (
    <div>
      <h1>Protected Page</h1>
      <p>Search params: {JSON.stringify(Object.fromEntries(searchParams))}</p>
      {/* Rest of your component */}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}