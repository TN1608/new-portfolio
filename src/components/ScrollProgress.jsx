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
    
    // Transition refs
    const isTransitioning = useRef(false)
    const barsRef = useRef([])

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

        // Delay trigger creation
        const delayedSetup = gsap.delayedCall(0.5, () => {
            ScrollTrigger.refresh()

            SECTIONS.forEach((section, i) => {
                const el = document.getElementById(section.id)
                if (!el) return

                const st = ScrollTrigger.create({
                    trigger: el,
                    start: "top center",
                    end: "bottom center",
                    refreshPriority: -10,
                    onEnter: () => {
                        if (isTransitioning.current) return;
                        setActiveIndex(i)
                        setIsHidden(section.id === "projects")
                    },
                    onEnterBack: () => {
                        if (isTransitioning.current) return;
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

    const handleClick = (id, index) => {
        if (isTransitioning.current) return
        const target = document.getElementById(id)
        if (!target) return

        isTransitioning.current = true
        setActiveIndex(index) // Optimistic update
        setIsHidden(id === "projects")

        const tl = gsap.timeline({
            onComplete: () => { isTransitioning.current = false }
        })

        // 1. Drop curtains to cover screen
        tl.fromTo(barsRef.current, {
            yPercent: (i) => i % 2 === 0 ? -110 : 110,
            display: "block"
        }, {
            yPercent: 0,
            duration: 0.8,
            ease: "power4.inOut",
            stagger: 0.06
        })

        // 2. Instant scroll when fully covered
        tl.call(() => {
            // Find if there's a pinning ScrollTrigger for this section to get the exact start scroll position
            const pinningST = ScrollTrigger.getAll().find(st => st.trigger === target && st.vars.pin)
            const scrollPos = pinningST ? pinningST.start : target

            if (window.__lenis) {
                window.__lenis.scrollTo(scrollPos, { immediate: true })
            } else {
                if (typeof scrollPos === "number") {
                    window.scrollTo({ top: scrollPos })
                } else {
                    target.scrollIntoView()
                }
            }

            // Force ScrollTriggers to immediately jump their scrub tweens
            // so they don't visually rewind the animation from the previous scroll spot
            setTimeout(() => {
                ScrollTrigger.update()
                ScrollTrigger.getAll().forEach(st => {
                    const scrubTween = st.getTween()
                    if (scrubTween) scrubTween.progress(1)
                })
            }, 50)
        })

        // 3. Small pause, then lift curtains
        tl.to(barsRef.current, {
            yPercent: (i) => i % 2 === 0 ? -110 : 110,
            duration: 0.8,
            ease: "power4.inOut",
            stagger: 0.06,
            delay: 0.2, // brief moment of black
            onComplete: () => {
                gsap.set(barsRef.current, { display: "none" })
            }
        })
    }

    return (
        <>
            {/* ── CURTAIN TRANSITION BARS ── */}
            <div className="fixed inset-0 z-[300] pointer-events-none flex w-full h-full">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={`bar-${i}`}
                        ref={(el) => (barsRef.current[i] = el)}
                        className="h-full flex-1 -ml-px first:ml-0"
                        style={{ background: "#0a0a0a", display: "none" }}
                    />
                ))}
            </div>

            <div
                ref={containerRef}
                className={`fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-end gap-1 mix-blend-difference transition-all duration-500 ${isHidden ? "opacity-0 pointer-events-none translate-x-4" : "opacity-100 translate-x-0"
                    }`}
            >
                {/* Percent */}
                <div className="mb-3 text-right">
                    <span className="text-[10px] font-mono text-background/30 tracking-widest block">
                        SCROLL
                    </span>
                    <span className="text-xs font-mono text-background/60 tabular-nums">
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
                                onClick={() => handleClick(section.id, i)}
                                className="group relative flex items-center gap-3 py-2 cursor-pointer"
                            >
                                {/* Label */}
                                <span
                                    className={`text-[10px] uppercase tracking-[0.2em] font-mono transition-all duration-500 ${isActive
                                        ? "text-background opacity-100 translate-x-0"
                                        : "text-background/30 opacity-70 translate-x-1 group-hover:text-background/60 group-hover:translate-x-0"
                                        }`}
                                >
                                    {section.label}
                                </span>

                                {/* Dot */}
                                <div className="relative flex flex-col items-center">
                                    <div
                                        className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${isActive
                                            ? "bg-background scale-150 shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                                            : isPast
                                                ? "bg-background/40 scale-100"
                                                : "bg-background/15 scale-100 group-hover:bg-background/30"
                                            }`}
                                    />
                                </div>
                            </button>
                        )
                    })}

                    {/* Vertical progress track */}
                    <div className="absolute right-[2.5px] top-[10px] bottom-[10px] w-px bg-background/6">
                        <div
                            className="w-full bg-background/30 origin-top transition-all duration-700 ease-out"
                            style={{ height: `${(activeIndex / (SECTIONS.length - 1)) * 100}%` }}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
