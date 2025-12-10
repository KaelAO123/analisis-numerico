'use client'

import { useState, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  Rocket, 
  Building, 
  Car, 
  Heart, 
  Cpu, 
  DollarSign, 
  Wind, 
  Zap, 
  Waves,
  TrendingUp,
  Calculator,
  LineChart,
  AreaChart,
  Target,
  MapPin,
  Thermometer,
  Globe,
  Leaf,
  Shield,
  Sparkles,
  Play,
  Pause,
  ChevronRight,
  BookOpen,
  GraduationCap,
  Lightbulb
} from 'lucide-react'

// Definir tipo para categorías
interface Category {
  id: string
  label: string
  icon: ReactNode
  count: number
}

// Definir tipo para ejemplos
interface RealWorldExample {
  id: string
  title: string
  description: string
  method: 'newton' | 'lagrange' | 'simpson'
  category: string
  icon: ReactNode
  color: string
  details: {
    problem: string
    equation: string
    application: string
    visualization: string
  }
  steps: string[]
}

// Definir tipo para información de método
interface MethodInfo {
  name: string
  icon: ReactNode
  color: string
  description: string
}

export default function ExamplesPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [playingExample, setPlayingExample] = useState<string | null>(null)

  const categories: Category[] = [
    { id: 'all', label: 'Todos', icon: <Globe className="h-5 w-5" />, count: 12 },
    { id: 'engineering', label: 'Ingeniería', icon: <Cpu className="h-5 w-5" />, count: 4 },
    { id: 'finance', label: 'Finanzas', icon: <DollarSign className="h-5 w-5" />, count: 3 },
    { id: 'science', label: 'Ciencias', icon: <Leaf className="h-5 w-5" />, count: 3 },
    { id: 'medicine', label: 'Medicina', icon: <Heart className="h-5 w-5" />, count: 2 },
  ]

  const realWorldExamples: RealWorldExample[] = [
    {
      id: 'rocket-trajectory',
      title: 'Trayectoria de Cohetes',
      description: 'Cálculo de la trayectoria óptima usando Newton-Raphson para resolver ecuaciones de movimiento',
      method: 'newton',
      category: 'engineering',
      icon: <Rocket className="h-8 w-8" />,
      color: 'from-red-500 to-orange-500',
      details: {
        problem: 'Encontrar el ángulo de lanzamiento que maximiza el alcance',
        equation: 'θ = solución de dR/dθ = 0 donde R = (v₀²/g) sin(2θ)',
        application: 'NASA, SpaceX, agencias espaciales',
        visualization: 'Trayectoria parabólica con ángulos óptimos'
      },
      steps: [
        'Definir función de alcance R(θ)',
        'Calcular derivada dR/dθ',
        'Aplicar Newton-Raphson para encontrar θ óptimo',
        'Validar con condiciones físicas'
      ]
    },
    {
      id: 'bridge-design',
      title: 'Diseño de Puentes',
      description: 'Análisis de tensiones en estructuras usando interpolación para predecir puntos críticos',
      method: 'lagrange',
      category: 'engineering',
      icon: <Building className="h-8 w-8" />,
      color: 'from-blue-500 to-cyan-500',
      details: {
        problem: 'Predecir tensiones en puntos no medidos',
        equation: 'P(x) = Σ yᵢ · Π (x - xⱼ)/(xᵢ - xⱼ)',
        application: 'Ingeniería civil, arquitectura',
        visualization: 'Distribución de tensiones a lo largo del puente'
      },
      steps: [
        'Medir tensiones en puntos específicos',
        'Construir polinomio interpolante',
        'Predecir tensiones en puntos críticos',
        'Validar con simulaciones FEM'
      ]
    },
    {
      id: 'car-aerodynamics',
      title: 'Aerodinámica de Autos',
      description: 'Cálculo del área bajo curvas de presión para optimizar diseño aerodinámico',
      method: 'simpson',
      category: 'engineering',
      icon: <Car className="h-8 w-8" />,
      color: 'from-purple-500 to-pink-500',
      details: {
        problem: 'Calcular fuerza de arrastre total',
        equation: '∫₀ᴸ P(x) dx ≈ (Δx/3)[P₀ + 4P₁ + 2P₂ + ... + Pₙ]',
        application: 'Automotriz, Fórmula 1',
        visualization: 'Áreas de presión positiva/negativa'
      },
      steps: [
        'Medir presión en puntos discretos',
        'Aplicar regla de Simpson compuesta',
        'Calcular fuerza neta',
        'Optimizar forma del vehículo'
      ]
    },
    {
      id: 'stock-prediction',
      title: 'Predicción de Acciones',
      description: 'Interpolación de datos bursátiles para predecir tendencias futuras',
      method: 'lagrange',
      category: 'finance',
      icon: <TrendingUp className="h-8 w-8" />,
      color: 'from-green-500 to-emerald-500',
      details: {
        problem: 'Predecir precios entre datos discretos',
        equation: 'Uso de polinomios para suavizar series temporales',
        application: 'Mercados financieros, trading algorítmico',
        visualization: 'Curva suave a través de puntos de precio'
      },
      steps: [
        'Tomar datos de precios históricos',
        'Construir polinomio interpolante',
        'Extrapolar tendencias a corto plazo',
        'Validar con datos reales'
      ]
    },
    {
      id: 'loan-interest',
      title: 'Cálculo de Intereses',
      description: 'Newton-Raphson para encontrar tasas de interés implícitas en préstamos',
      method: 'newton',
      category: 'finance',
      icon: <DollarSign className="h-8 w-8" />,
      color: 'from-amber-500 to-yellow-500',
      details: {
        problem: 'Encontrar TIR (Tasa Interna de Retorno)',
        equation: '0 = Σ CFₜ/(1 + r)ᵗ - Inversión',
        application: 'Bancos, finanzas personales',
        visualization: 'Convergencia a la tasa de interés real'
      },
      steps: [
        'Establecer ecuación de valor presente neto',
        'Aplicar método iterativo',
        'Encontrar raíz (tasa de interés)',
        'Comparar con tasas de mercado'
      ]
    },
    {
      id: 'portfolio-optimization',
      title: 'Optimización de Portafolios',
      description: 'Integración para calcular riesgo total de inversiones',
      method: 'simpson',
      category: 'finance',
      icon: <Shield className="h-8 w-8" />,
      color: 'from-indigo-500 to-blue-500',
      details: {
        problem: 'Calcular varianza total del portafolio',
        equation: 'σ² = ∫∫ ρ(x,y) f(x) f(y) dx dy',
        application: 'Gestión de riesgos financieros',
        visualization: 'Distribución de probabilidad de retornos'
      },
      steps: [
        'Definir funciones de densidad',
        'Integrar sobre distribución conjunta',
        'Calcular métricas de riesgo',
        'Optimizar asignación de activos'
      ]
    },
    {
      id: 'ecg-analysis',
      title: 'Análisis de ECG',
      description: 'Interpolación de señales cardíacas para diagnóstico médico preciso',
      method: 'lagrange',
      category: 'medicine',
      icon: <Heart className="h-8 w-8" />,
      color: 'from-rose-500 to-pink-500',
      details: {
        problem: 'Reconstruir señal cardiaca continua',
        equation: 'Suavizado de datos discretos de ECG',
        application: 'Cardiología, dispositivos médicos',
        visualization: 'Onda P-QRS-T reconstruida'
      },
      steps: [
        'Muestrear señal a 500 Hz',
        'Interpolar puntos perdidos',
        'Identificar anomalías en ritmo',
        'Generar diagnóstico automático'
      ]
    },
    {
      id: 'drug-concentration',
      title: 'Concentración de Fármacos',
      description: 'Cálculo del área bajo la curva para determinar dosis efectivas',
      method: 'simpson',
      category: 'medicine',
      icon: <Thermometer className="h-8 w-8" />,
      color: 'from-violet-500 to-purple-500',
      details: {
        problem: 'Calcular exposición total al fármaco (AUC)',
        equation: 'AUC = ∫₀ᵗ C(t) dt',
        application: 'Farmacología, ensayos clínicos',
        visualization: 'Curva de concentración vs tiempo'
      },
      steps: [
        'Medir concentraciones en tiempos discretos',
        'Aplicar integración numérica',
        'Calcular dosis óptima',
        'Ajustar regimen de tratamiento'
      ]
    },
    {
      id: 'weather-prediction',
      title: 'Predicción Meteorológica',
      description: 'Newton-Raphson en modelos atmosféricos para encontrar equilibrios',
      method: 'newton',
      category: 'science',
      icon: <Wind className="h-8 w-8" />,
      color: 'from-cyan-500 to-blue-500',
      details: {
        problem: 'Resolver ecuaciones de Navier-Stokes',
        equation: 'ρ(∂v/∂t + v·∇v) = -∇p + μ∇²v + ρg',
        application: 'Meteorología, climatología',
        visualization: 'Campos de presión y temperatura'
      },
      steps: [
        'Discretizar ecuaciones diferenciales',
        'Aplicar método iterativo',
        'Encontrar solución de equilibrio',
        'Predecir evolución temporal'
      ]
    },
    {
      id: 'seismic-waves',
      title: 'Análisis Sísmico',
      description: 'Integración para calcular energía liberada en terremotos',
      method: 'simpson',
      category: 'science',
      icon: <Waves className="h-8 w-8" />,
      color: 'from-orange-500 to-red-500',
      details: {
        problem: 'Calcular magnitud momento (Mw)',
        equation: 'Mw = (2/3) log₁₀(M₀) - 10.7',
        application: 'Sismología, ingeniería sísmica',
        visualization: 'Ondas sísmicas y energía'
      },
      steps: [
        'Integrar registro de aceleración',
        'Calcular momento sísmico',
        'Determinar magnitud',
        'Estimar daños potenciales'
      ]
    },
    {
      id: 'circuit-design',
      title: 'Diseño de Circuitos',
      description: 'Newton-Raphson para análisis de circuitos no lineales',
      method: 'newton',
      category: 'engineering',
      icon: <Zap className="h-8 w-8" />,
      color: 'from-yellow-500 to-amber-500',
      details: {
        problem: 'Encontrar punto de operación de diodos',
        equation: 'I = Iₛ(e^(V/Vₜ) - 1)',
        application: 'Electrónica, diseño de chips',
        visualization: 'Característica I-V de dispositivos'
      },
      steps: [
        'Escribir ecuaciones de mallas',
        'Aplicar a componentes no lineales',
        'Resolver sistema iterativamente',
        'Validar con simulaciones SPICE'
      ]
    },
    {
      id: 'gps-navigation',
      title: 'Navegación por Satélite',
      description: 'Newton-Raphson para trilateración en sistemas GPS',
      method: 'newton',
      category: 'science',
      icon: <MapPin className="h-8 w-8" />,
      color: 'from-teal-500 to-green-500',
      details: {
        problem: 'Determinar posición exacta desde satélites',
        equation: '√((x-xᵢ)² + (y-yᵢ)² + (z-zᵢ)²) = c·Δtᵢ',
        application: 'GPS, navegación, cartografía',
        visualization: 'Intersección de esferas'
      },
      steps: [
        'Medir distancias a satélites',
        'Formular ecuaciones de posición',
        'Resolver sistema no lineal',
        'Corregir por efectos relativistas'
      ]
    }
  ]

  const filteredExamples = activeCategory === 'all' 
    ? realWorldExamples 
    : realWorldExamples.filter(example => example.category === activeCategory)

  const methodInfo: Record<string, MethodInfo> = {
    newton: {
      name: 'Newton-Raphson',
      icon: <Target className="h-5 w-5" />,
      color: 'bg-gradient-to-r from-blue-600 to-cyan-600',
      description: 'Encuentra raíces de ecuaciones mediante aproximaciones sucesivas'
    },
    lagrange: {
      name: 'Interpolación de Lagrange',
      icon: <LineChart className="h-5 w-5" />,
      color: 'bg-gradient-to-r from-purple-600 to-pink-600',
      description: 'Construye polinomios que pasan exactamente por puntos dados'
    },
    simpson: {
      name: 'Regla de Simpson',
      icon: <AreaChart className="h-5 w-5" />,
      color: 'bg-gradient-to-r from-green-600 to-emerald-600',
      description: 'Aproxima integrales usando parábolas para alta precisión'
    }
  }

  const handlePlayExample = (exampleId: string) => {
    setPlayingExample(playingExample === exampleId ? null : exampleId)
  }

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
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600">
            <Lightbulb className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              Ejemplos del Mundo Real
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Descubre cómo los métodos numéricos se aplican en situaciones reales
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 mt-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Aplicaciones Prácticas
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Estos ejemplos demuestran la importancia y utilidad de los métodos numéricos 
                en diversas industrias y disciplinas científicas.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
              <GraduationCap className="h-4 w-4" />
              <span>Material educativo • Sin fines comerciales</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Categorías */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Filtrar por Área de Aplicación
        </h3>
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg transition-all
                ${activeCategory === category.id
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }
              `}
            >
              {category.icon}
              <span className="font-medium">{category.label}</span>
              <span className={`
                text-xs px-2 py-1 rounded-full ml-2
                ${activeCategory === category.id
                  ? 'bg-white/20'
                  : 'bg-gray-200 dark:bg-gray-700'
                }
              `}>
                {category.count}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Grid de Ejemplos */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredExamples.map((example) => {
          const method = methodInfo[example.method]
          
          return (
            <motion.div
              key={example.id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="group"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 h-full">
                {/* Header con gradiente */}
                <div className={`h-2 bg-gradient-to-r ${example.color}`}></div>
                
                <div className="p-6">
                  {/* Título e ícono */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${example.color}`}>
                        {example.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                          {example.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className={`px-2 py-1 rounded-full text-xs font-medium text-white ${method.color}`}>
                            {method.name}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handlePlayExample(example.id)}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                      title={playingExample === example.id ? 'Pausar' : 'Ver detalles'}
                    >
                      {playingExample === example.id ? (
                        <Pause className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <Play className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>

                  {/* Descripción */}
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {example.description}
                  </p>

                  {/* Animated Details */}
                  <AnimatePresence>
                    {playingExample === example.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          {/* Detalles específicos */}
                          <div className="space-y-2">
                            <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                              <BookOpen className="h-4 w-4" />
                              Problema
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 pl-6">
                              {example.details.problem}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                              <Calculator className="h-4 w-4" />
                              Ecuación Principal
                            </h4>
                            <code className="block text-sm font-mono bg-gray-100 dark:bg-gray-900 p-3 rounded-lg text-blue-600 dark:text-blue-400 pl-6">
                              {example.details.equation}
                            </code>
                          </div>

                          {/* Pasos del método */}
                          <div className="space-y-2">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              Pasos de Implementación
                            </h4>
                            <ol className="space-y-2 pl-6">
                              {example.steps.map((step, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs flex items-center justify-center mt-0.5">
                                    {idx + 1}
                                  </span>
                                  {step}
                                </li>
                              ))}
                            </ol>
                          </div>

                          {/* Aplicación */}
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <Sparkles className="h-4 w-4" />
                            <span>
                              Aplicación: <strong className="text-gray-700 dark:text-gray-300">{example.details.application}</strong>
                            </span>
                          </div>

                          {/* Botón para probar */}
                          <Link
                            href={`/dashboard/methods/${example.method === 'newton' ? 'newton-raphson' : example.method}`}
                            className="block text-center py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all font-medium text-sm"
                          >
                            Probar este ejemplo
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Footer con botón de acción */}
                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {example.details.application}
                      </span>
                      <button
                        onClick={() => handlePlayExample(example.id)}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center gap-1"
                      >
                        {playingExample === example.id ? 'Menos detalles' : 'Más detalles'}
                        <ChevronRight className={`h-4 w-4 transition-transform ${playingExample === example.id ? 'rotate-90' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Sección Educativa */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl p-8 border border-gray-200 dark:border-gray-700"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white mb-4">
            <GraduationCap className="h-5 w-5" />
            <span className="font-semibold">Propósito Educativo</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            ¿Por qué son importantes estos ejemplos?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Estos casos reales demuestran que los métodos numéricos no son solo conceptos abstractos, 
            sino herramientas esenciales que impulsan la innovación y resuelven problemas complejos en el mundo real.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 inline-block mb-4">
              <Target className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Newton-Raphson
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Ideal para problemas de optimización, búsqueda de equilibrios y sistemas no lineales en física e ingeniería.
            </p>
          </div>

          <div className="text-center">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 inline-block mb-4">
              <LineChart className="h-10 w-10 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Interpolación
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Esencial para reconstruir señales, predecir valores intermedios y suavizar datos en medicina y finanzas.
            </p>
          </div>

          <div className="text-center">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 inline-block mb-4">
              <AreaChart className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Integración
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Fundamental para calcular áreas, volúmenes, promedios y acumulaciones en análisis de datos y ciencias.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Comparación de Métodos */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Comparación de Aplicaciones por Método
        </h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Método
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Fortalezas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Aplicaciones Típicas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Precisión
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {Object.entries(methodInfo).map(([key, method]) => (
                <tr key={key} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${method.color}`}>
                        {method.icon}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {method.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {realWorldExamples.filter(e => e.method === key).length} ejemplos
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      {key === 'newton' && (
                        <>
                          <li>Convergencia rápida</li>
                          <li>Alta precisión</li>
                          <li>Eficiente computacionalmente</li>
                        </>
                      )}
                      {key === 'lagrange' && (
                        <>
                          <li>Exacto en puntos dados</li>
                          <li>Fácil implementación</li>
                          <li>Flexible en distribución de puntos</li>
                        </>
                      )}
                      {key === 'simpson' && (
                        <>
                          <li>Alta precisión con pocos puntos</li>
                          <li>Error fácil de estimar</li>
                          <li>Estable numéricamente</li>
                        </>
                      )}
                    </ul>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {realWorldExamples
                        .filter(e => e.method === key)
                        .slice(0, 3)
                        .map(example => (
                          <span 
                            key={example.id}
                            className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                          >
                            {example.category}
                          </span>
                        ))}
                      {realWorldExamples.filter(e => e.method === key).length > 3 && (
                        <span className="px-2 py-1 text-xs text-gray-500">
                          +{realWorldExamples.filter(e => e.method === key).length - 3} más
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {key === 'newton' && (
                        <>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 h-2.5 rounded-full" style={{ width: '95%' }}></div>
                          </div>
                          <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">95%</span>
                        </>
                      )}
                      {key === 'lagrange' && (
                        <>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                          </div>
                          <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">100%*</span>
                        </>
                      )}
                      {key === 'simpson' && (
                        <>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div className="bg-gradient-to-r from-green-600 to-emerald-600 h-2.5 rounded-full" style={{ width: '99%' }}></div>
                          </div>
                          <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">99%</span>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* CTA Final */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-center"
      >
        <h3 className="text-2xl font-bold text-white mb-4">
          ¿Listo para experimentar con estos métodos?
        </h3>
        <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
          Todos estos ejemplos están implementados en nuestra plataforma interactiva. 
          Puedes modificar parámetros, ver visualizaciones en tiempo real y comprender 
          profundamente cómo funcionan estos métodos.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard/methods/newton-raphson"
            className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all font-semibold"
          >
            Probar Newton-Raphson
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-all font-semibold"
          >
            Volver al Dashboard
          </Link>
        </div>
      </motion.div>

      {/* Pie de página informativo */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-8 border-t border-gray-200 dark:border-gray-800">
        <p className="mb-2">
          <strong>Nota:</strong> Estos ejemplos son ilustrativos y simplificados con fines educativos.
        </p>
        <p>
          En aplicaciones reales, los métodos suelen combinarse y optimizarse según necesidades específicas.
        </p>
      </div>
    </div>
  )
}