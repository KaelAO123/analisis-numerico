'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Calculator, 
  LineChart, 
  AreaChart, 
  TrendingUp, 
  Zap, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  BarChart3,
  Download,
  Share2,
  BookOpen,
  PlayCircle,
  Sparkles,
  ChevronRight,
  RefreshCw,
  Cpu,
  Target,
  PieChart,
  GraduationCap,
  Lightbulb,
  Rocket,
  Users,
  FileText
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function DashboardPage() {
  const [demoCalculations, setDemoCalculations] = useState([
    { id: 1, method: 'Newton-Raphson', equation: 'x² - 4 = 0', result: 'Raíz: 2.0000', time: 'Ejemplo 1', status: 'success' },
    { id: 2, method: 'Lagrange', equation: 'Puntos: (0,1), (1,3), (2,7)', result: 'P(x) = x² + x + 1', time: 'Ejemplo 2', status: 'success' },
    { id: 3, method: 'Simpson', equation: '∫₀²π sin(x) dx', result: 'Área: ≈ 0.0000', time: 'Ejemplo 3', status: 'success' },
  ])

  const [platformStats, setPlatformStats] = useState({
    methodsAvailable: 3,
    examplesCount: 12,
    accuracy: 99.8,
    visualizationTypes: 5
  })

  const [quickActions, setQuickActions] = useState([
    { title: 'Newton-Raphson', icon: Target, color: 'bg-blue-500', href: '/dashboard/methods/newton-raphson', description: 'Encuentra raíces' },
    { title: 'Interpolación', icon: TrendingUp, color: 'bg-purple-500', href: '/dashboard/methods/lagrange', description: 'Construye polinomios' },
    { title: 'Integración', icon: AreaChart, color: 'bg-green-500', href: '/dashboard/methods/simpson', description: 'Calcula áreas' },
    { title: 'Teoría', icon: BookOpen, color: 'bg-amber-500', href: '/dashboard/theory', description: 'Aprende conceptos' },
  ])

  const methods = [
    {
      title: "Newton-Raphson",
      description: "Método iterativo para encontrar raíces de ecuaciones mediante aproximaciones sucesivas",
      icon: <Target className="h-8 w-8" />,
      href: "/dashboard/methods/newton-raphson",
      color: "from-blue-500 to-cyan-500",
      features: ["Convergencia rápida", "Visualización de tangentes", "Iteraciones animadas"],
      difficulty: "Intermedio"
    },
    {
      title: "Interpolación de Lagrange",
      description: "Construye polinomios que pasan exactamente por un conjunto de puntos dados",
      icon: <TrendingUp className="h-8 w-8" />,
      href: "/dashboard/methods/lagrange",
      color: "from-purple-500 to-pink-500",
      features: ["Puntos arrastrables", "Polinomio en tiempo real", "Múltiples puntos"],
      difficulty: "Avanzado"
    },
    {
      title: "Integración de Simpson",
      description: "Aproxima el valor de integrales definidas usando parábolas para mayor precisión",
      icon: <AreaChart className="h-8 w-8" />,
      href: "/dashboard/methods/simpson",
      color: "from-green-500 to-emerald-500",
      features: ["Áreas coloreadas", "Comparación de métodos", "Precisión ajustable"],
      difficulty: "Básico"
    }
  ]

  const educationalFeatures = [
    {
      title: "Aprendizaje Visual",
      description: "Comprende conceptos complejos mediante visualizaciones interactivas",
      icon: <Lightbulb className="h-6 w-6" />,
      color: "text-yellow-600 dark:text-yellow-400"
    },
    {
      title: "Experimento Libre",
      description: "Modifica parámetros y observa resultados en tiempo real",
      icon: <Rocket className="h-6 w-6" />,
      color: "text-red-600 dark:text-red-400"
    },
    {
      title: "Sin Registro",
      description: "Acceso inmediato a todas las funcionalidades educativas",
      icon: <Users className="h-6 w-6" />,
      color: "text-green-600 dark:text-green-400"
    },
    {
      title: "Educación Abierta",
      description: "Recurso educativo gratuito para estudiantes y profesores",
      icon: <GraduationCap className="h-6 w-6" />,
      color: "text-blue-600 dark:text-blue-400"
    }
  ]

  useEffect(() => {
    // Simular actualización de estadísticas
    const interval = setInterval(() => {
      setPlatformStats(prev => ({
        ...prev,
        examplesCount: prev.examplesCount + Math.floor(Math.random() * 2),
      }))
    }, 10000)

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
    <div className="space-y-8">
      {/* Header del Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6"
      >
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              Plataforma Educativa de Métodos Numéricos
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Aprende, experimenta y comprende métodos numéricos fundamentales mediante visualizaciones interactivas
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
            Volver al inicio
          </Link>
          <Link
            href="/dashboard/theory"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all"
          >
            <BookOpen className="h-4 w-4" />
            Aprender Teoría
          </Link>
        </div>
      </motion.div>

      {/* Estadísticas de la Plataforma */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
          { 
            title: 'Métodos Disponibles', 
            value: platformStats.methodsAvailable, 
            icon: Calculator, 
            color: 'bg-blue-500',
            description: 'Algoritmos implementados'
          },
          { 
            title: 'Ejemplos Activos', 
            value: platformStats.examplesCount, 
            icon: FileText, 
            color: 'bg-green-500',
            description: 'Casos de estudio'
          },
          { 
            title: 'Precisión Media', 
            value: `${platformStats.accuracy}%`, 
            icon: CheckCircle, 
            color: 'bg-amber-500',
            description: 'En cálculos numéricos'
          },
          { 
            title: 'Visualizaciones', 
            value: platformStats.visualizationTypes, 
            icon: PlayCircle, 
            color: 'bg-purple-500',
            description: 'Tipos de gráficos'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {stat.title}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {stat.description}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Métodos Disponibles */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Métodos Numéricos Implementados
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Explora los algoritmos fundamentales del análisis numérico
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Sparkles className="h-4 w-4" />
            <span>100% Interactivos</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {methods.map((method, index) => (
            <motion.div
              key={method.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="relative group"
            >
              <Link href={method.href}>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 h-full border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gray-100 to-transparent dark:from-gray-900 dark:to-transparent rounded-full -translate-y-1/2 translate-x-1/2 opacity-50"></div>
                  
                  <div className="flex items-start justify-between mb-6">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${method.color} shadow-lg`}>
                      {method.icon}
                    </div>
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                      {method.difficulty}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {method.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {method.description}
                  </p>
                  
                  <ul className="space-y-2 mb-6">
                    {method.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${method.color} mr-3`} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:gap-2 transition-all">
                    <span>Explorar método</span>
                    <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Acceso Rápido y Características */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Acceso Rápido
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Comienza a explorar inmediatamente
                </p>
              </div>
              <Zap className="h-6 w-6 text-amber-500" />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Link href={action.href}>
                    <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all cursor-pointer group hover:shadow-lg">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${action.color} group-hover:scale-110 transition-transform`}>
                          <action.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {action.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Características Educativas */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Características Educativas
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {educationalFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/50 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
                    <div className={`p-2 rounded-lg ${feature.color} bg-opacity-10`}>
                      {feature.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white mb-1">
                        {feature.title}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Ejemplos Demostrativos */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 h-full">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Ejemplos Demostrativos
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Casos prácticos preconfigurados
                </p>
              </div>
              <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>

            <div className="space-y-4">
              {demoCalculations.map((calc) => (
                <div 
                  key={calc.id}
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${
                      calc.status === 'success' ? 'bg-green-100 dark:bg-green-900/30' :
                      'bg-blue-100 dark:bg-blue-900/30'
                    }`}>
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {calc.method}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                          {calc.time}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-mono mt-1">
                        {calc.equation}
                      </p>
                    </div>
                  </div>
                  
                  <div className="pl-11">
                    <p className="font-mono font-bold text-gray-900 dark:text-white text-sm">
                      {calc.result}
                    </p>
                    <Link 
                      href={`/dashboard/methods/${calc.method.toLowerCase().replace(' ', '-')}`}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 inline-flex items-center gap-1 mt-2"
                    >
                      Probar este ejemplo
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <Link 
                  href="/dashboard/examples"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium flex items-center gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  Ver todos los ejemplos
                </Link>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {demoCalculations.length} demostraciones
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Llamada a la Acción Educativa */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-purple-500/10 dark:from-blue-500/5 dark:via-cyan-500/5 dark:to-purple-500/5 rounded-xl p-8 border border-gray-200 dark:border-gray-700"
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 shadow-lg">
              <GraduationCap className="h-12 w-12 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                ¿Listo para aprender?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Esta plataforma está diseñada específicamente para facilitar el aprendizaje 
                de métodos numéricos mediante la experimentación práctica.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/dashboard/theory"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl font-semibold text-center"
            >
              Estudiar Teoría
            </Link>
            <Link
              href="/dashboard/examples"
              className="px-6 py-3 border-2 border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all font-semibold text-center"
            >
              Ver Ejemplos
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Información Técnica */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
      >
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <Cpu className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Tecnología</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Next.js 14 • TypeScript • Tailwind CSS
            </p>
          </div>
          <div className="text-center">
            <Sparkles className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Interactividad</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Gráficos en tiempo real • Animaciones • Cálculos instantáneos
            </p>
          </div>
          <div className="text-center">
            <BookOpen className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Educación</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Sin registro • Gratuito • Acceso abierto
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}