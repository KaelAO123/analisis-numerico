'use client'

import NewtonCalculator from '@/components/methods/newton/NewtonCalculator'
import NewtonVisualization from '@/components/methods/newton/NewtonVisualization'
import NewtonStepsTable from '@/components/methods/newton/NewtonStepsTable'
import { Info, AlertCircle } from 'lucide-react'
import { useState, useCallback } from 'react'

export default function NewtonRaphsonPage() {
  const [functionInput, setFunctionInput] = useState('x^2 - 4')
  const [derivativeInput, setDerivativeInput] = useState('2*x')
  const [initialGuess, setInitialGuess] = useState(3)
  const [tolerance, setTolerance] = useState(0.0001)
  const [maxIterations, setMaxIterations] = useState(10)
  const [calculationTrigger, setCalculationTrigger] = useState(0)

  const handleCalculate = useCallback(() => {
    // Incrementar el trigger para forzar re-render de componentes hijos
    setCalculationTrigger(prev => prev + 1)
  }, [])

  return (
    <div className="py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Método de Newton-Raphson
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Encuentra raíces de ecuaciones mediante aproximaciones sucesivas usando la fórmula: xₙ₊₁ = xₙ - f(xₙ)/f&apos;(xₙ)
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Panel izquierdo: Calculadora y controles */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 mr-3">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Configuración
              </h2>
            </div>
            
            <NewtonCalculator
              functionInput={functionInput}
              derivativeInput={derivativeInput}
              initialGuess={initialGuess}
              tolerance={tolerance}
              maxIterations={maxIterations}
              onFunctionChange={setFunctionInput}
              onDerivativeChange={setDerivativeInput}
              onInitialGuessChange={setInitialGuess}
              onToleranceChange={setTolerance}
              onMaxIterationsChange={setMaxIterations}
              onCalculate={handleCalculate}
            />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Resultados
            </h3>
            <NewtonStepsTable
              functionStr={functionInput}
              derivativeStr={derivativeInput}
              initialGuess={initialGuess}
              tolerance={tolerance}
              maxIterations={maxIterations}
              key={calculationTrigger} // Forzar re-render al calcular
            />
          </div>
        </div>

        {/* Panel derecho: Visualización */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Visualización
            </h2>
            {(!functionInput.trim() || !derivativeInput.trim()) && (
              <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                <AlertCircle className="h-4 w-4" />
                Completa los campos para ver la gráfica
              </div>
            )}
          </div>
          <div className="h-[500px]">
            <NewtonVisualization
              functionStr={functionInput}
              derivativeStr={derivativeInput}
              initialGuess={initialGuess}
              key={`${functionInput}-${derivativeInput}-${initialGuess}`} // Forzar re-render
            />
          </div>
        </div>
      </div>

      <div className="mt-8 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          💡 Teoría del Método
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-3">
          El método de Newton-Raphson es un algoritmo iterativo para encontrar raíces de funciones diferenciables. 
          Utiliza la idea de aproximación lineal: en cada punto, aproximamos la función por su recta tangente.
        </p>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
          <li>Requiere la derivada de la función</li>
          <li>Convergencia cuadrática cerca de la raíz</li>
          <li>Puede divergir si la derivada es cero</li>
          <li>Elegir un buen valor inicial es crucial</li>
        </ul>
      </div>
    </div>
  )
}