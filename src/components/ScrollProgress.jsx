"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const SECTIONS = [
    { id: "hero", label: "Introduction" },
    { id: "projects", label: "Projects" },
    { id: "skills", label: "Skills" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
]

export function ScrollProgress() {
    const containerRef = useRef(null)
    const [activeIndex, setActiveIndex] = useState(0)
    const [scrollPercent, setScrollPercent] = useState(0)
    const [isHidden, setIsHidden] = useState(false)
    const triggersRef = useRef([])

    useEffect(() => {
        // Track overall scroll progress
        const updateProgress = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const docHeight = document.documentElement.scrollHeight - window.innerHeight
            const percent = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0
            setScrollPercent(Math.round(percent))
        }

        window.addEventListener("scroll", updateProgress, { passive: true })
        updateProgress()

        // Delay trigger creation so that all other ScrollTriggers (especially
        // the Projects section pin) are created first.  GSAP's `ScrollTrigger.refresh()`
        // then recalculates every trigger with the correct pin-spacing offsets.
        const delayedSetup = gsap.delayedCall(0.5, () => {
            ScrollTrigger.refresh()

            SECTIONS.forEach((section, i) => {
                const el = document.getElementById(section.id)
                if (!el) return

                const st = ScrollTrigger.create({
                    trigger: el,
                    start: "top center",
                    end: "bottom center",
                    // Lower priority so it refreshes AFTER the Projects pin
                    refreshPriority: -10,
                    onEnter: () => {
                        setActiveIndex(i)
                        setIsHidden(section.id === "projects")
                    },
                    onEnterBack: () => {
                        setActiveIndex(i)
                        setIsHidden(section.id === "projects")
                    },
                })

                triggersRef.current.push(st)
            })
        })

        return () => {
            window.removeEventListener("scroll", updateProgress)
            delayedSetup.kill()
            triggersRef.current.forEach(st => st.kill())
            triggersRef.current = []
        }
    }, [])

    const handleClick = (id) => {
        const el = document.getElementById(id)
        if (el) {
            el.scrollIntoView({ behavior: "smooth" })
        }
    }

    return (
        <div
            ref={containerRef}
            className={`fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-end gap-1 mix-blend-difference transition-all duration-500 ${isHidden ? "opacity-0 pointer-events-none translate-x-4" : "opacity-100 translate-x-0"
                }`}
        >
            {/* Percent */}
            <div className="mb-3 text-right">
                <span className="text-[10px] font-mono text-white/30 tracking-widest block">
                    SCROLL
                </span>
                <span className="text-xs font-mono text-white/60 tabular-nums">
                    {String(scrollPercent).padStart(3, "0")}%
                </span>
            </div>

            {/* Progress line + dots */}
            <div className="relative flex flex-col items-end gap-0">
                {SECTIONS.map((section, i) => {
                    const isActive = i === activeIndex
                    const isPast = i < activeIndex

                    return (
                        <button
                            key={section.id}
                            onClick={() => handleClick(section.id)}
                            className="group relative flex items-center gap-3 py-2 cursor-pointer"
                        >
                            {/* Label */}
                            <span
                                className={`text-[10px] uppercase tracking-[0.2em] font-mono transition-all duration-500 ${isActive
                                    ? "text-white opacity-100 translate-x-0"
                                    : "text-white/30 opacity-70 translate-x-1 group-hover:text-white/60 group-hover:translate-x-0"
                                    }`}
                            >
                                {section.label}
                            </span>

                            {/* Dot */}
                            <div className="relative flex flex-col items-center">
                                <div
                                    className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${isActive
                                        ? "bg-white scale-150 shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                                        : isPast
                                            ? "bg-white/40 scale-100"
                                            : "bg-white/15 scale-100 group-hover:bg-white/30"
                                        }`}
                                />
                            </div>
                        </button>
                    )
                })}

                {/* Vertical progress track */}
                <div className="absolute right-[2.5px] top-[10px] bottom-[10px] w-px bg-white/6">
                    <div
                        className="w-full bg-white/30 origin-top transition-all duration-700 ease-out"
                        style={{ height: `${(activeIndex / (SECTIONS.length - 1)) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    )
}
