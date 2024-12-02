// app/layout.tsx
"use client"
import { ReactNode } from 'react'; // Ensure React is imported
import { AuthProvider } from './AuthContext';
import Breadcrumbs from './components/Breadcrumbs'; // Import Breadcrumbs
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import './styles/globals.css';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className="flex flex-col min-h-screen">
          <Navbar />
          <div className="flex flex-grow">
            <Sidebar />
            <main className="flex-grow p-4">
              {/* Include Breadcrumbs */}
              <Breadcrumbs />
              {children}
            </main>
          </div>
          <Footer />
        </body>
      </AuthProvider>
    </html>
  );
}
