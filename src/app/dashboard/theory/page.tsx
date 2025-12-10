"use client";

import { useState } from "react";
import {
  BookOpen,
  Calculator,
  LineChart,
  BarChart3,
  Target,
  Zap,
  ChevronRight,
  Search,
  Filter,
  Download,
  Share2,
  Bookmark,
  Eye,
  Code,
  CheckCircle,
  Clock,
  Users,
  TrendingUp,
  Brain,
} from "lucide-react";
import Link from "next/link";

const theoryCategories = [
  {
    id: "intro",
    title: "Introducción al Análisis Numérico",
    description: "Conceptos básicos, importancia y aplicaciones",
    icon: BookOpen,
    color: "from-blue-500 to-cyan-500",
    topics: [
      "¿Qué es el análisis numérico?",
      "Errores numéricos: absoluto y relativo",
      "Precisión vs exactitud",
      "Tipos de métodos numéricos",
      "Aplicaciones en ingeniería y ciencia",
    ],
  },
  {
    id: "ecuaciones",
    title: "Solución de Ecuaciones No Lineales",
    description: "Métodos para encontrar raíces de funciones",
    icon: Target,
    color: "from-purple-500 to-pink-500",
    topics: [
      "Método de Bisección",
      "Método de Newton-Raphson",
      "Método de la Secante",
      "Método de Punto Fijo",
      "Convergencia y análisis de error",
    ],
  },
  {
    id: "interpolacion",
    title: "Interpolación y Aproximación",
    description: "Ajuste de curvas y predicción de valores",
    icon: TrendingUp,
    color: "from-green-500 to-emerald-500",
    topics: [
      "Interpolación de Lagrange",
      "Interpolación de Newton",
      "Diferencias divididas",
      "Aproximación por mínimos cuadrados",
      "Splines cúbicos",
    ],
  },
  {
    id: "integracion",
    title: "Integración Numérica",
    description: "Cálculo aproximado de integrales definidas",
    icon: LineChart,
    color: "from-orange-500 to-red-500",
    topics: [
      "Regla del Trapecio",
      "Regla de Simpson 1/3 y 3/8",
      "Cuadratura de Gauss",
      "Integración de Romberg",
      "Error en integración numérica",
    ],
  },
  {
    id: "algebra",
    title: "Álgebra Lineal Numérica",
    description: "Solución de sistemas de ecuaciones lineales",
    icon: Calculator,
    color: "from-indigo-500 to-blue-500",
    topics: [
      "Métodos directos: Gauss, LU",
      "Métodos iterativos: Jacobi, Gauss-Seidel",
      "Valores y vectores propios",
      "Matrices especiales",
      "Condicionamiento de matrices",
    ],
  },
  {
    id: "edos",
    title: "Ecuaciones Diferenciales",
    description: "Solución numérica de EDOs y EDPs",
    icon: Brain,
    color: "from-rose-500 to-pink-500",
    topics: [
      "Método de Euler",
      "Métodos de Runge-Kutta",
      "Métodos multipaso",
      "Ecuaciones diferenciales parciales",
      "Estabilidad numérica",
    ],
  },
];

const featuredMethods = [
  {
    title: "Método de Newton-Raphson",
    description: "Encuentra raíces de funciones mediante derivadas",
    formula: "xₙ₊₁ = xₙ - f(xₙ)/f'(xₙ)",
    advantages: ["Convergencia cuadrática", "Rápido", "Preciso"],
    link: "/dashboard/methods/newton-raphson",
  },
  {
    title: "Interpolación de Lagrange",
    description: "Construye polinomios que pasan por puntos dados",
    formula: "P(x) = Σ yᵢ · Lᵢ(x)",
    advantages: ["Fácil implementación", "Exacto en puntos dados", "Flexible"],
    link: "/dashboard/methods/lagrange",
  },
  {
    title: "Regla de Simpson",
    description: "Aproxima integrales usando parábolas",
    formula: "∫f(x)dx ≈ (h/3)[f₀ + 4f₁ + 2f₂ + ... + fₙ]",
    advantages: ["Alta precisión", "Error pequeño", "Fácil de aplicar"],
    link: "/dashboard/methods/simpson",
  },
];

export default function TheoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredCategories = theoryCategories.filter(
    (category) =>
      category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.topics.some((topic) =>
        topic.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 rounded-3xl mx-4 lg:mx-8 mt-4 mb-8">
        <div className="absolute inset-0 bg-grid-white/10"></div>
        <div className="relative px-6 py-12 lg:px-12 lg:py-20">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <span className="text-white/90 text-sm font-semibold bg-white/10 px-3 py-1 rounded-full">
                RECURSO EDUCATIVO
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Teoría de Métodos Numéricos
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Aprende los fundamentos matemáticos, conceptos clave y teoría
              detrás de los métodos numéricos más importantes. Desde la
              interpolación hasta la integración numérica.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-6 py-3 bg-white text-blue-700 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1 shadow-xl flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Empezar a aprender
              </button>
              <button className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20 flex items-center gap-2">
                <Download className="h-5 w-5" />
                Descargar PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Search and Filter */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center mb-6">
              <div className="relative flex-1 max-w-2xl">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar conceptos, métodos, fórmulas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                />
              </div>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filtrar
                </button>
                <button className="px-4 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
                  <Bookmark className="h-4 w-4" />
                  Guardar
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {theoryCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() =>
                    setSelectedCategory(
                      selectedCategory === category.id ? null : category.id
                    )
                  }
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    selectedCategory === category.id
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {category.title}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Temas disponibles
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    24
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900">
                  <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Métodos cubiertos
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    12
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900">
                  <Calculator className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Horas de contenido
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    36+
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900">
                  <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Ejemplos interactivos
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    48
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-orange-100 dark:bg-orange-900">
                  <Eye className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Categorías de Estudio
              </h2>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {filteredCategories.length} categorías encontradas
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <div
                    key={category.id}
                    className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`p-3 rounded-xl bg-gradient-to-r ${category.color}`}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {category.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {category.description}
                    </p>
                    <div className="space-y-2">
                      {category.topics.slice(0, 3).map((topic, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm"
                        >
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                          <span className="text-gray-700 dark:text-gray-300">
                            {topic}
                          </span>
                        </div>
                      ))}
                      {category.topics.length > 3 && (
                        <div className="pt-2">
                          <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                            +{category.topics.length - 3} temas más
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Featured Methods */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Métodos Destacados
              </h2>
              <Link
                href="/dashboard/methods"
                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"
              >
                Ver todos
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {featuredMethods.map((method, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900">
                      <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 text-xs font-medium">
                      POPULAR
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {method.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {method.description}
                  </p>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 mb-4">
                    <code className="font-mono text-gray-900 dark:text-gray-100">
                      {method.formula}
                    </code>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {method.advantages.map((adv, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                      >
                        {adv}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={method.link}
                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <Code className="h-5 w-5" />
                    Probar método
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Guide */}
          <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  ¿Cómo estudiar métodos numéricos?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Sigue esta guía paso a paso para dominar los métodos
                  numéricos de manera efectiva:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Comprende la teoría matemática detrás de cada método",
                    "Estudia los casos de aplicación y limitaciones",
                    "Practica con ejemplos paso a paso",
                    "Implementa los algoritmos en código",
                    "Analiza el error y convergencia",
                    "Resuelve problemas del mundo real",
                  ].map((step, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900">
                        <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:w-1/3">
                <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl p-6 text-white">
                  <h4 className="text-lg font-bold mb-3">Tip del día</h4>
                  <p className="mb-4">
                    La comprensión geométrica de los métodos es clave. Siempre
                    visualiza gráficamente lo que estás calculando.
                  </p>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="text-sm opacity-90">
                      Recomendado por 95% de estudiantes
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}