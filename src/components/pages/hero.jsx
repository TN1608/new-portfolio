"use client"

import { forwardRef, useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Button } from "@/components/ui/button"
import { ArrowDown } from "lucide-react"
import RotatingText from "@/components/RotatingText.jsx"

gsap.registerPlugin(ScrollTrigger)

export const Hero = forwardRef((props, ref) => {
    const containerRef = useRef(null)
    const bgWrapperRef = useRef(null)
    const bgImageRef = useRef(null)
    const headingWrapRef = useRef(null)
    const subRef = useRef(null)
    const ctaRef = useRef(null)
    const scrollIndicatorRef = useRef(null)
    const textStrokelayerRef = useRef(null)
    const textSolidlayerRef = useRef(null)
    const badgeRef = useRef(null)

    // Transition refs
    const isTransitioning = useRef(false)
    const barsRef = useRef([])

    useEffect(() => {
        const ctx = gsap.context(() => {
            // ── MAIN MOUNT TIMELINE ──
            const tl = gsap.timeline({
                defaults: { ease: "power4.inOut" },
                delay: 4.8 // Wait for preloader to finish fully
            })

            // 1. Background image reveals via clip-path and scales down
            gsap.set(bgWrapperRef.current, { clipPath: "inset(25% 15% 25% 15% round 20px)" })
            gsap.set(bgImageRef.current, { scale: 1.3 })

            tl.to(bgWrapperRef.current, {
                clipPath: "inset(0% 0% 0% 0% round 0px)",
                duration: 1.6,
                ease: "expo.inOut"
            }, 0)

            tl.to(bgImageRef.current, {
                scale: 1,
                duration: 1.8,
                ease: "expo.out"
            }, 0)

            // 1.5 Badge pops up
            tl.fromTo(badgeRef.current,
                { opacity: 0, y: 30, scale: 0.9 },
                { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "back.out(1.5)" },
                0.4
            )

            // 2. Heading characters animate up (3D wave)
            // Stagger both solid and stroke layers together
            const solidChars = textSolidlayerRef.current?.querySelectorAll(".char")
            const strokeChars = textStrokelayerRef.current?.querySelectorAll(".char")

            if (solidChars?.length && strokeChars?.length) {
                gsap.set([solidChars, strokeChars], {
                    yPercent: 120,
                    rotateX: -80,
                    opacity: 0,
                    transformOrigin: "50% 100% -50px"
                })

                tl.to([solidChars, strokeChars], {
                    yPercent: 0,
                    rotateX: 0,
                    opacity: 1,
                    duration: 1.2,
                    stagger: 0.05,
                    ease: "back.out(1.4)"
                }, 0.6)
            }

            // 3. Subtitle slides in
            tl.fromTo(subRef.current,
                { opacity: 0, y: 40, filter: "blur(10px)" },
                { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, ease: "power3.out" },
                1.3
            )

            // 4. CTA buttons pop in
            tl.fromTo(ctaRef.current?.children,
                { opacity: 0, scale: 0.8, y: 30 },
                { opacity: 1, scale: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "back.out(2)" },
                1.5
            )

            // 5. Scroll indicator drops in
            tl.fromTo(scrollIndicatorRef.current,
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0, duration: 0.8, ease: "elastic.out(1, 0.5)" },
                1.8
            )

            gsap.to(scrollIndicatorRef.current, {
                y: 10, duration: 1.5, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 2.6
            })

            // ── SCROLL PARALLAX (3D Scale Down) ──
            ScrollTrigger.create({
                trigger: containerRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true,
                animation: gsap.timeline()
                    .to(bgWrapperRef.current, {
                        scale: 0.85, 
                        borderRadius: "40px", 
                        opacity: 0,
                        ease: "power1.inOut" 
                    }, 0)
                    .to(headingWrapRef.current, { yPercent: -40, opacity: 0, scale: 0.9, ease: "power1.inOut" }, 0)
                    .to(subRef.current, { yPercent: -60, opacity: 0, ease: "power1.inOut" }, 0)
                    .to(ctaRef.current, { yPercent: -80, opacity: 0, ease: "power1.inOut" }, 0)
                    .to(scrollIndicatorRef.current, { opacity: 0, ease: "power1.inOut" }, 0)
                    .to(badgeRef.current, { yPercent: -20, opacity: 0, ease: "power1.inOut" }, 0)
            })

            // ── MOUSE PARALLAX ──
            const handleMouseMove = (e) => {
                const { clientX, clientY } = e
                const cx = window.innerWidth / 2
                const cy = window.innerHeight / 2
                const dx = (clientX - cx) / cx // -1 to 1
                const dy = (clientY - cy) / cy // -1 to 1

                gsap.to(bgImageRef.current, {
                    x: dx * -30,
                    y: dy * -30,
                    duration: 1,
                    ease: "power2.out"
                })

                gsap.to(headingWrapRef.current, {
                    x: dx * 40,
                    y: dy * 40,
                    rotateX: dy * -3,
                    rotateY: dx * 3,
                    duration: 1.5,
                    ease: "power2.out"
                })
            }

            window.addEventListener("mousemove", handleMouseMove)
            return () => window.removeEventListener("mousemove", handleMouseMove)

        }, containerRef)

        return () => ctx.revert()
    }, [])

    // ── NAVIGATION TRANSITION ──
    const handleNavigate = (id) => {
        if (isTransitioning.current) return
        const target = document.getElementById(id)
        if (!target) return

        isTransitioning.current = true

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
            if (window.__lenis) {
                window.__lenis.scrollTo(target, { immediate: true })
            } else {
                target.scrollIntoView()
            }
        })

        // 3. Lift curtains
        tl.to(barsRef.current, {
            yPercent: (i) => i % 2 === 0 ? -110 : 110,
            duration: 0.8,
            ease: "power4.inOut",
            stagger: 0.06,
            delay: 0.2, // brief moment of solid cover
            onComplete: () => {
                gsap.set(barsRef.current, { display: "none" })
            }
        })
    }

    // Text split helper
    const text = "DIGITAL\nEXPERIENCES"
    const words = text.split("\n")

    return (
        <section
            ref={(el) => {
                containerRef.current = el
                if (typeof ref === 'function') ref(el)
                else if (ref) ref.current = el
            }}
            id="hero"
            className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#050505]"
        >
            {/* ── CURTAIN TRANSITION BARS ── */}
            <div className="fixed inset-0 z-[300] pointer-events-none flex w-full h-full">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={`hero-bar-${i}`}
                        ref={(el) => (barsRef.current[i] = el)}
                        className="h-full flex-1 -ml-px first:ml-0"
                        style={{ background: "#0a0a0a", display: "none" }}
                    />
                ))}
            </div>

            {/* ── BACKGROUND IMAGE WRAPPER ── */}
            <div
                ref={bgWrapperRef}
                className="absolute inset-0 w-full h-full overflow-hidden z-0"
                style={{ willChange: "clip-path, transform" }}
            >
                <div
                    ref={bgImageRef}
                    className="absolute inset-[-5%] w-[110%] h-[110%] bg-cover bg-center"
                    style={{
                        backgroundImage: "url('/img/bgcta.jpg')",
                        willChange: "transform",
                    }}
                />
                {/* Dark overlay for readability */}
                <div className="absolute inset-0 bg-black/60 z-10" />
            </div>

            {/* ── MAIN CONTENT ── */}
            <div className="container relative z-20 px-4 md:px-12 flex flex-col items-center justify-center h-full text-center mt-12">

                {/* Profile & Role Info */}
                <div ref={badgeRef} className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-8 opacity-0">
                    <div className="flex items-center gap-3 bg-white/5 pr-5 p-1.5 rounded-full border border-white/10 backdrop-blur-md">
                        <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center text-lg font-black font-mono">
                            T
                        </div>
                        <div className="flex flex-col items-start text-left">
                            <span className="text-white font-bold text-sm tracking-wide leading-tight">Tuan Nguyen</span>
                            <span className="text-white/50 text-[10px] uppercase tracking-widest font-mono mt-0.5">Frontend Developer</span>
                        </div>
                    </div>

                    <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-white/20" />

                    <RotatingText
                        texts={["UI/UX Enthusiast", "Creative Developer", "Full-Stack Capable"]}
                        mainClassName="px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold bg-white/10 text-white overflow-hidden justify-center border border-white/20 backdrop-blur-md"
                        staggerFrom={"last"}
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "-120%" }}
                        staggerDuration={0.025}
                        splitLevelClassName="overflow-hidden pb-0.5"
                        transition={{ type: "spring", damping: 30, stiffness: 400 }}
                        rotationInterval={3000}
                    />
                </div>

                {/* Typography Wrapper (3D perspective) */}
                <div
                    ref={headingWrapRef}
                    className="relative w-full mb-8 lg:mb-12 select-none"
                    style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
                >
                    {/* Layer 1: Solid Text (Behind) */}
                    <div
                        ref={textSolidlayerRef}
                        className="absolute inset-0 flex flex-col items-center justify-center"
                    >
                        {words.map((word, wIdx) => (
                            <div key={`solid-word-${wIdx}`} className="overflow-hidden leading-[0.85] pb-2">
                                {word.split("").map((char, cIdx) => (
                                    <span
                                        key={`solid-char-${wIdx}-${cIdx}`}
                                        className="char inline-block font-black text-[12vw] sm:text-[10vw] md:text-[9vw] lg:text-[11vw] tracking-tighter text-white opacity-0"
                                        style={{ transformStyle: "preserve-3d" }}
                                    >
                                        {char}
                                    </span>
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* Layer 2: Stroke Text (Front, overlaps solid to create effect) */}
                    <div
                        ref={textStrokelayerRef}
                        className="flex flex-col items-center justify-center relative translate-y-[2px] md:translate-y-[4px]"
                    >
                        {words.map((word, wIdx) => (
                            <div key={`stroke-word-${wIdx}`} className="overflow-hidden leading-[0.85] pb-2">
                                {word.split("").map((char, cIdx) => (
                                    <span
                                        key={`stroke-char-${wIdx}-${cIdx}`}
                                        className="char inline-block font-black text-[12vw] sm:text-[10vw] md:text-[9vw] lg:text-[11vw] tracking-tighter opacity-0"
                                        style={{
                                            WebkitTextStroke: "1px rgba(255,255,255,0.4)",
                                            color: "transparent",
                                            transformStyle: "preserve-3d"
                                        }}
                                    >
                                        {char}
                                    </span>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Subtitle */}
                <p
                    ref={subRef}
                    className="max-w-2xl text-sm md:text-base lg:text-lg text-white/70 mb-10 md:mb-12 leading-relaxed opacity-0"
                >
                    I build comprehensive full-stack solutions with a focus on
                    immersive frontend experiences and cutting-edge animations.
                </p>

                {/* CTA Buttons */}
                <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 mb-16">
                    <Button
                        size="lg"
                        className="group px-8 py-6 text-sm font-bold tracking-wide uppercase rounded-full bg-white text-black hover:bg-white/90 transition-all duration-300"
                        onClick={() => handleNavigate('projects')}
                    >
                        View My Work
                        <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                    </Button>
                </div>

                {/* Scroll Indicator */}
                <div
                    ref={scrollIndicatorRef}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-white/50 cursor-pointer"
                    onClick={() => handleNavigate('projects')}
                >
                    <span className="text-[10px] font-mono uppercase tracking-[0.4em]">Scroll</span>
                    <ArrowDown className="w-4 h-4" />
                </div>
            </div>
        </section>
    )
})

Hero.displayName = "Hero"