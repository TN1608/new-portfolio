"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import BlurText from "@/components/BlurText"
import { AnimatedLink } from "@/components/ui/animated-link"
import { CONTACT_INFO, ABOUT_ME_LINKS } from "@/assets/data/CONTACT"
import { ArrowUpRight } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

const GMAIL_COMPOSE_URL = "https://mail.google.com/mail/?view=cm&to=tuanngdinh.1608@gmail.com&su=Collaboration+Inquiry+%E2%80%93+From+Your+Portfolio&body=Hi+Tuan%2C%0A%0AI+came+across+your+portfolio+and+was+impressed+by+your+work.+I%E2%80%99d+love+to+discuss+a+potential+opportunity.%0A%0ABest+regards%2C%0A%5BYour+Name%5D"

export const ContactPage = () => {
    const sectionRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            const els = gsap.utils.toArray(".contact-animate")
            const lines = gsap.utils.toArray(".contact-line-draw")

            // Single timeline triggered by the section entering viewport
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                    toggleActions: "play none none reverse",
                }
            })

            // Stagger all contact elements
            tl.fromTo(els,
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.06,
                    ease: "power3.out",
                },
                0
            )

            // Draw horizontal lines
            tl.fromTo(lines,
                { scaleX: 0 },
                {
                    scaleX: 1,
                    duration: 1,
                    stagger: 0.15,
                    ease: "power3.out",
                },
                0.2
            )

        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <section
            ref={sectionRef}
            id="contact"
            className="relative bg-neutral-50 overflow-hidden"
        >
            {/* Divider transition from About */}
            <div className="contact-line-draw h-px bg-neutral-200 origin-left mx-6 md:mx-16" />

            <div className="min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-24 py-24 md:py-32">

                {/* ── TOP: Small label ── */}
                <div className="contact-animate mb-12 md:mb-20">
                    <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-neutral-500 flex items-center gap-3">
                        <span className="w-6 h-px bg-neutral-300 inline-block" />
                        Get In Touch
                    </span>
                </div>

                {/* ── HERO HEADING ── */}
                <div className="mb-16 md:mb-24 max-w-4xl">
                    <BlurText
                        text="Let's create something"
                        delay={60}
                        animateBy="words"
                        direction="top"
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-neutral-900 tracking-tight leading-none mb-2"
                    />
                    <BlurText
                        text="extraordinary together."
                        delay={60}
                        animateBy="words"
                        direction="top"
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-neutral-900 tracking-tight leading-none"
                    />
                </div>

                {/* ── MAIN CONTENT GRID ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

                    {/* Left: Reach out + email CTA */}
                    <div>
                        <p className="contact-animate text-sm sm:text-base text-neutral-600 leading-relaxed max-w-md mb-10">
                            I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision. Feel free to reach out.
                        </p>

                        {/* Email — large CTA */}
                        <div className="contact-animate">
                            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-500 block mb-3">
                                Say hello
                            </span>
                            <AnimatedLink
                                href={GMAIL_COMPOSE_URL}
                                className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight py-2"
                            >
                                tuanngdinh.1608
                                <span className="text-neutral-400">@gmail.com</span>
                            </AnimatedLink>
                        </div>
                    </div>

                    {/* Right: Social links + Quick links */}
                    <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-16">
                        {/* Socials */}
                        <div>
                            <span className="contact-animate text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-500 block mb-6">
                                Socials
                            </span>
                            <div className="flex flex-col gap-1">
                                {ABOUT_ME_LINKS.map((link) => (
                                    <div key={link.name} className="contact-animate">
                                        <AnimatedLink
                                            href={link.href}
                                            className="text-lg sm:text-xl md:text-2xl font-medium text-neutral-600 hover:text-neutral-900 py-1.5"
                                        >
                                            {link.name}
                                        </AnimatedLink>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Info */}
                        <div>
                            <span className="contact-animate text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-500 block mb-6">
                                Quick Links
                            </span>
                            <div className="flex flex-col gap-1">
                                {CONTACT_INFO.filter(c => c.label !== "Email").map((info) => (
                                    <div key={info.label} className="contact-animate">
                                        <AnimatedLink
                                            href={info.value.startsWith("http") ? info.value : `mailto:${info.value}`}
                                            className="text-lg sm:text-xl md:text-2xl font-medium text-neutral-600 hover:text-neutral-900 py-1.5"
                                        >
                                            {info.label}
                                        </AnimatedLink>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── BOTTOM LINE ── */}
                <div className="contact-line-draw h-px bg-neutral-200 origin-left mt-20 md:mt-32" />

                {/* ── FOOTER ── */}
                <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <p className="contact-animate text-xs font-mono text-neutral-500 tracking-wide">
                        © {new Date().getFullYear()} Nguyen Dinh Tuan. All rights reserved.
                    </p>
                    <p className="contact-animate text-xs font-mono text-neutral-500 tracking-wide flex items-center gap-1.5">
                        Built with React, GSAP & passion
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </p>
                </div>
            </div>
        </section>
    )
}