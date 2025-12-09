"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import {
  Menu,
  X,
  Home,
  BarChart3,
  Settings,
  HelpCircle,
  FileText,
  BookOpen,
  Info,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Toaster } from "react-hot-toast";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Inicio", exact: true },
    {
      href: "/dashboard/methods/newton-raphson",
      icon: BarChart3,
      label: "Newton-Raphson",
    },
    { href: "/dashboard/methods/lagrange", icon: BarChart3, label: "Lagrange" },
    { href: "/dashboard/methods/simpson", icon: BarChart3, label: "Simpson" },
    { href: "/dashboard/theory", icon: BookOpen, label: "Teoría" },
    { href: "/dashboard/examples", icon: FileText, label: "Ejemplos" },
    { href: "/dashboard/about", icon: Info, label: "Acerca de" },
    { href: "/dashboard/help", icon: HelpCircle, label: "Ayuda" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "hsl(var(--background))",
            color: "hsl(var(--foreground))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "0.5rem",
          },
        }}
      />

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {sidebarOpen ? (
                <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>

            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-gradient-to-r from-blue-600 to-cyan-600">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">
                Análisis Numérico
              </span>
            </Link>
          </div>

          <Link
            href="/"
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
          >
            <Zap className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        navItems={navItems}
      />

      {/* Main Content */}
      <div
        className={`
        transition-all duration-300 ease-in-out
        ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"}
        ${isMobile ? "pt-16" : ""}
      `}
      >
        {/* Desktop Header */}
        <header className="hidden lg:block bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Plataforma Educativa de Métodos Numéricos
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Visualización interactiva • Aprendizaje práctico • Sin
                  registro necesario
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <input
                    type="search"
                    placeholder="Buscar métodos, teoría, ejemplos..."
                    className="pl-10 pr-4 py-2 w-64 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>

                <div className="h-8 w-px bg-gray-300 dark:bg-gray-700"></div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Acceso Libre
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400">
                      <span className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                        Disponible
                      </span>
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center text-white font-semibold">
                    <BookOpen className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="min-h-[calc(100vh-73px)] p-4 lg:p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto w-full">{children}</div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-gray-800 py-6 px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} Análisis Numérico Interactivo •
              <span className="mx-2">•</span>
              <span className="text-blue-600 dark:text-blue-400">
                Proyecto Educativo Abierto
              </span>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <Link
                href="/dashboard/theory"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Teoría
              </Link>
              <Link
                href="/dashboard/examples"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Ejemplos
              </Link>
              <Link
                href="/dashboard/about"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Acerca de
              </Link>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-green-600 dark:text-green-400">
                  Sistema activo
                </span>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
