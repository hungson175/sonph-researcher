'use client'

import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import { FcGoogle } from "react-icons/fc"

export default function GoogleLoginButton() {
  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/' })
  }

  return (
    <Button variant="outline" size="sm" onClick={handleGoogleLogin}>
      <FcGoogle className="mr-2 h-4 w-4" />
      Login with Google
    </Button>
  )
}