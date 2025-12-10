/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { 
  Calculator, 
  RefreshCw, 
  Play, 
  Zap, 
  AlertCircle,
  CheckCircle,
  Settings,
  TrendingUp,
  Hash,
  Maximize2,
  Minimize2,
  FunctionSquare,
  BarChart3,
  PieChart,
  SigmaSquare,
  X,
  ChevronRight,
  ChevronLeft,
  GitBranch,
  DivideCircle,
  Square,
  Infinity,
  ArrowLeftRight
} from 'lucide-react'
import toast from 'react-hot-toast'
import { evaluate, parse } from 'mathjs'

interface SimpsonCalculatorProps {
  functionInput: string
  lowerLimit: number
  upperLimit: number
  segments: number
  method: '1/3' | '3/8' | 'composite'
  tolerance: number
  onFunctionChange: (value: string) => void
  onLowerLimitChange: (value: number) => void
  onUpperLimitChange: (value: number) => void
  onSegmentsChange: (value: number) => void
  onMethodChange: (method: '1/3' | '3/8' | 'composite') => void
  onToleranceChange: (value: number) => void
  onCalculate?: () => void
}

export default function SimpsonCalculator({
  functionInput,
  lowerLimit,
  upperLimit,
  segments,
  method,
  tolerance,
  onFunctionChange,
  onLowerLimitChange,
  onUpperLimitChange,
  onSegmentsChange,
  onMethodChange,
  onToleranceChange,
  onCalculate
}: SimpsonCalculatorProps) {
  const [isCalculating, setIsCalculating] = useState(false)
  const [functionError, setFunctionError] = useState('')
  const [isValidFunction, setIsValidFunction] = useState(true)
  const [exactValue, setExactValue] = useState<number | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const exampleFunctions = [
    { label: 'x²', f: 'x^2', icon: <FunctionSquare className="h-4 w-4" />, exact: (b: number, a: number) => (Math.pow(b, 3) - Math.pow(a, 3)) / 3 },
    { label: 'sin(x)', f: 'sin(x)', icon: <BarChart3 className="h-4 w-4" />, exact: (b: number, a: number) => Math.cos(a) - Math.cos(b) },
    { label: 'eˣ', f: 'exp(x)', icon: <TrendingUp className="h-4 w-4" />, exact: (b: number, a: number) => Math.exp(b) - Math.exp(a) },
    { label: '1/x', f: '1/x', icon: <DivideCircle className="h-4 w-4" />, exact: (b: number, a: number) => Math.log(Math.abs(b)) - Math.log(Math.abs(a)) },
    { label: 'cos(x)', f: 'cos(x)', icon: <PieChart className="h-4 w-4" />, exact: (b: number, a: number) => Math.sin(b) - Math.sin(a) },
    { label: '√x', f: 'sqrt(x)', icon: <Square className="h-4 w-4" />, exact: (b: number, a: number) => (2/3) * (Math.pow(b, 1.5) - Math.pow(a, 1.5)) }
  ]

  const validateFunction = (funcStr: string) => {
    if (!funcStr.trim()) {
      setFunctionError('Ingresa una función')
      setIsValidFunction(false)
      return false
    }

    try {
      // Probar evaluación en varios puntos
      const testPoints = [lowerLimit, (lowerLimit + upperLimit) / 2, upperLimit]
      let hasValidResult = false
      
      for (const x of testPoints) {
        try {
          const result = evaluate(funcStr, { x })
          if (typeof result === 'number' && isFinite(result)) {
            hasValidResult = true
            break
          }
        } catch {
          continue
        }
      }
      
      if (hasValidResult) {
        setFunctionError('')
        setIsValidFunction(true)
        return true
      } else {
        setFunctionError('La función no produce valores numéricos válidos en el intervalo')
        setIsValidFunction(false)
        return false
      }
    } catch (error: any) {
      setFunctionError('Sintaxis inválida. Usa: x^2, sin(x), exp(x), etc.')
      setIsValidFunction(false)
      return false
    }
  }

  useEffect(() => {
    validateFunction(functionInput)
    
    // Intentar calcular valor exacto
    try {
      const normalized = functionInput.toLowerCase().replace(/\s+/g, '')
      
      if (normalized.includes('x^2') || normalized.includes('x**2')) {
        setExactValue((Math.pow(upperLimit, 3) - Math.pow(lowerLimit, 3)) / 3)
      } else if (normalized.includes('sin(x)')) {
        setExactValue(Math.cos(lowerLimit) - Math.cos(upperLimit))
      } else if (normalized.includes('cos(x)')) {
        setExactValue(Math.sin(upperLimit) - Math.sin(lowerLimit))
      } else if (normalized.includes('exp(x)') || normalized.includes('e^x')) {
        setExactValue(Math.exp(upperLimit) - Math.exp(lowerLimit))
      } else if (normalized === 'x') {
        setExactValue((upperLimit * upperLimit - lowerLimit * lowerLimit) / 2)
      } else {
        setExactValue(null)
      }
    } catch {
      setExactValue(null)
    }
  }, [functionInput, lowerLimit, upperLimit])

  const handleExampleSelect = (f: string) => {
    onFunctionChange(f)
    toast.success('Función de ejemplo cargada')
  }

  const handleCalculate = () => {
    if (!validateFunction(functionInput)) {
      toast.error('Corrige la función antes de calcular')
      return
    }

    if (lowerLimit >= upperLimit) {
      toast.error('El límite inferior debe ser menor al superior')
      return
    }

    if (segments < 2) {
      toast.error('Se necesitan al menos 2 segmentos')
      return
    }

    if (method === '1/3' && segments % 2 !== 0) {
      toast.error('Simpson 1/3 requiere un número par de segmentos')
      return
    }

    if (method === '3/8' && segments % 3 !== 0) {
      toast.error('Simpson 3/8 requiere un múltiplo de 3 segmentos')
      return
    }

    setIsCalculating(true)
    
    if (onCalculate) {
      onCalculate()
    }
    
    setTimeout(() => {
      setIsCalculating(false)
      toast.success('Integración completada')
    }, 800)
  }

  const handleReset = () => {
    onFunctionChange('x^2')
    onLowerLimitChange(0)
    onUpperLimitChange(2)
    onSegmentsChange(10)
    onMethodChange('1/3')
    onToleranceChange(0.0001)
    setFunctionError('')
    setIsValidFunction(true)
    toast.success('Valores restablecidos')
  }

  const handleSwapLimits = () => {
    onLowerLimitChange(upperLimit)
    onUpperLimitChange(lowerLimit)
    toast.success('Límites intercambiados')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <SigmaSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Configuración de la Integral
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Define la función y los límites de integración
          </p>
        </div>
        
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          title={showAdvanced ? 'Ocultar opciones avanzadas' : 'Mostrar opciones avanzadas'}
        >
          {showAdvanced ? (
            <Minimize2 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          ) : (
            <Maximize2 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          )}
        </button>
      </div>

      {/* Valor exacto si está disponible */}
      {exactValue !== null && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="font-medium text-green-800 dark:text-green-300">
                  Valor exacto conocido
                </p>
                <p className="text-sm text-green-700 dark:text-green-400 font-mono">
                  ∫ f(x) dx = {exactValue.toFixed(6)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
      )}

      {/* Ejemplos rápidos */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <FunctionSquare className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Funciones de ejemplo
          </label>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {exampleFunctions.map((example, idx) => (
            <button
              key={idx}
              onClick={() => handleExampleSelect(example.f)}
              className="flex flex-col items-center gap-2 px-3 py-3 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 text-gray-700 dark:text-gray-300 group hover:scale-[1.02] active:scale-[0.98]"
              title={example.label}
            >
              <div className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {example.icon}
              </div>
              <span className="font-medium">{example.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Entrada de función */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Hash className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Función f(x) a integrar
            </label>
          </div>
          {isValidFunction && functionInput.trim() && !functionError && (
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-xs text-green-600 dark:text-green-400">Válida</span>
            </div>
          )}
        </div>
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
            <FunctionSquare className="h-5 w-5" />
          </div>
          <input
            type="text"
            value={functionInput}
            onChange={(e) => onFunctionChange(e.target.value)}
            className={`w-full pl-12 pr-10 py-3 bg-gray-50 dark:bg-gray-900 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-600 dark:focus:border-blue-600 transition-colors ${
              functionError 
                ? 'border-red-300 dark:border-red-700' 
                : isValidFunction && functionInput.trim()
                ? 'border-green-300 dark:border-green-700'
                : 'border-gray-300 dark:border-gray-700'
            }`}
            placeholder="x^2 + sin(x)"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            f(x) =
          </div>
        </div>
        {functionError ? (
          <div className="flex items-center gap-2 mt-2 text-red-600 dark:text-red-400 text-sm">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{functionError}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 mt-2 text-gray-600 dark:text-gray-400 text-sm">
            <ChevronRight className="h-3 w-3" />
            <span>La función debe ser continua en el intervalo [a, b]</span>
          </div>
        )}
      </div>

      {/* Límites de integración */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Límite inferior (a)
          </label>
          <div className="relative group">
            <input
              type="number"
              value={lowerLimit}
              onChange={(e) => onLowerLimitChange(parseFloat(e.target.value) || 0)}
              step="0.1"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors group-hover:border-blue-400"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
              <ChevronLeft className="h-4 w-4" />
            </div>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">
              a
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <button
            onClick={handleSwapLimits}
            className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
            title="Intercambiar límites"
          >
            <ArrowLeftRight className="h-5 w-5" />
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Límite superior (b)
          </label>
          <div className="relative group">
            <input
              type="number"
              value={upperLimit}
              onChange={(e) => onUpperLimitChange(parseFloat(e.target.value) || 1)}
              step="0.1"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors group-hover:border-blue-400"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
              <ChevronRight className="h-4 w-4" />
            </div>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">
              b
            </div>
          </div>
        </div>
      </div>

      {/* Sliders para límites */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Intervalo de integración</span>
            </div>
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Ancho: {(upperLimit - lowerLimit).toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <input
                type="range"
                min="-10"
                max="10"
                step="0.1"
                value={lowerLimit}
                onChange={(e) => onLowerLimitChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-gradient-to-r from-red-200 to-blue-200 dark:from-red-900/30 dark:to-blue-900/30 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg"
              />
            </div>
            <div className="flex-1">
              <input
                type="range"
                min="-10"
                max="10"
                step="0.1"
                value={upperLimit}
                onChange={(e) => onUpperLimitChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-gradient-to-r from-blue-200 to-green-200 dark:from-blue-900/30 dark:to-green-900/30 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg"
              />
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>a = {lowerLimit.toFixed(2)}</span>
            <span>← Intervalo →</span>
            <span>b = {upperLimit.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Método y segmentos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <GitBranch className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Método de Simpson
            </label>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => onMethodChange('1/3')}
              className={`px-4 py-3 rounded-lg transition-all duration-200 flex flex-col items-center gap-2 ${
                method === '1/3'
                  ? 'bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-[1.02]'
              }`}
            >
              <DivideCircle className={`h-5 w-5 ${method === '1/3' ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`} />
              <span className="font-medium">1/3</span>
              <span className="text-xs opacity-75">Parábolas</span>
            </button>
            <button
              onClick={() => onMethodChange('3/8')}
              className={`px-4 py-3 rounded-lg transition-all duration-200 flex flex-col items-center gap-2 ${
                method === '3/8'
                  ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-[1.02]'
              }`}
            >
              <SigmaSquare className={`h-5 w-5 ${method === '3/8' ? 'text-white' : 'text-purple-600 dark:text-purple-400'}`} />
              <span className="font-medium">3/8</span>
              <span className="text-xs opacity-75">Cúbicas</span>
            </button>
            <button
              onClick={() => onMethodChange('composite')}
              className={`px-4 py-3 rounded-lg transition-all duration-200 flex flex-col items-center gap-2 ${
                method === 'composite'
                  ? 'bg-gradient-to-br from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/25'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-[1.02]'
              }`}
            >
              <Infinity className={`h-5 w-5 ${method === 'composite' ? 'text-white' : 'text-green-600 dark:text-green-400'}`} />
              <span className="font-medium">Compuesto</span>
              <span className="text-xs opacity-75">Adaptativo</span>
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Número de segmentos
              </label>
            </div>
            <div className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{segments}</span>
            </div>
          </div>
          <div className="relative">
            <input
              type="number"
              value={segments}
              onChange={(e) => {
                const value = parseInt(e.target.value)
                if (!isNaN(value) && value >= 2 && value <= 1000) {
                  onSegmentsChange(value)
                }
              }}
              min="2"
              max="1000"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
              {method === '1/3' && segments % 2 !== 0 && (
                <AlertCircle className="h-4 w-4 text-amber-500" />
              )}
              {method === '3/8' && segments % 3 !== 0 && (
                <AlertCircle className="h-4 w-4 text-amber-500" />
              )}
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {method === '1/3' ? 'Debe ser par' : method === '3/8' ? 'Múltiplo de 3' : 'Cualquier número ≥ 2'}
            </p>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              [2, 1000]
            </div>
          </div>
        </div>
      </div>

      {/* Slider para segmentos */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Hash className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Segmentos: {segments}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Precisión: {method === '1/3' || method === '3/8' ? 'O(h⁴)' : 'Adaptativa'}
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="100"
              step={method === '1/3' ? '2' : method === '3/8' ? '3' : '1'}
              value={segments}
              onChange={(e) => onSegmentsChange(parseInt(e.target.value))}
              className="w-full h-2 bg-gradient-to-r from-gray-200 to-blue-200 dark:from-gray-700 dark:to-blue-900/30 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Opciones avanzadas */}
      {showAdvanced && (
        <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 animate-fadeIn">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Settings className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Opciones avanzadas
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Ajustes de precisión y control de error
              </p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tolerancia (método compuesto)
            </label>
            <div className="relative">
              <input
                type="number"
                value={tolerance}
                onChange={(e) => {
                  const value = parseFloat(e.target.value)
                  if (!isNaN(value) && value > 0 && value <= 1) {
                    onToleranceChange(value)
                  }
                }}
                step="0.0001"
                min="0.000001"
                max="1"
                className="w-full pl-4 pr-12 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <span className="text-xs text-gray-500 dark:text-gray-400">ε</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <AlertCircle className="h-3 w-3 text-gray-500 dark:text-gray-400" />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Error máximo permitido para convergencia del método adaptativo
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Información del método seleccionado */}
      <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3 mb-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">
              Método de Simpson {method === '1/3' ? '1/3' : method === '3/8' ? '3/8' : 'Compuesto'}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {method === '1/3' 
                ? 'Aproxima cada subintervalo con una parábola (polinomio cuadrático)' 
                : method === '3/8'
                ? 'Aproxima cada tres subintervalos con un polinomio cúbico'
                : 'Adapta automáticamente el número de segmentos hasta alcanzar la precisión deseada'
              }
            </p>
          </div>
        </div>
        
        {method === '1/3' && segments % 2 !== 0 && (
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm mt-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>Se requiere un número par de segmentos. Se ajustará automáticamente.</span>
          </div>
        )}
        
        {method === '3/8' && segments % 3 !== 0 && (
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm mt-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>Se requiere un múltiplo de 3 segmentos. Se ajustará automáticamente.</span>
          </div>
        )}
      </div>

      {/* Botones de acción */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={handleCalculate}
          disabled={isCalculating || !!functionError || !functionInput.trim()}
          className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-[0.98]"
        >
          {isCalculating ? (
            <>
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span>Calculando...</span>
            </>
          ) : (
            <>
              <Play className="h-5 w-5" />
              <span>Calcular Integral</span>
            </>
          )}
        </button>

        <button
          onClick={handleReset}
          className="px-6 py-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2 active:scale-[0.95]"
          type="button"
          title="Restablecer valores"
        >
          <RefreshCw className="h-5 w-5" />
          <span className="sr-only lg:not-sr-only">Reiniciar</span>
        </button>
      </div>

      {/* Instrucciones */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
            <Calculator className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="font-medium mb-3 text-gray-700 dark:text-gray-300">¿Cómo usar esta calculadora?</p>
            <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <li className="flex items-start gap-2">
                <div className="p-1 rounded bg-blue-50 dark:bg-blue-900/20">
                  <Hash className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                </div>
                <span>Ingresa f(x) manualmente o selecciona un ejemplo</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="p-1 rounded bg-blue-50 dark:bg-blue-900/20">
                  <ChevronLeft className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                </div>
                <span>Define los límites de integración a y b usando los controles</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="p-1 rounded bg-blue-50 dark:bg-blue-900/20">
                  <GitBranch className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                </div>
                <span>Elige el método y ajusta el número de segmentos</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="p-1 rounded bg-blue-50 dark:bg-blue-900/20">
                  <Play className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                </div>
                <span>Haz clic en &quot;Calcular Integral&quot; para ver resultados</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}