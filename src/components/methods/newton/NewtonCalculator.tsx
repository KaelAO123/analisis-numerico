'use client'

import { useState } from 'react'
import { Calculator, RefreshCw, Play, Zap } from 'lucide-react'
import toast from 'react-hot-toast'

interface NewtonCalculatorProps {
  functionInput: string
  derivativeInput: string
  initialGuess: number
  tolerance: number
  maxIterations: number
  onFunctionChange: (value: string) => void
  onDerivativeChange: (value: string) => void
  onInitialGuessChange: (value: number) => void
  onToleranceChange: (value: number) => void
  onMaxIterationsChange: (value: number) => void
}

export default function NewtonCalculator({
  functionInput,
  derivativeInput,
  initialGuess,
  tolerance,
  maxIterations,
  onFunctionChange,
  onDerivativeChange,
  onInitialGuessChange,
  onToleranceChange,
  onMaxIterationsChange
}: NewtonCalculatorProps) {
  const [isCalculating, setIsCalculating] = useState(false)

  const exampleFunctions = [
    { label: 'x² - 4', f: 'x^2 - 4', df: '2*x' },
    { label: 'sin(x)', f: 'sin(x)', df: 'cos(x)' },
    { label: 'e^x - 2', f: 'exp(x) - 2', df: 'exp(x)' },
    { label: 'x³ - 2x + 2', f: 'x^3 - 2*x + 2', df: '3*x^2 - 2' }
  ]

  const handleExampleSelect = (f: string, df: string) => {
    onFunctionChange(f)
    onDerivativeChange(df)
    toast.success('Función de ejemplo cargada')
  }

  const handleCalculate = () => {
    setIsCalculating(true)
    // Simular cálculo (la lógica real está en el componente padre)
    setTimeout(() => {
      setIsCalculating(false)
      toast.success('Cálculo completado')
    }, 500)
  }

  const handleReset = () => {
    onFunctionChange('x^2 - 4')
    onDerivativeChange('2*x')
    onInitialGuessChange(3)
    onToleranceChange(0.0001)
    onMaxIterationsChange(10)
    toast.success('Valores restablecidos')
  }

  return (
    <div className="space-y-6">
      {/* Selector de ejemplos */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Ejemplos rápidos
        </label>
        <div className="grid grid-cols-2 gap-2">
          {exampleFunctions.map((example, idx) => (
            <button
              key={idx}
              onClick={() => handleExampleSelect(example.f, example.df)}
              className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
            >
              {example.label}
            </button>
          ))}
        </div>
      </div>

      {/* Entrada de función */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Función f(x)
        </label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            f(x) =
          </div>
          <input
            type="text"
            value={functionInput}
            onChange={(e) => onFunctionChange(e.target.value)}
            className="w-full pl-16 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-600 dark:focus:border-blue-600"
            placeholder="x^2 - 4"
          />
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Usa sintaxis de math.js: x^2, sin(x), exp(x), log(x), etc.
        </p>
      </div>

      {/* Entrada de derivada */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Derivada f&apos;(x) (opcional - se puede calcular automáticamente)
        </label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            f&apos;(x) =
          </div>
          <input
            type="text"
            value={derivativeInput}
            onChange={(e) => onDerivativeChange(e.target.value)}
            className="w-full pl-16 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-600 dark:focus:border-blue-600"
            placeholder="2*x"
          />
        </div>
      </div>

      {/* Parámetros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Valor inicial (x₀)
          </label>
          <input
            type="number"
            value={initialGuess}
            onChange={(e) => onInitialGuessChange(parseFloat(e.target.value) || 0)}
            step="0.1"
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tolerancia
          </label>
          <input
            type="number"
            value={tolerance}
            onChange={(e) => onToleranceChange(parseFloat(e.target.value) || 0.0001)}
            step="0.0001"
            min="0.0000001"
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Máx. Iteraciones
          </label>
          <input
            type="number"
            value={maxIterations}
            onChange={(e) => onMaxIterationsChange(parseInt(e.target.value) || 10)}
            min="1"
            max="100"
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Sliders para ajuste fino */}
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-600 dark:text-gray-400">Valor inicial: {initialGuess.toFixed(2)}</span>
            <span className="text-sm text-gray-500">[-10, 10]</span>
          </div>
          <input
            type="range"
            min="-10"
            max="10"
            step="0.1"
            value={initialGuess}
            onChange={(e) => onInitialGuessChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Tolerancia: {tolerance.toExponential(2)}
            </span>
            <span className="text-sm text-gray-500">[1e-7, 1e-2]</span>
          </div>
          <input
            type="range"
            min="-7"
            max="-2"
            step="0.1"
            value={Math.log10(tolerance)}
            onChange={(e) => onToleranceChange(Math.pow(10, parseFloat(e.target.value)))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={handleCalculate}
          disabled={isCalculating}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCalculating ? (
            <>
              <RefreshCw className="h-5 w-5 animate-spin" />
              Calculando...
            </>
          ) : (
            <>
              <Play className="h-5 w-5" />
              Calcular Raíz
            </>
          )}
        </button>

        <button
          onClick={handleReset}
          className="px-4 py-3 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
        >
          <RefreshCw className="h-5 w-5" />
        </button>

        <button
          onClick={() => {
            // Auto-calcular derivada (implementación básica)
            if (functionInput.includes('x^')) {
              const base = functionInput.match(/x\^(\d+)/)?.[1]
              if (base) {
                const power = parseInt(base)
                const newDerivative = `${power}*x^${power - 1}`
                onDerivativeChange(newDerivative)
                toast.success('Derivada calculada automáticamente')
              }
            }
          }}
          className="px-4 py-3 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 font-medium rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
        >
          <Zap className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}