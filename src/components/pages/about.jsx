"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import BlurText from "@/components/BlurText"

gsap.registerPlugin(ScrollTrigger)

const STORY_SECTIONS = [
    {
        tag: "01 — INTRODUCTION",
        heading: "Hi, I'm Tuan.",
        body: "A Frontend-Focused Fullstack Developer who crafts digital experiences that feel alive. I believe great interfaces aren't just seen — they're felt.",
        image: "/img/aboutme.jpg",
        imageAlt: "Nguyen Dinh Tuan",
        layout: "image-right",
    },
    {
        tag: "02 — ORIGIN",
        heading: "Where It Began",
        body: "My journey started with a simple question: how do the websites I admire actually work? That curiosity led me into code editors, terminal windows, and countless late-night debugging sessions that became the foundation of everything I build today.",
        image: "/img/aboutme2.jpg",
        imageAlt: "Tuan exploring development",
        layout: "image-left",
    },
    {
        tag: "03 — CRAFT",
        heading: "What I Do",
        body: "With over 2 years of experience, I work primarily with React and modern JavaScript to build responsive, performant interfaces. I also develop backend APIs and architect databases — giving me a fullstack perspective that shapes how I approach every project.",
        image: "/img/aboutme.jpg",
        imageAlt: "Working on code",
        layout: "image-right",
    },
    {
        tag: "04 — FRONTIER",
        heading: "What Excites Me Now",
        body: "I'm currently diving deep into animation systems, smooth scroll interactions, and 3D web experiences. I love pushing the boundary between engineering and art — turning every pixel into a purposeful moment.",
        image: "/img/aboutme2.jpg",
        imageAlt: "Creative exploration",
        layout: "image-left",
    },
]

export const AboutPage = () => {
    const sectionRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            // ──────────────────────────────────────────────
            // Kaitonote-style image reveal:
            //   1. Container = overflow:hidden mask
            //   2. Image starts translated DOWN (hidden below mask bottom)
            //   3. As container enters viewport, image slides UP through the mask
            //   4. Image moves at slower rate = parallax depth effect
            // ──────────────────────────────────────────────

            const blocks = document.querySelectorAll(".about-story-block")

            blocks.forEach((block) => {
                const imageWrapper = block.querySelector(".about-image-mask")
                const img = block.querySelector(".about-image-inner")
                const content = block.querySelector(".about-story-content")
                const tag = block.querySelector(".about-story-tag")
                const line = block.querySelector(".about-story-line")
                const heading = block.querySelector(".about-story-heading")
                const body = block.querySelector(".about-story-body")
                const number = block.querySelector(".about-story-number")

                // ── IMAGE PARALLAX REVEAL ──
                // The wrapper acts as a viewport/window.
                // The img inside is taller (130%) and slides through it.
                if (img) {
                    gsap.fromTo(img, {
                        yPercent: 20,
                        scale: 1.15,
                    }, {
                        yPercent: -20,
                        scale: 1,
                        ease: "none",
                        scrollTrigger: {
                            trigger: imageWrapper,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: true,
                        }
                    })
                }

                // ── IMAGE WRAPPER OPACITY REVEAL (subtle) ──
                if (imageWrapper) {
                    gsap.fromTo(imageWrapper, {
                        opacity: 0,
                        y: 80,
                    }, {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: imageWrapper,
                            start: "top 90%",
                            end: "top 50%",
                            scrub: 1,
                        }
                    })
                }

                // ── TEXT ANIMATIONS ──
                // Tag + line
                if (tag) {
                    gsap.fromTo(tag, {
                        opacity: 0,
                        x: -15,
                    }, {
                        opacity: 1,
                        x: 0,
                        duration: 0.8,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: content,
                            start: "top 80%",
                            toggleActions: "play none none reverse",
                        }
                    })
                }

                if (line) {
                    gsap.fromTo(line, {
                        scaleX: 0,
                    }, {
                        scaleX: 1,
                        duration: 0.8,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: content,
                            start: "top 80%",
                            toggleActions: "play none none reverse",
                        }
                    })
                }

                // Heading slide up
                if (heading) {
                    gsap.fromTo(heading, {
                        y: 40,
                        opacity: 0,
                    }, {
                        y: 0,
                        opacity: 1,
                        duration: 1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: content,
                            start: "top 75%",
                            toggleActions: "play none none reverse",
                        }
                    })
                }

                // Body slide up (staggered)
                if (body) {
                    gsap.fromTo(body, {
                        y: 30,
                        opacity: 0,
                    }, {
                        y: 0,
                        opacity: 1,
                        duration: 1,
                        ease: "power3.out",
                        delay: 0.15,
                        scrollTrigger: {
                            trigger: content,
                            start: "top 75%",
                            toggleActions: "play none none reverse",
                        }
                    })
                }

                // Decorative number
                if (number) {
                    gsap.fromTo(number, {
                        y: 20,
                        opacity: 0,
                    }, {
                        y: 0,
                        opacity: 1,
                        duration: 1,
                        ease: "power3.out",
                        delay: 0.25,
                        scrollTrigger: {
                            trigger: content,
                            start: "top 75%",
                            toggleActions: "play none none reverse",
                        }
                    })
                }
            })
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <section
            ref={sectionRef}
            id="about"
            className="relative overflow-hidden"
        >
            {/* ── HERO INTRO ── */}
            <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
                <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-neutral-500 mb-6 block">
                    About Me
                </span>
                <BlurText
                    text="The Story Behind the Code"
                    delay={80}
                    animateBy="words"
                    direction="top"
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-neutral-900 tracking-tight justify-center text-center mb-4"
                />
                <BlurText
                    text="Developer. Design thinker. Pixel perfectionist."
                    delay={60}
                    animateBy="words"
                    direction="top"
                    className="text-sm sm:text-base md:text-lg text-neutral-500 max-w-lg justify-center text-center"
                />
            </div>

            {/* ── STORY BLOCKS ── */}
            <div className="max-w-6xl mx-auto px-6 md:px-12 pb-32 space-y-24 md:space-y-40">
                {STORY_SECTIONS.map((section, i) => {
                    const isImageRight = section.layout === "image-right"
                    // Staggered vertical offset for floating feel (kaitonote style)
                    const imageOffset = i % 2 === 0 ? "lg:mt-0" : "lg:mt-20"

                    return (
                        <div
                            key={i}
                            className={`about-story-block flex flex-col ${isImageRight ? "lg:flex-row" : "lg:flex-row-reverse"
                                } items-start gap-10 lg:gap-20`}
                        >
                            {/* ── IMAGE (Kaitonote parallax window) ── */}
                            <div className={`w-full lg:w-[55%] ${imageOffset}`}>
                                {/*
                                  The mask container:
                                  - overflow-hidden crops the image
                                  - Fixed aspect ratio creates the "window"
                                  - Image inside is scaled 130% to allow parallax travel
                                */}
                                <div className="about-image-mask relative overflow-hidden rounded-2xl aspect-[3/4] sm:aspect-[4/5] bg-neutral-900">
                                    <img
                                        src={section.image}
                                        alt={section.imageAlt}
                                        className="about-image-inner absolute inset-0 w-full h-[130%] object-cover will-change-transform"
                                    />
                                    {/* Subtle gradient at bottom */}
                                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-neutral-950/40 to-transparent pointer-events-none" />
                                </div>
                            </div>

                            {/* ── CONTENT ── */}
                            <div className={`about-story-content w-full lg:w-[45%] ${isImageRight ? "lg:pr-4" : "lg:pl-4"
                                } flex flex-col justify-center lg:pt-16`}>
                                {/* Tag with line */}
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="about-story-tag text-xs font-bold font-mono uppercase tracking-[0.2em] text-neutral-500">
                                        {section.tag}
                                    </span>
                                    <div className="about-story-line h-px w-12 bg-neutral-300 origin-left" />
                                </div>

                                {/* Heading */}
                                <h3 className="about-story-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-neutral-900 tracking-tight leading-tight mb-6">
                                    {section.heading}
                                </h3>

                                {/* Body */}
                                <p className="about-story-body text-base sm:text-lg md:text-xl font-medium text-neutral-600 leading-relaxed max-w-xl">
                                    {section.body}
                                </p>

                                {/* Decorative number */}
                                <div className="about-story-number mt-8">
                                    <span className="text-7xl sm:text-8xl md:text-9xl font-black text-neutral-900/3 leading-none font-mono select-none">
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* ── TRANSITION TO CONTACT ── */}
            <div className="py-28 md:py-40 px-6 text-center">
                <BlurText
                    text="I enjoy turning ideas into polished digital products that combine good engineering with thoughtful design."
                    delay={40}
                    animateBy="words"
                    direction="top"
                    className="text-lg sm:text-xl md:text-2xl text-neutral-500 max-w-3xl mx-auto justify-center text-center italic mb-6"
                />
                <p className="text-xs font-mono text-neutral-600 tracking-widest uppercase">
                    — Nguyen Dinh Tuan
                </p>
            </div>
        </section>
    )
}