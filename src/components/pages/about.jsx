"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import BlurText from "@/components/BlurText"

gsap.registerPlugin(ScrollTrigger)

const STORY_SECTIONS = [
    {
        tag: "01 — INTRODUCTION",
        heading: "Crafting Experiences.",
        body: "Hi, I'm Tuan. I bridge the gap between engineering and design, turning complex logic into intuitive, pixel-perfect interfaces that truly feel alive.",
        image: "/img/aboutme.jpg",
        imageAlt: "Nguyen Dinh Tuan",
        layout: "right"
    },
    {
        tag: "02 — EVOLUTION",
        heading: "Beyond Static Webs.",
        body: "Websites shouldn't just be read; they should be experienced. I leverage modern tools like React, GSAP, and 3D rendering to create fluid, storytelling-driven journeys.",
        image: "/img/aboutme2.jpg",
        imageAlt: "Exploring development code",
        layout: "left"
    },
    {
        tag: "03 — VISION",
        heading: "Every Pixel Matters.",
        body: "From resilient database architectures to the finest easing curve in an animation, I care deeply about the complete picture and the final user experience.",
        image: "/img/team_pics.jpg",
        imageAlt: "Graduation Project Team and Personal Growth",
        layout: "center"
    },
]

export const AboutPage = () => {
    const sectionRef = useRef(null)
    const blocksRef = useRef([])

    useEffect(() => {
        const ctx = gsap.context(() => {

            // ── HERO INTRO ANIMATION ──
            gsap.fromTo(".about-hero-fade",
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    stagger: 0.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 75%",
                    }
                }
            )

            // ── STORY BLOCKS ANIMATION ──
            blocksRef.current.forEach((block) => {
                if (!block) return;

                const tag = block.querySelector(".story-tag");
                const line = block.querySelector(".story-line");
                const heading = block.querySelector(".story-heading");
                const words = block.querySelectorAll(".story-word");
                const imageWrapper = block.querySelector(".story-image-mask");
                const imageInner = block.querySelector(".story-image-inner");

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: block,
                        start: "top 75%",
                        // toggleActions: play pause resume reverse
                    }
                });

                // 1. Tag & Line Reveal
                if (tag && line) {
                    tl.fromTo(tag, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }, 0)
                    tl.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: "power2.out" }, 0)
                }

                // 2. Heading Fade Up
                if (heading) {
                    tl.fromTo(heading,
                        { opacity: 0, y: 30 },
                        { opacity: 1, y: 0, duration: 0.8, ease: "back.out(1.2)" },
                        0.2
                    )
                }

                // 3. Word by Word Body Text Reveal (GSAP storytelling)
                if (words.length > 0) {
                    tl.fromTo(words,
                        { opacity: 0, y: 15, filter: "blur(4px)" },
                        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8, stagger: 0.04, ease: "power2.out" },
                        0.4
                    )
                }

                // 4. Parallax Image Mask Reveal
                // Image container is unmasked from bottom to top, image scales down slightly
                if (imageWrapper && imageInner) {
                    tl.fromTo(imageWrapper,
                        { clipPath: "inset(100% 0% 0% 0%)" },
                        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "power4.inOut" },
                        0.3
                    )
                    tl.fromTo(imageInner,
                        { scale: 1.4 },
                        { scale: 1, duration: 1.5, ease: "power4.inOut" },
                        0.3
                    )
                }
            })

        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <section
            ref={sectionRef}
            id="about"
            className="relative bg-background text-foreground pb-12"
        >
            {/* ── HERO INTRO ── */}
            <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center pt-32 pb-16">
                <span className="about-hero-fade text-[10px] md:text-sm font-mono uppercase tracking-[0.4em] text-muted-foreground mb-6 block">
                    Focus & Identity
                </span>
                <BlurText
                    text="The Story Behind the Code"
                    delay={60}
                    animateBy="words"
                    direction="top"
                    className="text-4xl sm:text-5xl md:text-7xl lg:text-[80px] font-black text-foreground tracking-tight leading-none justify-center text-center mb-6"
                />
                <h2 className="about-hero-fade text-sm sm:text-base md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
                    Developer. Design thinker. Pixel perfectionist.
                </h2>
            </div>

            {/* ── INLINE STORYTELLING BLOCKS ── */}
            <div className="w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col gap-32 md:gap-48 mt-10">
                {STORY_SECTIONS.map((section, i) => {
                    const isRight = section.layout === "right"
                    const isCenter = section.layout === "center"

                    return (
                        <div
                            key={i}
                            ref={el => blocksRef.current[i] = el}
                            className={`flex flex-col ${isCenter ? 'items-center text-center' : (isRight ? 'md:flex-row' : 'md:flex-row-reverse')} items-center gap-12 md:gap-24`}
                        >
                            {/* ── TEXT CONTENT ── */}
                            <div className={`w-full ${isCenter ? 'max-w-3xl' : 'md:w-1/2'} flex flex-col ${isCenter ? 'items-center' : ''}`}>
                                {/* Tag with line */}
                                <div className={`flex items-center gap-4 mb-6 ${isCenter ? 'justify-center' : ''}`}>
                                    <span className="story-tag text-xs font-bold font-mono uppercase tracking-[0.2em] text-muted-foreground">
                                        {section.tag}
                                    </span>
                                    {!isCenter && <div className="story-line h-px w-16 bg-neutral-300 origin-left" />}
                                </div>

                                {/* Heading */}
                                <h3 className="story-heading text-4xl sm:text-5xl md:text-6xl font-black text-foreground tracking-tight leading-[1.1] mb-6">
                                    {section.heading}
                                </h3>

                                {/* Body with Word Splitting for GSAP Animation */}
                                <p className={`text-lg md:text-2xl font-medium text-muted-foreground leading-relaxed flex flex-wrap gap-x-[0.3em] gap-y-[0.2em] ${isCenter ? 'justify-center' : ''}`}>
                                    {section.body.split(" ").map((word, wordIndex) => (
                                        <span key={wordIndex} className="story-word inline-block will-change-[transform,opacity,filter]">
                                            {word}
                                        </span>
                                    ))}
                                </p>
                            </div>

                            {/* ── INLINE IMAGE REVEAL ── */}
                            <div className={`w-full ${isCenter ? 'max-w-5xl h-[40vh] md:h-[60vh] mt-10' : 'md:w-1/2 h-[50vh] md:h-[70vh]'}`}>
                                <div className="story-image-mask w-full h-full relative overflow-hidden rounded-3xl shadow-2xl">
                                    <img
                                        src={section.image}
                                        alt={section.imageAlt}
                                        className="story-image-inner absolute inset-0 w-full h-full object-cover will-change-transform"
                                    />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* ── FOOTER TRANSITION TO NEXT SECTION ── */}
            <div className="pt-40 px-6 text-center">
                <div className="w-px h-24 bg-neutral-300 mx-auto mb-10" />
                <BlurText
                    text="I enjoy turning ideas into polished digital products that combine good engineering with thoughtful design."
                    delay={40}
                    animateBy="words"
                    direction="top"
                    className="text-xl sm:text-2xl md:text-4xl text-foreground max-w-4xl mx-auto justify-center text-center font-bold leading-snug mb-8"
                />
                <p className="text-xs font-mono text-muted-foreground tracking-[0.3em] uppercase">
                    — Nguyen Dinh Tuan
                </p>
            </div>
        </section>
    )
}