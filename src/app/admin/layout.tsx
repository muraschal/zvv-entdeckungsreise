'use client';

import React, { useState, useEffect } from 'react';
import { ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Menu,
  X,
  Home,
  LogOut,
  TicketCheck,
  AlertTriangle,
  BookOpen,
  Key,
  ShoppingCart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: Home },
  { label: 'Bestellungen', href: '/admin/bestellungen', icon: ShoppingCart },
  { label: 'Codes', href: '/admin/codes', icon: Key },
  { label: 'Testcodes', href: '/admin/testcodes', icon: BookOpen },
];

export default function AdminLayout({
  children,
}: AdminLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isIntegrationEnv, setIsIntegrationEnv] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Überprüfe, ob der aktuelle Pfad die Login- oder Reset-Password-Seite ist
  const isAuthPage = pathname === '/admin/login' || pathname === '/admin/reset-password';

  // Vereinfachter Loading-State ohne Router-Events
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Überprüfe die Umgebung anhand der Hostname-Endung
    const hostname = window.location.hostname;
    const isInt = hostname.includes('localhost') || 
                  hostname.includes('vercel.app') || 
                  hostname.includes('-int') || 
                  hostname === 'entdeckungsreise-int.zvv.ch';
    
    setIsIntegrationEnv(isInt);
  }, []);

  const handleLogout = async () => {
    // Einfache Weiterleitung auf Login-Seite
    router.push('/admin/login');
  };
  
  // Wenn es die Login-Seite oder Reset-Password-Seite ist, zeige nur den Inhalt ohne Navigation
  if (isAuthPage) {
    return <>{children}</>;
  }
  
  // CSS-Klassen basierend auf der Umgebung
  const sidebarBgClass = isIntegrationEnv ? 'bg-zvv-integration-red' : 'bg-zvv-blue';
  const headerBgClass = isIntegrationEnv ? 'bg-zvv-integration-dark-red' : 'bg-zvv-dark-blue';
  const activeNavClass = isIntegrationEnv 
    ? "bg-zvv-integration-light-red text-zvv-integration-red" 
    : "bg-zvv-light-blue text-zvv-blue";
  const hoverNavClass = isIntegrationEnv 
    ? "hover:bg-zvv-integration-dark-red" 
    : "hover:bg-zvv-dark-blue";
  
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className={`flex flex-col flex-1 ${sidebarBgClass}`}>
          <div className={`flex items-center justify-between h-16 px-4 ${headerBgClass}`}>
            <div className="flex items-center">
              <Image 
                src="/zvv-logo-white.png" 
                width={80} 
                height={40} 
                alt="ZVV Logo" 
                className="h-8 w-auto" 
              />
              <span className="ml-2 text-white font-semibold">Admin</span>
              {isIntegrationEnv && (
                <span className="ml-2 text-xs bg-white text-zvv-integration-red px-1.5 py-0.5 rounded">INT</span>
              )}
            </div>
          </div>
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <nav className="flex-1 px-2 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                      isActive ? activeNavClass : `text-white ${hoverNavClass}`
                    )}
                  >
                    <Icon 
                      className={cn(
                        "mr-3 flex-shrink-0 h-5 w-5",
                        isActive ? (isIntegrationEnv ? "text-zvv-integration-red" : "text-zvv-blue") : "text-white"
                      )} 
                    />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="px-2 mt-6 mb-2">
              <div className="flex items-center px-2 py-2">
                <LogOut className="mr-3 flex-shrink-0 h-5 w-5 text-white/80" />
                <button 
                  onClick={handleLogout}
                  className="text-white/90 text-sm hover:text-white focus:outline-none"
                >
                  Abmelden
                </button>
              </div>
            </div>
          </div>
          <div className="p-2 text-xs text-white/60 text-center">
            Version 1.0.0
          </div>
        </div>
      </div>
      
      {/* Mobile header */}
      <div className={`md:hidden flex items-center justify-between h-16 ${sidebarBgClass} px-4`}>
        <div className="flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          >
            <Menu className="h-6 w-6" />
          </button>
          <Image 
            src="/zvv-logo-white.png" 
            width={80} 
            height={40} 
            alt="ZVV Logo" 
            className="ml-2 h-8 w-auto" 
          />
          {isIntegrationEnv && (
            <span className="ml-2 text-xs bg-white text-zvv-integration-red px-1.5 py-0.5 rounded">INT</span>
          )}
        </div>
        <div>
          {/* Platzhalter für UserButton */}
        </div>
      </div>
      
      {/* Mobile sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 flex z-40 md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className={`relative flex-1 flex flex-col max-w-xs w-full ${sidebarBgClass}`}>
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="sr-only">Sidebar schließen</span>
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <Image 
                  src="/zvv-logo-white.png" 
                  width={80} 
                  height={40} 
                  alt="ZVV Logo" 
                  className="h-8 w-auto" 
                />
                <span className="ml-2 text-white font-semibold">Admin</span>
                {isIntegrationEnv && (
                  <span className="ml-2 text-xs bg-white text-zvv-integration-red px-1.5 py-0.5 rounded">INT</span>
                )}
              </div>
              <nav className="mt-5 px-2 space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group flex items-center px-2 py-2 text-base font-medium rounded-md",
                        isActive ? activeNavClass : `text-white ${hoverNavClass}`
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon 
                        className={cn(
                          "mr-4 flex-shrink-0 h-6 w-6",
                          isActive ? (isIntegrationEnv ? "text-zvv-integration-red" : "text-zvv-blue") : "text-white"
                        )} 
                      />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-white/10 p-4">
              <div className="flex items-center w-full">
                <LogOut className="h-6 w-6 text-white/80" />
                <button 
                  onClick={handleLogout}
                  className="ml-3 flex-1 flex items-center text-white/90 text-sm hover:text-white focus:outline-none"
                >
                  Abmelden
                </button>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 w-14">
            {/* Force sidebar to shrink to fit close icon */}
          </div>
        </div>
      )}
      
      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <main className="flex-1">
          {loading ? (
            <div className="flex items-center justify-center h-screen">
              <div className="h-8 w-8 rounded-full border-2 border-t-zvv-blue animate-spin"></div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
} 