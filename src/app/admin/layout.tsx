'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import { 
  Home, 
  TicketCheck, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 border-t-2 border-blue-600 border-solid rounded-full animate-spin"></div>
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

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar für Desktop */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-white border-r">
        <div className="p-6 border-b">
          <h1 className="text-lg font-bold text-blue-600">ZVV Admin</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                item.isActive 
                  ? 'bg-blue-50 text-blue-600 font-medium' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Abmelden
          </Button>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-white border-b px-4 py-3 flex justify-between items-center">
        <h1 className="text-lg font-bold text-blue-600">ZVV Admin</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-10 bg-gray-800 bg-opacity-75" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="fixed left-0 top-0 bottom-0 w-64 bg-white shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b">
              <h1 className="text-lg font-bold text-blue-600">ZVV Admin</h1>
            </div>
            <nav className="p-4 space-y-1">
              {navItems.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                    item.isActive 
                      ? 'bg-blue-50 text-blue-600 font-medium' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Abmelden
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 pt-16 md:pt-6">
        {process.env.VERCEL_ENV === 'preview' && (
          <Alert className="mb-4">
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