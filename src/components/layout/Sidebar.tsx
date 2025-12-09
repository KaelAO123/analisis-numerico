/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  ChevronLeft, 
  ChevronRight, 
  Home, 
  BarChart3, 
  HelpCircle, 
  FileText, 
  BookOpen,
  Info,
  Calculator,
  LineChart,
  AreaChart,
  Moon,
  Sun,
  ExternalLink
} from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'

interface NavItem {
  href: string
  icon: any
  label: string
  exact?: boolean
}

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
  navItems: NavItem[]
}

export default function Sidebar({ isOpen, onToggle, navItems }: SidebarProps) {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()

  const getIconForPath = (href: string) => {
    if (href.includes('newton')) return Calculator
    if (href.includes('lagrange')) return LineChart
    if (href.includes('simpson')) return AreaChart
    return navItems.find(item => item.href === href)?.icon || Home
  }

  return (
    <>
      {/* Sidebar para desktop */}
      <aside className={`
        fixed left-0 top-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
        z-40 transition-all duration-300 hidden lg:block
        ${isOpen ? 'w-64' : 'w-20'}
      `}>
        <div className="h-16 flex items-center px-4 border-b border-gray-200 dark:border-gray-800">
          {isOpen ? (
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-gray-900 dark:text-white">
                  Análisis Numérico
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Plataforma Educativa
                </p>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg mx-auto" />
          )}
          
          <button
            onClick={onToggle}
            className="ml-auto p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title={isOpen ? 'Contraer sidebar' : 'Expandir sidebar'}
          >
            {isOpen ? (
              <ChevronLeft className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-500" />
            )}
          </button>
        </div>

        <nav className="p-4 flex-1">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = getIconForPath(item.href)
              const isActive = item.exact 
                ? pathname === item.href
                : pathname.startsWith(item.href)
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center px-4 py-3 rounded-lg transition-all duration-200
                      ${isActive 
                        ? 'bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 text-blue-600 dark:text-blue-400 border-l-4 border-blue-500' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }
                      ${isOpen ? 'justify-start' : 'justify-center'}
                    `}
                    title={!isOpen ? item.label : ''}
                  >
                    <Icon className={`h-5 w-5 ${isOpen ? 'mr-3' : ''}`} />
                    {isOpen && <span className="font-medium">{item.label}</span>}
                    
                    {isActive && !isOpen && (
                      <div className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r"></div>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Separador */}
          <div className="my-6 border-t border-gray-200 dark:border-gray-800"></div>

          {/* Acciones del sistema */}
          <div className={`space-y-1 ${isOpen ? 'px-4' : 'px-2'}`}>
            <button
              onClick={toggleTheme}
              className={`
                w-full flex items-center px-4 py-3 rounded-lg transition-colors
                text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800
                ${isOpen ? 'justify-start' : 'justify-center'}
              `}
              title={!isOpen ? (theme === 'dark' ? 'Modo claro' : 'Modo oscuro') : ''}
            >
              {theme === 'dark' ? (
                <Sun className={`h-5 w-5 ${isOpen ? 'mr-3' : ''}`} />
              ) : (
                <Moon className={`h-5 w-5 ${isOpen ? 'mr-3' : ''}`} />
              )}
              {isOpen && <span className="font-medium">
                {theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
              </span>}
            </button>

            <Link
              href="/"
              className={`
                w-full flex items-center px-4 py-3 rounded-lg transition-colors
                text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800
                ${isOpen ? 'justify-start' : 'justify-center'}
              `}
              title={!isOpen ? 'Volver al inicio' : ''}
            >
              <ExternalLink className={`h-5 w-5 ${isOpen ? 'mr-3' : ''}`} />
              {isOpen && <span className="font-medium">Volver al inicio</span>}
            </Link>
          </div>
        </nav>

        {/* Footer del sidebar */}
        {isOpen && (
          <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 dark:border-gray-800">
            <div className="text-center text-xs text-gray-500 dark:text-gray-400">
              <p className="font-medium">Proyecto Educativo</p>
              <p className="mt-1">Análisis Numérico Interactivo</p>
              <p className="mt-1 text-blue-600 dark:text-blue-400">v1.0.0</p>
            </div>
          </div>
        )}
      </aside>

      {/* Sidebar móvil */}
      <aside className={`
        fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-gray-900 w-64
        z-40 transition-transform lg:hidden
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-16 flex items-center px-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900 dark:text-white">
                Análisis Numérico
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Plataforma Educativa
              </p>
            </div>
          </div>
        </div>

        <nav className="p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = getIconForPath(item.href)
              const isActive = item.exact 
                ? pathname === item.href
                : pathname.startsWith(item.href)
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center px-4 py-3 rounded-lg transition-all duration-200
                      ${isActive 
                        ? 'bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 text-blue-600 dark:text-blue-400 border-l-4 border-blue-500' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }
                    `}
                    onClick={() => onToggle()}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
            <div className="space-y-1">
              <button
                onClick={toggleTheme}
                className="w-full flex items-center px-4 py-3 rounded-lg transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5 mr-3" />
                ) : (
                  <Moon className="h-5 w-5 mr-3" />
                )}
                <span className="font-medium">
                  {theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
                </span>
              </button>
              
              <Link
                href="/"
                className="w-full flex items-center px-4 py-3 rounded-lg transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ExternalLink className="h-5 w-5 mr-3" />
                <span className="font-medium">Volver al inicio</span>
              </Link>
            </div>
          </div>
        </nav>
      </aside>
    </>
  )
}