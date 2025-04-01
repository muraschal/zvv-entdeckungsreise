'use client';

import { ZVVEntdeckungsreiseForm } from '@/components/ZVVEntdeckungsreiseForm';

export default function TestPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">ZVV-Entdeckungsreise Formular Test</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <ZVVEntdeckungsreiseForm />
      </div>
    </div>
  );
} 