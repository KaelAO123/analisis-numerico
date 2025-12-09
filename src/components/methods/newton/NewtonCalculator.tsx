/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { Calculator, RefreshCw, Play, Zap, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { evaluate, derivative } from 'mathjs'

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
  onCalculate?: () => void
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
  onMaxIterationsChange,
  onCalculate
}: NewtonCalculatorProps) {
  const [isCalculating, setIsCalculating] = useState(false)
  const [functionError, setFunctionError] = useState('')
  const [derivativeError, setDerivativeError] = useState('')

  // Validar función cuando cambia
  useEffect(() => {
    if (!functionInput.trim()) {
      setFunctionError('Ingresa una función')
      return
    }

    try {
      // Intentar parsear la función
      const testExpression = functionInput.replace(/x/g, '1')
      evaluate(testExpression)
      setFunctionError('')
    } catch (error: any) {
      setFunctionError('Sintaxis inválida. Usa: x^2, sin(x), exp(x), etc.')
    }
  }, [functionInput])

  // Validar derivada cuando cambia
  useEffect(() => {
    if (!derivativeInput.trim()) {
      setDerivativeError('')
      return
    }

    try {
      const testExpression = derivativeInput.replace(/x/g, '1')
      evaluate(testExpression)
      setDerivativeError('')
    } catch (error: any) {
      setDerivativeError('Sintaxis inválida')
    }
  }, [derivativeInput])

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
    // Validar antes de calcular
    if (functionError || !functionInput.trim()) {
      toast.error('Corrige la función antes de calcular')
      return
    }

    if (derivativeInput && derivativeError) {
      toast.error('Corrige la derivada antes de calcular')
      return
    }

    if (isNaN(initialGuess) || initialGuess < -100 || initialGuess > 100) {
      toast.error('Valor inicial inválido. Usa valores entre -100 y 100')
      return
    }

    setIsCalculating(true)
    
    // Si hay un callback del padre, usarlo
    if (onCalculate) {
      onCalculate()
    }
    
    // Simular cálculo
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

  const calculateDerivative = () => {
    if (!functionInput.trim()) {
      toast.error('Ingresa una función primero')
      return
    }

    try {
      // Usar math.js para calcular la derivada simbólica
      let expr = functionInput
      
      // Reemplazar exponentes para math.js
      expr = expr.replace(/(\d+)\^(\d+)/g, 'pow($1, $2)')
      expr = expr.replace(/x\^(\d+)/g, 'pow(x, $1)')
      
      // Calcular derivada
      const deriv = derivative(expr, 'x').toString()
      
      // Convertir de nuevo a notación amigable
      const friendlyDeriv = deriv
        .replace(/pow\(x, (\d+)\)/g, 'x^$1')
        .replace(/pow\((\d+), (\d+)\)/g, '$1^$2')
        .replace(/\*/g, '')
        .replace(/(\d)(x)/g, '$1*$2')
        .replace(/(x)(\d)/g, '$1*$2')
        .replace(/\((\d+)\)/g, '$1')
      
      onDerivativeChange(friendlyDeriv)
      toast.success('Derivada calculada automáticamente')
    } catch (error: any) {
      console.error('Error calculando derivada:', error)
      
      // Fallback para casos simples
      if (functionInput.includes('x^')) {
        const match = functionInput.match(/x\^(\d+)/)
        if (match) {
          const power = parseInt(match[1])
          const newDerivative = `${power}*x^${power - 1}`
          onDerivativeChange(newDerivative)
          toast.success('Derivada calculada (caso simple)')
        } else {
          toast.error('No se pudo calcular la derivada automáticamente')
        }
      } else {
        toast.error('Ingresa una función con variable x')
      }
    }
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
            className={`w-full pl-16 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-600 dark:focus:border-blue-600 ${
              functionError 
                ? 'border-red-300 dark:border-red-700' 
                : 'border-gray-300 dark:border-gray-700'
            }`}
            placeholder="x^2 - 4"
          />
        </div>
        {functionError ? (
          <div className="flex items-center gap-1 mt-1 text-red-600 dark:text-red-400 text-xs">
            <AlertCircle className="h-3 w-3" />
            {functionError}
          </div>
        ) : (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Usa sintaxis: x^2, sin(x), cos(x), exp(x), log(x), sqrt(x), etc.
          </p>
        )}
      </div>

      {/* Entrada de derivada */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Derivada f&apos;(x)
          </label>
          <button
            onClick={calculateDerivative}
            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1"
            type="button"
          >
            <Zap className="h-3 w-3" />
            Calcular automáticamente
          </button>
        </div>
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            f&apos;(x) =
          </div>
          <input
            type="text"
            value={derivativeInput}
            onChange={(e) => onDerivativeChange(e.target.value)}
            className={`w-full pl-16 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-600 dark:focus:border-blue-600 ${
              derivativeError 
                ? 'border-red-300 dark:border-red-700' 
                : 'border-gray-300 dark:border-gray-700'
            }`}
            placeholder="2*x (opcional - se calculará si está vacío)"
          />
        </div>
        {derivativeError && (
          <div className="flex items-center gap-1 mt-1 text-red-600 dark:text-red-400 text-xs">
            <AlertCircle className="h-3 w-3" />
            {derivativeError}
          </div>
        )}
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
            onChange={(e) => {
              const value = parseFloat(e.target.value)
              if (!isNaN(value) && value >= -100 && value <= 100) {
                onInitialGuessChange(value)
              }
            }}
            step="0.1"
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Entre -100 y 100
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tolerancia
          </label>
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
            min="0.0000001"
            max="1"
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            1e-7 a 1
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Máx. Iteraciones
          </label>
          <input
            type="number"
            value={maxIterations}
            onChange={(e) => {
              const value = parseInt(e.target.value)
              if (!isNaN(value) && value >= 1 && value <= 1000) {
                onMaxIterationsChange(value)
              }
            }}
            min="1"
            max="1000"
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            1 a 1000
          </p>
        </div>
      </div>

      {/* Sliders para ajuste fino */}
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Valor inicial: {initialGuess.toFixed(2)}
            </span>
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
            onChange={(e) => {
              const logValue = parseFloat(e.target.value)
              if (!isNaN(logValue)) {
                onToleranceChange(Math.pow(10, logValue))
              }
            }}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={handleCalculate}
          disabled={isCalculating || !!functionError}
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
          type="button"
        >
          <RefreshCw className="h-5 w-5" />
        </button>

        <button
          onClick={calculateDerivative}
          disabled={!functionInput.trim() || !!functionError}
          className="px-4 py-3 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 font-medium rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
          title="Calcular derivada automáticamente"
        >
          <Zap className="h-5 w-5" />
        </button>
      </div>

      {/* Instrucciones */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Calculator className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium mb-1">Instrucciones:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Ingresa la función f(x) o selecciona un ejemplo</li>
              <li>La derivada f&apos;(x) se puede calcular automáticamente</li>
              <li>Ajusta los parámetros según necesites</li>
              <li>Haz clic en &quot;Calcular Raíz&quot; para ver resultados</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}