import React from "react";
import { Button } from "@/components/ui/button"; // Optional, use if you have shadcn or custom button
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center bg-gray-100 text-center px-4">
      <h1 className="text-6xl font-bold text-black mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-gray-600 mb-6 max-w-md">
        Sorry, the page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link href="/" className="inline-block">
        <Button className="px-6 py-3 text-white bg-gray-900 hover:bg-gray-700 cursor-pointer rounded-lg">
          Go to Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
