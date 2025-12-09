export interface NewtonParams {
  function: string
  derivative: string
  initialGuess: number
  tolerance: number
  maxIterations: number
}

export interface NewtonResult {
  root: number | null
  iterations: NewtonIteration[]
  converged: boolean
  message: string
}

export interface NewtonIteration {
  iteration: number
  x: number
  fx: number
  fpx: number
  error: number
  root?: number
}