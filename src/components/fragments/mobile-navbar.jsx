"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"

export const MobileNavbar = ({ links = [], onNavigate }) => {
    const [isOpen, setIsOpen] = useState(false)
    const overlayRef = useRef(null)
    const menuRef = useRef(null)
    const itemsRef = useRef([])
    const lineRefs = useRef([])
    const footerRef = useRef(null)

    useEffect(() => {
        if (!overlayRef.current || !menuRef.current) return

        const tl = gsap.timeline({ paused: true })

        // 1. Overlay fade in
        tl.fromTo(overlayRef.current,
            { opacity: 0, visibility: "hidden" },
            { opacity: 1, visibility: "visible", duration: 0.4, ease: "power2.out" },
            0
        )

        // 2. Menu panel slides in from right
        tl.fromTo(menuRef.current,
            { x: "100%" },
            { x: "0%", duration: 0.6, ease: "power4.out" },
            0.1
        )

        // 3. Stagger nav items with word reveal
        itemsRef.current.forEach((item, i) => {
            if (!item) return
            const chars = item.querySelectorAll(".mobile-nav-char")
            tl.fromTo(chars,
                { y: "120%", opacity: 0, rotateX: -60 },
                {
                    y: "0%",
                    opacity: 1,
                    rotateX: 0,
                    duration: 0.5,
                    stagger: 0.02,
                    ease: "power4.out"
                },
                0.3 + i * 0.06
            )
        })

        // 4. Dividing lines draw in
        lineRefs.current.forEach((line, i) => {
            if (!line) return
            tl.fromTo(line,
                { scaleX: 0 },
                { scaleX: 1, duration: 0.6, ease: "power3.inOut" },
                0.35 + i * 0.06
            )
        })

        // 5. Footer info fades up
        if (footerRef.current) {
            tl.fromTo(footerRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
                0.5
            )
        }

        // Store timeline reference for play/reverse
        overlayRef.current._tl = tl

        return () => tl.kill()
    }, [])

    useEffect(() => {
        const tl = overlayRef.current?._tl
        if (!tl) return

        if (isOpen) {
            document.body.style.overflow = "hidden"
            tl.play()
        } else {
            tl.reverse()
            // Delay restoring overflow until animation completes
            setTimeout(() => {
                document.body.style.overflow = ""
            }, 600)
        }
    }, [isOpen])

    const handleClick = (e, href) => {
        setIsOpen(false)
        setTimeout(() => {
            if (onNavigate) {
                onNavigate(e, href)
            } else {
                document.querySelector(href)?.scrollIntoView({ behavior: "smooth" })
            }
        }, 500)
    }

    const splitChars = (text) => {
        return text.split("").map((char, i) => (
            <span
                key={i}
                className="mobile-nav-char inline-block"
                style={{ perspective: "600px", willChange: "transform" }}
            >
                {char === " " ? "\u00A0" : char}
            </span>
        ))
    }

    return (
        <div className="md:hidden">
            {/* ── HAMBURGER BUTTON ── */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative z-110 w-10 h-10 flex flex-col items-center justify-center gap-[5px] group"
                aria-label="Toggle menu"
            >
                <span className={`w-6 h-[1.5px] bg-white/70 transition-all duration-300 ease-in-out ${isOpen ? "rotate-45 translate-y-[3.25px]" : "group-hover:w-5"
                    }`} />
                <span className={`w-6 h-[1.5px] bg-white/70 transition-all duration-300 ease-in-out ${isOpen ? "-rotate-45 -translate-y-[3.25px]" : "group-hover:w-4"
                    }`} />
            </button>

            {/* ── FULLSCREEN OVERLAY ── */}
            <div
                ref={overlayRef}
                className="fixed inset-0 z-105 bg-black/40 backdrop-blur-sm invisible opacity-0"
                onClick={() => setIsOpen(false)}
            />

            {/* ── SLIDE-IN MENU PANEL ── */}
            <div
                ref={menuRef}
                className="fixed top-0 right-0 z-106 w-full sm:w-[380px] h-full bg-neutral-950 border-l border-white/5 flex flex-col translate-x-full"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close area top */}
                <div className="flex items-center justify-between px-8 h-16">
                    <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/30">
                        Navigation
                    </span>
                </div>

                {/* Nav links */}
                <div className="flex-1 flex flex-col justify-center px-8">
                    {links.map((link, i) => (
                        <div key={link.label}>
                            <a
                                ref={(el) => (itemsRef.current[i] = el)}
                                href={link.href}
                                onClick={(e) => {
                                    e.preventDefault()
                                    handleClick(e, link.href)
                                }}
                                className="group block py-5 overflow-hidden"
                            >
                                <div className="flex items-baseline gap-4">
                                    {/* Index Number */}
                                    <span className="text-[11px] font-mono text-white/20 tabular-nums">
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                    {/* Label */}
                                    <span className="text-4xl sm:text-5xl font-black text-white/80 tracking-tight leading-none group-hover:text-white transition-colors duration-300 inline-flex">
                                        {splitChars(link.label)}
                                    </span>
                                </div>
                            </a>
                            {/* Divider */}
                            {i < links.length - 1 && (
                                <div
                                    ref={(el) => (lineRefs.current[i] = el)}
                                    className="h-px bg-white/8 origin-left scale-x-0"
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Footer info */}
                <div ref={footerRef} className="px-8 pb-10 opacity-0">
                    <div className="h-px bg-white/8 mb-6" />
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/30 mb-1">
                                Get in touch
                            </p>
                            <a
                                href="https://mail.google.com/mail/?view=cm&to=tuanngdinh.1608@gmail.com&su=Collaboration+Inquiry+%E2%80%93+From+Your+Portfolio&body=Hi+Tuan%2C%0A%0AI+came+across+your+portfolio+and+was+impressed+by+your+work.+I%E2%80%99d+love+to+discuss+a+potential+opportunity.%0A%0ABest+regards%2C%0A%5BYour+Name%5D"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-white/60 hover:text-white transition-colors duration-300"
                            >
                                tuanngdinh.1608@gmail.com
                            </a>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-mono text-white/30 uppercase tracking-wider">
                                Open to work
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
