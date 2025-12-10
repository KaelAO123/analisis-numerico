/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { 
  Calculator, 
  AreaChart, 
  Zap, 
  AlertCircle, 
  Target,
  BookOpen,
  TrendingUp,
  Layers,
  PieChart,
  BarChart3,
  Play,
  RefreshCw,
  Settings,
  LineChart as LineChartIcon,
  ChevronRight,
  SigmaSquare,
  Lightbulb,
  GitBranch,
  Cpu,
  Shield,
  Rocket,
  Bell,
  Clock,
  Maximize2,
  Minimize2,
  Download,
  Upload,
  Eye,
  EyeOff,
  Hash,
  Infinity,
  DivideCircle,
  Sparkles,
  BarChart,
  ChartBar,
  Target as TargetIcon,
  FunctionSquare,
  X
} from 'lucide-react'
import SimpsonCalculator from '@/components/methods/simpson/SimpsonCalculator'
import SimpsonVisualization from '@/components/methods/simpson/SimpsonVisualization'
import SimpsonResults from '@/components/methods/simpson/SimpsonResults'
import { 
  simpson13, 
  simpson38, 
  compositeSimpson,
  getExactIntegral,
  SimpsonResult 
} from '@/lib/utils/math/simpsonIntegration'
import toast from 'react-hot-toast'

export default function SimpsonPage() {
  // Estado para la calculadora
  const [functionInput, setFunctionInput] = useState('x^2')
  const [lowerLimit, setLowerLimit] = useState(0)
  const [upperLimit, setUpperLimit] = useState(2)
  const [segments, setSegments] = useState(10)
  const [method, setMethod] = useState<'1/3' | '3/8' | 'composite'>('1/3')
  const [tolerance, setTolerance] = useState(0.0001)
  
  // Estado para resultados
  const [result, setResult] = useState<SimpsonResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [showParabolas, setShowParabolas] = useState(true)
  const [exactValue, setExactValue] = useState<number | null>(null)
  const [activeSection, setActiveSection] = useState<'calculator' | 'visualization' | 'results'>('calculator')
  const [showTheory, setShowTheory] = useState(false)
  const [showQuickTips, setShowQuickTips] = useState(true)

  // Calcular valor exacto cuando cambian parámetros
  useEffect(() => {
    const exact = getExactIntegral(functionInput, lowerLimit, upperLimit)
    setExactValue(exact)
  }, [functionInput, lowerLimit, upperLimit])

  // Ejemplo inicial
  useEffect(() => {
    calculateIntegral()
  }, [])

  const calculateIntegral = () => {
    if (!functionInput.trim()) {
      toast.error('Ingresa una función primero')
      return
    }

    if (lowerLimit >= upperLimit) {
      toast.error('El límite inferior debe ser menor al superior')
      return
    }

    setIsCalculating(true)

    try {
      let calculationResult: SimpsonResult
      
      switch (method) {
        case '1/3':
          calculationResult = simpson13(functionInput, lowerLimit, upperLimit, segments)
          break
        case '3/8':
          calculationResult = simpson38(functionInput, lowerLimit, upperLimit, segments)
          break
        case 'composite':
          calculationResult = compositeSimpson(functionInput, lowerLimit, upperLimit, tolerance)
          break
      }
      
      setResult(calculationResult)
      toast.success('Integración completada exitosamente', {
        icon: '✅',
        duration: 3000
      })
      
      // Cambiar a visualización automáticamente
      setActiveSection('visualization')
      
    } catch (error: any) {
      console.error('Error en cálculo:', error)
      toast.error(`Error: ${error.message || 'No se pudo calcular la integral'}`, {
        icon: '❌'
      })
    } finally {
      setIsCalculating(false)
    }
  }

  const handleReset = () => {
    setFunctionInput('x^2')
    setLowerLimit(0)
    setUpperLimit(2)
    setSegments(10)
    setMethod('1/3')
    setTolerance(0.0001)
    setShowParabolas(true)
    toast.success('Valores restablecidos', {
      icon: '🔄'
    })
  }

  const loadExample = (example: string) => {
    switch (example) {
      case 'sine':
        setFunctionInput('sin(x)')
        setLowerLimit(0)
        setUpperLimit(Math.PI)
        setSegments(12)
        setMethod('1/3')
        break
      case 'exponential':
        setFunctionInput('exp(x)')
        setLowerLimit(0)
        setUpperLimit(1)
        setSegments(8)
        setMethod('1/3')
        break
      case 'polynomial':
        setFunctionInput('x^3 - 2*x^2 + x')
        setLowerLimit(-1)
        setUpperLimit(2)
        setSegments(20)
        setMethod('1/3')
        break
      case 'rational':
        setFunctionInput('1/(1 + x^2)')
        setLowerLimit(-3)
        setUpperLimit(3)
        setSegments(30)
        setMethod('composite')
        setTolerance(0.00001)
        break
    }
    toast.success('Ejemplo cargado', {
      icon: '📥'
    })
  }

  return (
    <div className="py-6">
      {/* Header Principal */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-green-600 via-emerald-500 to-teal-600 shadow-xl">
              <AreaChart className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                Integración de Simpson
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-2xl">
                Calcula integrales definidas numéricamente utilizando el método de Simpson 
                con visualización interactiva y análisis detallado de resultados.
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowTheory(!showTheory)}
              className="px-5 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 flex items-center gap-2 group hover:scale-[1.02]"
            >
              <BookOpen className="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:text-blue-600" />
              {showTheory ? 'Ocultar teoría' : 'Ver teoría'}
            </button>
            <button
              onClick={handleReset}
              className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 group hover:scale-[1.02]"
            >
              <RefreshCw className="h-4 w-4" />
              Restablecer
            </button>
          </div>
        </div>

        {/* Teoría expandible */}
        {showTheory && (
          <div className="mb-8 animate-fadeIn">
            <div className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-blue-900/20 dark:via-gray-800/50 dark:to-cyan-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-800 shadow-xl">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 shadow-lg">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Fundamentos del Método de Simpson
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Teoría matemática y aplicaciones prácticas
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowTheory(false)}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <TargetIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      ¿Qué es el método de Simpson?
                    </h4>
                    <div className="space-y-3 text-gray-700 dark:text-gray-300">
                      <p>
                        Es un <strong className="text-blue-600 dark:text-blue-400">método numérico</strong> para aproximar el valor de 
                        integrales definidas. A diferencia del método del trapecio que usa rectángulos, 
                        Simpson utiliza <strong className="text-green-600 dark:text-green-400">parábolas</strong> para aproximar la 
                        función en cada subintervalo.
                      </p>
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-2">
                          <Zap className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                          <span className="font-medium text-gray-900 dark:text-white">Orden de error: O(h⁴)</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          El error disminuye con la cuarta potencia del ancho del segmento
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <SigmaSquare className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      Fórmulas principales
                    </h4>
                    <div className="space-y-4">
                      <div className="bg-gray-900 dark:bg-black p-4 rounded-xl">
                        <code className="font-mono text-sm text-gray-100 block">
                          <span className="text-cyan-400">// Simpson 1/3</span><br/>
                          ∫ f(x) dx ≈ (h/3)[f(x₀) + 4f(x₁) + 2f(x₂) + ... + f(xₙ)]
                        </code>
                      </div>
                      <div className="bg-gray-900 dark:bg-black p-4 rounded-xl">
                        <code className="font-mono text-sm text-gray-100 block">
                          <span className="text-purple-400">// Simpson 3/8</span><br/>
                          ∫ f(x) dx ≈ (3h/8)[f(x₀) + 3f(x₁) + 3f(x₂) + 2f(x₃) + ... + f(xₙ)]
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Rocket className="h-5 w-5 text-green-600 dark:text-green-400" />
                      Ventajas y aplicaciones
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                          <span className="font-medium text-gray-900 dark:text-white">Alta precisión</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Error O(h⁴) vs O(h²) del método del trapecio
                        </p>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 mb-2">
                          <Cpu className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          <span className="font-medium text-gray-900 dark:text-white">Eficiente</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Pocos segmentos para buena precisión
                        </p>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                          <span className="font-medium text-gray-900 dark:text-white">Versátil</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Funciona con diversas funciones matemáticas
                        </p>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 mb-2">
                          <ChartBar className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                          <span className="font-medium text-gray-900 dark:text-white">Visual</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Fácil interpretación gráfica del área
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                      Aplicaciones prácticas
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-3 w-3 text-green-600 dark:text-green-400 mt-0.5" />
                        <span>Cálculo de áreas bajo curvas en física e ingeniería</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-3 w-3 text-green-600 dark:text-green-400 mt-0.5" />
                        <span>Análisis de datos experimentales y señales</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-3 w-3 text-green-600 dark:text-green-400 mt-0.5" />
                        <span>Cálculo de volúmenes y promedios</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-3 w-3 text-green-600 dark:text-green-400 mt-0.5" />
                        <span>Simulaciones numéricas en ciencias computacionales</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tips rápidos */}
        {showQuickTips && (
          <div className="mb-6">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-5 border border-amber-200 dark:border-amber-800">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-amber-600">
                    <Lightbulb className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Tips para comenzar
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg">
                        <Target className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Usa ejemplos para empezar rápido</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg">
                        <Eye className="h-3 w-3 text-green-600 dark:text-green-400" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Explora diferentes métodos</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg">
                        <TrendingUp className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Ajusta segmentos para precisión</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowQuickTips(false)}
                  className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Ejemplos rápidos */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => loadExample('sine')}
            className="p-5 rounded-xl bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-blue-900/20 dark:via-gray-800/50 dark:to-blue-900/20 border border-blue-200 dark:border-blue-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 group hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="flex flex-col items-center text-center">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 text-white mb-3 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="h-6 w-6" />
              </div>
              <p className="font-semibold text-gray-900 dark:text-white mb-1">
                ∫ sin(x) dx
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">[0, π]</p>
              <div className="mt-3 flex items-center justify-center gap-2">
                <DivideCircle className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                <span className="text-xs text-blue-600 dark:text-blue-400">Simpson 1/3</span>
              </div>
            </div>
          </button>
          
          <button
            onClick={() => loadExample('exponential')}
            className="p-5 rounded-xl bg-gradient-to-br from-green-50 via-white to-green-50 dark:from-green-900/20 dark:via-gray-800/50 dark:to-green-900/20 border border-green-200 dark:border-green-800 hover:border-green-500 dark:hover:border-green-500 transition-all duration-300 group hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="flex flex-col items-center text-center">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 text-white mb-3 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-6 w-6" />
              </div>
              <p className="font-semibold text-gray-900 dark:text-white mb-1">
                ∫ eˣ dx
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">[0, 1]</p>
              <div className="mt-3 flex items-center justify-center gap-2">
                <DivideCircle className="h-3 w-3 text-green-600 dark:text-green-400" />
                <span className="text-xs text-green-600 dark:text-green-400">Simpson 1/3</span>
              </div>
            </div>
          </button>
          
          <button
            onClick={() => loadExample('polynomial')}
            className="p-5 rounded-xl bg-gradient-to-br from-purple-50 via-white to-purple-50 dark:from-purple-900/20 dark:via-gray-800/50 dark:to-purple-900/20 border border-purple-200 dark:border-purple-800 hover:border-purple-500 dark:hover:border-purple-500 transition-all duration-300 group hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="flex flex-col items-center text-center">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 text-white mb-3 group-hover:scale-110 transition-transform duration-300">
                <SigmaSquare className="h-6 w-6" />
              </div>
              <p className="font-semibold text-gray-900 dark:text-white mb-1">
                ∫ x³ - 2x² + x dx
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">[-1, 2]</p>
              <div className="mt-3 flex items-center justify-center gap-2">
                <DivideCircle className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                <span className="text-xs text-purple-600 dark:text-purple-400">Simpson 1/3</span>
              </div>
            </div>
          </button>
          
          <button
            onClick={() => loadExample('rational')}
            className="p-5 rounded-xl bg-gradient-to-br from-pink-50 via-white to-pink-50 dark:from-pink-900/20 dark:via-gray-800/50 dark:to-pink-900/20 border border-pink-200 dark:border-pink-800 hover:border-pink-500 dark:hover:border-pink-500 transition-all duration-300 group hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="flex flex-col items-center text-center">
              <div className="p-3 rounded-xl bg-gradient-to-br from-pink-600 to-rose-600 text-white mb-3 group-hover:scale-110 transition-transform duration-300">
                <ChartBar className="h-6 w-6" />
              </div>
              <p className="font-semibold text-gray-900 dark:text-white mb-1">
                ∫ 1/(1 + x²) dx
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">[-3, 3]</p>
              <div className="mt-3 flex items-center justify-center gap-2">
                <Infinity className="h-3 w-3 text-pink-600 dark:text-pink-400" />
                <span className="text-xs text-pink-600 dark:text-pink-400">Adaptativo</span>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Navegación de secciones */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setActiveSection('calculator')}
            className={`px-6 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 ${
              activeSection === 'calculator'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-xl'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-[1.02]'
            }`}
          >
            <Calculator className="h-5 w-5" />
            <span>Calculadora</span>
          </button>
          
          <button
            onClick={() => setActiveSection('visualization')}
            className={`px-6 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 ${
              activeSection === 'visualization'
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-xl'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-[1.02]'
            }`}
          >
            <LineChartIcon className="h-5 w-5" />
            <span>Visualización</span>
          </button>
          
          <button
            onClick={() => setActiveSection('results')}
            className={`px-6 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 ${
              activeSection === 'results'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-[1.02]'
            }`}
          >
            <PieChart className="h-5 w-5" />
            <span>Resultados</span>
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Panel izquierdo: Calculadora */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-200 dark:border-gray-700 sticky top-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 shadow-lg">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Configuración
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Define los parámetros de integración
                  </p>
                </div>
              </div>
              <button
                onClick={calculateIntegral}
                disabled={isCalculating}
                className="px-5 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center gap-2 group hover:scale-[1.02]"
              >
                {isCalculating ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span className="font-semibold">Calculando...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5" />
                    <span className="font-semibold">Calcular</span>
                  </>
                )}
              </button>
            </div>
            
            <SimpsonCalculator
              functionInput={functionInput}
              lowerLimit={lowerLimit}
              upperLimit={upperLimit}
              segments={segments}
              method={method}
              tolerance={tolerance}
              onFunctionChange={setFunctionInput}
              onLowerLimitChange={setLowerLimit}
              onUpperLimitChange={setUpperLimit}
              onSegmentsChange={setSegments}
              onMethodChange={setMethod}
              onToleranceChange={setTolerance}
              onCalculate={calculateIntegral}
            />
          </div>

          {/* Panel de información del método */}
          <div className="mt-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600">
                <GitBranch className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                  Método Seleccionado
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Resumen de la configuración actual
                </p>
              </div>
            </div>
            
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SigmaSquare className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Tipo:</span>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  method === '1/3' 
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : method === '3/8'
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                }`}>
                  {method === '1/3' ? 'Simpson 1/3' : method === '3/8' ? 'Simpson 3/8' : 'Simpson Compuesto'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Segmentos:</span>
                </div>
                <span className="font-mono font-bold text-gray-900 dark:text-white text-lg">
                  {segments}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Intervalo:</span>
                </div>
                <span className="font-mono text-gray-900 dark:text-white">
                  [{lowerLimit.toFixed(2)}, {upperLimit.toFixed(2)}]
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Ancho:</span>
                </div>
                <span className="font-mono text-gray-900 dark:text-white">
                  {(upperLimit - lowerLimit).toFixed(2)}
                </span>
              </div>
            </div>
            
            {exactValue !== null && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Valor exacto:</span>
                  </div>
                  <span className="font-mono font-bold text-green-600 dark:text-green-400 text-lg">
                    {exactValue.toFixed(6)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Panel derecho: Contenido dinámico según sección activa */}
        <div className="lg:col-span-2">
          {activeSection === 'calculator' ? (
            <div className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-blue-900/20 dark:via-gray-800/50 dark:to-cyan-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-800">
              <div className="text-center">
                <div className="inline-flex p-5 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 mb-8 shadow-xl">
                  <Calculator className="h-14 w-14 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Configura tu integral
                </h3>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                  Usa el panel izquierdo para definir la función, límites y método de integración.
                  Luego haz clic en <span className="font-bold text-green-600 dark:text-green-400">&quot;Calcular&quot;</span> para ver los resultados.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="inline-flex p-3 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 text-white font-bold text-xl mb-4">
                      1
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                      <FunctionSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <h4 className="font-semibold text-gray-900 dark:text-white">Define f(x)</h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Ingresa la función o selecciona un ejemplo predefinido
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="inline-flex p-3 rounded-lg bg-gradient-to-br from-green-600 to-emerald-600 text-white font-bold text-xl mb-4">
                      2
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                      <Hash className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <h4 className="font-semibold text-gray-900 dark:text-white">Configura límites</h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Establece a y b del intervalo de integración
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="inline-flex p-3 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 text-white font-bold text-xl mb-4">
                      3
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                      <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      <h4 className="font-semibold text-gray-900 dark:text-white">Calcula y explora</h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Haz clic en calcular y explora los resultados detallados
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : activeSection === 'visualization' ? (
            <div className="space-y-8">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Visualización del Área
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Representación gráfica de la aproximación de Simpson
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowParabolas(!showParabolas)}
                      className={`px-5 py-2.5 rounded-xl flex items-center gap-3 transition-all duration-300 ${
                        showParabolas
                          ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Layers className="h-4 w-4" />
                      {showParabolas ? 'Ocultar áreas' : 'Mostrar áreas'}
                    </button>
                  </div>
                </div>
                
                <div className="h-[500px]">
                  <SimpsonVisualization
                    functionStr={functionInput}
                    lowerLimit={lowerLimit}
                    upperLimit={upperLimit}
                    result={result}
                    showParabolas={showParabolas}
                    onShowParabolasChange={setShowParabolas}
                  />
                </div>
              </div>
              
              {/* Explicación de la visualización */}
              <div className="bg-gradient-to-r from-green-50 via-white to-emerald-50 dark:from-green-900/20 dark:via-gray-800/50 dark:to-emerald-900/20 rounded-2xl p-8 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 shadow-lg">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Interpretación del gráfico
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Entiende lo que representa cada elemento visual
                    </p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-blue-600">
                        <LineChartIcon className="h-4 w-4 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Línea azul - Función f(x)</h4>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      Representa la función matemática que estás integrando. 
                      Es la curva original que deseamos calcular el área bajo ella.
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-green-600">
                        <AreaChart className="h-4 w-4 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Áreas coloreadas - Aproximación</h4>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      Cada área representa la aproximación parabólica de Simpson en ese segmento.
                      La suma de todas estas áreas es el valor aproximado de la integral.
                    </p>
                  </div>
                </div>
                
                <div className="mt-8 pt-8 border-t border-green-200 dark:border-green-800">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-4">
                      <Zap className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        ¿Por qué usar áreas en lugar de rectángulos?
                      </h4>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      Simpson usa <strong>parábolas</strong> en lugar de rectángulos (como el método del trapecio) 
                      porque proporcionan una <strong>aproximación mucho más precisa</strong>. 
                      El error disminuye con la cuarta potencia del ancho del segmento (O(h⁴)), 
                      en lugar de la segunda potencia (O(h²)).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Resultados Detallados
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Análisis completo de la integración numérica
                    </p>
                  </div>
                  
                  {result && (
                    <div className="text-center lg:text-right">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        ≈ {result.integral.toFixed(6)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Valor aproximado de la integral
                      </div>
                    </div>
                  )}
                </div>
                
                <SimpsonResults
                  result={result}
                  exactValue={exactValue}
                  functionStr={functionInput}
                  lowerLimit={lowerLimit}
                  upperLimit={upperLimit}
                  method={method}
                />
              </div>
              
              {/* Consejos para mejorar precisión */}
              <div className="bg-gradient-to-r from-amber-50 via-white to-orange-50 dark:from-amber-900/20 dark:via-gray-800/50 dark:to-orange-900/20 rounded-2xl p-8 border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 shadow-lg">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Optimización de resultados
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Estrategias para mejorar la precisión del cálculo
                    </p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-4">
                      <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <h4 className="font-semibold text-gray-900 dark:text-white">Aumenta segmentos</h4>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Más segmentos = mejor aproximación, pero aumenta el tiempo de cálculo.
                    </p>
                    <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                      <p className="text-sm text-blue-800 dark:text-blue-300">
                        <strong>Relación:</strong> Duplicar segmentos reduce el error ~16 veces
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-4">
                      <Infinity className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <h4 className="font-semibold text-gray-900 dark:text-white">Usa método adaptativo</h4>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      El método compuesto ajusta automáticamente hasta alcanzar la tolerancia deseada.
                    </p>
                    <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                      <p className="text-sm text-green-800 dark:text-green-300">
                        <strong>Ventaja:</strong> Precisión controlada sin adivinar segmentos
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Aplicaciones prácticas */}
      <div className="mt-12 bg-gradient-to-r from-purple-50 via-white to-pink-50 dark:from-purple-900/20 dark:via-gray-800/50 dark:to-pink-900/20 rounded-2xl p-10 border border-purple-200 dark:border-purple-800">
        <div className="text-center mb-10">
          <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 mb-6">
            <Rocket className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Aplicaciones del Método de Simpson
          </h3>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Este método es fundamental en diversas áreas de la ciencia e ingeniería 
            donde se requiere calcular áreas bajo curvas de forma precisa y eficiente.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 mb-6">
              <AreaChart className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-3">
              Física e Ingeniería
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Cálculo de trabajo, energía, flujo de fluidos y áreas de secciones transversales
            </p>
            <div className="flex justify-center gap-2">
              <span className="text-xs px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                Trabajo
              </span>
              <span className="text-xs px-3 py-1 bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200 rounded-full">
                Energía
              </span>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 mb-6">
              <BarChart className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-3">
              Análisis de Datos
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Integración de datos experimentales, señales y análisis estadístico
            </p>
            <div className="flex justify-center gap-2">
              <span className="text-xs px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">
                Señales
              </span>
              <span className="text-xs px-3 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 rounded-full">
                Datos
              </span>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 mb-6">
              <Cpu className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-3">
              Simulaciones Computacionales
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Cálculo de volúmenes, promedios y análisis numérico en software científico
            </p>
            <div className="flex justify-center gap-2">
              <span className="text-xs px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full">
                Volúmenes
              </span>
              <span className="text-xs px-3 py-1 bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200 rounded-full">
                Promedios
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Información técnica final */}
      <div className="mt-12 pt-12 border-t border-gray-200 dark:border-gray-800">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-gray-600 to-gray-800">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Método de Simpson • Orden de error: O(h⁴)
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Segmentos actuales: {segments} • Precisión estimada: {result?.errorEstimate.toExponential(2) || 'N/A'}
              </p>
            </div>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-lg">
              Este método es especialmente efectivo para funciones suaves. 
              Para funciones con discontinuidades o cambios bruscos, considera usar 
              más segmentos o métodos adaptativos.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}