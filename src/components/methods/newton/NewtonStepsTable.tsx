/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { Download, Filter, SortAsc, SortDesc } from 'lucide-react'
import { newtonRaphson, NewtonIteration } from '@/lib/utils/math/newtonRaphson'
import toast from 'react-hot-toast'

interface NewtonStepsTableProps {
  functionStr: string
  derivativeStr: string
  initialGuess: number
  tolerance: number
  maxIterations: number
}

export default function NewtonStepsTable({
  functionStr,
  derivativeStr,
  initialGuess,
  tolerance,
  maxIterations
}: NewtonStepsTableProps) {
  const [iterations, setIterations] = useState<NewtonIteration[]>([])
  const [result, setResult] = useState<any>(null)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [showConvergence, setShowConvergence] = useState(true)

  useEffect(() => {
    try {
      const calculation = newtonRaphson(
        functionStr,
        derivativeStr,
        initialGuess,
        tolerance,
        maxIterations
      )
      setIterations(calculation.iterations)
      setResult(calculation)
    } catch (error) {
      console.error('Error en cálculo:', error)
      toast.error('Error al calcular las iteraciones')
    }
  }, [functionStr, derivativeStr, initialGuess, tolerance, maxIterations])

  const sortedIterations = [...iterations].sort((a, b) => 
    sortOrder === 'asc' ? a.iteration - b.iteration : b.iteration - a.iteration
  )

  const filteredIterations = showConvergence 
    ? sortedIterations 
    : sortedIterations.filter(iter => iter.error > tolerance)

  const handleExportCSV = () => {
    const headers = ['Iteración', 'x', 'f(x)', 'f\'(x)', 'Error']
    const csvContent = [
      headers.join(','),
      ...iterations.map(iter => [
        iter.iteration,
        iter.x.toFixed(6),
        iter.fx.toFixed(6),
        iter.fpx.toFixed(6),
        iter.error.toFixed(6)
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'newton-raphson-iterations.csv'
    a.click()
    toast.success('Datos exportados como CSV')
  }

  const handleExportJSON = () => {
    const data = {
      function: functionStr,
      derivative: derivativeStr,
      initialGuess,
      tolerance,
      maxIterations,
      result,
      iterations
    }
    
    const jsonStr = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'newton-raphson-data.json'
    a.click()
    toast.success('Datos exportados como JSON')
  }

  if (!result) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Calculando iteraciones...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Resumen de resultados */}
      <div className={`p-4 rounded-lg ${result.converged ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20' : 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {result.converged ? '✓ Convergencia alcanzada' : '⚠ No convergió'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {result.message}
            </p>
          </div>
          {result.root !== null && (
            <div className="text-right">
              <p className="text-xs text-gray-500">Raíz aproximada</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {result.root.toFixed(6)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Controles de tabla */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {sortOrder === 'asc' ? (
                <SortAsc className="h-4 w-4" />
              ) : (
                <SortDesc className="h-4 w-4" />
              )}
              Orden {sortOrder === 'asc' ? 'Ascendente' : 'Descendente'}
            </button>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showConvergence}
                onChange={(e) => setShowConvergence(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Mostrar convergencia
              </span>
            </label>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50"
          >
            <Download className="h-4 w-4" />
            CSV
          </button>
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50"
          >
            <Download className="h-4 w-4" />
            JSON
          </button>
        </div>
      </div>

      {/* Tabla de iteraciones */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Iteración
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                xₙ
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                f(xₙ)
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                f&apos;(xₙ)
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Error |xₙ₊₁ - xₙ|
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {filteredIterations.length > 0 ? (
              filteredIterations.map((iteration) => {
                const isConverged = iteration.error <= tolerance
                const isExactRoot = Math.abs(iteration.fx) < tolerance
                
                return (
                  <tr 
                    key={iteration.iteration}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-800 ${
                      isConverged ? 'bg-green-50/50 dark:bg-green-900/10' : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                          isConverged 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}>
                          {iteration.iteration}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="font-mono text-gray-900 dark:text-gray-100">
                        {iteration.x.toFixed(6)}
                      </code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className={`font-mono ${
                        Math.abs(iteration.fx) < 0.001 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-gray-900 dark:text-gray-100'
                      }`}>
                        {iteration.fx.toFixed(6)}
                      </code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="font-mono text-gray-900 dark:text-gray-100">
                        {iteration.fpx.toFixed(6)}
                      </code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <code className="font-mono text-gray-900 dark:text-gray-100 mr-3">
                          {iteration.error.toFixed(6)}
                        </code>
                        {iteration.error <= tolerance && (
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            &lt; tol
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isExactRoot ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                          f(x) ≈ 0
                        </span>
                      ) : isConverged ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Convergió
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                          Iterando
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  No hay iteraciones para mostrar
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Iteraciones totales</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {iterations.length}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Error final</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {iterations.length > 0 ? iterations[iterations.length - 1].error.toExponential(2) : 'N/A'}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Tasa convergencia</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {iterations.length > 2 
              ? ((iterations[iterations.length - 2]?.error / iterations[iterations.length - 1]?.error) || 0).toFixed(2)
              : 'N/A'}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Tiempo estimado</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {iterations.length * 50}ms
          </p>
        </div>
      </div>

      {/* Fórmula actual */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
          Fórmula aplicada
        </h4>
        <div className="flex items-center justify-between">
          <code className="font-mono text-lg bg-white dark:bg-gray-800 px-4 py-2 rounded border">
            xₙ₊₁ = xₙ - f(xₙ)/f&apos;(xₙ)
          </code>
          {iterations.length > 0 && (
            <div className="text-right">
              <p className="text-sm text-gray-500">Último cálculo:</p>
              <code className="font-mono text-gray-900 dark:text-gray-100">
                {iterations[iterations.length - 1].x.toFixed(4)} - ({iterations[iterations.length - 1].fx.toFixed(4)} / {iterations[iterations.length - 1].fpx.toFixed(4)})
              </code>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}