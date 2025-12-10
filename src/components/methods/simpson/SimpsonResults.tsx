"use client";

import { useState } from "react";
import {
  Copy,
  Check,
  Download,
  BarChart3,
  TrendingUp,
  AlertCircle,
  Clock,
  Hash,
  Zap,
  Calculator,
  PieChart,
  Layers,
  SigmaSquare,
  Target,
  DivideCircle,
  Infinity,
  AreaChart,
  FileText,
  Table,
  LineChart,
  Shield,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Cpu,
  Gauge,
  Award,
  Clock3,
  BarChart,
  ArrowLeftRight,
} from "lucide-react";
import { SimpsonResult } from "@/lib/utils/math/simpsonIntegration";
import toast from "react-hot-toast";

interface SimpsonResultsProps {
  result: SimpsonResult | null;
  exactValue?: number | null;
  functionStr: string;
  lowerLimit: number;
  upperLimit: number;
  method: "1/3" | "3/8" | "composite";
}

export default function SimpsonResults({
  result,
  exactValue,
  functionStr,
  lowerLimit,
  upperLimit,
  method,
}: SimpsonResultsProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "summary" | "segments" | "comparison"
  >("summary");

  if (!result) {
    return (
      <div className="text-center py-16 px-4">
        <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 mb-6">
          <Calculator className="h-12 w-12 text-gray-400" />
        </div>
        <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          Esperando cálculo
        </h4>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Configura los parámetros en el panel izquierdo y haz clic en
          <span className="font-semibold text-blue-600 dark:text-blue-400 mx-1">
            &quot;Calcular Integral&quot;
          </span>
          para ver los resultados.
        </p>
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30">
              <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                ¿Primera vez?
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Prueba con los ejemplos predefinidos
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleCopyResults = () => {
    const resultsText = `
Integral calculada: ${result.integral.toFixed(6)}
Método: Simpson ${
      method === "1/3" ? "1/3" : method === "3/8" ? "3/8" : "Compuesto"
    }
Límites: [${lowerLimit}, ${upperLimit}]
Segmentos: ${result.segments.length}
Error estimado: ${result.errorEstimate.toExponential(2)}
${
  exactValue
    ? `Valor exacto: ${exactValue.toFixed(6)}\nError absoluto: ${Math.abs(
        result.integral - exactValue
      ).toExponential(2)}`
    : ""
}
    `.trim();

    navigator.clipboard.writeText(resultsText);
    setCopied(true);
    toast.success("Resultados copiados al portapapeles");

    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadResults = () => {
    const data = {
      function: functionStr,
      lowerLimit,
      upperLimit,
      method:
        method === "1/3"
          ? "Simpson 1/3"
          : method === "3/8"
          ? "Simpson 3/8"
          : "Simpson Compuesto",
      result: {
        integral: result.integral,
        errorEstimate: result.errorEstimate,
        segments: result.segments.length,
        executionTime: result.executionTime,
      },
      segments: result.segments.map((segment, index) => ({
        index: index + 1,
        interval: [segment.a, segment.b],
        area: segment.area,
        percentage: ((segment.area / result.integral) * 100).toFixed(2) + "%",
      })),
      exactValue,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `simpson-result-${
      new Date().toISOString().split("T")[0]
    }.json`;
    a.click();
    toast.success("Resultados exportados");
  };

  const calculateRelativeError = () => {
    if (!exactValue || exactValue === 0) return null;
    return Math.abs(result.integral - exactValue) / Math.abs(exactValue);
  };

  const relativeError = calculateRelativeError();
  const totalArea = result.segments.reduce(
    (sum, segment) => sum + segment.area,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-green-600 to-emerald-600">
              <AreaChart className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Resultados de la Integración
            </h3>
          </div>
          <div className="flex items-center flex-wrap gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
              <SigmaSquare className="h-3 w-3" />
              Simpson{" "}
              {method === "1/3"
                ? "1/3"
                : method === "3/8"
                ? "3/8"
                : "Compuesto"}
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm">
              <Layers className="h-3 w-3" />
              {result.segments.length} segmentos
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyResults}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 group"
            title="Copiar resultados"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">
                  Copiado
                </span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:text-blue-600" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Copiar
                </span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadResults}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            title="Exportar resultados"
          >
            <Download className="h-4 w-4" />
            <span className="text-sm font-medium">Exportar</span>
          </button>
        </div>
      </div>

      {/* Valor de la integral */}
      <div className="bg-gradient-to-r from-blue-50 via-white to-cyan-50 dark:from-blue-900/20 dark:via-gray-800/50 dark:to-cyan-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 shadow-lg">
              <Calculator className="h-8 w-8 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white text-xl">
                Valor de la Integral
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ∫<sub>{lowerLimit.toFixed(2)}</sub>
                <sup>{upperLimit.toFixed(2)}</sup> f(x) dx
              </p>
            </div>
          </div>

          <div className="text-center lg:text-right">
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              ≈ {result.integral.toFixed(6)}
            </div>
            <div className="flex items-center justify-center lg:justify-end gap-3">
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Error estimado: {result.errorEstimate.toExponential(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pestañas de resultados */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab("summary")}
              className={`flex-1 min-w-[120px] px-6 py-4 text-center font-medium transition-all duration-200 flex items-center justify-center gap-3 border-b-2 ${
                activeTab === "summary"
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-500"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 border-transparent"
              }`}
            >
              <BarChart3 className="h-4 w-4 flex-shrink-0" />
              <span className="whitespace-nowrap">Resumen</span>
            </button>
            <button
              onClick={() => setActiveTab("segments")}
              className={`flex-1 min-w-[120px] px-6 py-4 text-center font-medium transition-all duration-200 flex items-center justify-center gap-3 border-b-2 ${
                activeTab === "segments"
                  ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-500"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 border-transparent"
              }`}
            >
              <Table className="h-4 w-4 flex-shrink-0" />
              <span className="whitespace-nowrap">Segmentos</span>
            </button>
            <button
              onClick={() => setActiveTab("comparison")}
              className={`flex-1 min-w-[120px] px-6 py-4 text-center font-medium transition-all duration-200 flex items-center justify-center gap-3 border-b-2 ${
                activeTab === "comparison"
                  ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-500"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 border-transparent"
              }`}
            >
              <TrendingUp className="h-4 w-4 flex-shrink-0" />
              <span className="whitespace-nowrap">Comparación</span>
            </button>
          </div>
        </div>

        {/* Contenido de las pestañas */}
        <div className="p-6">
          {activeTab === "summary" && (
            <div className="space-y-6">
              {/* Métricas principales */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                  <div className="flex items-center gap-2 mb-3">
                    <Layers className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Segmentos
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {result.segments.length}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {method === "1/3"
                      ? "Pares de segmentos"
                      : method === "3/8"
                      ? "Grupos de 3"
                      : "Adaptativo"}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition-colors">
                  <div className="flex items-center gap-2 mb-3">
                    <Gauge className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Error estimado
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {result.errorEstimate.toExponential(2)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Precisión del método
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700 transition-colors">
                  <div className="flex items-center gap-2 mb-3">
                    <LineChart className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Ancho intervalo
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {(upperLimit - lowerLimit).toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    b - a
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-cyan-300 dark:hover:border-cyan-700 transition-colors">
                  <div className="flex items-center gap-2 mb-3">
                    <Hash className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      h promedio
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {(
                      (upperLimit - lowerLimit) /
                      result.segments.length
                    ).toFixed(4)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Ancho de segmento
                  </div>
                </div>
              </div>

              {/* Comparación con valor exacto */}
              {(exactValue !== null && exactValue !== undefined) && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-green-600">
                        <CheckCircle className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                          Comparación con valor exacto
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Precisión del cálculo
                        </p>
                      </div>
                    </div>
                    <div
                      className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${
                        relativeError && relativeError < 0.001
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : relativeError && relativeError < 0.01
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {relativeError && relativeError < 0.001 ? (
                        <Award className="h-4 w-4" />
                      ) : relativeError && relativeError < 0.01 ? (
                        <AlertTriangle className="h-4 w-4" />
                      ) : (
                        <AlertCircle className="h-4 w-4" />
                      )}
                      <span>
                        {relativeError
                          ? `${(relativeError * 100).toFixed(4)}% error`
                          : "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Valor exacto
                      </p>
                      <p className="font-mono text-xl font-bold text-gray-900 dark:text-white">
                        {exactValue.toFixed(6)}
                      </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Diferencia absoluta
                      </p>
                      <p className="font-mono text-xl font-bold text-gray-900 dark:text-white">
                        {Math.abs(result.integral - exactValue).toExponential(
                          2
                        )}
                      </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Cifras significativas
                      </p>
                      <p className="font-mono text-xl font-bold text-gray-900 dark:text-white">
                        {Math.floor(
                          -Math.log10(Math.abs(result.integral - exactValue))
                        )}{" "}
                        cifras
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Información del método */}
              <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-lg bg-blue-600">
                    <Cpu className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                      Información del método
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Detalles técnicos y fórmulas utilizadas
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Fórmula utilizada
                    </p>
                    <div className="bg-gray-900 dark:bg-black p-4 rounded-lg overflow-x-auto">
                      <code className="font-mono text-sm text-gray-100">
                        {method === "1/3"
                          ? "∫ f(x) dx ≈ (h/3)[f(x₀) + 4f(x₁) + 2f(x₂) + ... + f(xₙ)]"
                          : method === "3/8"
                          ? "∫ f(x) dx ≈ (3h/8)[f(x₀) + 3f(x₁) + 3f(x₂) + 2f(x₃) + ... + f(xₙ)]"
                          : "Método adaptativo que ajusta h hasta alcanzar la tolerancia ε"}
                      </code>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Características
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Zap className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            Orden de convergencia
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {method === "1/3" || method === "3/8"
                              ? "O(h⁴) - Muy rápido"
                              : "Adaptativo - Control preciso"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            Complejidad computacional
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            O(n) - Lineal con el número de segmentos
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "segments" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                    Detalle por segmentos
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {result.segments.length} segmentos analizados
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      Área total: {totalArea.toFixed(6)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          <div className="flex items-center gap-2">
                            <Hash className="h-3 w-3" />
                            Segmento
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          Intervalo [a, b]
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          Ancho
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          Área
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          % del total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                      {result.segments.slice(0, 15).map((segment, index) => {
                        const percentage = (segment.area / totalArea) * 100;
                        return (
                          <tr
                            key={index}
                            className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-bold shadow-sm">
                                  {index + 1}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-mono text-gray-900 dark:text-white">
                                [{segment.a.toFixed(3)}, {segment.b.toFixed(3)}]
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-mono text-gray-900 dark:text-white">
                                {(segment.b - segment.a).toFixed(3)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-mono font-bold text-gray-900 dark:text-white">
                                {segment.area.toFixed(6)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3 overflow-hidden">
                                  <div
                                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                                    style={{
                                      width: `${Math.min(percentage, 100)}%`,
                                    }}
                                  ></div>
                                </div>
                                <div className="min-w-[60px] text-right">
                                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {percentage.toFixed(2)}%
                                  </span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {result.segments.length > 15 && (
                  <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Mostrando 15 de {result.segments.length} segmentos
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Los segmentos restantes siguen el mismo patrón de
                        cálculo
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Gráfico de distribución */}
              <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <PieChart className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <h5 className="font-semibold text-gray-900 dark:text-white">
                    Distribución del área por segmentos
                  </h5>
                </div>

                <div className="flex items-center h-6 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                  {result.segments.slice(0, 8).map((segment, index) => {
                    const percentage = (segment.area / totalArea) * 100;
                    return (
                      <div
                        key={index}
                        className="h-full transition-all duration-300 hover:opacity-90"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: `hsl(${index * 45}, 70%, 60%)`,
                        }}
                        title={`Segmento ${index + 1}: ${segment.area.toFixed(
                          4
                        )} (${percentage.toFixed(1)}%)`}
                      ></div>
                    );
                  })}
                  {result.segments.length > 8 && (
                    <div
                      className="h-full bg-gradient-to-r from-gray-400 to-gray-500 dark:from-gray-600 dark:to-gray-700"
                      style={{
                        width: `${result.segments
                          .slice(8)
                          .reduce(
                            (sum, s) => sum + (s.area / totalArea) * 100,
                            0
                          )}%`,
                      }}
                      title={`${result.segments.length - 8} segmentos más`}
                    ></div>
                  )}
                </div>

                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-3">
                  <span>Segmento 1</span>
                  <span className="font-medium">
                    Distribución del área total
                  </span>
                  <span>Segmento {Math.min(result.segments.length, 8)}</span>
                </div>

                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                  {result.segments.slice(0, 4).map((segment, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded"
                        style={{
                          backgroundColor: `hsl(${index * 45}, 70%, 60%)`,
                        }}
                      ></div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        S{index + 1}:{" "}
                        <span className="font-medium">
                          {segment.area.toFixed(4)}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "comparison" && (
            <div className="space-y-6">
              {/* Comparación de métodos teórica */}
              <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-lg bg-purple-600">
                    <BarChart className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                      Comparación de métodos de integración
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Análisis de diferentes métodos numéricos
                    </p>
                  </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          Método
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          Orden de error
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          Ventajas
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          Aplicaciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                      <tr className="hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-600 to-cyan-600 text-white font-bold shadow-sm">
                              ⅓
                            </div>
                            <div className="ml-4">
                              <div className="font-semibold text-gray-900 dark:text-white">
                                Simpson 1/3
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                Parábolas
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                            <Zap className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                            <span className="font-mono font-bold text-blue-700 dark:text-blue-300">
                              O(h⁴)
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1.5">
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Alto orden de precisión</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Implementación simple</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Eficiente para funciones suaves</span>
                            </li>
                          </ul>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <span className="text-gray-500 dark:text-gray-400">
                              Ideal para:
                            </span>
                            <ul className="mt-1 space-y-1">
                              <li>• Funciones polinómicas</li>
                              <li>• Integración rápida</li>
                              <li>• Análisis general</li>
                            </ul>
                          </div>
                        </td>
                      </tr>

                      <tr className="hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-purple-600 to-pink-600 text-white font-bold shadow-sm">
                              ⅜
                            </div>
                            <div className="ml-4">
                              <div className="font-semibold text-gray-900 dark:text-white">
                                Simpson 3/8
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                Cúbicas
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                            <Zap className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                            <span className="font-mono font-bold text-purple-700 dark:text-purple-300">
                              O(h⁴)
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1.5">
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Mismo orden que 1/3</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Mejor para funciones cúbicas</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Útil con múltiplos de 3</span>
                            </li>
                          </ul>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <span className="text-gray-500 dark:text-gray-400">
                              Recomendado para:
                            </span>
                            <ul className="mt-1 space-y-1">
                              <li>• Funciones periódicas</li>
                              <li>• Datos experimentales</li>
                              <li>• Cuando n es múltiplo de 3</li>
                            </ul>
                          </div>
                        </td>
                      </tr>

                      <tr className="hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-green-600 to-emerald-600 text-white font-bold shadow-sm">
                              C
                            </div>
                            <div className="ml-4">
                              <div className="font-semibold text-gray-900 dark:text-white">
                                Compuesto
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                Adaptativo
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                            <Infinity className="h-3 w-3 text-green-600 dark:text-green-400" />
                            <span className="font-mono font-bold text-green-700 dark:text-green-300">
                              Adaptativo
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1.5">
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Control de error preciso</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Eficiente para precisión dada</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Automático refinamiento</span>
                            </li>
                          </ul>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <span className="text-gray-500 dark:text-gray-400">
                              Esencial para:
                            </span>
                            <ul className="mt-1 space-y-1">
                              <li>• Alta precisión requerida</li>
                              <li>• Funciones irregulares</li>
                              <li>• Investigación científica</li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recomendaciones */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-lg bg-amber-600">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                      Recomendaciones para mejores resultados
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Optimiza tu cálculo de integrales
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-4">
                      <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <h5 className="font-medium text-gray-900 dark:text-white">
                        Para funciones suaves:
                      </h5>
                    </div>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="p-1 rounded bg-green-100 dark:bg-green-900/30">
                          <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-400" />
                        </div>
                        <span>Usa Simpson 1/3 con segmentos pares (10-20)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="p-1 rounded bg-green-100 dark:bg-green-900/30">
                          <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-400" />
                        </div>
                        <span>El error decrece rápidamente (O(h⁴))</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="p-1 rounded bg-green-100 dark:bg-green-900/30">
                          <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-400" />
                        </div>
                        <span>Balance entre velocidad y precisión</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-4">
                      <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <h5 className="font-medium text-gray-900 dark:text-white">
                        Para alta precisión:
                      </h5>
                    </div>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="p-1 rounded bg-blue-100 dark:bg-blue-900/30">
                          <CheckCircle className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span>Usa método compuesto con tolerancia pequeña</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="p-1 rounded bg-blue-100 dark:bg-blue-900/30">
                          <CheckCircle className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span>Aumenta segmentos en regiones variables</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="p-1 rounded bg-blue-100 dark:bg-blue-900/30">
                          <CheckCircle className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span>Verifica convergencia del error</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notas importantes */}
      {result.errorEstimate > 0.01 && (
        <div className="bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-red-600 flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Error estimado relativamente alto
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                El error estimado ({result.errorEstimate.toExponential(2)})
                sugiere que la precisión podría mejorarse.
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1.5">
                <li className="flex items-start gap-2">
                  <ArrowLeftRight className="h-3 w-3 text-red-600 dark:text-red-400 mt-0.5" />
                  <span>Considera aumentar el número de segmentos</span>
                </li>
                <li className="flex items-start gap-2">
                  <FileText className="h-3 w-3 text-red-600 dark:text-red-400 mt-0.5" />
                  <span>Verifica que la función sea suave en el intervalo</span>
                </li>
                <li className="flex items-start gap-2">
                  <TrendingUp className="h-3 w-3 text-red-600 dark:text-red-400 mt-0.5" />
                  <span>
                    Usa el método compuesto para mejor control de error
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Resumen final */}
      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600">
              <SigmaSquare className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Simpson{" "}
                {method === "1/3"
                  ? "1/3"
                  : method === "3/8"
                  ? "3/8"
                  : "Compuesto"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Orden O(h⁴) • {result.segments.length} segmentos
              </p>
            </div>
          </div>

          <div className="text-center md:text-right">
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              Integral: {result.integral.toFixed(6)}
            </p>
            {relativeError !== null && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Error relativo:{" "}
                <span className="font-medium">
                  {(relativeError * 100).toFixed(4)}%
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}




