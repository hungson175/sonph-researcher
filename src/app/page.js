'use client'

import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { GithubIcon } from "lucide-react"
import Link from "next/link"
import GoogleLoginButton from "@/components/GoogleLoginButton"

export default function HomePage() {
  const { data: session } = useSession()

  const handleLogout = () => {
    signOut()
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <GithubIcon className="h-6 w-6" />
          <span className="sr-only">SonPH GitHub Analyzer</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#pricing">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#contact">
            Contact
          </Link>
          {session && (
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="/dashboard">
              Dashboard
            </Link>
          )}
          <div className="flex items-center gap-2">
            {session ? (
              <Button onClick={handleLogout} size="sm">Logout</Button>
            ) : (
              <>
                <GoogleLoginButton />
                <Button size="sm">Sign Up</Button>
              </>
            )}
          </div>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Analyze GitHub Repositories with Ease
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Get powerful insights into open-source projects with our API. Summaries, star analysis, and important PRs at your fingertips.
                </p>
              </div>
              <div className="space-x-4">
                <Button>Get Started for Free</Button>
                <Button variant="outline">View Documentation</Button>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Key Features</h2>
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardHeader>
                  <CardTitle>Repository Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Get a comprehensive overview of any GitHub repository, including activity metrics and contributor insights.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Star Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Track and analyze star trends to understand the popularity and growth of repositories over time.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Important PRs</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Identify and highlight significant pull requests that have made substantial impacts on the project.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Simple Pricing</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
              {[
                { title: "Free Tier", price: "$0", features: ["5 API requests", "Basic repository summary", "Star count analysis", "Top 5 important PRs"], button: "Get Started" },
                { title: "Starter Pack", price: "$20", features: ["20 API requests", "Detailed repository analytics", "Extended star analysis", "Top 10 important PRs"], button: "Buy Now" },
                { title: "Pro Pack", price: "$50", features: ["100 API requests", "Advanced repository insights", "Comprehensive star analysis", "All important PRs", "Priority support"], button: "Buy Now" },
                { title: "Enterprise Pack", price: "$100", features: ["300 API requests", "Full-scale repository analytics", "Custom star analysis reports", "All PRs with impact scoring", "24/7 premium support", "Custom integrations"], button: "Contact Sales" }
              ].map((tier, index) => (
                <Card key={index} className="flex flex-col">
                  <CardHeader>
                    <CardTitle>{tier.title}</CardTitle>
                    <CardDescription>{index === 0 ? "Try it out" : index === 1 ? "For small projects" : index === 2 ? "For growing teams" : "For large organizations"}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="text-center mb-4">
                      <span className="text-3xl font-bold">{tier.price}</span>
                    </div>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                      {tier.features.map((feature, i) => (
                        <li key={i}>{feature}</li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="mt-auto">
                    <Button className="w-full">{tier.button}</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer id="contact" className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 SonPH GitHub Analyzer. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
