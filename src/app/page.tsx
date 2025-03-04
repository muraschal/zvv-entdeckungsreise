'use client';

import { useState } from 'react';
import { ZVVEntdeckungsreiseForm } from '../components/ZVVEntdeckungsreiseForm';
import { redirect } from 'next/navigation';

// Standard-Export für Next.js-Seite
export default function Home() {
  // Leite direkt zur Admin-Seite weiter
  redirect('/admin');
  
  // Diese Komponente wird nie gerendert, da die Weiterleitung vorher erfolgt
  return null;
}