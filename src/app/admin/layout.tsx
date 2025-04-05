'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import { 
  Home, 
  TicketCheck, 
  LogOut, 
  Menu, 
  X,
  AlertTriangle,
  InfoIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Image from 'next/image';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (session) {
          setIsAuthenticated(true);
        } else {
          // Nur zur Login-Seite weiterleiten, wenn wir nicht bereits dort sind
          if (!pathname?.includes('/admin/login')) {
            router.push('/admin/login');
          }
        }
      } catch (error) {
        console.error('Fehler beim Prüfen der Authentifizierung:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  // Login-Seite benötigt keinen Admin-Layout
  if (pathname?.includes('/admin/login') || pathname?.includes('/admin/reset-password')) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-8 h-8 border-t-2 border-[#003399] border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Nichts rendern, wird zur Login-Seite weitergeleitet
  }

  const navItems = [
    { 
      href: '/admin', 
      label: 'Dashboard', 
      icon: <Home className="w-5 h-5 mr-3" />,
      isActive: pathname === '/admin'
    },
    { 
      href: '/admin/testcodes', 
      label: 'Testcodes', 
      icon: <TicketCheck className="w-5 h-5 mr-3" />,
      isActive: pathname?.includes('/admin/testcodes')
    },
  ];

  // ZVV-Farbschema
  const zvvBlue = '#003399';
  const zvvLightBlue = '#e6ecf9';

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar für Desktop */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-white shadow-md">
        <div className="p-5 bg-[#003399] text-white">
          <div className="flex items-center space-x-2">
            <div className="relative w-8 h-8 overflow-hidden">
              <Image 
                src="/apple-touch-icon.png" 
                alt="ZVV Logo" 
                width={32} 
                height={32} 
                priority
                className="object-contain"
              />
            </div>
            <h1 className="text-xl font-bold">ZVV Admin</h1>
          </div>
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-1">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                item.isActive 
                  ? 'bg-[#e6ecf9] text-[#003399] font-medium' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
        
        <div className="p-4 mt-auto">
          <Button 
            variant="outline" 
            className="w-full justify-start text-gray-600 border-gray-200 hover:bg-gray-100 hover:text-gray-800"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Abmelden
          </Button>
        </div>
        
        <div className="p-4 text-xs text-gray-500 bg-gray-50">
          <div className="flex items-center">
            <InfoIcon className="w-3 h-3 mr-1" />
            <span>
              ZVV-Entdeckungsreise v2.0
            </span>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-[#003399] text-white px-4 py-3 flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-2">
          <div className="relative w-6 h-6 overflow-hidden">
            <Image 
              src="/apple-touch-icon.png" 
              alt="ZVV Logo" 
              width={24} 
              height={24} 
              className="object-contain"
            />
          </div>
          <h1 className="text-lg font-bold">ZVV Admin</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-[#00297a]"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-10 bg-gray-800 bg-opacity-75" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="fixed left-0 top-0 bottom-0 w-64 bg-white shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 bg-[#003399] text-white">
              <div className="flex items-center space-x-2">
                <div className="relative w-8 h-8 overflow-hidden">
                  <Image 
                    src="/apple-touch-icon.png" 
                    alt="ZVV Logo" 
                    width={32} 
                    height={32} 
                    className="object-contain"
                  />
                </div>
                <h1 className="text-xl font-bold">ZVV Admin</h1>
              </div>
            </div>
            
            <nav className="py-6 px-3 space-y-1">
              {navItems.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                    item.isActive 
                      ? 'bg-[#e6ecf9] text-[#003399] font-medium' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>
            
            <div className="p-4 mt-auto">
              <Button 
                variant="outline" 
                className="w-full justify-start text-gray-600 border-gray-200 hover:bg-gray-100 hover:text-gray-800"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Abmelden
              </Button>
            </div>
            
            <div className="p-4 text-xs text-gray-500 bg-gray-50">
              <div className="flex items-center">
                <InfoIcon className="w-3 h-3 mr-1" />
                <span>
                  ZVV-Entdeckungsreise v2.0
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 pt-16 md:pt-6">
        {process.env.VERCEL_ENV === 'preview' && (
          <Alert className="mb-4 border-amber-300 bg-amber-50 text-amber-800">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>INT-Umgebung</AlertTitle>
            <AlertDescription>
              Dies ist die Integrationsumgebung. Alle Änderungen betreffen nur Testdaten.
            </AlertDescription>
          </Alert>
        )}
        {children}
      </main>
    </div>
  );
} 