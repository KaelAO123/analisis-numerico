import { evaluate, parse } from 'mathjs'

export interface Point {
  x: number
  y: number
  id: string
  isDragging?: boolean
}

export interface LagrangeResult {
  polynomial: string
  coefficients: number[]
  points: Point[]
  degree: number
}

/**
 * Calcula el polinomio de Lagrange para un conjunto de puntos
 */
export function lagrangeInterpolation(points: Point[]): LagrangeResult {
  if (points.length < 2) {
    throw new Error('Se necesitan al menos 2 puntos para interpolación')
  }

  const n = points.length
  const coefficients: number[] = new Array(n).fill(0)
  
  // Coeficientes del polinomio de Lagrange
  for (let i = 0; i < n; i++) {
    let product = 1
    for (let j = 0; j < n; j++) {
      if (i !== j) {
        product *= (points[i].x - points[j].x)
      }
    }
    coefficients[i] = points[i].y / product
  }

  // Construir representación del polinomio
  const polynomial = buildPolynomialString(points, coefficients)
  
  return {
    polynomial,
    coefficients,
    points,
    degree: n - 1
  }
}

/**
 * Evalúa el polinomio de Lagrange en un punto x
 */
export function evaluateLagrange(x: number, points: Point[]): number {
  let result = 0
  const n = points.length
  
  for (let i = 0; i < n; i++) {
    let term = points[i].y
    for (let j = 0; j < n; j++) {
      if (i !== j) {
        term *= (x - points[j].x) / (points[i].x - points[j].x)
      }
    }
    result += term
  }
  
  return result
}

/**
 * Genera puntos para graficar el polinomio
 */
export function generatePolynomialPoints(
  points: Point[], 
  samples: number = 200,
  xRange?: [number, number]
): { x: number; y: number }[] {
  if (points.length < 2) return []
  
  const xValues = points.map(p => p.x)
  const xMin = xRange ? xRange[0] : Math.min(...xValues) - 2
  const xMax = xRange ? xRange[1] : Math.max(...xValues) + 2
  
  const result = []
  const step = (xMax - xMin) / (samples - 1)
  
  for (let i = 0; i < samples; i++) {
    const x = xMin + i * step
    try {
      const y = evaluateLagrange(x, points)
      if (isFinite(y) && Math.abs(y) < 1e6) { // Evitar valores muy grandes
        result.push({ x, y })
      }
    } catch {
      // Puntos donde no se puede evaluar (por ejemplo, división por cero)
      continue
    }
  }
  
  return result
}

/**
 * Construye la representación en string del polinomio
 */
function buildPolynomialString(points: Point[], coefficients: number[]): string {
  const n = points.length
  
  if (n === 1) {
    return `${points[0].y}`
  }
  
  const terms: string[] = []
  
  for (let i = 0; i < n; i++) {
    let term = ''
    let numerator = ''
    let denominator = ''
    
    // Construir el término L_i(x)
    for (let j = 0; j < n; j++) {
      if (i !== j) {
        if (numerator) numerator += ' * '
        numerator += `(x - ${formatNumber(points[j].x)})`
        
        if (denominator) denominator += ' * '
        denominator += `(${formatNumber(points[i].x)} - ${formatNumber(points[j].x)})`
      }
    }
    
    const coeff = coefficients[i]
    if (Math.abs(coeff) > 1e-10) { // Ignorar términos muy pequeños
      if (n === 2) {
        // Para 2 puntos, simplificar la expresión
        if (i === 0) {
          term = `${formatNumber(points[0].y)} * (x - ${formatNumber(points[1].x)}) / (${formatNumber(points[0].x - points[1].x)})`
        } else {
          term = `${formatNumber(points[1].y)} * (x - ${formatNumber(points[0].x)}) / (${formatNumber(points[1].x - points[0].x)})`
        }
      } else {
        term = `${formatNumber(coeff)}${numerator}`
      }
      terms.push(term)
    }
  }
  
  if (terms.length === 0) return '0'
  
  // Combinar términos
  let polynomial = terms[0]
  for (let i = 1; i < terms.length; i++) {
    if (coefficients[i] >= 0) {
      polynomial += ` + ${terms[i]}`
    } else {
      polynomial += ` - ${terms[i].replace('-', '')}`
    }
  }
  
  return polynomial
}

/**
 * Formatea números para mostrar de manera más legible
 */
function formatNumber(num: number): string {
  if (Math.abs(num) < 0.0001 || Math.abs(num) > 10000) {
    return num.toExponential(2)
  }
  
  // Redondear a 4 decimales para mostrar
  const rounded = Math.round(num * 10000) / 10000
  if (Math.abs(rounded - Math.round(rounded)) < 0.0001) {
    return Math.round(rounded).toString()
  }
  return rounded.toString()
}

/**
 * Calcula el error de interpolación (diferencias divididas)
 */
export function calculateInterpolationError(points: Point[]): number {
  if (points.length < 3) return 0
  
  // Calcular la diferencia dividida de mayor orden como aproximación del error
  const n = points.length
  let maxError = 0
  
  for (let i = 0; i < n; i++) {
    const x = points[i].x
    const yActual = points[i].y
    const yInterpolated = evaluateLagrange(x, points.filter((_, idx) => idx !== i))
    const error = Math.abs(yActual - yInterpolated)
    maxError = Math.max(maxError, error)
  }
  
  return maxError
}

/**
 * Encuentra el rango y recomendaciones para los puntos
 */
export function getInterpolationStats(points: Point[]) {
  if (points.length === 0) {
    return {
      recommendedRange: [-5, 5],
      maxPoints: 10,
      spacing: 'Uniforme'
    }
  }
  
  const xValues = points.map(p => p.x)
  const yValues = points.map(p => p.y)
  
  return {
    xRange: [Math.min(...xValues), Math.max(...xValues)],
    yRange: [Math.min(...yValues), Math.max(...yValues)],
    averageSpacing: calculateAverageSpacing(points),
    conditionNumber: calculateConditionNumber(points)
  }
}

function calculateAverageSpacing(points: Point[]): number {
  if (points.length < 2) return 0
  
  const sortedPoints = [...points].sort((a, b) => a.x - b.x)
  let totalSpacing = 0
  
  for (let i = 1; i < sortedPoints.length; i++) {
    totalSpacing += Math.abs(sortedPoints[i].x - sortedPoints[i - 1].x)
  }
  
  return totalSpacing / (sortedPoints.length - 1)
}

function calculateConditionNumber(points: Point[]): number {
  // Una medida simple de qué tan bien condicionado está el problema
  const sortedPoints = [...points].sort((a, b) => a.x - b.x)
  let minSpacing = Infinity
  let maxSpacing = -Infinity
  
  for (let i = 1; i < sortedPoints.length; i++) {
    const spacing = Math.abs(sortedPoints[i].x - sortedPoints[i - 1].x)
    minSpacing = Math.min(minSpacing, spacing)
    maxSpacing = Math.max(maxSpacing, spacing)
  }
  
  return maxSpacing / minSpacing
}