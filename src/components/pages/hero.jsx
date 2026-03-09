"use client"

import { forwardRef, useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"
import { Meteors } from "@/components/meteors.jsx"
import RotatingText from "@/components/RotatingText.jsx"
import { ArrowDown } from "lucide-react"

export const Hero = forwardRef((props, ref) => {
    const containerRef = useRef(null)
    const badgeRef = useRef(null)
    const headingRef = useRef(null)
    const subRef = useRef(null)
    const ctaRef = useRef(null)
    const scrollIndicatorRef = useRef(null)
    const gridRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            // ── Master entrance timeline ──
            const tl = gsap.timeline({
                defaults: { ease: "power3.out" },
                delay: 0.3 // Let the page settle
            })

            // 1. Grid background fades in with a slow zoom
            tl.fromTo(gridRef.current,
                { opacity: 0, scale: 1.3 },
                { opacity: 1, scale: 1, duration: 2, ease: "expo.out" },
                0
            )

            // 2. Badge slides up with a bouncy elastic
            tl.fromTo(badgeRef.current,
                { opacity: 0, y: 60, scale: 0.7 },
                { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "back.out(2)" },
                0.2
            )

            // 3. Heading characters: split and animate each word
            const headingWords = headingRef.current?.querySelectorAll(".hero-word")
            if (headingWords?.length) {
                tl.fromTo(headingWords,
                    {
                        opacity: 0,
                        y: 120,
                        rotateX: -90,
                        transformOrigin: "50% 100%"
                    },
                    {
                        opacity: 1,
                        y: 0,
                        rotateX: 0,
                        duration: 1.4,
                        ease: "expo.out",
                        stagger: 0.08
                    },
                    0.4
                )
            }

            // 4. Subtitle slides up
            tl.fromTo(subRef.current,
                { opacity: 0, y: 40, filter: "blur(10px)" },
                { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, ease: "power2.out" },
                0.9
            )

            // 5. CTA buttons pop in with elastic
            const buttons = ctaRef.current?.querySelectorAll("button, a")
            if (buttons?.length) {
                tl.fromTo(buttons,
                    { opacity: 0, y: 30, scale: 0.8 },
                    {
                        opacity: 1, y: 0, scale: 1,
                        duration: 0.8,
                        ease: "back.out(2.5)",
                        stagger: 0.15
                    },
                    1.2
                )
            }

            // 6. Scroll indicator bounces in
            tl.fromTo(scrollIndicatorRef.current,
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0, duration: 0.8, ease: "elastic.out(1, 0.5)" },
                1.6
            )

            // Continuous scroll indicator bounce
            gsap.to(scrollIndicatorRef.current, {
                y: 10,
                duration: 1.5,
                yoyo: true,
                repeat: -1,
                ease: "sine.inOut",
                delay: 2.5
            })

            // ── Magnetic Button Effect ──
            const magneticButtons = containerRef.current?.querySelectorAll(".magnetic-btn")
            magneticButtons?.forEach(btn => {
                const handleMouseMove = (e) => {
                    const rect = btn.getBoundingClientRect()
                    const x = e.clientX - rect.left - rect.width / 2
                    const y = e.clientY - rect.top - rect.height / 2
                    gsap.to(btn, {
                        x: x * 0.3,
                        y: y * 0.3,
                        duration: 0.4,
                        ease: "power2.out"
                    })
                }
                const handleMouseLeave = () => {
                    gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" })
                }
                btn.addEventListener("mousemove", handleMouseMove)
                btn.addEventListener("mouseleave", handleMouseLeave)
            })

        }, containerRef)

        return () => ctx.revert()
    }, [])

    // Split headline text into words for individual animation
    const headlineText = "Creating Digital Experiences That Matter"
    const headlineWords = headlineText.split(" ")

    return (
        <section
            ref={(el) => {
                containerRef.current = el
                if (typeof ref === 'function') ref(el)
                else if (ref) ref.current = el
            }}
            id="hero"
            className="relative h-screen flex items-center justify-center overflow-hidden bg-background"
        >
            {/* ── Animated Grid Background ── */}
            <div
                ref={gridRef}
                className="absolute inset-0 opacity-0"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(128,128,128,0.06) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(128,128,128,0.06) 1px, transparent 1px)
                    `,
                    backgroundSize: "60px 60px"
                }}
            />

            {/* ── Radial glow behind the headline ── */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[600px] h-[600px] md:w-[800px] md:h-[800px] rounded-full bg-primary/5 blur-3xl" />
            </div>

            {/* Meteor shower (existing component) */}
            <Meteors number={50} />

            {/* ── Main Content ── */}
            <div className="container relative z-10 px-4 flex flex-col items-center text-center">

                {/* Badge */}
                <div ref={badgeRef} className="mb-8 opacity-0">
                    <RotatingText
                        texts={["Frontend-Focused Full-Stack Developer", "UI/UX Enthusiast", "Creative Developer"]}
                        mainClassName="px-5 py-2.5 rounded-full text-sm font-semibold bg-primary/10 text-foreground overflow-hidden justify-center border border-primary/20"
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

                {/* Headline - GSAP Split Text */}
                <div
                    ref={headingRef}
                    className="mb-8 overflow-hidden"
                    style={{ perspective: "1000px" }}
                >
                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[110px] font-black tracking-tighter leading-[0.9] text-foreground">
                        {headlineWords.map((word, i) => (
                            <span
                                key={i}
                                className="hero-word inline-block mr-[0.25em] opacity-0"
                                style={{ transformStyle: "preserve-3d" }}
                            >
                                {word}
                            </span>
                        ))}
                    </h1>
                </div>

                {/* Subtitle */}
                <p
                    ref={subRef}
                    className="max-w-2xl text-base md:text-lg lg:text-xl text-muted-foreground mb-10 leading-relaxed opacity-0"
                >
                    I build comprehensive full-stack solutions with a focus on
                    immersive frontend experiences and cutting-edge animations.
                </p>

                {/* CTA Buttons */}
                <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 mb-16">
                    <Button
                        size="lg"
                        className="magnetic-btn px-8 py-6 text-base font-bold rounded-2xl opacity-0"
                        onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        View My Work
                    </Button>

                    <Button
                        size="lg"
                        variant="outline"
                        className="magnetic-btn px-8 py-6 text-base font-bold rounded-2xl opacity-0"
                        onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        Contact Me
                    </Button>
                </div>

                {/* Scroll Indicator */}
                <div
                    ref={scrollIndicatorRef}
                    className="flex flex-col items-center gap-2 text-muted-foreground/60 opacity-0 cursor-pointer"
                    onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                >
                    <span className="text-xs font-mono uppercase tracking-[0.3em]">Scroll</span>
                    <ArrowDown className="w-4 h-4 animate-bounce" />
                </div>
            </div>
        </section>
    )
})

Hero.displayName = "Hero"