"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function ScrollTransitionSVG() {
    const containerRef = useRef(null)
    const pathRef = useRef(null)

    useEffect(() => {
        const path = pathRef.current
        const container = containerRef.current
        if (!path || !container) return

        // Get the total length of the SVG path
        const pathLength = path.getTotalLength()

        // Set initial state: path is fully hidden (stroke-dashoffset = pathLength)
        gsap.set(path, {
            strokeDasharray: pathLength,
            strokeDashoffset: pathLength,
        })

        const ctx = gsap.context(() => {
            // Draw the path as user scrolls through the container
            gsap.to(path, {
                strokeDashoffset: 0,
                ease: "none",
                scrollTrigger: {
                    trigger: container,
                    start: "top 80%",
                    end: "bottom 20%",
                    scrub: 1.5,
                }
            })
        }, container)

        return () => ctx.revert()
    }, [])

    return (
        <div
            ref={containerRef}
            className="relative w-full overflow-hidden pointer-events-none select-none"
            style={{ height: "clamp(80px, 12vh, 160px)" }}
        >
            <svg
                viewBox="0 0 1200 400"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="none"
            >
                {/* Main flowing curve */}
                <path
                    ref={pathRef}
                    d="M0,350 C150,350 200,200 350,200 C500,200 450,50 600,50 C750,50 700,300 850,300 C950,300 1000,150 1100,100 C1150,75 1180,50 1200,30"
                    stroke="url(#gradient-line)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    fill="none"
                    className="will-change-[stroke-dashoffset]"
                />

                {/* Gradient definition */}
                <defs>
                    <linearGradient id="gradient-line" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.06)" />
                        <stop offset="30%" stopColor="rgba(255,255,255,0.15)" />
                        <stop offset="50%" stopColor="rgba(255,255,255,0.25)" />
                        <stop offset="70%" stopColor="rgba(255,255,255,0.15)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0.06)" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    )
}
