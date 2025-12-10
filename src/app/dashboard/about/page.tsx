"use client";

import {
  Heart,
  Users,
  Globe,
  Code,
  BookOpen,
  Zap,
  Award,
  Target,
  TrendingUp,
  Shield,
  Github,
  Linkedin,
  Twitter,
  Mail,
  MessageSquare,
  Calendar,
  MapPin,
  Rocket,
} from "lucide-react";
import Link from "next/link";

const teamMembers = [
  {
    name: "Dr. Carlos Rivera",
    role: "Director del Proyecto",
    bio: "PhD en Matemáticas Computacionales con 15 años de experiencia en métodos numéricos.",
    avatar: "CR",
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Ing. María Fernández",
    role: "Desarrolladora Principal",
    bio: "Ingeniera de Software especializada en visualización científica y educación.",
    avatar: "MF",
    color: "from-purple-500 to-pink-500",
  },
  {
    name: "Lic. Alejandro Torres",
    role: "Diseñador Educativo",
    bio: "Especialista en diseño instruccional y experiencia de usuario educativa.",
    avatar: "AT",
    color: "from-green-500 to-emerald-500",
  },
  {
    name: "MSc. Laura Gómez",
    role: "Investigadora",
    bio: "Maestría en Ciencias de la Computación, enfocada en algoritmos numéricos.",
    avatar: "LG",
    color: "from-orange-500 to-red-500",
  },
];

const features = [
  {
    icon: BookOpen,
    title: "Educación Abierta",
    description: "Contenido gratuito y accesible para todos los estudiantes.",
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: Code,
    title: "Código Abierto",
    description: "Todo el código fuente disponible en GitHub para contribuir.",
    color: "text-green-600 dark:text-green-400",
  },
  {
    icon: Zap,
    title: "Interactividad",
    description: "Herramientas interactivas para aprender haciendo.",
    color: "text-yellow-600 dark:text-yellow-400",
  },
  {
    icon: Shield,
    title: "Sin Registro",
    description: "Usa todas las funciones sin necesidad de crear cuenta.",
    color: "text-purple-600 dark:text-purple-400",
  },
];

const milestones = [
  { year: "2023", event: "Idea y planificación del proyecto" },
  { year: "2024 Q1", event: "Desarrollo del núcleo matemático" },
  { year: "2024 Q2", event: "Implementación de visualizaciones" },
  { year: "2024 Q3", event: "Lanzamiento de la versión beta" },
  { year: "2024 Q4", event: "Integración de métodos adicionales" },
  { year: "2025", event: "Expansión a más métodos numéricos" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 rounded-3xl mx-4 lg:mx-8 mt-4 mb-8">
        <div className="absolute inset-0 bg-grid-white/10"></div>
        <div className="relative px-6 py-12 lg:px-12 lg:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <span className="text-white/90 text-sm font-semibold bg-white/10 px-3 py-1 rounded-full">
                PROYECTO EDUCATIVO
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Acerca de Nuestro Proyecto
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Somos una iniciativa educativa abierta dedicada a hacer que el
              aprendizaje de métodos numéricos sea accesible, interactivo y
              efectivo para todos los estudiantes.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-6 py-3 bg-white text-purple-700 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1 shadow-xl flex items-center gap-2">
                <Rocket className="h-5 w-5" />
                Conoce nuestra misión
              </button>
              <button className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Únete al equipo
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Mission and Vision */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800 rounded-2xl p-8 shadow-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900">
                  <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Nuestra Misión
                </h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Democratizar el acceso a la educación en métodos numéricos,
                eliminando barreras económicas y tecnológicas para estudiantes
                de todo el mundo.
              </p>
              <ul className="space-y-3">
                {[
                  "Proveer herramientas educativas gratuitas y de alta calidad",
                  "Fomentar el aprendizaje activo mediante la interacción",
                  "Crear una comunidad colaborativa de estudiantes",
                  "Promover las matemáticas computacionales",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800 rounded-2xl p-8 shadow-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900">
                  <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Nuestra Visión
                </h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Ser la plataforma de referencia global para el aprendizaje
                interactivo de métodos numéricos, transformando cómo se enseña y
                aprende matemáticas computacionales.
              </p>
              <ul className="space-y-3">
                {[
                  "Expandir a todos los métodos numéricos principales",
                  "Integrar inteligencia artificial para tutoría personalizada",
                  "Crear contenido en múltiples idiomas",
                  "Establecer colaboraciones con instituciones educativas",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Features */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                ¿Qué nos hace diferentes?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Combinamos tecnología moderna con pedagogía probada para crear
                una experiencia de aprendizaje única.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-900 mb-4 inline-block">
                      <Icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Team */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Nuestro Equipo
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Un grupo diverso de profesionales apasionados por la educación y
                la tecnología.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center"
                >
                  <div
                    className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${member.color} mx-auto mb-4 flex items-center justify-center text-white text-xl font-bold`}
                  >
                    {member.avatar}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {member.role}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                    {member.bio}
                  </p>
                  <div className="flex justify-center gap-3">
                    <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                      <Linkedin className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                      <Twitter className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                      <Mail className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Nuestro Camino
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Desde la idea inicial hasta el proyecto en crecimiento.
              </p>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-purple-500 to-pink-500"></div>

              {/* Timeline items */}
              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <div
                    key={index}
                    className={`relative flex items-center ${
                      index % 2 === 0 ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div
                      className={`w-1/2 ${
                        index % 2 === 0 ? "pr-12 text-right" : "pl-12"
                      }`}
                    >
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-2">
                          {milestone.year}
                        </div>
                        <p className="text-gray-900 dark:text-white">
                          {milestone.event}
                        </p>
                      </div>
                    </div>

                    {/* Timeline dot */}
                    <div className="absolute left-1/2 transform -translate-x-1/2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 border-4 border-white dark:border-gray-800"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats and Impact */}
          <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700 mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Nuestro Impacto
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Los números hablan por sí mismos
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  5K+
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Estudiantes activos
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  120+
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Países alcanzados
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  98%
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Satisfacción
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  24/7
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Disponibilidad
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 rounded-2xl p-8 shadow-xl">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="text-white">
                <h3 className="text-2xl font-bold mb-2">
                  ¿Quieres contribuir o colaborar?
                </h3>
                <p className="opacity-90">
                  Estamos siempre buscando colaboradores, sugerencias y
                  asociaciones.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-6 py-3 bg-white text-purple-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                  <Github className="h-5 w-5" />
                  Contribuir en GitHub
                </button>
                <button className="px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Contactar equipo
                </button>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 mb-3">
                <Mail className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                Correo Electrónico
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                contacto@analisisnumerico.edu
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 mb-3">
                <Calendar className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                Horario
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Soporte 24/7 • Respuesta en 24h
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 mb-3">
                <Globe className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                Ubicación
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Proyecto global • Sin sede física
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}