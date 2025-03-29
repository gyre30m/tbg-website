"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Scale,
  Building,
  FileText,
  BarChart3,
  BookOpen,
  GraduationCap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
          {/* <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#sample"
          >
            Sample
          </Link> */}
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#about"
          >
            About
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
        {/* <section className="w-full py-12 md:py-24 lg:py-32" id="sample">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Sample
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Sample Impact Report
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  This is a sample economic impact report for a fictitious
                  person and personal injury claim.
                </p>
              </div>
            </div>
          </div>
        </section> */}

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

        <section className="w-full py-12 md:py-24 lg:py-32" id="contact">
          <div className="container px-4 lg:px-6">
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
            <div className="mx-auto grid max-w-5xl grid-cols-1  gap-6 py-12 lg:grid-cols-2">
              <div className="rounded-lg border bg-background py-6 px-2 lg:px-6 shadow-sm">
                <h3 className="text-xl font-bold mb-4">Schedule a Call</h3>
                <iframe
                  src="https://meetings-na2.hubspot.com/brad-gibbs?embed=true"
                  width="450"
                  height="620"
                  allowFullScreen
                  title="Embedded Content"
                ></iframe>
              </div>
              <div className="rounded-lg border bg-background py-6 px-2 lg:px-6  shadow-sm">
                <h3 className="text-xl font-bold mb-4">Send a Message</h3>
                <HSContactForm
                  region="na2"
                  portalId="242272349"
                  formId="162605ae-c2b0-4771-ab7c-13bbd5917469"
                />
              </div>
            </div>
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
