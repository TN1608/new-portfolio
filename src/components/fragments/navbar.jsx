"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { AnimatedLink } from "@/components/ui/animated-link"
import { MobileNavbar } from "@/components/fragments/mobile-navbar"

gsap.registerPlugin(ScrollTrigger)

const NAV_LINKS = [
    { label: "Projects", href: "#projects" },
    { label: "Skills", href: "#skills" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
]

export const Navbar = () => {
    const navRef = useRef(null)
    const logoRef = useRef(null)
    const linksRef = useRef([])
    const lineRef = useRef(null)
    const [hidden, setHidden] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const ctx = gsap.context(() => {

            // ── INITIAL WORD REVEAL ANIMATION ──
            const tl = gsap.timeline({ delay: 4.5 }) // After preloader

            // Logo reveal: slide in from left + blur
            tl.fromTo(logoRef.current,
                { opacity: 0, x: -30, filter: "blur(10px)" },
                { opacity: 1, x: 0, filter: "blur(0px)", duration: 0.8, ease: "power3.out" },
                0
            )

            // Nav links: staggered character reveal from bottom
            linksRef.current.forEach((link, i) => {
                if (!link) return
                const chars = link.querySelectorAll(".nav-char")
                tl.fromTo(chars,
                    { y: "110%", opacity: 0 },
                    {
                        y: "0%",
                        opacity: 1,
                        duration: 0.6,
                        stagger: 0.02,
                        ease: "power4.out",
                    },
                    0.1 + i * 0.08
                )
            })

            // Bottom line draws in
            tl.fromTo(lineRef.current,
                { scaleX: 0 },
                { scaleX: 1, duration: 1, ease: "power3.inOut" },
                0.3
            )

            // ── SCROLL HIDE/SHOW ──
            let lastScroll = 0
            ScrollTrigger.create({
                start: "top top",
                end: "max",
                onUpdate: (self) => {
                    const currentScroll = self.scroll()
                    const direction = currentScroll > lastScroll ? "down" : "up"

                    if (currentScroll > 100) {
                        setScrolled(true)
                        if (direction === "down" && currentScroll > 300) {
                            setHidden(true)
                        } else {
                            setHidden(false)
                        }
                    } else {
                        setScrolled(false)
                        setHidden(false)
                    }
                    lastScroll = currentScroll
                }
            })

        }, navRef)

        return () => ctx.revert()
    }, [])

    // Animate hide/show
    useEffect(() => {
        if (!navRef.current) return
        gsap.to(navRef.current, {
            y: hidden ? -120 : 0,
            duration: 0.4,
            ease: "power3.inOut",
        })
    }, [hidden])

    const handleNavClick = (e, href) => {
        e.preventDefault()
        const target = document.querySelector(href)
        if (target) {
            target.scrollIntoView({ behavior: "smooth" })
        }
    }

    const splitChars = (text) => {
        return text.split("").map((char, i) => (
            <span key={i} className="nav-char inline-block" style={{ willChange: "transform" }}>
                {char === " " ? "\u00A0" : char}
            </span>
        ))
    }

    return (
        <nav
            ref={navRef}
            className={`fixed top-0 left-0 right-0 z-100 transition-[backdrop-filter,background] duration-500 ${scrolled
                ? "bg-black/60 backdrop-blur-xl shadow-[0_1px_0_rgba(255,255,255,0.05)]"
                : "bg-transparent"
                }`}
        >
            <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
                <div className="flex items-center justify-between h-16 md:h-20">

                    {/* ── LOGO ── */}
                    <a
                        ref={logoRef}
                        href="#hero"
                        onClick={(e) => handleNavClick(e, "#hero")}
                        className="relative flex items-center gap-2 opacity-0 group"
                    >
                        <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white/50 transition-colors duration-300">
                            <span className="text-[11px] font-bold text-white/80 font-mono group-hover:text-white transition-colors duration-300">T</span>
                        </div>
                        <span className="text-sm font-medium text-white/70 tracking-wide font-mono hidden sm:block group-hover:text-white transition-colors duration-300">
                            TUAN.DEV
                        </span>
                    </a>

                    {/* ── DESKTOP NAV LINKS ── */}
                    <div className="hidden md:flex items-center gap-1">
                        {NAV_LINKS.map((link, i) => (
                            <a
                                key={link.label}
                                ref={(el) => (linksRef.current[i] = el)}
                                href={link.href}
                                onClick={(e) => handleNavClick(e, link.href)}
                                className="relative px-4 py-2 text-[13px] font-medium text-white/60 tracking-wide uppercase overflow-hidden group hover:text-white transition-colors duration-300"
                            >
                                <span className="inline-flex">
                                    {splitChars(link.label)}
                                </span>
                                {/* Hover underline */}
                                <span className="absolute bottom-1 left-4 right-4 h-px bg-white/40 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-in-out" />
                            </a>
                        ))}
                    </div>

                    {/* ── CTA BUTTON ── */}
                    <div className="hidden md:block">
                        <a
                            href="mailto:tuanngdinh.1608@gmail.com?subject=Collaboration%20Inquiry%20%E2%80%93%20From%20Your%20Portfolio&body=Hi%20Tuan%2C%0A%0AI%20came%20across%20your%20portfolio%20and%20was%20impressed%20by%20your%20work.%20I%E2%80%99d%20love%20to%20discuss%20a%20potential%20opportunity.%0A%0ABest%20regards%2C%0A%5BYour%20Name%5D"
                            className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/50 border border-white/15 rounded-full px-5 py-2 hover:bg-white/10 hover:text-white hover:border-white/30 transition-all duration-300"
                        >
                            Available for work
                        </a>
                    </div>

                    {/* ── MOBILE HAMBURGER ── */}
                    <MobileNavbar links={NAV_LINKS} onNavigate={handleNavClick} />
                </div>

                {/* ── BOTTOM LINE ── */}
                <div
                    ref={lineRef}
                    className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent origin-center scale-x-0"
                />
            </div>
        </nav>
    )
}
