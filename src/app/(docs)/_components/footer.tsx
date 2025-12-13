"use client";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-gray-100 py-6 mt-12">
      <div className="container mx-auto px-4 text-center text-sm text-gray-600">
        &copy; {new Date().getFullYear()} LeaFin Things. All rights reserved.
      </div>
    </footer>
  );
}