/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/static-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Scatter, ResponsiveContainer,
  ReferenceLine
} from 'recharts'
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2,
  Target,
  Eye,
  EyeOff,
  Grid,
  Square
} from 'lucide-react'
import { Point, generatePolynomialPoints, evaluateLagrange } from '@/lib/utils/math/lagrangeInterpolation'
import toast from 'react-hot-toast'

interface LagrangeVisualizationProps {
  points: Point[]
  onPointsChange?: (points: Point[]) => void
}

interface GraphData {
  x: number
  y: number
  type: 'polynomial' | 'point'
  pointId?: string
}

export default function LagrangeVisualization({
  points,
  onPointsChange
}: LagrangeVisualizationProps) {
  const [graphData, setGraphData] = useState<GraphData[]>([])
  const [xRange, setXRange] = useState<[number, number]>([-5, 5])
  const [yRange, setYRange] = useState<[number, number]>([-5, 5])
  const [showGrid, setShowGrid] = useState(true)
  const [showPolynomial, setShowPolynomial] = useState(true)
  const [draggingPoint, setDraggingPoint] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showCoordinates, setShowCoordinates] = useState(true)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  // Generar datos del polinomio
  useEffect(() => {
    if (points.length >= 2 && showPolynomial) {
      try {
        const polynomialPoints = generatePolynomialPoints(points, 300, xRange)
        const polynomialData = polynomialPoints.map(p => ({
          ...p,
          type: 'polynomial' as const
        }))
        
        const pointData = points.map(p => ({
          x: p.x,
          y: p.y,
          type: 'point' as const,
          pointId: p.id
        }))
        
        setGraphData([...polynomialData, ...pointData])
        
        // Ajustar rango Y automáticamente
        if (polynomialPoints.length > 0) {
          const allYValues = [
            ...polynomialPoints.map(p => p.y),
            ...points.map(p => p.y)
          ].filter(y => isFinite(y))
          
          if (allYValues.length > 0) {
            const maxY = Math.max(...allYValues.map(Math.abs)) * 1.2
            const minY = Math.min(...allYValues) * 1.2
            const newYRange: [number, number] = [
              Math.min(minY, -maxY),
              Math.max(maxY, -minY)
            ]
            
            if (Math.abs(newYRange[0] - yRange[0]) > 0.1 || 
                Math.abs(newYRange[1] - yRange[1]) > 0.1) {
              setYRange(newYRange)
            }
          }
        }
      } catch (error) {
        console.error('Error generando polinomio:', error)
        // Mostrar solo puntos si hay error
        const pointData = points.map(p => ({
          x: p.x,
          y: p.y,
          type: 'point' as const,
          pointId: p.id
        }))
        setGraphData(pointData)
      }
    } else {
      // Mostrar solo puntos
      const pointData = points.map(p => ({
        x: p.x,
        y: p.y,
        type: 'point' as const,
        pointId: p.id
      }))
      setGraphData(pointData)
    }
  }, [points, xRange, showPolynomial, yRange])

  // Ajustar rango X basado en los puntos
  useEffect(() => {
    if (points.length > 0) {
      const xValues = points.map(p => p.x)
      const minX = Math.min(...xValues)
      const maxX = Math.max(...xValues)
      const padding = Math.max(2, (maxX - minX) * 0.5)
      
      const newXRange: [number, number] = [
        Math.min(minX - padding, -5),
        Math.max(maxX + padding, 5)
      ]
      
      setXRange(newXRange)
    }
  }, [points])

  // Manejar arrastre de puntos
  const handleMouseDown = useCallback((pointId: string) => {
    setDraggingPoint(pointId)
    toast('Arrastra el punto. Suelta para actualizar.', { duration: 2000 })
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!draggingPoint || !containerRef.current || !svgRef.current) return
    
    const containerRect = containerRef.current.getBoundingClientRect()
    const svgRect = svgRef.current.getBoundingClientRect()
    
    // Convertir coordenadas del mouse a coordenadas del gráfico
    const mouseX = e.clientX - svgRect.left
    const mouseY = e.clientY - svgRect.top
    
    // Convertir a valores del dominio/range de Recharts
    const xPercent = mouseX / svgRect.width
    const yPercent = mouseY / svgRect.height
    
    const newX = xRange[0] + (xRange[1] - xRange[0]) * xPercent
    const newY = yRange[0] + (yRange[1] - yRange[0]) * (1 - yPercent) // Invertir Y
    
    // Actualizar punto
    const updatedPoints = points.map(p => {
      if (p.id === draggingPoint) {
        return {
          ...p,
          x: parseFloat(newX.toFixed(2)),
          y: parseFloat(newY.toFixed(2)),
          isDragging: true
        }
      }
      return p
    })
    
    if (onPointsChange) {
      onPointsChange(updatedPoints)
    }
  }, [draggingPoint, points, onPointsChange, xRange, yRange])

  const handleMouseUp = useCallback(() => {
    if (draggingPoint) {
      setDraggingPoint(null)
      const updatedPoints = points.map(p => ({
        ...p,
        isDragging: false
      }))
      if (onPointsChange) {
        onPointsChange(updatedPoints)
      }
      toast.success('Punto actualizado')
    }
  }, [draggingPoint, points, onPointsChange])

  // Agregar event listeners para arrastre
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (draggingPoint) {
        handleMouseUp()
      }
    }
    
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (draggingPoint && svgRef.current) {
        handleMouseMove(e as unknown as React.MouseEvent<SVGSVGElement>)
      }
    }
    
    if (draggingPoint) {
      window.addEventListener('mousemove', handleGlobalMouseMove)
      window.addEventListener('mouseup', handleGlobalMouseUp)
    }
    
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove)
      window.removeEventListener('mouseup', handleGlobalMouseUp)
    }
  }, [draggingPoint, handleMouseMove, handleMouseUp])

  const handleZoomIn = () => {
    setXRange([xRange[0] * 0.8, xRange[1] * 0.8])
    setYRange([yRange[0] * 0.8, yRange[1] * 0.8])
  }

  const handleZoomOut = () => {
    setXRange([xRange[0] * 1.2, xRange[1] * 1.2])
    setYRange([yRange[0] * 1.2, yRange[1] * 1.2])
  }

  const handleResetView = () => {
    if (points.length > 0) {
      const xValues = points.map(p => p.x)
      const yValues = points.map(p => p.y)
      const padding = 2
      
      setXRange([
        Math.min(...xValues) - padding,
        Math.max(...xValues) + padding
      ])
      
      setYRange([
        Math.min(...yValues) - padding,
        Math.max(...yValues) + padding
      ])
    } else {
      setXRange([-5, 5])
      setYRange([-5, 5])
    }
    toast.success('Vista restablecida')
  }

  const toggleFullscreen = () => {
    if (!containerRef.current) return
    
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
    
    setIsFullscreen(!isFullscreen)
  }

  // Escuchar cambios de fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          {data.type === 'point' ? (
            <>
              <p className="font-semibold text-blue-600 dark:text-blue-400 mb-1">
                Punto {points.findIndex(p => p.id === data.pointId) + 1}
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">x:</span>
                  <span className="font-mono ml-2 text-gray-900 dark:text-white">
                    {data.x.toFixed(3)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">y:</span>
                  <span className="font-mono ml-2 text-gray-900 dark:text-white">
                    {data.y.toFixed(3)}
                  </span>
                </div>
              </div>
              {draggingPoint === data.pointId && (
                <div className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                  ← Arrastrando →
                </div>
              )}
            </>
          ) : (
            <>
              <p className="font-semibold text-gray-900 dark:text-white mb-1">
                Polinomio de Lagrange
              </p>
              <div className="text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">f(</span>
                  <span className="font-mono text-gray-900 dark:text-white">
                    {data.x.toFixed(3)}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">) = </span>
                  <span className="font-mono text-gray-900 dark:text-white">
                    {data.y.toFixed(3)}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      )
    }
    return null
  }

  // Renderizar punto personalizado
  const renderCustomPoint = (props: any) => {
    const { cx, cy, payload } = props
    const point = points.find(p => p.id === payload.pointId)
    const isDragging = point?.isDragging
    const pointIndex = points.findIndex(p => p.id === payload.pointId) + 1
    
    return (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r={isDragging ? 10 : 8}
          fill={isDragging ? "#f59e0b" : "#3b82f6"}
          stroke="#ffffff"
          strokeWidth={isDragging ? 3 : 2}
          style={{ cursor: 'grab' }}
          onMouseDown={() => handleMouseDown(payload.pointId)}
          className="hover:r-10 transition-all"
        />
        
        {showCoordinates && (
          <g>
            <text
              x={cx}
              y={cy - 15}
              textAnchor="middle"
              fill={isDragging ? "#f59e0b" : "#374151"}
              fontSize={12}
              fontWeight="bold"
              className="select-none"
            >
              {pointIndex}
            </text>
            <text
              x={cx}
              y={cy + 25}
              textAnchor="middle"
              fill="#6b7280"
              fontSize={10}
              className="select-none"
            >
              ({point?.x.toFixed(1)}, {point?.y.toFixed(1)})
            </text>
          </g>
        )}
        
        {/* Indicador de arrastre */}
        {isDragging && (
          <g>
            <circle
              cx={cx}
              cy={cy}
              r={12}
              fill="transparent"
              stroke="#f59e0b"
              strokeWidth={2}
              strokeDasharray="5,5"
            />
            <circle
              cx={cx}
              cy={cy}
              r={15}
              fill="transparent"
              stroke="#f59e0b"
              strokeWidth={1}
              strokeDasharray="3,3"
              opacity={0.5}
            />
          </g>
        )}
      </g>
    )
  }

  return (
    <div 
      ref={containerRef}
      className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      {/* Controles del gráfico */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">Puntos</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">Polinomio</span>
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {points.length} punto{points.length !== 1 ? 's' : ''}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              • Grado: {Math.max(0, points.length - 1)}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Controles de visibilidad */}
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-2 rounded-lg transition-colors ${showGrid ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
            title={showGrid ? 'Ocultar grid' : 'Mostrar grid'}
          >
            <Grid className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => setShowPolynomial(!showPolynomial)}
            className={`p-2 rounded-lg transition-colors ${showPolynomial ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
            title={showPolynomial ? 'Ocultar polinomio' : 'Mostrar polinomio'}
          >
            {showPolynomial ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </button>
          
          <button
            onClick={() => setShowCoordinates(!showCoordinates)}
            className={`p-2 rounded-lg transition-colors ${showCoordinates ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
            title={showCoordinates ? 'Ocultar coordenadas' : 'Mostrar coordenadas'}
          >
            <Square className="h-4 w-4" />
          </button>
          
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-1"></div>
          
          {/* Controles de zoom */}
          <button
            onClick={handleZoomOut}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          
          <button
            onClick={handleResetView}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
            title="Restablecer vista"
          >
            <Target className="h-4 w-4" />
          </button>
          
          <button
            onClick={handleZoomIn}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
            title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Área del gráfico */}
      <div className="flex-1 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            ref={svgRef}
            data={graphData.filter(d => d.type === 'polynomial')}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            {showGrid && (
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#e5e7eb" 
                strokeOpacity={0.3}
                horizontal={true}
                vertical={true}
              />
            )}
            
            <XAxis 
              dataKey="x" 
              type="number"
              domain={xRange}
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#9ca3af' }}
              tickLine={{ stroke: '#9ca3af' }}
              label={{ 
                value: 'x', 
                position: 'insideBottomRight', 
                offset: -10,
                fill: '#6b7280'
              }}
            />
            
            <YAxis 
              type="number"
              domain={yRange}
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#9ca3af' }}
              tickLine={{ stroke: '#9ca3af' }}
              label={{ 
                value: 'f(x)', 
                angle: -90, 
                position: 'insideLeft', 
                offset: 10,
                fill: '#6b7280'
              }}
            />

            <Tooltip content={<CustomTooltip />} />
            <Legend />

            {/* Línea del polinomio */}
            {showPolynomial && points.length >= 2 && (
              <Line
                type="monotone"
                dataKey="y"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={false}
                name="Polinomio de Lagrange"
                activeDot={{ r: 6, fill: '#8b5cf6' }}
                isAnimationActive={!draggingPoint}
              />
            )}

            {/* Puntos de interpolación */}
            <Scatter
              data={graphData.filter(d => d.type === 'point')}
              dataKey="y"
              fill="#3b82f6"
              name="Puntos de interpolación"
              shape={renderCustomPoint}
            />

            {/* Líneas de referencia */}
            <ReferenceLine 
              y={0} 
              stroke="#6b7280" 
              strokeWidth={1} 
              strokeDasharray="3 3"
              opacity={0.5}
            />
            
            <ReferenceLine 
              x={0} 
              stroke="#6b7280" 
              strokeWidth={1} 
              strokeDasharray="3 3"
              opacity={0.5}
            />

            {/* Líneas verticales en cada punto (si hay pocos puntos) */}
            {points.length <= 5 && points.map((point, index) => (
              <ReferenceLine
                key={`vline-${point.id}`}
                x={point.x}
                stroke="#3b82f6"
                strokeWidth={1}
                strokeDasharray="5 5"
                opacity={0.3}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Información y controles inferiores */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900/50">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <div className="text-sm">
                <span className="text-gray-600 dark:text-gray-400">Rango X: </span>
                <span className="font-mono text-gray-900 dark:text-white">
                  [{xRange[0].toFixed(1)}, {xRange[1].toFixed(1)}]
                </span>
              </div>
              
              <div className="text-sm">
                <span className="text-gray-600 dark:text-gray-400">Rango Y: </span>
                <span className="font-mono text-gray-900 dark:text-white">
                  [{yRange[0].toFixed(1)}, {yRange[1].toFixed(1)}]
                </span>
              </div>
            </div>
            
            {draggingPoint && (
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm">
                <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></div>
                <span>Modo arrastre activo - mueve el punto y suelta para actualizar</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {points.length >= 2 ? (
                <span className="text-green-600 dark:text-green-400">
                  ✓ Polinomio de grado {points.length - 1}
                </span>
              ) : (
                <span className="text-amber-600 dark:text-amber-400">
                  Agrega al menos 2 puntos
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Instrucciones de arrastre */}
        {points.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              💡 <span className="font-medium">Haz clic y arrastra</span> cualquier punto para moverlo. 
              El polinomio se actualizará automáticamente.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}