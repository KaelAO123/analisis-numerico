export interface NewtonRaphsonParams {
  functionStr: string
  derivativeStr: string
  initialGuess: number
  tolerance: number
  maxIterations: number
}

export interface NewtonIteration {
  iteration: number
  x: number
  fx: number
  fpx: number
  error: number
  root?: number
}

export interface Point {
  x: number
  y: number
  id?: string
}

export interface LagrangeResult {
  polynomial: string
  points: Point[]
  coefficients: number[]
}

export interface SimpsonResult {
  integral: number
  error: number
  partitions: number
  segments: Array<{
    a: number
    b: number
    area: number
    midpoint: number
  }>
}