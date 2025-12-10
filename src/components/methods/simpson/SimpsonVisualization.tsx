/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable react-hooks/static-components */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Palette,
  Eye,
  EyeOff,
  Grid,
  Layers,
  Target,
  Download,
  RotateCcw,
  Settings,
  BarChart3,
  LineChart as LineChartIcon,
  AreaChart,
  TrendingUp,
  Filter,
  Type,
  AlertCircle,
  Info,
  RefreshCw,
} from "lucide-react";
import { SimpsonResult } from "@/lib/utils/math/simpsonIntegration";
import toast from "react-hot-toast";

interface SimpsonVisualizationProps {
  functionStr: string;
  lowerLimit: number;
  upperLimit: number;
  result: SimpsonResult | null;
  showParabolas: boolean;
  onShowParabolasChange: (show: boolean) => void;
}

interface Point {
  x: number;
  y: number;
}

interface SegmentArea {
  points: Point[];
  color: string;
  area: number;
  index: number;
}

export default function SimpsonVisualization({
  functionStr,
  lowerLimit,
  upperLimit,
  result,
  showParabolas,
  onShowParabolasChange,
}: SimpsonVisualizationProps) {
  const [functionPoints, setFunctionPoints] = useState<Point[]>([]);
  const [segmentAreas, setSegmentAreas] = useState<SegmentArea[]>([]);
  const [xRange, setXRange] = useState<[number, number]>([-5, 5]);
  const [yRange, setYRange] = useState<[number, number]>([-5, 5]);
  const [showGrid, setShowGrid] = useState(true);
  const [showFunction, setShowFunction] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [colorMode, setColorMode] = useState<"gradient" | "solid" | "pattern">(
    "gradient"
  );
  const [showAxes, setShowAxes] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Colores para los segmentos - colores HEX simples
  const segmentColors = [
    "#3b82f6", // blue-500
    "#8b5cf6", // violet-500
    "#10b981", // emerald-500
    "#f59e0b", // amber-500
    "#ef4444", // red-500
    "#ec4899", // pink-500
    "#06b6d4", // cyan-500
    "#84cc16", // lime-500
    "#f97316", // orange-500
    "#a855f7", // purple-500
  ];

  // Evaluar función matemática usando mathjs
  const evaluateFunction = useCallback((x: number): number => {
    if (!functionStr.trim()) return 0;
    
    try {
      // Usar mathjs para evaluar
      const math = require('mathjs');
      const result = math.evaluate(functionStr, { x: x });
      return typeof result === "number" && isFinite(result) ? result : 0;
    } catch (error) {
      console.error("Error evaluando función con mathjs:", error, "para x =", x);
      
      // Fallback a evaluación nativa
      try {
        const expression = functionStr
          .replace(/\^/g, "**")
          .replace(/sin\(/g, "Math.sin(")
          .replace(/cos\(/g, "Math.cos(")
          .replace(/tan\(/g, "Math.tan(")
          .replace(/exp\(/g, "Math.exp(")
          .replace(/log\(/g, "Math.log(")
          .replace(/sqrt\(/g, "Math.sqrt(")
          .replace(/abs\(/g, "Math.abs(")
          .replace(/pi/g, "Math.PI")
          .replace(/e/g, "Math.E");

        const func = new Function("x", `return ${expression};`);
        const result = func(x);
        return typeof result === "number" && isFinite(result) ? result : 0;
      } catch (fallbackError) {
        console.error("Error en evaluación fallback:", fallbackError);
        return 0;
      }
    }
  }, [functionStr]);

  // Generar puntos para la función
  const generateFunctionData = useCallback(() => {
    const points: Point[] = [];
    const samples = 300;
    const step = (xRange[1] - xRange[0]) / samples;
    
    for (let i = 0; i <= samples; i++) {
      const x = xRange[0] + i * step;
      const y = evaluateFunction(x);
      if (isFinite(y)) {
        points.push({ x, y });
      }
    }
    
    console.log("Datos de función generados:", points.length, "puntos");
    return points;
  }, [xRange, evaluateFunction]);

  // Generar áreas de segmentos basadas en el resultado
  const generateSegmentAreas = useCallback(() => {
    if (!result || !result.segments || result.segments.length === 0) {
      console.log("No hay segmentos para generar áreas");
      return [];
    }
    
    console.log("Generando áreas para", result.segments.length, "segmentos");
    
    const areas: SegmentArea[] = [];
    
    result.segments.forEach((segment, index) => {
      console.log(`Procesando segmento ${index}: a=${segment.a}, b=${segment.b}, area=${segment.area}`);
      
      // Crear puntos para el área del segmento - MÁS PUNTOS
      const points: Point[] = [];
      const segmentSamples = 30; // Incrementado para mejor visualización
      
      // Punto inicial en el eje x (y=0)
      points.push({ x: segment.a, y: 0 });
      
      // Puntos intermedios de la función
      for (let i = 0; i <= segmentSamples; i++) {
        const x = segment.a + (i / segmentSamples) * (segment.b - segment.a);
        const y = evaluateFunction(x);
        if (isFinite(y)) {
          points.push({ x, y });
        } else {
          points.push({ x, y: 0 });
        }
      }
      
      // Punto final en el eje x (y=0) - CERRAR EL ÁREA
      points.push({ x: segment.b, y: 0 });
      
      console.log(`Segmento ${index} generó ${points.length} puntos`, points);
      
      // Asegurar que tenemos al menos 3 puntos
      if (points.length >= 3) {
        areas.push({
          points,
          color: segmentColors[index % segmentColors.length],
          area: segment.area || 0,
          index,
        });
      } else {
        console.warn(`Segmento ${index} no tiene suficientes puntos:`, points.length);
      }
    });
    
    console.log("Áreas generadas:", areas.length);
    return areas;
  }, [result, evaluateFunction]);

  // Efecto para generar datos de la función
  useEffect(() => {
    if (!functionStr.trim()) return;

    setIsLoading(true);
    try {
      const data = generateFunctionData();
      setFunctionPoints(data);

      // Ajustar rango Y automáticamente
      if (data.length > 0) {
        const yValues = data.map(p => p.y).filter(y => isFinite(y));
        if (yValues.length > 0) {
          const maxY = Math.max(...yValues);
          const minY = Math.min(...yValues);
          const padding = Math.max(Math.abs(maxY - minY) * 0.2, 0.5);
          const newYRange: [number, number] = [minY - padding, maxY + padding];
          setYRange(newYRange);
          console.log("Rango Y ajustado:", newYRange);
        }
      }
    } catch (error) {
      console.error("Error generando gráfico:", error);
      toast.error("Error al generar el gráfico");
    } finally {
      setIsLoading(false);
    }
  }, [functionStr, xRange, generateFunctionData]);

  // Ajustar rango X basado en los límites
  useEffect(() => {
    const padding = Math.max(0.5, (upperLimit - lowerLimit) * 0.2);
    const newXRange: [number, number] = [
      Math.min(lowerLimit - padding, -5),
      Math.max(upperLimit + padding, 5),
    ];
    setXRange(newXRange);
    console.log("Rango X ajustado:", newXRange);
  }, [lowerLimit, upperLimit]);

  // Generar áreas de segmentos
  useEffect(() => {
    if (!result || !showParabolas) {
      setSegmentAreas([]);
      return;
    }

    try {
      const areas = generateSegmentAreas();
      setSegmentAreas(areas);
    } catch (error) {
      console.error("Error generando segmentos:", error);
      setSegmentAreas([]);
    }
  }, [result, showParabolas, generateSegmentAreas]);

  // Funciones de control
  const handleZoomIn = () => {
    const centerX = (xRange[0] + xRange[1]) / 2;
    const centerY = (yRange[0] + yRange[1]) / 2;
    const newWidth = (xRange[1] - xRange[0]) * 0.8;
    const newHeight = (yRange[1] - yRange[0]) * 0.8;

    setXRange([centerX - newWidth / 2, centerX + newWidth / 2]);
    setYRange([centerY - newHeight / 2, centerY + newHeight / 2]);

    toast.success("Zoom aumentado");
  };

  const handleZoomOut = () => {
    const centerX = (xRange[0] + xRange[1]) / 2;
    const centerY = (yRange[0] + yRange[1]) / 2;
    const newWidth = (xRange[1] - xRange[0]) * 1.2;
    const newHeight = (yRange[1] - yRange[0]) * 1.2;

    setXRange([centerX - newWidth / 2, centerX + newWidth / 2]);
    setYRange([centerY - newHeight / 2, centerY + newHeight / 2]);

    toast.success("Zoom reducido");
  };

  const handleResetView = () => {
    const padding = Math.max(0.5, (upperLimit - lowerLimit) * 0.2);
    const newXRange: [number, number] = [
      Math.min(lowerLimit - padding, -5),
      Math.max(upperLimit + padding, 5),
    ];
    setXRange(newXRange);

    // Recalcular rango Y
    try {
      const step = (upperLimit - lowerLimit) / 50;
      const yValues: number[] = [];
      
      for (let i = 0; i <= 50; i++) {
        const x = lowerLimit + i * step;
        const y = evaluateFunction(x);
        if (isFinite(y)) {
          yValues.push(y);
        }
      }
      
      if (yValues.length > 0) {
        const maxY = Math.max(...yValues);
        const minY = Math.min(...yValues);
        const paddingY = Math.max(Math.abs(maxY - minY) * 0.2, 0.5);
        setYRange([minY - paddingY, maxY + paddingY]);
      }
    } catch {
      setYRange([-5, 5]);
    }

    toast.success("Vista restablecida");
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Escuchar cambios de fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const handleExportImage = () => {
    toast.success("Funcionalidad de exportación en desarrollo");
  };

  const totalArea = segmentAreas.reduce((sum, segment) => sum + segment.area, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload;
      
      return (
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-blue-600">
              <LineChartIcon className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                Función f(x)
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Punto de la función
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-gray-500 dark:text-gray-400">Coordenada X</p>
              <p className="font-mono font-bold text-gray-900 dark:text-white">
                {point.x.toFixed(4)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-gray-500 dark:text-gray-400">Valor Y</p>
              <p className="font-mono font-bold text-gray-900 dark:text-white">
                {point.y.toFixed(4)}
              </p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Obtener el fillOpacity basado en el colorMode
  const getFillOpacity = () => {
    return colorMode === "solid" ? 0.4 : colorMode === "gradient" ? 0.3 : 0.2;
  };

  // Definir gradientes para cada segmento
  const renderSegmentGradients = () => {
    return segmentAreas.map((segment, index) => (
      <linearGradient
        key={`gradient-${index}`}
        id={`gradient-${index}`}
        x1="0"
        y1="0"
        x2="0"
        y2="1"
      >
        <stop offset="0%" stopColor={segment.color} stopOpacity={0.6} />
        <stop offset="100%" stopColor={segment.color} stopOpacity={0.1} />
      </linearGradient>
    ));
  };

  return (
    <div
      ref={containerRef}
      className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      {/* Header con información */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-800/50">
        <div className="flex items-center gap-4 mb-4 sm:mb-0">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 shadow-lg">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Visualización de la Integral
            </h3>
            <div className="flex flex-wrap items-center gap-3 mt-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Función f(x)
                </span>
              </div>
              {result && (
                <>
                  <div className="w-px h-4 bg-gray-300 dark:bg-gray-700"></div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {result.segments.length} áreas de Simpson
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              ∫ [{lowerLimit.toFixed(2)}, {upperLimit.toFixed(2)}]
            </span>
          </div>
        </div>
      </div>

      {/* Controles del gráfico */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30">
        <div className="flex flex-wrap items-center gap-2">
          {/* Grupo: Visualización */}
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 mr-2">
              Ver:
            </span>
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`p-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                showGrid
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
              title={showGrid ? "Ocultar cuadrícula" : "Mostrar cuadrícula"}
            >
              <Grid className="h-4 w-4" />
            </button>

            <button
              onClick={() => setShowFunction(!showFunction)}
              className={`p-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                showFunction
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
              title={showFunction ? "Ocultar función" : "Mostrar función"}
            >
              {showFunction ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </button>

            <button
              onClick={() => onShowParabolasChange(!showParabolas)}
              className={`p-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                showParabolas
                  ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
              title={showParabolas ? "Ocultar áreas" : "Mostrar áreas"}
            >
              <Layers className="h-4 w-4" />
            </button>
          </div>

          {/* Grupo: Colores */}
          <div className="flex items-center gap-1">
            <button
              onClick={() =>
                setColorMode(
                  colorMode === "gradient"
                    ? "solid"
                    : colorMode === "solid"
                    ? "pattern"
                    : "gradient"
                )
              }
              className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-all duration-200"
              title={`Modo color: ${
                colorMode === "gradient"
                  ? "Gradiente"
                  : colorMode === "solid"
                  ? "Sólido"
                  : "Patrón"
              }`}
            >
              <Palette className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Grupo: Zoom y navegación */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleZoomOut}
              className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-all duration-200"
              title="Alejar (Zoom Out)"
            >
              <ZoomOut className="h-4 w-4" />
            </button>

            <button
              onClick={handleResetView}
              className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-all duration-200"
              title="Restablecer vista"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            <button
              onClick={handleZoomIn}
              className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-all duration-200"
              title="Acercar (Zoom In)"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
          </div>

          {/* Grupo: Acciones */}
          <div className="flex items-center gap-1">
            <button
              onClick={toggleFullscreen}
              className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-all duration-200"
              title={
                isFullscreen
                  ? "Salir de pantalla completa"
                  : "Pantalla completa"
              }
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Área del gráfico */}
      <div className="flex-1 min-h-[400px] p-4 md:p-6">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Generando gráfico...
              </p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%" minHeight={400}>
            <LineChart
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <defs>
                {renderSegmentGradients()}
              </defs>

              {showGrid && (
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                  strokeOpacity={0.3}
                />
              )}

              {showAxes && (
                <>
                  <XAxis
                    type="number"
                    dataKey="x"
                    domain={xRange}
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                    axisLine={{ stroke: "#9ca3af", strokeWidth: 1.5 }}
                    tickLine={{ stroke: "#9ca3af" }}
                    label={{
                      value: "x",
                      position: "insideBottomRight",
                      offset: -10,
                      fill: "#6b7280",
                      fontSize: 14,
                    }}
                  />

                  <YAxis
                    type="number"
                    domain={yRange}
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                    axisLine={{ stroke: "#9ca3af", strokeWidth: 1.5 }}
                    tickLine={{ stroke: "#9ca3af" }}
                    label={{
                      value: "f(x)",
                      angle: -90,
                      position: "insideLeft",
                      offset: 10,
                      fill: "#6b7280",
                      fontSize: 14,
                    }}
                  />
                </>
              )}

              <Tooltip content={<CustomTooltip />} />
              
              {showLegend && (
                <Legend
                  verticalAlign="top"
                  height={36}
                  iconSize={12}
                  iconType="circle"
                />
              )}

              {/* Áreas de segmentos - COMPONENTES SEPARADOS */}
              {showParabolas && segmentAreas.map((segment) => (
                <Area
                  key={`segment-${segment.index}`}
                  data={segment.points}
                  type="linear"
                  dataKey="y"
                  stroke={segment.color}
                  fill={colorMode === "gradient" ? `url(#gradient-${segment.index})` : segment.color}
                  fillOpacity={getFillOpacity()}
                  strokeWidth={1}
                  strokeDasharray={colorMode === "pattern" ? "5,5" : undefined}
                  name={`Segmento ${segment.index + 1}`}
                  isAnimationActive={true}
                  animationDuration={800}
                  connectNulls={true}
                  activeDot={{ r: 4, fill: segment.color }}
                />
              ))}

              {/* Línea de la función - DEBE IR DESPUÉS DE LAS ÁREAS */}
              {showFunction && (
                <Line
                  type="monotone"
                  data={functionPoints}
                  dataKey="y"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 8, fill: "#3b82f6", stroke: "#fff", strokeWidth: 2 }}
                  name="f(x)"
                  isAnimationActive={true}
                  animationDuration={1500}
                  connectNulls={true}
                />
              )}

              {/* Líneas de referencia para límites */}
              <ReferenceLine
                x={lowerLimit}
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="5 5"
                label={{
                  value: `a = ${lowerLimit.toFixed(2)}`,
                  position: "insideTopLeft",
                  fill: "#ef4444",
                  fontSize: 12,
                }}
              />

              <ReferenceLine
                x={upperLimit}
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="5 5"
                label={{
                  value: `b = ${upperLimit.toFixed(2)}`,
                  position: "insideTopRight",
                  fill: "#10b981",
                  fontSize: 12,
                }}
              />

              {/* Línea y = 0 */}
              <ReferenceLine
                y={0}
                stroke="#6b7280"
                strokeWidth={1}
                strokeDasharray="3 3"
                opacity={0.5}
              />

              {/* Líneas divisorias de segmentos */}
              {result && result.segments.map((segment, index) => (
                <ReferenceLine
                  key={`divider-${index}`}
                  x={segment.a}
                  stroke="#9ca3af"
                  strokeWidth={1}
                  strokeDasharray="2 2"
                  opacity={0.3}
                />
              ))}

              {result && result.segments.length > 0 && (
                <ReferenceLine
                  x={result.segments[result.segments.length - 1].b}
                  stroke="#9ca3af"
                  strokeWidth={1}
                  strokeDasharray="2 2"
                  opacity={0.3}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Información y controles inferiores */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-5 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900/30 dark:to-gray-800/30">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-4 mb-3">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Información del gráfico
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Rango X:{" "}
                  </span>
                  <span className="font-mono text-gray-900 dark:text-white">
                    [{xRange[0].toFixed(1)}, {xRange[1].toFixed(1)}]
                  </span>
                </div>

                <div className="text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Rango Y:{" "}
                  </span>
                  <span className="font-mono text-gray-900 dark:text-white">
                    [{yRange[0].toFixed(1)}, {yRange[1].toFixed(1)}]
                  </span>
                </div>

                {result && (
                  <div className="text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Segmentos:{" "}
                    </span>
                    <span className="font-mono font-bold text-gray-900 dark:text-white">
                      {result.segments.length}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Leyenda de colores */}
            {result && showParabolas && segmentAreas.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                  <Filter className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Segmentos principales (área total):
                  </span>
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">
                    {totalArea.toFixed(6)}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3">
                  {segmentAreas.slice(0, 6).map((segment, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
                      title={`Segmento ${segment.index + 1}: ${segment.area.toFixed(4)}`}
                    >
                      <div
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: segment.color }}
                      ></div>
                      <span className="text-xs font-medium text-gray-900 dark:text-white">
                        S{segment.index + 1}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {segment.area.toFixed(3)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {result && (
            <div className="flex flex-col items-end">
              <div className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                ∫ ≈ {result.integral.toFixed(6)}
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    result.errorEstimate < 0.001
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  }`}
                >
                  Error: {result.errorEstimate.toExponential(2)}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Instrucciones */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600">
              <AlertCircle className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Interpretación del gráfico
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <div className="p-1 rounded bg-blue-100 dark:bg-blue-900/30 mt-0.5">
                    <LineChartIcon className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    La{" "}
                    <strong className="text-blue-600 dark:text-blue-400">
                      línea azul
                    </strong>{" "}
                    representa la función f(x)
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="p-1 rounded bg-green-100 dark:bg-green-900/30 mt-0.5">
                    <AreaChart className="h-3 w-3 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Cada{" "}
                    <strong className="text-green-600 dark:text-green-400">
                      área coloreada
                    </strong>{" "}
                    es la aproximación de Simpson en ese segmento
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}