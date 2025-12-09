'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calculator, 
  LineChart, 
  AreaChart, 
  Code, 
  Zap, 
  BarChart3,
  Brain,
  TrendingUp,
  Cpu,
  ChevronRight,
  Sparkles,
  Globe,
  Download,
  BookOpen,
  Users,
  Award
} from 'lucide-react'
import ThemeToggle from '@/components/layout/ThemeToggle'

export default function Home() {
  const [currentExample, setCurrentExample] = useState(0)

  const featuredMethods = [
    {
      title: "Método de Newton-Raphson",
      description: "Encuentra raíces de ecuaciones con visualización de tangentes animadas",
      icon: <Brain className="h-10 w-10" />,
      color: "from-blue-500 to-cyan-500",
      href: "/dashboard/methods/newton-raphson",
      features: ["Tangentes animadas", "Convergencia visual", "Iteraciones paso a paso"]
    },
    {
      title: "Interpolación de Lagrange",
      description: "Construye polinomios interpolantes con puntos arrastrables",
      icon: <TrendingUp className="h-10 w-10" />,
      color: "from-purple-500 to-pink-500",
      href: "/dashboard/methods/lagrange",
      features: ["Puntos arrastrables", "Polinomio en tiempo real", "Múltiples puntos"]
    },
    {
      title: "Integración de Simpson",
      description: "Calcula integrales con áreas coloreadas y alta precisión",
      icon: <AreaChart className="h-10 w-10" />,
      color: "from-green-500 to-emerald-500",
      href: "/dashboard/methods/simpson",
      features: ["Áreas coloreadas", "Precisión ajustable", "Comparación de métodos"]
    }
  ]

  const examples = [
    { 
      title: "Cálculo de Raíces", 
      equation: "x³ - 6x² + 11x - 6 = 0",
      description: "Encuentra las raíces de ecuaciones polinómicas complejas"
    },
    { 
      title: "Aproximación de Funciones", 
      equation: "f(x) = sin(x) + cos(2x)",
      description: "Interpola funciones trigonométricas con alta precisión"
    },
    { 
      title: "Cálculo de Áreas", 
      equation: "∫₀²π sin(x) dx",
      description: "Calcula áreas bajo curvas con diferentes métodos"
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentExample((prev) => (prev + 1) % examples.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600">
                <Cpu className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Análisis Numérico
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Dashboard
                </Link>
                <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Teoría
                </Link>
                <Link href="/examples" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Ejemplos
                </Link>
              </nav>
              <ThemeToggle />
              <Link
                href="/dashboard"
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl"
              >
                Comenzar
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-6">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Plataforma Interactiva</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 bg-clip-text text-transparent">
                Métodos Numéricos
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">Visualizados</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10">
              Aprende, experimenta y comprende los métodos fundamentales del análisis numérico 
              a través de visualizaciones interactivas y ejemplos prácticos.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 text-lg font-semibold"
              >
                <Calculator className="h-5 w-5" />
                Explorar Métodos
                <ChevronRight className="h-5 w-5" />
              </Link>
              
              <Link
                href="/about"
                className="px-8 py-4 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all flex items-center justify-center gap-3 text-lg font-semibold"
              >
                <BookOpen className="h-5 w-5" />
                Aprender Teoría
              </Link>
            </div>
          </motion.div>

          {/* Interactive Example Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-20"
          >
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Ejemplo Interactivo
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Visualiza cómo funcionan los métodos en tiempo real
                  </p>
                </div>
                <div className="flex gap-2">
                  {examples.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentExample(idx)}
                      className={`h-2 rounded-full transition-all ${
                        idx === currentExample 
                          ? 'w-8 bg-blue-600' 
                          : 'w-2 bg-gray-300 dark:bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentExample}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col md:flex-row items-center justify-between gap-8"
                >
                  <div className="flex-1">
                    <div className="mb-6">
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {examples[currentExample].title}
                      </h4>
                      <code className="block text-2xl md:text-3xl font-mono bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-blue-600 dark:text-blue-400 mb-4">
                        {examples[currentExample].equation}
                      </code>
                      <p className="text-gray-600 dark:text-gray-300">
                        {examples[currentExample].description}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm">
                        Cálculo Numérico
                      </span>
                      <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm">
                        Visualización
                      </span>
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-sm">
                        Interactivo
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 dark:from-blue-500/5 dark:to-cyan-500/5 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center gap-3 mb-4">
                        <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <span className="font-semibold text-gray-900 dark:text-white">
                          Visualización en Tiempo Real
                        </span>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                        <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full w-3/4"></div>
                        <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full w-1/2"></div>
                        <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full w-2/3"></div>
                      </div>
                      
                      <div className="mt-6 flex items-center justify-between">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Simulación activa
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                          <span className="text-sm text-green-600 dark:text-green-400">
                            En ejecución
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Methods */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent to-gray-100/50 dark:to-gray-900/50">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center mb-16"
          >
            <motion.div variants={itemVariants}>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                Métodos <span className="text-blue-600 dark:text-blue-400">Destacados</span>
              </h2>
            </motion.div>
            
            <motion.p variants={itemVariants} className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12">
              Explora los tres métodos fundamentales implementados con visualizaciones interactivas 
              y controles en tiempo real.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {featuredMethods.map((method, index) => (
              <motion.div
                key={method.title}
                variants={itemVariants}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className="relative group"
              >
                <Link href={method.href}>
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 h-full border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300">
                    {/* Decorative gradient */}
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${method.color} opacity-5 rounded-full -translate-y-1/2 translate-x-1/2`}></div>
                    
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${method.color} text-white mb-6`}>
                      {method.icon}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      {method.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      {method.description}
                    </p>
                    
                    <ul className="space-y-3 mb-8">
                      {method.features.map((feature, i) => (
                        <li key={i} className="flex items-center text-gray-700 dark:text-gray-300">
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${method.color} mr-3`} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:gap-3 transition-all">
                      <span>Explorar método</span>
                      <ChevronRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Features Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-4 gap-6"
          >
            {[
              {
                icon: <Code className="h-8 w-8" />,
                title: "Código Abierto",
                description: "Implementación transparente y verificable"
              },
              {
                icon: <Globe className="h-8 w-8" />,
                title: "Accesible",
                description: "Totalmente responsive y accesible"
              },
              {
                icon: <Download className="h-8 w-8" />,
                title: "Exportable",
                description: "Exporta resultados en múltiples formatos"
              },
              {
                icon: <Users className="h-8 w-8" />,
                title: "Educativo",
                description: "Diseñado para aprendizaje activo"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
              >
                <div className="inline-flex p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
                  {feature.icon}
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-purple-500/10 dark:from-blue-500/5 dark:via-cyan-500/5 dark:to-purple-500/5 rounded-2xl p-12 border border-gray-200 dark:border-gray-700">
              <Award className="h-16 w-16 mx-auto mb-6 text-blue-600 dark:text-blue-400" />
              
              <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                Comienza tu Viaje en Análisis Numérico
              </h2>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
                Desde estudiantes hasta profesionales, esta plataforma te ofrece las herramientas 
                para comprender y aplicar métodos numéricos de manera práctica y visual.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/dashboard"
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl text-lg font-semibold"
                >
                  Explorar Métodos
                </Link>
                
                <Link
                  href="/about"
                  className="px-8 py-4 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all text-lg font-semibold"
                >
                  Aprender Teoría
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600">
                <Cpu className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Análisis Numérico
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Plataforma Educativa Interactiva
                </p>
              </div>
            </div>
            
            <div className="flex gap-6">
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                GitHub
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Documentación
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Contacto
              </a>
            </div>
            
            <div className="text-gray-600 dark:text-gray-400 text-center md:text-right">
              <p>© {new Date().getFullYear()} Análisis Numérico Interactivo</p>
              <p className="text-sm mt-1">Proyecto académico para métodos numéricos</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}