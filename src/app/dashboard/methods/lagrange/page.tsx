'use client'

import { useState } from 'react'
import { Info, Zap, AlertCircle, Lightbulb, Target, BookOpen, TrendingUp, Cpu } from 'lucide-react'
import LagrangeCalculator from '@/components/methods/lagrange/LagrangeCalculator'
import LagrangeVisualization from '@/components/methods/lagrange/LagrangeVisualization'
import LagrangePolynomial from '@/components/methods/lagrange/LagrangePolynomial'
import { Point } from '@/lib/utils/math/lagrangeInterpolation'

export default function LagrangePage() {
  // Puntos iniciales (forman una parábola)
  const [points, setPoints] = useState<Point[]>([
    { x: -2, y: 4, id: 'point-1' },
    { x: -1, y: 1, id: 'point-2' },
    { x: 0, y: 0, id: 'point-3' },
    { x: 1, y: 1, id: 'point-4' },
    { x: 2, y: 4, id: 'point-5' }
  ])

  const [isCalculating, setIsCalculating] = useState(false)
  const [activeTab, setActiveTab] = useState<'visualization' | 'polynomial'>('visualization')
  const [showTheory, setShowTheory] = useState(false)

  const handleCalculate = () => {
    setIsCalculating(true)
    // Simular cálculo
    setTimeout(() => {
      setIsCalculating(false)
    }, 800)
  }

  const resetToDefault = () => {
    setPoints([
      { x: -2, y: 4, id: 'point-1' },
      { x: -1, y: 1, id: 'point-2' },
      { x: 0, y: 0, id: 'point-3' },
      { x: 1, y: 1, id: 'point-4' },
      { x: 2, y: 4, id: 'point-5' }
    ])
  }

  return (
    <div className="py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg">
              <Target className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                Interpolación de Lagrange
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Construye polinomios únicos que pasan exactamente por puntos dados
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowTheory(!showTheory)}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              {showTheory ? 'Ocultar teoría' : 'Ver teoría'}
            </button>
            <button
              onClick={resetToDefault}
              className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-400 rounded-lg hover:from-purple-200 hover:to-pink-200 dark:hover:from-purple-900/50 dark:hover:to-pink-900/50 transition-all flex items-center gap-2"
            >
              <Zap className="h-4 w-4" />
              Restablecer
            </button>
          </div>
        </div>

        {/* Descripción destacada */}
        <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-rose-500/10 dark:from-purple-500/5 dark:via-pink-500/5 dark:to-rose-500/5 rounded-2xl p-6 mb-6 border border-purple-200 dark:border-purple-800 backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-purple-600">
                  <Lightbulb className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Polinomios que pasan exactamente por tus puntos
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5"></div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Exactitud perfecta</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      El polinomio pasa exactamente por cada punto
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-pink-500 mt-1.5"></div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Puntos arrastrables</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Arrastra puntos para ver cambios en tiempo real
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5"></div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Sin restricciones</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Los puntos no necesitan estar equiespaciados
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:w-64 flex-shrink-0">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-purple-200 dark:border-purple-700">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <span className="font-medium text-gray-900 dark:text-white">Estadísticas</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Puntos activos:</span>
                    <span className="font-bold text-gray-900 dark:text-white">{points.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Grado polinomio:</span>
                    <span className="font-bold text-gray-900 dark:text-white">{points.length - 1}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Rango X:</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {points.length > 0 
                        ? `${Math.min(...points.map(p => p.x)).toFixed(1)} a ${Math.max(...points.map(p => p.x)).toFixed(1)}`
                        : 'N/A'
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Teoría expandible */}
      {showTheory && (
        <div className="mb-8 animate-fadeIn">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-600">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Teoría del método de Lagrange
                </h3>
              </div>
              <button
                onClick={() => setShowTheory(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  ¿Qué es la interpolación de Lagrange?
                </h4>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Es un método para encontrar un polinomio único de grado <strong>n-1</strong> que 
                  pasa exactamente por <strong>n</strong> puntos dados. A diferencia de otros métodos, 
                  no requiere que los puntos estén equiespaciados.
                </p>
                
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Fórmula del polinomio
                </h4>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-4">
                  <code className="font-mono text-sm text-gray-900 dark:text-white block">
                    P(x) = Σᵢ₌₀ⁿ yᵢ * Lᵢ(x)
                  </code>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Donde Lᵢ(x) son los polinomios de base de Lagrange.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Ventajas y desventajas
                </h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="font-medium text-gray-900 dark:text-white">Ventajas</span>
                    </div>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-5">
                      <li>• Exacto en los puntos dados</li>
                      <li>• Funciona con puntos no equiespaciados</li>
                      <li>• Polinomio único para cada conjunto</li>
                      <li>• Simple conceptualmente</li>
                    </ul>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="font-medium text-gray-900 dark:text-white">Desventajas</span>
                    </div>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-5">
                      <li>• Costo computacional O(n²)</li>
                      <li>• Inestable para muchos puntos</li>
                      <li>• Fenómeno de Runge en grados altos</li>
                      <li>• Difícil de actualizar (agregar/eliminar puntos)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Panel izquierdo: Calculadora y controles */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Control de Puntos
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${points.length >= 2 ? 'bg-green-500' : 'bg-amber-500'} animate-pulse`}></div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {points.length >= 2 ? 'Listo' : 'Faltan puntos'}
                </span>
              </div>
            </div>
            
            <LagrangeCalculator
              points={points}
              onPointsChange={setPoints}
              onCalculate={handleCalculate}
            />
          </div>

          {/* Consejos rápidos */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Consejos importantes
              </h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5"></div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">Evita grados altos</p>
                  <p className="text-gray-600 dark:text-gray-400 text-xs">
                    Más de 8 puntos pueden causar oscilaciones (Runge)
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5"></div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">Coord X únicas</p>
                  <p className="text-gray-600 dark:text-gray-400 text-xs">
                    No puede haber dos puntos con la misma coordenada X
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5"></div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">Usa arrastre</p>
                  <p className="text-gray-600 dark:text-gray-400 text-xs">
                    Haz clic y arrastra puntos en la visualización para moverlos
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Método alternativo */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Cpu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Método alternativo
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Para muchos puntos, considera usar:
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-gray-800">
                <span className="text-sm text-gray-700 dark:text-gray-300">Splines cúbicos</span>
                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  Recomendado
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-gray-800">
                <span className="text-sm text-gray-700 dark:text-gray-300">Mínimos cuadrados</span>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                  Aproximación
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Panel derecho: Visualización y resultados */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pestañas de navegación */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('visualization')}
                  className={`flex-1 px-6 py-4 text-center font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                    activeTab === 'visualization'
                      ? 'bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-600 dark:text-purple-400 border-b-2 border-purple-500'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${activeTab === 'visualization' ? 'bg-purple-500' : 'bg-gray-400'}`}></div>
                  Visualización Interactiva
                </button>
                <button
                  onClick={() => setActiveTab('polynomial')}
                  className={`flex-1 px-6 py-4 text-center font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                    activeTab === 'polynomial'
                      ? 'bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${activeTab === 'polynomial' ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
                  Polinomio Resultante
                </button>
              </div>
            </div>

            {/* Contenido de las pestañas */}
            <div className="p-6">
              {activeTab === 'visualization' ? (
                <div className="h-[500px]">
                  <LagrangeVisualization
                    points={points}
                    onPointsChange={setPoints}
                  />
                </div>
              ) : (
                <LagrangePolynomial points={points} />
              )}
            </div>
          </div>

          {/* Advertencia de Runge */}
          {points.length >= 6 && (
            <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 dark:from-amber-500/5 dark:via-orange-500/5 dark:to-red-500/5 rounded-2xl p-6 border border-amber-300 dark:border-amber-700 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="p-3 rounded-xl bg-amber-600">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    ⚠️ Advertencia: Fenómeno de Runge detectado
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Con {points.length} puntos (grado {points.length - 1}), el polinomio de Lagrange 
                    puede sufrir oscilaciones excesivas, especialmente cerca de los extremos.
                    Considera reducir el número de puntos o usar un método alternativo.
                  </p>
                </div>
                <button
                  onClick={() => setPoints(points.slice(0, 5))}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors whitespace-nowrap"
                >
                  Reducir a 5 puntos
                </button>
              </div>
            </div>
          )}

          {/* Aplicaciones prácticas */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
              🚀 Aplicaciones Prácticas
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center group">
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 group-hover:scale-110 transition-transform duration-300 mb-4">
                  <span className="text-2xl">📈</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Análisis de Datos
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Interpolación entre mediciones experimentales para estimar valores no medidos
                </p>
              </div>
              
              <div className="text-center group">
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 group-hover:scale-110 transition-transform duration-300 mb-4">
                  <span className="text-2xl">🎨</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Diseño Gráfico
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Creación de curvas suaves en diseño vectorial y animación por computadora
                </p>
              </div>
              
              <div className="text-center group">
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 group-hover:scale-110 transition-transform duration-300 mb-4">
                  <span className="text-2xl">🔧</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Ingeniería
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Aproximación de funciones complejas en simulaciones y modelado matemático
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demostración interactiva */}
      <div className="mt-8 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-rose-500/5 dark:from-purple-500/2 dark:via-pink-500/2 dark:to-rose-500/2 rounded-2xl p-8 border border-purple-200 dark:border-purple-800">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          🎯 Demostración Interactiva
        </h3>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
              Instrucciones de uso
            </h4>
            <ol className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Agrega puntos</strong> usando el panel izquierdo o arrastrándolos directamente en el gráfico
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Arrastra puntos</strong> para moverlos y observar cómo cambia el polinomio en tiempo real
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Explora el polinomio</strong> en la pestaña &quot;Polinomio Resultante&quot; para ver la fórmula exacta
                </p>
              </li>
            </ol>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
              Ejemplos rápidos para probar
            </h4>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setPoints([
                    { x: 0, y: 1, id: 'p1' },
                    { x: 1, y: 3, id: 'p2' },
                    { x: 2, y: 2, id: 'p3' }
                  ])
                  setActiveTab('visualization')
                }}
                className="w-full text-left p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-purple-500 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Línea quebrada</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">3 puntos no lineales</p>
                  </div>
                  <div className="text-purple-600 dark:text-purple-400">→</div>
                </div>
              </button>
              
              <button
                onClick={() => {
                  setPoints([
                    { x: -Math.PI, y: 0, id: 'p1' },
                    { x: -Math.PI/2, y: -1, id: 'p2' },
                    { x: 0, y: 0, id: 'p3' },
                    { x: Math.PI/2, y: 1, id: 'p4' },
                    { x: Math.PI, y: 0, id: 'p5' }
                  ])
                  setActiveTab('visualization')
                }}
                className="w-full text-left p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-purple-500 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Función seno</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">5 puntos del seno</p>
                  </div>
                  <div className="text-purple-600 dark:text-purple-400">→</div>
                </div>
              </button>
              
              <button
                onClick={() => {
                  setPoints([
                    { x: 1, y: 1, id: 'p1' },
                    { x: 2, y: 4, id: 'p2' },
                    { x: 3, y: 9, id: 'p3' },
                    { x: 4, y: 16, id: 'p4' }
                  ])
                  setActiveTab('visualization')
                }}
                className="w-full text-left p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-purple-500 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Parábola perfecta</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">4 puntos de x²</p>
                  </div>
                  <div className="text-purple-600 dark:text-purple-400">→</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Información técnica */}
      <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          <p className="mb-2">
            <strong className="text-gray-900 dark:text-white">Interpolación de Lagrange</strong> • 
            Grado máximo recomendado: 7 • 
            Puntos actuales: {points.length}
          </p>
          <p>
            Este método es exacto pero puede volverse inestable con muchos puntos.
            Usa con moderación para mejores resultados.
          </p>
        </div>
      </div>
    </div>
  )
}