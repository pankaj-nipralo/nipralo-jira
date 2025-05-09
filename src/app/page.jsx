"use client";

import React from "react";
import Link from "next/link";
import {
  ChevronRight,
  Layout,
  Calendar,
  BarChart,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs, features } from "@/data/dataHub";
// import Header from "@/components/common/Header2";

export default function Home() {
  return (
    <>
      {/* <Header /> */}
      <div className="min-h-screen text-white">
        {/* Hero Section */}
        <section className="container mx-auto py-20 text-center">
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold gradient-title pb-6 flex flex-col text-black">
            Streamline Your Workflow <br />
            with Nipralo
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-3xl mx-auto">
            Empower your team with our intuitive project management solution.
          </p>
          <p className="text-xl mb-12 max-w-2xl mx-auto"></p>
          <Link href="/register">
            <Button size="lg" className="mr-4 cursor-pointer">
              Get Started <ChevronRight size={18} className="ml-1" />
            </Button>
          </Link>
          <Link href="/login">
            <Button
              size="lg"
              variant="outline"
              className="text-black hover:bg-black hover:text-gray-100 cursor-pointer"
            >
              Login
            </Button>
          </Link>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-gray-900 py-20 px-5 ">
          <div className="container mx-auto">
            <h3 className="text-3xl font-bold mb-12 text-center text-white">
              Key Features
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 cursor-pointer">
              {features.map((feature, index) => (
                <Card key={index} className="bg-gray-800">
                  <CardContent className="pt-6">
                    <feature.icon className="h-12 w-12 mb-4 text-blue-300" />
                    <h4 className="text-xl font-semibold mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-gray-300">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-gray-900 py-20 px-5">
          <div className="container mx-auto">
            <h3 className="text-3xl font-bold mb-12 text-center">
              Frequently Asked Questions
            </h3>
            <Accordion
              type="single"
              collapsible
              className="w-full cursor-pointer"
            >
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 text-center px-5 bg-gray-900">
          <div className="container mx-auto">
            <h3 className="text-3xl font-bold mb-6">
              Ready to Transform Your Workflow?
            </h3>
            <p className="text-xl mb-12">
              Join thousands of teams already using ZCRUM to streamline their
              projects and boost productivity.
            </p>
            <Link href="/onboarding">
              <Button
                size="lg"
                className="animate-bounce bg-amber-50 text-black hover:bg-amber-100 cursor-pointer"
              >
                Start For Free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
