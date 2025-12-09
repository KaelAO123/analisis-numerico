/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import { useState, useEffect } from 'react'
import { 
  Copy, 
  Check, 
  Download, 
  Hash, 
  Calculator,
  Zap,
  AlertCircle
} from 'lucide-react'
import { Point, lagrangeInterpolation, calculateInterpolationError } from '@/lib/utils/math/lagrangeInterpolation'
import toast from 'react-hot-toast'

interface LagrangePolynomialProps {
  points: Point[]
}

export default function LagrangePolynomial({ points }: LagrangePolynomialProps) {
  const [polynomial, setPolynomial] = useState<string>('')
  const [coefficients, setCoefficients] = useState<number[]>([])
  const [error, setError] = useState<number>(0)
  const [copied, setCopied] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  // Calcular polinomio cuando cambian los puntos
  useEffect(() => {
    if (points.length >= 2) {
      try {
        const result = lagrangeInterpolation(points)
        setPolynomial(result.polynomial)
        setCoefficients(result.coefficients)
        
        // Calcular error de interpolación
        const interpolationError = calculateInterpolationError(points)
        setError(interpolationError)
      } catch (err: any) {
        console.error('Error calculando polinomio:', err)
        setPolynomial('Error al calcular el polinomio')
        setCoefficients([])
        setError(0)
      }
    } else {
      setPolynomial('Agrega al menos 2 puntos para ver el polinomio')
      setCoefficients([])
      setError(0)
    }
  }, [points])

  const handleCopyPolynomial = () => {
    navigator.clipboard.writeText(polynomial)
    setCopied(true)
    toast.success('Polinomio copiado al portapapeles')
    
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadPolynomial = () => {
    const data = {
      points: points.map(p => ({ x: p.x, y: p.y })),
      polynomial,
      coefficients,
      degree: points.length - 1,
      error,
      timestamp: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `lagrange-polynomial-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    toast.success('Polinomio exportado')
  }

  const formatCoefficient = (coeff: number, index: number): string => {
    if (Math.abs(coeff) < 1e-10) return '0'
    
    const formatted = coeff.toExponential(4)
    return `L${index} = ${formatted}`
  }

  const getPolynomialComplexity = () => {
    if (points.length < 2) return 'N/A'
    
    const degree = points.length - 1
    if (degree === 1) return 'Simple (lineal)'
    if (degree === 2) return 'Moderado (cuadrático)'
    if (degree === 3) return 'Complejo (cúbico)'
    return `Muy complejo (grado ${degree})`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Polinomio de Lagrange
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {points.length >= 2 
              ? `Grado ${points.length - 1} • ${getPolynomialComplexity()}`
              : 'Agrega puntos para generar el polinomio'
            }
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
            title={showDetails ? 'Ocultar detalles' : 'Mostrar detalles'}
          >
            <Hash className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Polinomio principal */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-600">
              <Calculator className="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white">
                Polinomio interpolante
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                P(x) = Σ [yᵢ * Lᵢ(x)]
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyPolynomial}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700 transition-colors"
              title="Copiar polinomio"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              )}
            </button>
            
            <button
              onClick={handleDownloadPolynomial}
              disabled={points.length < 2}
              className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Exportar polinomio"
            >
              <Download className="h-4 w-4 text-green-600 dark:text-green-400" />
            </button>
          </div>
        </div>

        {/* Display del polinomio */}
        <div className="mt-4">
          <div className={`bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 ${
            isExpanded ? '' : 'max-h-32 overflow-hidden'
          }`}>
            <code className="font-mono text-gray-900 dark:text-white whitespace-pre-wrap break-all">
              {polynomial}
            </code>
          </div>
          
          {polynomial.length > 200 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1"
            >
              {isExpanded ? 'Mostrar menos' : 'Mostrar más'}
            </button>
          )}
        </div>

        {/* Información de error */}
        {points.length >= 2 && error > 0 && (
          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <p className="text-sm text-amber-800 dark:text-amber-300">
                Error de interpolación estimado: {error.toExponential(4)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Detalles del polinomio (expandible) */}
      {showDetails && points.length >= 2 && (
        <div className="space-y-4">
          {/* Coeficientes de Lagrange */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-600" />
              Coeficientes de Lagrange Lᵢ
            </h4>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {coefficients.map((coeff, index) => (
                <div 
                  key={index}
                  className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    L{index}
                  </div>
                  <div className="font-mono text-sm font-medium text-gray-900 dark:text-white">
                    {formatCoefficient(coeff, index)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Punto {index + 1}: ({points[index].x.toFixed(2)}, {points[index].y.toFixed(2)})
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Información estadística */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Grado del polinomio
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {points.length - 1}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {points.length} puntos - 1
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Complejidad
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {getPolynomialComplexity()}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {points.length >= 5 ? 'Alto grado → posible oscilación' : 'Grado manejable'}
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Error estimado
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {error.toExponential(2)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {error < 0.01 ? 'Buena precisión' : 'Posible error significativo'}
              </div>
            </div>
          </div>

          {/* Fórmula de Lagrange */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Fórmula del polinomio de Lagrange
            </h4>
            <div className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700">
              <code className="font-mono text-sm text-gray-900 dark:text-white">
                P(x) = Σᵢ₌₀ⁿ yᵢ * Πⱼ₌₀,ⱼ≠ᵢⁿ (x - xⱼ)/(xᵢ - xⱼ)
              </code>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Donde n es el número de puntos - 1, yᵢ son las coordenadas Y,
              y xᵢ son las coordenadas X de los puntos de interpolación.
            </p>
          </div>
        </div>
      )}

      {/* Mensaje cuando no hay suficientes puntos */}
      {points.length < 2 && (
        <div className="text-center py-8">
          <div className="inline-flex p-3 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
            <Calculator className="h-8 w-8 text-gray-400" />
          </div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
            Esperando puntos de interpolación
          </h4>
          <p className="text-gray-600 dark:text-gray-400">
            Agrega al menos 2 puntos en el panel izquierdo para generar el polinomio de Lagrange.
          </p>
        </div>
      )}

      {/* Explicación */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">
          ¿Qué es el polinomio de Lagrange?
        </h4>
        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
          <p>
            El polinomio de Lagrange es un polinomio único de grado n-1 que pasa 
            exactamente por n puntos dados. Es particularmente útil cuando:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Necesitas una función que pase exactamente por puntos conocidos</li>
            <li>Los puntos no están equiespaciados</li>
            <li>Quieres interpolar valores entre puntos medidos</li>
            <li>Necesitas una aproximación polinómica suave</li>
          </ul>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Nota: Polinomios de alto grado pueden sufrir de oscilación (fenómeno de Runge).
            Se recomienda usar grados moderados para interpolación.
          </p>
        </div>
      </div>
    </div>
  )
}