/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/static-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect, useRef } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Scatter, ReferenceLine, ResponsiveContainer } from 'recharts'
import { Play, Pause, SkipBack, SkipForward, ZoomIn, ZoomOut } from 'lucide-react'
import { newtonRaphson, generateFunctionPoints, calculateTangentLine } from '@/lib/utils/math/newtonRaphson'

interface NewtonVisualizationProps {
  functionStr: string
  derivativeStr: string
  initialGuess: number
}

interface GraphPoint {
  x: number
  y: number
  type?: 'function' | 'tangent' | 'point'
  iteration?: number
}

export default function NewtonVisualization({
  functionStr,
  derivativeStr,
  initialGuess
}: NewtonVisualizationProps) {
  const [animationStep, setAnimationStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [graphData, setGraphData] = useState<GraphPoint[]>([])
  const [tangentLines, setTangentLines] = useState<GraphPoint[][]>([])
  const [iterationPoints, setIterationPoints] = useState<GraphPoint[]>([])
  const [xRange, setXRange] = useState<[number, number]>([-5, 5])
  const [yRange, setYRange] = useState<[number, number]>([-10, 10])
  const animationRef = useRef<NodeJS.Timeout>()

  // Calcular resultados
  const result = newtonRaphson(functionStr, derivativeStr, initialGuess, 0.0001, 10)
  const iterations = result.iterations

  // Generar datos de la función
  useEffect(() => {
    try {
      // Datos de la función principal
      const functionPoints = generateFunctionPoints(functionStr, xRange[0], xRange[1], 300)
      const functionData = functionPoints.map(p => ({ ...p, type: 'function' as const }))

      // Puntos de iteraciones
      const iterationData = iterations.slice(0, animationStep + 1).map((iter, idx) => ({
        x: iter.x,
        y: 0,
        type: 'point' as const,
        iteration: idx + 1
      }))

      // Líneas tangentes
      const newTangentLines = iterations.slice(0, animationStep + 1).map(iter => 
        calculateTangentLine(functionStr, derivativeStr, iter.x, 2)
      )

      setGraphData([...functionData, ...iterationData])
      setTangentLines(newTangentLines)
      setIterationPoints(iterationData)

      // Ajustar rango Y automáticamente
      const allYValues = functionPoints.map(p => p.y).filter(y => isFinite(y))
      if (allYValues.length > 0) {
        const maxY = Math.max(...allYValues.map(Math.abs)) * 1.2
        setYRange([-maxY, maxY])
      }
    } catch (error) {
      console.error('Error generating graph data:', error)
    }
  }, [functionStr, derivativeStr, initialGuess, animationStep, xRange])

  // Animación automática
  useEffect(() => {
    if (isPlaying && animationStep < iterations.length - 1) {
      animationRef.current = setTimeout(() => {
        setAnimationStep(prev => Math.min(prev + 1, iterations.length - 1))
      }, 1000)
    } else if (animationStep >= iterations.length - 1) {
      setIsPlaying(false)
    }

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current)
      }
    }
  }, [isPlaying, animationStep, iterations.length])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleStepForward = () => {
    if (animationStep < iterations.length - 1) {
      setAnimationStep(prev => prev + 1)
    }
  }

  const handleStepBackward = () => {
    if (animationStep > 0) {
      setAnimationStep(prev => prev - 1)
    }
  }

  const handleResetAnimation = () => {
    setAnimationStep(0)
    setIsPlaying(false)
  }

  const handleZoomIn = () => {
    setXRange([xRange[0] * 0.8, xRange[1] * 0.8])
  }

  const handleZoomOut = () => {
    setXRange([xRange[0] * 1.2, xRange[1] * 1.2])
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          {data.type === 'point' ? (
            <>
              <p className="font-semibold text-blue-600">Iteración {data.iteration}</p>
              <p className="text-sm">x = {data.x.toFixed(4)}</p>
              <p className="text-sm">f(x) = {iterations[data.iteration - 1]?.fx.toFixed(6)}</p>
            </>
          ) : (
            <>
              <p className="font-semibold">f({data.x.toFixed(2)})</p>
              <p className="text-sm">= {data.y.toFixed(4)}</p>
            </>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-full flex flex-col">
      {/* Controles de animación */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Animación: Paso {animationStep + 1} de {iterations.length}
          </span>
          <div className="w-48 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((animationStep + 1) / iterations.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleZoomOut}
            className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            onClick={handleZoomIn}
            className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Controles de reproducción */}
      <div className="flex justify-center gap-3 mb-6">
        <button
          onClick={handleResetAnimation}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700"
        >
          <SkipBack className="h-5 w-5" />
        </button>
        <button
          onClick={handleStepBackward}
          disabled={animationStep === 0}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          Anterior
        </button>
        <button
          onClick={handlePlayPause}
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 flex items-center gap-2"
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          {isPlaying ? 'Pausar' : 'Reproducir'}
        </button>
        <button
          onClick={handleStepForward}
          disabled={animationStep >= iterations.length - 1}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>

      {/* Gráfico */}
      <div className="flex-1 min-h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#e5e7eb" 
              strokeOpacity={0.3}
            />
            
            <XAxis 
              dataKey="x" 
              type="number"
              domain={xRange}
              tick={{ fill: '#6b7280' }}
              axisLine={{ stroke: '#9ca3af' }}
            />
            
            <YAxis 
              type="number"
              domain={yRange}
              tick={{ fill: '#6b7280' }}
              axisLine={{ stroke: '#9ca3af' }}
            />

            <Tooltip content={<CustomTooltip />} />
            <Legend />

            {/* Línea de la función */}
            <Line
              type="monotone"
              data={graphData.filter(d => d.type === 'function')}
              dataKey="y"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={false}
              name="f(x)"
            />

            {/* Líneas tangentes */}
            {tangentLines.map((line, idx) => (
              <Line
                key={idx}
                type="linear"
                data={line}
                dataKey="y"
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name={idx === tangentLines.length - 1 ? 'Tangente actual' : undefined}
                hide={idx !== tangentLines.length - 1}
              />
            ))}

            {/* Puntos de iteraciones */}
            <Scatter
              data={iterationPoints}
              fill="#10b981"
              shape={(props:any) => {
                const { cx, cy, payload } = props
                return (
                  <g>
                    <circle
                      cx={cx}
                      cy={cy}
                      r={6}
                      fill="#10b981"
                      stroke="#ffffff"
                      strokeWidth={2}
                    />
                    <text
                      x={cx}
                      y={cy - 10}
                      textAnchor="middle"
                      fill="#374151"
                      fontSize={12}
                      fontWeight="bold"
                    >
                      {payload.iteration}
                    </text>
                  </g>
                )
              }}
              name="Iteraciones"
            />

            {/* Línea y = 0 */}
            <ReferenceLine 
              y={0} 
              stroke="#6b7280" 
              strokeWidth={1} 
              strokeDasharray="3 3"
            />

            {/* Línea vertical en la iteración actual */}
            {iterationPoints.length > 0 && animationStep < iterationPoints.length && (
              <ReferenceLine 
                x={iterationPoints[animationStep]?.x} 
                stroke="#f59e0b" 
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Leyenda interactiva */}
      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          <span className="text-gray-600 dark:text-gray-400">f(x) - Función</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
          <span className="text-gray-600 dark:text-gray-400">Tangente actual</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span className="text-gray-600 dark:text-gray-400">Puntos de iteración</span>
        </div>
      </div>

      {/* Información de la iteración actual */}
      {iterations[animationStep] && (
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            Iteración {iterations[animationStep].iteration}
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <p className="text-xs text-gray-500">xₙ</p>
              <p className="font-mono">{iterations[animationStep].x.toFixed(6)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">f(xₙ)</p>
              <p className="font-mono">{iterations[animationStep].fx.toFixed(6)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">f&apos;(xₙ)</p>
              <p className="font-mono">{iterations[animationStep].fpx.toFixed(6)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Error</p>
              <p className="font-mono">{iterations[animationStep].error.toFixed(6)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}