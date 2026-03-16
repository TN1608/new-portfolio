"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { TextRoll } from "@/components/ui/text-roll"

export const MobileNavbar = ({ links = [], onNavigate, hidden = false }) => {
    const [isOpen, setIsOpen] = useState(false)
    const overlayRef = useRef(null)
    const menuRef = useRef(null)
    const itemsRef = useRef([])
    const lineRefs = useRef([])
    const footerRef = useRef(null)
    const tlRef = useRef(null)

    // ── GSAP OPEN/CLOSE TIMELINE ──
    useEffect(() => {
        if (!overlayRef.current || !menuRef.current) return

        const tl = gsap.timeline({ paused: true })
        tlRef.current = tl

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

        // 3. Stagger nav items
        itemsRef.current.forEach((item, i) => {
            if (!item) return
            tl.fromTo(item,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, ease: "power4.out" },
                0.3 + i * 0.08
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

        return () => tl.kill()
    }, [])

    // ── LOCK BODY + HTML SCROLL ──
    useEffect(() => {
        const tl = tlRef.current
        if (!tl) return

        if (isOpen) {
            // Lock BOTH html and body to prevent iOS Safari scroll-through
            document.documentElement.style.overflow = "hidden"
            document.body.style.overflow = "hidden"
            document.body.style.position = "fixed"
            document.body.style.inset = "0"
            document.body.style.width = "100%"
            tl.play()
        } else {
            tl.reverse()
            setTimeout(() => {
                document.documentElement.style.overflow = ""
                document.body.style.overflow = ""
                document.body.style.position = ""
                document.body.style.inset = ""
                document.body.style.width = ""
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



    return (
        <div className="md:hidden">
            {/* ── HAMBURGER BUTTON ── */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative z-200 w-10 h-10 flex flex-col items-center justify-center gap-[5px] group transition-opacity duration-300 ${hidden && !isOpen ? "pointer-events-none opacity-0" : "opacity-100"}`}
                aria-label="Toggle menu"
            >
                <span className={`w-6 h-[1.5px] bg-background/70 transition-all duration-300 ease-in-out origin-center ${isOpen ? "rotate-45 translate-y-[3.25px]" : "group-hover:w-5"
                    }`} />
                <span className={`w-6 h-[1.5px] bg-background/70 transition-all duration-300 ease-in-out origin-center ${isOpen ? "-rotate-45 -translate-y-[3.25px]" : "group-hover:w-4"
                    }`} />
            </button>

            {/* ── FULLSCREEN OVERLAY ── */}
            <div
                ref={overlayRef}
                className="fixed inset-0 z-190 bg-foreground/60 backdrop-blur-md invisible opacity-0"
                onClick={() => setIsOpen(false)}
            />

            {/* ── FULLSCREEN MENU PANEL ── */}
            <div
                ref={menuRef}
                className="fixed z-195 flex flex-col overflow-hidden"
                style={{
                    transform: "translateX(100%)",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    width: "100vw",
                    height: "100vh",
                    /* extend beyond viewport to cover any safe-area or rubber-band gaps */
                    minHeight: "100vh",
                    minHeight: "-webkit-fill-available",
                    background: "#0a0a0a",
                    overscrollBehavior: "none",
                    touchAction: "none",
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-5 pb-2 shrink-0">
                    <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-background/30">
                        Navigation
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-background/20">
                        Menu
                    </span>
                </div>

                {/* Nav links */}
                <div className="flex-1 flex flex-col justify-center px-6 py-4">
                    {links.map((link, i) => (
                        <div key={link.label}>
                            <a
                                ref={(el) => (itemsRef.current[i] = el)}
                                href={link.href}
                                onClick={(e) => {
                                    e.preventDefault()
                                    handleClick(e, link.href)
                                }}
                                className="group block py-4 overflow-hidden"
                            >
                                <div className="flex items-baseline gap-3">
                                    {/* Index Number */}
                                    <span className="text-[11px] font-mono text-background/20 tabular-nums">
                                        {String(i + 1).padStart(2, "0")}
                                    </span>

                                    {/* ── AWWWARDS TEXT ROLL ── */}
                                    <TextRoll
                                        text={link.label}
                                        className="text-3xl sm:text-4xl font-black text-background/80 tracking-tight leading-none"
                                        hoverClassName="text-3xl sm:text-4xl font-black text-background tracking-tight leading-none"
                                        charSplit={true}
                                        staggerMs={15}
                                    />
                                </div>
                            </a>
                            {/* Divider */}
                            {i < links.length - 1 && (
                                <div
                                    ref={(el) => (lineRefs.current[i] = el)}
                                    className="h-px bg-background/8 origin-left scale-x-0"
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Footer info */}
                <div ref={footerRef} className="px-6 pb-8 shrink-0 opacity-0">
                    <div className="h-px bg-background/8 mb-5" />
                    <div className="flex flex-col gap-3">
                        <div>
                            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-background/30 mb-1">
                                Get in touch
                            </p>
                            <a
                                href="https://mail.google.com/mail/?view=cm&to=tuanngdinh.1608@gmail.com&su=Collaboration+Inquiry+%E2%80%93+From+Your+Portfolio&body=Hi+Tuan%2C%0A%0AI+came+across+your+portfolio+and+was+impressed+by+your+work.+I%E2%80%99d+love+to+discuss+a+potential+opportunity.%0A%0ABest+regards%2C%0A%5BYour+Name%5D"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-background/60 hover:text-background transition-colors duration-300"
                            >
                                tuanngdinh.1608@gmail.com
                            </a>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-mono text-background/30 uppercase tracking-wider">
                                Open to work
                            </span>
                        </div>
                    </div>
                </div>

                {/* Extra safety: absolutely positioned background that extends past the viewport */}
                <div className="absolute inset-0 -z-10 pointer-events-none" style={{ background: "#0a0a0a", top: "-50px", bottom: "-100px", left: "-10px", right: "-10px" }} />
            </div>
        </div>
    )
}
