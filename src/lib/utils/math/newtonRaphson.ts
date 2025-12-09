/* eslint-disable @typescript-eslint/no-explicit-any */
import { evaluate, derivative, parse } from 'mathjs'

export interface NewtonIteration {
  iteration: number
  x: number
  fx: number
  fpx: number
  error: number
  root?: number
}

export interface NewtonResult {
  root: number | null
  iterations: NewtonIteration[]
  converged: boolean
  message: string
}

export function newtonRaphson(
  f: string,
  df: string,
  x0: number,
  tolerance: number = 1e-6,
  maxIterations: number = 50
): NewtonResult {
  const iterations: NewtonIteration[] = []
  
  // Validar parámetros de entrada
  if (!f || !df || isNaN(x0)) {
    return {
      root: null,
      iterations: [],
      converged: false,
      message: 'Parámetros inválidos'
    }
  }

  let x = x0
  let iteration = 0
  let error = Infinity

  try {
    // Sanitizar inputs
    const sanitizedF = f.trim()
    const sanitizedDf = df.trim()

    // Crear funciones a partir de strings
    const func = (xVal: number) => {
      try {
        const result = evaluate(sanitizedF, { x: xVal })
        return typeof result === 'number' ? result : NaN
      } catch (err) {
        console.error('Error evaluando f(x):', err)
        return NaN
      }
    }

    const deriv = (xVal: number) => {
      try {
        const result = evaluate(sanitizedDf, { x: xVal })
        return typeof result === 'number' ? result : NaN
      } catch (err) {
        console.error('Error evaluando f\'(x):', err)
        return NaN
      }
    }

    // Validaciones iniciales
    const initialFx = func(x0)
    if (isNaN(initialFx)) {
      return {
        root: null,
        iterations: [],
        converged: false,
        message: 'Error al evaluar f(x) en el punto inicial'
      }
    }

    if (Math.abs(initialFx) < tolerance) {
      return {
        root: x0,
        iterations: [],
        converged: true,
        message: 'El valor inicial ya es una raíz'
      }
    }

    // Iteraciones del método
    while (error > tolerance && iteration < maxIterations) {
      iteration++

      const fx = func(x)
      const fpx = deriv(x)

      // Validar resultados
      if (isNaN(fx) || isNaN(fpx)) {
        return {
          root: null,
          iterations,
          converged: false,
          message: `Error en iteración ${iteration}: valores NaN`
        }
      }

      // Evitar división por cero
      if (Math.abs(fpx) < 1e-15) {
        return {
          root: null,
          iterations,
          converged: false,
          message: `Derivada cercana a cero en iteración ${iteration}`
        }
      }

      const xNew = x - fx / fpx
      error = Math.abs(xNew - x)

      iterations.push({
        iteration,
        x,
        fx,
        fpx,
        error
      })

      x = xNew

      // Si encontramos una raíz exacta
      if (Math.abs(fx) < tolerance) {
        if (iterations.length > 0) {
          iterations[iterations.length - 1].root = x
        }
        break
      }
    }

    const converged = error <= tolerance
    const lastIteration = iterations.length > 0 ? iterations[iterations.length - 1] : null

    return {
      root: converged && lastIteration ? x : null,
      iterations,
      converged,
      message: converged 
        ? `Convergencia alcanzada después de ${iteration} iteraciones`
        : lastIteration && Math.abs(lastIteration.fx) < tolerance
          ? 'Raíz encontrada (f(x) ≈ 0)'
          : `No convergió después de ${maxIterations} iteraciones`
    }
  } catch (error: any) {
    console.error('Error en newtonRaphson:', error)
    return {
      root: null,
      iterations,
      converged: false,
      message: `Error: ${error.message || 'Error en el cálculo'}`
    }
  }
}

// Función para generar puntos de la función
export function generateFunctionPoints(
  f: string,
  xMin: number,
  xMax: number,
  points: number = 200
): { x: number; y: number }[] {
  const result:any = []
  
  if (!f || xMin >= xMax || points <= 0) {
    return result
  }

  const step = (xMax - xMin) / (points - 1)

  for (let i = 0; i < points; i++) {
    const x = xMin + i * step
    try {
      const y = evaluate(f, { x })
      if (typeof y === 'number' && isFinite(y)) {
        result.push({ x, y })
      }
    } catch {
      // Ignorar puntos donde la función no está definida
      continue
    }
  }

  return result
}

// Función para calcular la recta tangente
export function calculateTangentLine(
  f: string,
  df: string,
  x0: number,
  length: number = 2
): { x: number; y: number }[] {
  try {
    if (!f || !df || isNaN(x0)) {
      return []
    }

    const y0 = evaluate(f, { x: x0 })
    const m = evaluate(df, { x: x0 })
    
    if (typeof y0 !== 'number' || typeof m !== 'number' || !isFinite(y0) || !isFinite(m)) {
      return []
    }
    
    const x1 = x0 - length/2
    const x2 = x0 + length/2
    const y1 = y0 + m * (x1 - x0)
    const y2 = y0 + m * (x2 - x0)

    return [
      { x: x1, y: y1 },
      { x: x2, y: y2 }
    ]
  } catch {
    return []
  }
}