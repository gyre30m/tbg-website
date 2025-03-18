"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Building,
  FileText,
  GraduationCap,
  Scale,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HSContactForm from "@/components/ui/contact-form";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link className="flex items-center justify-center" href="#">
          <Image
            className="dark:invert"
            src="/tbg-logo.svg"
            alt="The Bradley Group logo"
            width={80}
            height={20}
            priority
          />
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#services"
          >
            Services
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#expertise"
          >
            Expertise
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#about"
          >
            About
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#testimonials"
          >
            Testimonials
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#contact"
          >
            Contact
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <Image
                    className="dark:invert mx-auto mb-6"
                    src="/tbg-logo.svg"
                    alt="The Bradley Group logo"
                    width={300}
                    height={200}
                    priority
                  />
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Forensic Economists
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Providing expert economic analysis, testimony, and
                    litigation support for wrongful death and personal injury
                    litigation, insurance claims, and business disputes.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="#contact">
                    <Button className="px-8">Schedule a Consultation</Button>
                  </Link>
                  <Link href="#services">
                    <Button variant="outline" className="px-8">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                {/* <Image
                  alt="Economic Expert"
                  className="rounded-lg object-cover"
                  height="400"
                  src="/placeholder.svg?height=400&width=600"
                  style={{
                    aspectRatio: "600/400",
                    objectFit: "cover",
                  }}
                  width="600"
                /> */}
                <Image
                  alt="Economic Experts Projects"
                  className="rounded-lg object-cover"
                  height="400"
                  src="/cover-photo.jpg"
                  style={{
                    aspectRatio: "600/400",
                    objectFit: "cover",
                  }}
                  width="600"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32" id="services">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Services
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Comprehensive Economic Analysis
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our forensic economic services provide detailed analysis and
                  expert testimony for a wide range of cases.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <FileText className="h-8 w-8 text-primary" />
                  <CardTitle className="text-xl">
                    Personal Injury & Wrongful Death
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm text-muted-foreground">
                    Calculation of economic damages including lost earnings,
                    benefits, household services, and medical expenses in
                    personal injury and wrongful death cases.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <Building className="h-8 w-8 text-primary" />
                  <CardTitle className="text-xl">
                    Commercial Litigation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm text-muted-foreground">
                    Analysis of lost profits, business valuation, intellectual
                    property damages, and other economic losses in commercial
                    disputes.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <Scale className="h-8 w-8 text-primary" />
                  <CardTitle className="text-xl">
                    Employment Litigation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm text-muted-foreground">
                    Economic analysis for employment discrimination, wrongful
                    termination, and other employment-related cases.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <BarChart3 className="h-8 w-8 text-primary" />
                  <CardTitle className="text-xl">
                    Statistical Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm text-muted-foreground">
                    Advanced statistical modeling and data analysis to support
                    economic damage calculations and identify patterns.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <BookOpen className="h-8 w-8 text-primary" />
                  <CardTitle className="text-xl">Expert Testimony</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm text-muted-foreground">
                    Clear, compelling expert testimony for depositions and
                    trials, with experience in federal and state courts.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <GraduationCap className="h-8 w-8 text-primary" />
                  <CardTitle className="text-xl">Consulting Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm text-muted-foreground">
                    Economic consulting for attorneys, insurance companies, and
                    businesses on case strategy and settlement negotiations.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section
          className="w-full py-12 md:py-24 lg:py-32 bg-muted/40"
          id="expertise"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-background px-3 py-1 text-sm">
                  Areas of Expertise
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Specialized Economic Analysis
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our forensic economic expertise covers a wide range of
                  specialized areas.
                </p>
              </div>
            </div>
            <div className="mx-auto py-12">
              <Tabs
                defaultValue="personal"
                className="w-full max-w-4xl mx-auto"
              >
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger value="personal">Personal Injury</TabsTrigger>
                  <TabsTrigger value="commercial">
                    Commercial Damages
                  </TabsTrigger>
                  <TabsTrigger value="employment">Employment Cases</TabsTrigger>
                </TabsList>
                <TabsContent
                  value="personal"
                  className="p-6 bg-background rounded-lg shadow-sm"
                >
                  <h3 className="text-xl font-bold mb-4">
                    Personal Injury & Wrongful Death Analysis
                  </h3>
                  <ul className="space-y-2 list-disc pl-5">
                    <li>Lost earnings capacity calculations</li>
                    <li>Fringe benefits valuation</li>
                    <li>Household services replacement costs</li>
                    <li>Life care plan present value calculations</li>
                    <li>Medical expense projections</li>
                    <li>Hedonic damages analysis</li>
                    <li>Worklife expectancy determinations</li>
                  </ul>
                </TabsContent>
                <TabsContent
                  value="commercial"
                  className="p-6 bg-background rounded-lg shadow-sm"
                >
                  <h3 className="text-xl font-bold mb-4">
                    Commercial & Business Damages
                  </h3>
                  <ul className="space-y-2 list-disc pl-5">
                    <li>Lost profits analysis</li>
                    <li>Business valuation</li>
                    <li>Intellectual property damages</li>
                    <li>Contract breach damages</li>
                    <li>Market analysis and forecasting</li>
                    <li>Anti-trust and competition analysis</li>
                    <li>Business interruption claims</li>
                  </ul>
                </TabsContent>
                <TabsContent
                  value="employment"
                  className="p-6 bg-background rounded-lg shadow-sm"
                >
                  <h3 className="text-xl font-bold mb-4">
                    Employment Litigation
                  </h3>
                  <ul className="space-y-2 list-disc pl-5">
                    <li>Wage and hour disputes</li>
                    <li>Discrimination damages</li>
                    <li>Wrongful termination losses</li>
                    <li>Pay equity analysis</li>
                    <li>Statistical analysis of employment patterns</li>
                    <li>Executive compensation valuation</li>
                    <li>Pension and retirement benefits analysis</li>
                  </ul>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32" id="about">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                    About
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Expert Credentials
                  </h2>
                </div>
                <ul className="grid gap-2">
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-primary" />
                    <span>
                      Juris Doctorate | University of Wisconsin Law School
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-primary" />
                    <span>
                      Master of Business Administration | University of
                      Wisconsin School of Business
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-primary" />
                    <span>Published in Journal of Forensic Economics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-primary" />
                    <span>
                      Member of the National Association of Forensic Economists
                    </span>
                  </li>
                </ul>
                <div>
                  <Link href="#contact">
                    <Button className="px-8">Request CV</Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                {/* <Image
                  className="dark:invert"
                  src="/tbg-logo.svg"
                  alt="The Bradley Group logo"
                  width={80}
                  height={20}
                  priority
                /> */}
                <Image
                  alt="Economic Expert Portrait"
                  className="rounded-lg object-cover"
                  height="400"
                  src="/work-headshot.png"
                  style={{
                    aspectRatio: "600/400",
                    objectFit: "cover",
                  }}
                  width="600"
                />
              </div>
            </div>
          </div>
        </section>
        <section
          className="w-full py-12 md:py-24 lg:py-32 bg-muted/40"
          id="testimonials"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-background px-3 py-1 text-sm">
                  Testimonials
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Client Feedback
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  What attorneys and clients say about our economic analysis and
                  expert testimony.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="h-5 w-5 text-primary"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-muted-foreground">
                      &ldquo;The economic analysis provided was thorough and
                      well-documented. The expert testimony was clear and
                      compelling, which significantly strengthened our
                      case.&rdquo;
                    </p>
                    <div>
                      <p className="font-semibold">John Smith</p>
                      <p className="text-sm text-muted-foreground">
                        Partner, Smith & Associates
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="h-5 w-5 text-primary"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-muted-foreground">
                      &ldquo;The detailed lost profits analysis was instrumental
                      in our commercial litigation case. The methodology was
                      sound and withstood rigorous cross-examination.&rdquo;
                    </p>
                    <div>
                      <p className="font-semibold">Sarah Johnson</p>
                      <p className="text-sm text-muted-foreground">
                        Litigation Attorney, Johnson Law Group
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="h-5 w-5 text-primary"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-muted-foreground">
                      &ldquo;The statistical analysis of employment patterns was
                      crucial in our class action case. The expert&apos;s
                      ability to explain complex concepts to the jury was
                      exceptional.&rdquo;
                    </p>
                    <div>
                      <p className="font-semibold">Michael Davis</p>
                      <p className="text-sm text-muted-foreground">
                        Senior Partner, Davis & Williams
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32" id="contact">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Contact
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Schedule a Consultation
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Contact us to discuss how we can help.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 lg:grid-cols-2">
              <div className="rounded-lg border bg-background p-6 shadow-sm">
                <h3 className="text-xl font-bold mb-4">Schedule a Call</h3>
                <iframe
                  src="https://meetings-na2.hubspot.com/brad-gibbs?embed=true"
                  width="450"
                  height="620"
                  allowFullScreen
                  title="Embedded Content"
                ></iframe>
              </div>
              <div className="rounded-lg border bg-background p-6 shadow-sm">
                <h3 className="text-xl font-bold mb-4">Send a Message</h3>
                <HSContactForm />
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-background p-6 shadow-sm">
            <h3 className="text-xl font-bold mb-4">Send a Message</h3>
            <form className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="first-name"
                  >
                    First Name
                  </label>
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    id="first-name"
                    placeholder="John"
                  />
                </div>
                <div className="grid gap-2">
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="last-name"
                  >
                    Last Name
                  </label>
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    id="last-name"
                    placeholder="Smith"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <label
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  id="email"
                  placeholder="john.smith@example.com"
                  type="email"
                />
              </div>
              <div className="grid gap-2">
                <label
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor="phone"
                >
                  Phone
                </label>
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  id="phone"
                  placeholder="(555) 123-4567"
                  type="tel"
                />
              </div>
              <div className="grid gap-2">
                <label
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor="case-type"
                >
                  Case Type
                </label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  id="case-type"
                >
                  <option value="">Select Case Type</option>
                  <option value="personal-injury">Personal Injury</option>
                  <option value="wrongful-death">Wrongful Death</option>
                  <option value="commercial-litigation">
                    Commercial Litigation
                  </option>
                  <option value="employment">Employment Litigation</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="grid gap-2">
                <label
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor="message"
                >
                  Message
                </label>
                <textarea
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  id="message"
                  placeholder="Please provide a brief description of your case..."
                />
              </div>
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center border-t px-4 md:px-6">
        <p className="text-xs text-muted-foreground">
          © 2025 The Bradley Group LLC. All rights reserved. Economic Damages
          Expert Witnesses.
        </p>
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
  );
}
