"use client"

import { useEffect, useRef } from 'react'
import Lenis from '@studio-freight/lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function SmoothScroll({ children }) {
    const lenisRef = useRef(null)

    useEffect(() => {
        // Initialize Lenis
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        })

        lenisRef.current = lenis

        // Sync GSAP ScrollTrigger with Lenis
        lenis.on('scroll', ScrollTrigger.update)

        // Add Lenis's requestAnimationFrame to GSAP's ticker
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000)
        })

        // Disable GSAP's default lag smoothing to prevent conflicts with Lenis
        gsap.ticker.lagSmoothing(0)

        return () => {
            gsap.ticker.remove((time) => {
                lenis.raf(time * 1000)
            })
            lenis.destroy()
        }
    }, [])

    return (
        <div className="smooth-scroll-wrapper relative w-full" id="smooth-wrapper">
            <div id="smooth-content">
                {children}
            </div>
        </div>
    )
}
