'use client'

import { useSession, signIn, signOut } from 'next-auth/react';
import Image from "next/image";

export default function HomePage() {
  const { data: session } = useSession();

  if (session) {
    return (
      <button
        onClick={() => signOut()}
        className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
      >
        Sign out
      </button>
    );
  }

  return (
    <button
      onClick={() => signIn("google")}
      className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
    >
      <Image
        src="https://authjs.dev/img/providers/google.svg"
        alt="Google logo"
        width={20}
        height={20}
      />
      Sign in with Google
    </button>
  );
}