"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { FullscreenMenu } from "@/components/fragments/mobile-navbar"

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
    const triggerRef = useRef(null)
    const lineRef = useRef(null)
    const [hidden, setHidden] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline()
            // Kept the context but removed initial hiding animations
            // so the navbar is visible immediately.

            // Scroll hide/show
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

    // Animate hide/show (but always show when menu is open)
    useEffect(() => {
        if (!navRef.current) return
        gsap.to(navRef.current, {
            y: (hidden && !menuOpen) ? -120 : 0,
            duration: 0.4,
            ease: "power3.inOut",
        })
    }, [hidden, menuOpen])

    return (
        <>
            <nav
                ref={navRef}
                className={`fixed top-0 left-0 right-0 z-150 transition-[backdrop-filter,background] duration-500 ${scrolled && !menuOpen
                    ? "bg-foreground/60 backdrop-blur-xl shadow-[0_1px_0_rgba(255,255,255,0.05)]"
                    : "bg-transparent"
                    }`}
            >
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
                    <div className="flex items-center justify-between h-16 md:h-20">

                        {/* ── LOGO ── */}
                        <a
                            ref={logoRef}
                            href="#hero"
                            onClick={(e) => {
                                e.preventDefault()
                                document.querySelector("#hero")?.scrollIntoView({ behavior: "smooth" })
                            }}
                            className="relative flex items-center gap-2 group z-201"
                        >
                            <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors duration-300 ${menuOpen ? "border-white/20 group-hover:border-white/50" : "border-white/20 group-hover:border-white/50"}`}>
                                <span className={`text-[11px] font-bold font-mono transition-colors duration-300 ${menuOpen ? "text-white/80 group-hover:text-white" : "text-background/80 group-hover:text-background"}`}>T</span>
                            </div>
                            <span className={`text-sm font-medium tracking-wide font-mono hidden sm:block transition-colors duration-300 ${menuOpen ? "text-white/70 group-hover:text-white" : "text-background/70 group-hover:text-background"}`}>
                                TUAN.DEV
                            </span>
                        </a>

                        {/* ── MENU TRIGGER ── */}
                        <button
                            ref={triggerRef}
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="relative z-201 flex items-center gap-3 cursor-pointer group"
                            aria-label="Toggle menu"
                        >
                            <span className={`text-[11px] font-mono uppercase tracking-[0.25em] transition-colors duration-300 hidden sm:block ${menuOpen ? "text-white/60" : "text-background/60"}`}>
                                {menuOpen ? "Close" : "Menu"}
                            </span>
                            <div className="relative w-10 h-10 flex items-center justify-center">
                                {/* Hamburger lines */}
                                <div className="flex flex-col gap-[5px]">
                                    <span className={`block h-[1.5px] transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] origin-center ${menuOpen
                                        ? "w-6 rotate-45 translate-y-[3.25px] bg-white/70"
                                        : "w-6 bg-background/70 group-hover:w-5"
                                        }`} />
                                    <span className={`block h-[1.5px] transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] origin-center ${menuOpen
                                        ? "w-6 -rotate-45 -translate-y-[3.25px] bg-white/70"
                                        : "w-6 bg-background/70 group-hover:w-4"
                                        }`} />
                                </div>
                            </div>
                        </button>
                    </div>

                    {/* ── BOTTOM LINE ── */}
                    <div
                        ref={lineRef}
                        className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent origin-center"
                    />
                </div>
            </nav>

            {/* ── FULLSCREEN MENU ── */}
            <FullscreenMenu
                links={NAV_LINKS}
                isOpen={menuOpen}
                onClose={() => setMenuOpen(false)}
            />
        </>
    )
}
