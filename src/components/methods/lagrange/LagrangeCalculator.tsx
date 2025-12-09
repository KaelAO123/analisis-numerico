/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Trash2, 
  RefreshCw, 
  Download, 
  Upload,
  Zap,
  AlertCircle,
  CheckCircle,
  Grid,
  ScatterChart
} from 'lucide-react'
import toast from 'react-hot-toast'
import { Point } from '@/lib/utils/math/lagrangeInterpolation'

interface LagrangeCalculatorProps {
  points: Point[]
  onPointsChange: (points: Point[]) => void
  onCalculate?: () => void
}

export default function LagrangeCalculator({
  points,
  onPointsChange,
  onCalculate
}: LagrangeCalculatorProps) {
  const [isCalculating, setIsCalculating] = useState(false)
  const [newPointX, setNewPointX] = useState('')
  const [newPointY, setNewPointY] = useState('')
  const [gridVisible, setGridVisible] = useState(true)

  // Ejemplos predefinidos
  const examples = [
    {
      name: 'Línea recta',
      points: [
        { x: -2, y: -2, id: '1' },
        { x: 2, y: 2, id: '2' }
      ],
      description: 'Dos puntos en línea recta'
    },
    {
      name: 'Parábola',
      points: [
        { x: -2, y: 4, id: '1' },
        { x: 0, y: 0, id: '2' },
        { x: 2, y: 4, id: '3' }
      ],
      description: 'Tres puntos que forman una parábola'
    },
    {
      name: 'Función seno',
      points: [
        { x: -Math.PI, y: 0, id: '1' },
        { x: -Math.PI/2, y: -1, id: '2' },
        { x: 0, y: 0, id: '3' },
        { x: Math.PI/2, y: 1, id: '4' },
        { x: Math.PI, y: 0, id: '5' }
      ],
      description: 'Puntos de la función seno'
    },
    {
      name: 'Polinomio cúbico',
      points: [
        { x: -3, y: -27, id: '1' },
        { x: -1, y: -1, id: '2' },
        { x: 1, y: 1, id: '3' },
        { x: 3, y: 27, id: '4' }
      ],
      description: 'Puntos de x³'
    }
  ]

  // Validar puntos
  const validatePoints = () => {
    if (points.length < 2) {
      return { valid: false, message: 'Se necesitan al menos 2 puntos' }
    }

    // Verificar que no haya puntos con misma x
    const xValues = points.map(p => p.x)
    const uniqueXValues = new Set(xValues)
    if (uniqueXValues.size !== xValues.length) {
      return { valid: false, message: 'No puede haber dos puntos con la misma coordenada x' }
    }

    return { valid: true, message: '' }
  }

  const handleAddPoint = () => {
    const x = parseFloat(newPointX)
    const y = parseFloat(newPointY)

    if (isNaN(x) || isNaN(y)) {
      toast.error('Ingresa valores numéricos válidos')
      return
    }

    // Verificar que no exista punto con misma x
    if (points.some(p => Math.abs(p.x - x) < 0.001)) {
      toast.error('Ya existe un punto con esta coordenada x')
      return
    }

    const newPoint: Point = {
      x,
      y,
      id: `point-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }

    const updatedPoints = [...points, newPoint]
    onPointsChange(updatedPoints)
    
    setNewPointX('')
    setNewPointY('')
    toast.success('Punto agregado')
  }

  const handleRemovePoint = (id: string) => {
    const updatedPoints = points.filter(point => point.id !== id)
    onPointsChange(updatedPoints)
    toast.success('Punto eliminado')
  }

  const handleClearAll = () => {
    onPointsChange([])
    toast.success('Todos los puntos eliminados')
  }

  const handleExampleSelect = (examplePoints: Point[]) => {
    onPointsChange(examplePoints)
    toast.success('Ejemplo cargado')
  }

  const handleCalculate = () => {
    const validation = validatePoints()
    if (!validation.valid) {
      toast.error(validation.message || 'Error en los puntos')
      return
    }

    setIsCalculating(true)
    
    if (onCalculate) {
      onCalculate()
    }
    
    setTimeout(() => {
      setIsCalculating(false)
      toast.success('Interpolación calculada')
    }, 500)
  }

  const handleExportPoints = () => {
    const data = {
      points: points.map(p => ({ x: p.x, y: p.y })),
      timestamp: new Date().toISOString(),
      count: points.length
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `lagrange-points-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    toast.success('Puntos exportados')
  }

  const handleImportPoints = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const data = JSON.parse(content)
        
        if (!data.points || !Array.isArray(data.points)) {
          throw new Error('Formato inválido')
        }

        const importedPoints: Point[] = data.points.map((p: any, index: number) => ({
          x: p.x,
          y: p.y,
          id: `imported-${Date.now()}-${index}`
        }))

        onPointsChange(importedPoints)
        toast.success(`${importedPoints.length} puntos importados`)
      } catch (error) {
        toast.error('Error al importar puntos')
      }
    }
    reader.readAsText(file)
    
    // Limpiar input
    event.target.value = ''
  }

  const handleRandomPoints = () => {
    const count = Math.floor(Math.random() * 5) + 3 // 3-7 puntos
    const newPoints: Point[] = []
    
    for (let i = 0; i < count; i++) {
      const x = Math.round((Math.random() * 8 - 4) * 10) / 10 // -4.0 a 4.0
      const y = Math.round((Math.random() * 8 - 4) * 10) / 10 // -4.0 a 4.0
      
      newPoints.push({
        x,
        y,
        id: `random-${Date.now()}-${i}`
      })
    }
    
    onPointsChange(newPoints)
    toast.success(`${count} puntos aleatorios generados`)
  }

  // Efecto para validar cuando cambian los puntos
  useEffect(() => {
    const validation = validatePoints()
    if (!validation.valid && points.length >= 2) {
      // Solo mostrar error si hay puntos pero son inválidos
      toast.error(validation.message)
    }
  }, [points])

  const validation = validatePoints()
  const hasEnoughPoints = points.length >= 2
  const hasDuplicateX = points.length !== new Set(points.map(p => p.x)).size

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Puntos de Interpolación
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {points.length} punto{points.length !== 1 ? 's' : ''} definido{points.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setGridVisible(!gridVisible)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            title={gridVisible ? 'Ocultar grid' : 'Mostrar grid'}
          >
            <Grid className={`h-4 w-4 ${gridVisible ? 'text-blue-600' : 'text-gray-600'}`} />
          </button>
        </div>
      </div>

      {/* Estado de validación */}
      {points.length > 0 && (
        <div className={`p-3 rounded-lg ${
          validation.valid 
            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
        }`}>
          <div className="flex items-center gap-3">
            {validation.valid ? (
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            )}
            <div>
              <p className={`text-sm font-medium ${
                validation.valid 
                  ? 'text-green-800 dark:text-green-300' 
                  : 'text-red-800 dark:text-red-300'
              }`}>
                {validation.valid ? '✓ Puntos válidos para interpolación' : validation.message}
              </p>
              {hasEnoughPoints && (
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Grado del polinomio: {points.length - 1}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Ejemplos rápidos */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Ejemplos predefinidos
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {examples.map((example, idx) => (
            <button
              key={idx}
              onClick={() => handleExampleSelect(example.points)}
              className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-300 text-center truncate group relative"
              title={example.description}
            >
              <div className="truncate">{example.name}</div>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                {example.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Agregar nuevo punto */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Agregar nuevo punto
        </h4>
        
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              Coordenada X
            </label>
            <input
              type="number"
              value={newPointX}
              onChange={(e) => setNewPointX(e.target.value)}
              step="0.1"
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.0"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              Coordenada Y
            </label>
            <input
              type="number"
              value={newPointY}
              onChange={(e) => setNewPointY(e.target.value)}
              step="0.1"
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.0"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleAddPoint}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all text-sm font-medium"
          >
            Agregar punto
          </button>
          
          <button
            onClick={handleRandomPoints}
            className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors text-sm font-medium"
            title="Generar puntos aleatorios"
          >
            <Zap className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Lista de puntos */}
      {points.length > 0 && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ScatterChart className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Puntos definidos
                </span>
              </div>
              <button
                onClick={handleClearAll}
                className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 flex items-center gap-1"
              >
                <Trash2 className="h-3 w-3" />
                Limpiar todo
              </button>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-64 overflow-y-auto">
            {points.map((point, index) => (
              <div 
                key={point.id}
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold">
                    {index + 1}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="text-sm">
                        <span className="text-gray-600 dark:text-gray-400">x = </span>
                        <span className="font-mono font-bold text-gray-900 dark:text-white">
                          {point.x.toFixed(2)}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600 dark:text-gray-400">y = </span>
                        <span className="font-mono font-bold text-gray-900 dark:text-white">
                          {point.y.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      ID: {point.id.substring(0, 8)}...
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => handleRemovePoint(point.id)}
                  className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400"
                  title="Eliminar punto"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Controles de archivo */}
      <div className="flex flex-col sm:flex-row gap-3">
        <label className="flex-1">
          <div className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer text-gray-700 dark:text-gray-300 text-sm font-medium">
            <Upload className="h-4 w-4" />
            Importar puntos
            <input
              type="file"
              accept=".json"
              onChange={handleImportPoints}
              className="hidden"
            />
          </div>
        </label>
        
        <button
          onClick={handleExportPoints}
          disabled={points.length === 0}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-green-700 dark:text-green-400 text-sm font-medium"
        >
          <Download className="h-4 w-4" />
          Exportar puntos
        </button>
      </div>

      {/* Botones de acción */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={handleCalculate}
          disabled={isCalculating || !validation.valid || points.length < 2}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          {isCalculating ? (
            <>
              <RefreshCw className="h-5 w-5 animate-spin" />
              Calculando...
            </>
          ) : (
            <>
              Calcular Polinomio
            </>
          )}
        </button>
      </div>

      {/* Estadísticas */}
      {points.length >= 2 && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">
            Estadísticas de puntos
          </h4>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400">Total puntos</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{points.length}</p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400">Grado polinomio</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{points.length - 1}</p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400">Rango X</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {Math.min(...points.map(p => p.x)).toFixed(1)} - {Math.max(...points.map(p => p.x)).toFixed(1)}
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400">Rango Y</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {Math.min(...points.map(p => p.y)).toFixed(1)} - {Math.max(...points.map(p => p.y)).toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Instrucciones */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-3 text-sm">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
            <ScatterChart className="h-4 w-4" />
          </div>
          <div>
            <p className="font-medium mb-2 text-gray-700 dark:text-gray-300">Instrucciones:</p>
            <ul className="text-gray-600 dark:text-gray-400 space-y-1">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></div>
                <span>Agrega puntos usando coordenadas X e Y</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></div>
                <span>Los puntos se pueden arrastrar en la visualización</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></div>
                <span>No puede haber dos puntos con la misma coordenada X</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></div>
                <span>El grado del polinomio es (número de puntos - 1)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}