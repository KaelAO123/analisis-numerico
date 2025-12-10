import { evaluate, parse } from 'mathjs'

export interface SimpsonSegment {
  a: number
  b: number
  midpoint: number
  area: number
  isParabola: boolean
  color: string
}

export interface SimpsonResult {
  integral: number
  errorEstimate: number
  segments: SimpsonSegment[]
  n: number
  method: '1/3' | '3/8' | 'composite'
  actualError?: number
  executionTime?: number
}

/**
 * Método de Simpson 1/3 para una función
 */
export function simpson13(
  f: string,
  a: number,
  b: number,
  n: number = 100
): SimpsonResult {
  if (n % 2 !== 0) {
    n += 1 // Asegurar que n sea par
  }

  const h = (b - a) / n
  const segments: SimpsonSegment[] = []
  
  const colors = [
    'bg-blue-500/20', 'bg-purple-500/20', 'bg-pink-500/20', 
    'bg-green-500/20', 'bg-yellow-500/20', 'bg-red-500/20'
  ]

  // Crear función evaluable
  const func = (x: number): number => {
    try {
      const result = evaluate(f, { x })
      if (typeof result !== 'number' || !isFinite(result)) {
        return 0
      }
      return result
    } catch {
      return 0
    }
  }

  // Calcular integral usando Simpson 1/3
  let sum = func(a) + func(b)
  
  // Suma de términos impares
  for (let i = 1; i < n; i += 2) {
    const x = a + i * h
    sum += 4 * func(x)
  }
  
  // Suma de términos pares
  for (let i = 2; i < n; i += 2) {
    const x = a + i * h
    sum += 2 * func(x)
  }

  const integral = (h / 3) * sum

  // Crear segmentos para visualización
  for (let i = 0; i < n; i += 2) {
    const segmentStart = a + i * h
    const segmentEnd = a + (i + 2) * h
    
    // Puntos para la parábola
    const x0 = segmentStart
    const x1 = segmentStart + h
    const x2 = segmentEnd
    const y0 = func(x0)
    const y1 = func(x1)
    const y2 = func(x2)
    
    // Calcular área del segmento usando Simpson 1/3 para este subintervalo
    const segmentH = h
    const segmentArea = (segmentH / 3) * (y0 + 4 * y1 + y2)
    
    segments.push({
      a: segmentStart,
      b: segmentEnd,
      midpoint: segmentStart + h,
      area: segmentArea,
      isParabola: true,
      color: colors[i % colors.length]
    })
  }

  // Estimación del error (fórmula del error para Simpson 1/3)
  const errorEstimate = estimateError13(f, a, b, n)

  return {
    integral,
    errorEstimate,
    segments,
    n,
    method: '1/3',
    executionTime: performance.now()
  }
}

/**
 * Método de Simpson 3/8
 */
export function simpson38(
  f: string,
  a: number,
  b: number,
  n: number = 99
): SimpsonResult {
  if (n % 3 !== 0) {
    n = Math.ceil(n / 3) * 3 // Asegurar múltiplo de 3
  }

  const h = (b - a) / n
  const segments: SimpsonSegment[] = []
  
  const colors = [
    'bg-blue-500/20', 'bg-purple-500/20', 'bg-green-500/20',
    'bg-yellow-500/20', 'bg-red-500/20', 'bg-indigo-500/20'
  ]

  const func = (x: number): number => {
    try {
      const result = evaluate(f, { x })
      if (typeof result !== 'number' || !isFinite(result)) {
        return 0
      }
      return result
    } catch {
      return 0
    }
  }

  // Calcular integral usando Simpson 3/8
  let sum = func(a) + func(b)
  
  // Términos con coeficiente 3
  for (let i = 1; i < n; i++) {
    if (i % 3 !== 0) {
      const x = a + i * h
      sum += 3 * func(x)
    }
  }
  
  // Términos con coeficiente 2
  for (let i = 3; i < n; i += 3) {
    const x = a + i * h
    sum += 2 * func(x)
  }

  const integral = (3 * h / 8) * sum

  // Crear segmentos
  for (let i = 0; i < n; i += 3) {
    const segmentStart = a + i * h
    const segmentEnd = a + (i + 3) * h
    
    // Calcular área del segmento usando Simpson 3/8
    const x0 = segmentStart
    const x1 = segmentStart + h
    const x2 = segmentStart + 2 * h
    const x3 = segmentEnd
    const y0 = func(x0)
    const y1 = func(x1)
    const y2 = func(x2)
    const y3 = func(x3)
    
    const segmentArea = (3 * h / 8) * (y0 + 3 * y1 + 3 * y2 + y3)
    
    segments.push({
      a: segmentStart,
      b: segmentEnd,
      midpoint: segmentStart + 1.5 * h,
      area: segmentArea,
      isParabola: true,
      color: colors[(i / 3) % colors.length]
    })
  }

  const errorEstimate = estimateError38(f, a, b, n)

  return {
    integral,
    errorEstimate,
    segments,
    n,
    method: '3/8',
    executionTime: performance.now()
  }
}

/**
 * Método compuesto de Simpson
 */
export function compositeSimpson(
  f: string,
  a: number,
  b: number,
  tolerance: number = 1e-6,
  maxIterations: number = 10
): SimpsonResult {
  let n = 2
  let prevIntegral = 0
  let integral = 0
  let error = Infinity
  let iteration = 0

  const results: SimpsonResult[] = []

  while (error > tolerance && iteration < maxIterations) {
    const result = simpson13(f, a, b, n)
    integral = result.integral
    
    if (iteration > 0) {
      error = Math.abs(integral - prevIntegral)
    }
    
    results.push(result)
    prevIntegral = integral
    n *= 2
    iteration++
  }

  const finalResult = results[results.length - 1]
  return {
    ...finalResult,
    errorEstimate: error,
    method: 'composite',
    actualError: error
  }
}

/**
 * Genera puntos para graficar la función
 */
export function generateFunctionPoints(
  f: string,
  a: number,
  b: number,
  samples: number = 200
): { x: number; y: number }[] {
  const points = []
  const step = (b - a) / (samples - 1)

  const func = (x: number): number => {
    try {
      const result = evaluate(f, { x })
      if (typeof result !== 'number' || !isFinite(result)) {
        return NaN
      }
      return result
    } catch {
      return NaN
    }
  }

  for (let i = 0; i < samples; i++) {
    const x = a + i * step
    const y = func(x)
    if (!isNaN(y)) {
      points.push({ x, y })
    }
  }

  return points
}

/**
 * Estima el error para Simpson 1/3
 */
function estimateError13(f: string, a: number, b: number, n: number): number {
  // Fórmula del error: E = -(b-a)^5 * f⁽⁴⁾(ξ) / (180 * n^4)
  // Usamos una aproximación numérica de la cuarta derivada
  const h = (b - a) / n
  
  // Aproximación de la cuarta derivada usando diferencias finitas
  const func = (x: number): number => {
    try {
      return evaluate(f, { x })
    } catch {
      return 0
    }
  }

  // Puntos para calcular la cuarta derivada
  const samplePoints = 5
  let maxFourthDeriv = 0
  
  for (let i = 0; i <= samplePoints; i++) {
    const x = a + (i / samplePoints) * (b - a)
    
    // Aproximación de la cuarta derivada usando diferencias finitas
    const hSmall = 0.001
    const f2 = (func(x + hSmall) - 2 * func(x) + func(x - hSmall)) / (hSmall * hSmall)
    const f4 = (func(x + 2*hSmall) - 4*func(x + hSmall) + 6*func(x) - 4*func(x - hSmall) + func(x - 2*hSmall)) / (hSmall * hSmall * hSmall * hSmall)
    
    maxFourthDeriv = Math.max(maxFourthDeriv, Math.abs(f4))
  }

  const errorEstimate = Math.abs(Math.pow(b - a, 5) * maxFourthDeriv / (180 * Math.pow(n, 4)))
  
  return isFinite(errorEstimate) ? errorEstimate : 0
}

/**
 * Estima el error para Simpson 3/8
 */
function estimateError38(f: string, a: number, b: number, n: number): number {
  // Fórmula del error: E = -(b-a)^5 * f⁽⁴⁾(ξ) / (80 * n^4)
  const h = (b - a) / n
  
  const func = (x: number): number => {
    try {
      return evaluate(f, { x })
    } catch {
      return 0
    }
  }

  const samplePoints = 5
  let maxFourthDeriv = 0
  
  for (let i = 0; i <= samplePoints; i++) {
    const x = a + (i / samplePoints) * (b - a)
    const hSmall = 0.001
    const f4 = (func(x + 2*hSmall) - 4*func(x + hSmall) + 6*func(x) - 4*func(x - hSmall) + func(x - 2*hSmall)) / (hSmall * hSmall * hSmall * hSmall)
    
    maxFourthDeriv = Math.max(maxFourthDeriv, Math.abs(f4))
  }

  const errorEstimate = Math.abs(Math.pow(b - a, 5) * maxFourthDeriv / (80 * Math.pow(n, 4)))
  
  return isFinite(errorEstimate) ? errorEstimate : 0
}

/**
 * Compara diferentes métodos de integración
 */
export function compareIntegrationMethods(
  f: string,
  a: number,
  b: number,
  exactValue?: number
): {
  simpson13: SimpsonResult
  simpson38: SimpsonResult
  trapezoidal?: { integral: number; error: number }
  comparisons: Array<{
    method: string
    integral: number
    error: number
    segments: number
    relativeError?: number
  }>
} {
  const n = 100 // Número base de segmentos
  
  const result13 = simpson13(f, a, b, n)
  const result38 = simpson38(f, a, b, n)
  
  const comparisons = [
    {
      method: 'Simpson 1/3',
      integral: result13.integral,
      error: result13.errorEstimate,
      segments: result13.n,
      relativeError: exactValue ? Math.abs(result13.integral - exactValue) / Math.abs(exactValue) : undefined
    },
    {
      method: 'Simpson 3/8',
      integral: result38.integral,
      error: result38.errorEstimate,
      segments: result38.n,
      relativeError: exactValue ? Math.abs(result38.integral - exactValue) / Math.abs(exactValue) : undefined
    }
  ]

  return {
    simpson13: result13,
    simpson38: result38,
    comparisons
  }
}

/**
 * Calcula la integral exacta para funciones conocidas (si es posible)
 */
export function getExactIntegral(f: string, a: number, b: number): number | null {
  try {
    // Intentar analizar la función para ver si conocemos su integral
    const normalized = f.toLowerCase().replace(/\s+/g, '')
    
    // Algunas integrales conocidas
    if (normalized.includes('x^2') || normalized.includes('x**2')) {
      return (Math.pow(b, 3) - Math.pow(a, 3)) / 3
    }
    
    if (normalized.includes('x^3') || normalized.includes('x**3')) {
      return (Math.pow(b, 4) - Math.pow(a, 4)) / 4
    }
    
    if (normalized.includes('sin(x)')) {
      return Math.cos(a) - Math.cos(b)
    }
    
    if (normalized.includes('cos(x)')) {
      return Math.sin(b) - Math.sin(a)
    }
    
    if (normalized.includes('exp(x)') || normalized.includes('e^x')) {
      return Math.exp(b) - Math.exp(a)
    }
    
    if (normalized === 'x') {
      return (b * b - a * a) / 2
    }
    
    // Si no reconocemos la función, devolver null
    return null
  } catch {
    return null
  }
}