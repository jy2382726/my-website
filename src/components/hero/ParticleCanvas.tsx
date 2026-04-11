import { forwardRef } from 'react'

const ParticleCanvas = forwardRef<HTMLCanvasElement>(
  function ParticleCanvas(_props, canvasRef) {
    return (
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
      />
    )
  },
)

export default ParticleCanvas
