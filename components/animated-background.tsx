"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Градиентный фон */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-blue-900 to-indigo-950"></div>

      {/* Анимированные частицы */}
      <div className="absolute inset-0">
        <Particles />
      </div>

      {/* Градиентные круги */}
      <motion.div
        initial={{ opacity: 0.5, scale: 0.8 }}
        animate={{
          opacity: [0.4, 0.6, 0.4],
          scale: [0.8, 1, 0.8],
          x: [0, 20, 0],
          y: [0, -20, 0],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 15,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0.5, scale: 0.8 }}
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [0.7, 0.9, 0.7],
          x: [0, -30, 0],
          y: [0, 30, 0],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 18,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0.5, scale: 0.8 }}
        animate={{
          opacity: [0.2, 0.4, 0.2],
          scale: [0.6, 0.8, 0.6],
          x: [0, 40, 0],
          y: [0, 40, 0],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 20,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full bg-gradient-to-r from-cyan-600/20 to-blue-600/20 blur-3xl"
      />

      {/* Сетка */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
    </div>
  )
}

function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let particles: Particle[] = []

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 2 + 0.5
        this.speedX = Math.random() * 0.5 - 0.25
        this.speedY = Math.random() * 0.5 - 0.25
        this.color = `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1})`
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x < 0 || this.x > canvas.width) {
          this.speedX = -this.speedX
        }

        if (this.y < 0 || this.y > canvas.height) {
          this.speedY = -this.speedY
        }
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const initParticles = () => {
      particles = []
      const particleCount = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 10000), 100)

      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle())
      }
    }

    const animate = () => {
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        particle.update()
        particle.draw()
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()
    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0" />
}
