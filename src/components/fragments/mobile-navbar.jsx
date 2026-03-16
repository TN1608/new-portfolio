"use client"

import { useEffect, useRef, useCallback } from "react"
import { gsap } from "gsap"
import { SOCIAL_LINKS } from "@/assets/data/SOCIAL"

const BAR_COUNT = 5

/* ──────────────────────────────────────
   NavLink — Individual link with split-text hover
   ────────────────────────────────────── */
const NavLink = ({ link, index, total, onNavigate, linksRef, linkLinesRef, onEnter, onLeave }) => {
    const wrapperRef = useRef(null)
    const topCharsRef = useRef([])
    const bottomCharsRef = useRef([])
    const indexRef = useRef(null)
    const progressRef = useRef(null)
    const arrowRef = useRef(null)
    const scrambleInterval = useRef(null)

    const chars = link.label.split("")

    // ── SCRAMBLE INDEX NUMBER ──
    const startScramble = () => {
        const el = indexRef.current
        if (!el) return
        const original = String(index + 1).padStart(2, "0")
        const glyphs = "!@#$%&*0123456789"
        let iters = 0
        scrambleInterval.current = setInterval(() => {
            el.textContent = original.split("").map((c, ci) =>
                iters > ci * 3 ? c : glyphs[Math.floor(Math.random() * glyphs.length)]
            ).join("")
            iters++
            if (iters > original.length * 4) {
                clearInterval(scrambleInterval.current)
                el.textContent = original
            }
        }, 40)
    }

    const stopScramble = () => {
        clearInterval(scrambleInterval.current)
        if (indexRef.current) {
            indexRef.current.textContent = String(index + 1).padStart(2, "0")
        }
    }

    // ── HOVER IN ──
    const handleEnter = (e) => {
        onEnter(index)
        startScramble()

        // Text roller sequence per character (single layer)
        topCharsRef.current.filter(Boolean).forEach((char, i) => {
            gsap.killTweensOf(char)
            const tl = gsap.timeline({ delay: i * 0.03 })
            tl.to(char, { yPercent: -80, opacity: 0, rotateX: 90, duration: 0.2, ease: "power2.in" })
            tl.set(char, { yPercent: 80, rotateX: -90, color: "#ffffff" })
            tl.to(char, { yPercent: 0, opacity: 1, rotateX: 0, duration: 0.4, ease: "back.out(2)" })
        })

        // Progress underline draws in
        gsap.to(progressRef.current, {
            scaleX: 1,
            duration: 0.6,
            ease: "power3.inOut",
        })

        // Arrow spins in
        gsap.to(arrowRef.current, {
            opacity: 1,
            x: 0,
            rotate: 0,
            scale: 1,
            duration: 0.5,
            ease: "back.out(2)",
        })

        // Index color
        gsap.to(indexRef.current, {
            color: "rgba(255,255,255,0.7)",
            duration: 0.3,
        })
    }

    // ── HOVER OUT ──
    const handleLeave = () => {
        onLeave()
        stopScramble()

        // Text roller sequence per character (single layer) reverse
        topCharsRef.current.filter(Boolean).forEach((char, i) => {
            gsap.killTweensOf(char)
            const tl = gsap.timeline({ delay: i * 0.02 })
            tl.to(char, { yPercent: 80, opacity: 0, rotateX: -90, duration: 0.2, ease: "power2.in" })
            tl.set(char, { yPercent: -80, rotateX: 90, color: "rgba(255,255,255,0.85)" })
            tl.to(char, { yPercent: 0, opacity: 1, rotateX: 0, duration: 0.3, ease: "power3.out" })
        })

        // Progress line retracts
        gsap.to(progressRef.current, {
            scaleX: 0,
            duration: 0.4,
            ease: "power3.inOut",
        })

        // Arrow hides
        gsap.to(arrowRef.current, {
            opacity: 0,
            x: -15,
            rotate: -45,
            scale: 0.5,
            duration: 0.3,
            ease: "power2.in",
        })

        // Index color reset
        gsap.to(indexRef.current, {
            color: "rgba(255,255,255,0.2)",
            duration: 0.3,
        })
    }

    // ── MAGNETIC EFFECT ──
    const handleMouseMove = (e) => {
        const rect = wrapperRef.current?.getBoundingClientRect()
        if (!rect) return
        const x = (e.clientX - rect.left - rect.width / 2) * 0.08
        const y = (e.clientY - rect.top - rect.height / 2) * 0.15
        gsap.to(wrapperRef.current, {
            x, y,
            duration: 0.4,
            ease: "power2.out",
        })
    }

    const handleMouseLeaveWrapper = () => {
        gsap.to(wrapperRef.current, {
            x: 0, y: 0,
            duration: 0.7,
            ease: "elastic.out(1, 0.4)",
        })
    }

    return (
        <div>
            <a
                ref={(el) => {
                    wrapperRef.current = el
                    linksRef.current[index] = el
                }}
                href={link.href}
                onClick={(e) => onNavigate(e, link.href)}
                onMouseEnter={handleEnter}
                onMouseLeave={(e) => { handleLeave(); handleMouseLeaveWrapper() }}
                onMouseMove={handleMouseMove}
                className="flex items-baseline gap-4 lg:gap-6 py-3 lg:py-5 cursor-pointer relative will-change-transform"
                style={{ perspective: "600px" }}
            >
                {/* Index with scramble */}
                <span
                    ref={indexRef}
                    className="text-[11px] font-mono text-white/20 tabular-nums mt-1 lg:mt-2 shrink-0 transition-colors duration-300"
                >
                    {String(index + 1).padStart(2, "0")}
                </span>

                {/* Text roller container */}
                <span className="relative overflow-hidden inline-block" style={{ perspective: "500px" }}>
                    <span className="flex" style={{ transformStyle: "preserve-3d" }}>
                        {chars.map((char, ci) => (
                            <span
                                key={ci}
                                ref={(el) => (topCharsRef.current[ci] = el)}
                                className="text-[10vw] sm:text-[8vw] md:text-[7vw] lg:text-[5.5vw] font-black text-white/85 tracking-tighter leading-[0.9] inline-block will-change-transform"
                                style={{ transformStyle: "preserve-3d" }}
                            >
                                {char === " " ? "\u00A0" : char}
                            </span>
                        ))}
                    </span>
                </span>

                {/* Animated arrow */}
                <span
                    ref={arrowRef}
                    className="ml-2 mt-1 lg:mt-3 shrink-0 opacity-0"
                    style={{ transform: "translateX(-15px) rotate(-45deg) scale(0.5)" }}
                >
                    <svg
                        className="w-5 h-5 lg:w-8 lg:h-8 text-white/60"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                </span>

                {/* Progress underline */}
                <div
                    ref={progressRef}
                    className="absolute bottom-0 left-0 right-0 h-[2px] origin-left scale-x-0"
                    style={{
                        background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 30%, rgba(255,255,255,0.6) 60%, rgba(255,255,255,0) 100%)"
                    }}
                />
            </a>

            {/* Divider */}
            {index < total - 1 && (
                <div
                    ref={(el) => (linkLinesRef.current[index] = el)}
                    className="h-px bg-white/8 origin-left"
                />
            )}
        </div>
    )
}


/* ──────────────────────────────────────
   FullscreenMenu — Main overlay menu
   ────────────────────────────────────── */
export const FullscreenMenu = ({ links = [], isOpen, onClose }) => {
    const containerRef = useRef(null)
    const barsRef = useRef([])
    const linksRef = useRef([])
    const linkLinesRef = useRef([])
    const socialRef = useRef(null)
    const footerRef = useRef(null)
    const headerRef = useRef(null)
    const isTransitioning = useRef(false)
    const hasAnimated = useRef(false)

    // ── ESCAPE KEY ──
    useEffect(() => {
        const fn = (e) => { if (e.key === "Escape" && isOpen) onClose() }
        window.addEventListener("keydown", fn)
        return () => window.removeEventListener("keydown", fn)
    }, [isOpen, onClose])

    // ── OPEN / CLOSE ANIMATION ──
    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        if (isOpen) {
            document.documentElement.style.overflow = "hidden"
            document.body.style.overflow = "hidden"

            gsap.set(container, { display: "block", visibility: "visible" })
            gsap.killTweensOf([container, ...barsRef.current, ...linksRef.current.filter(Boolean), ...linkLinesRef.current.filter(Boolean), headerRef.current, socialRef.current, footerRef.current])

            const tl = gsap.timeline()

            // 1. Curtain bars
            tl.fromTo(barsRef.current.filter(Boolean),
                { yPercent: (i) => i % 2 === 0 ? -110 : 110 },
                { yPercent: 0, duration: 0.8, ease: "power4.inOut", stagger: 0.06 },
                0
            )

            // 2. Header
            if (headerRef.current) {
                tl.fromTo(headerRef.current,
                    { opacity: 0, y: -20 },
                    { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
                    0.6
                )
            }

            // 3. Nav links stagger in
            linksRef.current.forEach((link, i) => {
                if (!link) return
                tl.fromTo(link,
                    { clipPath: "inset(100% 0 0 0)", y: 60, opacity: 0 },
                    { clipPath: "inset(0% 0 0 0)", y: 0, opacity: 1, duration: 0.8, ease: "power4.out" },
                    0.7 + i * 0.08
                )
            })

            // 4. Dividers
            linkLinesRef.current.forEach((line, i) => {
                if (!line) return
                tl.fromTo(line,
                    { scaleX: 0 },
                    { scaleX: 1, duration: 0.6, ease: "power3.inOut" },
                    0.75 + i * 0.06
                )
            })

            // 5. Social + footer
            if (socialRef.current) {
                tl.fromTo(socialRef.current,
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
                    0.9
                )
            }
            if (footerRef.current) {
                tl.fromTo(footerRef.current,
                    { opacity: 0 },
                    { opacity: 1, duration: 0.5, ease: "power2.out" },
                    1.0
                )
            }

            hasAnimated.current = true
        } else if (hasAnimated.current) {
            const container = containerRef.current
            if (!container) return

            gsap.killTweensOf([container, ...barsRef.current, ...linksRef.current.filter(Boolean), ...linkLinesRef.current.filter(Boolean), headerRef.current, socialRef.current, footerRef.current])

            const tl = gsap.timeline({
                onComplete: () => {
                    gsap.set(container, { display: "none", visibility: "hidden" })
                    document.documentElement.style.overflow = ""
                    document.body.style.overflow = ""
                }
            })

            const allContent = [headerRef.current, socialRef.current, footerRef.current, ...linksRef.current.filter(Boolean)].filter(Boolean)
            tl.to(allContent, {
                opacity: 0, y: -20, duration: 0.3, stagger: 0.02, ease: "power2.inOut"
            }, 0)

            tl.to(barsRef.current.filter(Boolean), {
                yPercent: (i) => i % 2 === 0 ? -110 : 110,
                duration: 0.6,
                ease: "power4.inOut",
                stagger: 0.04,
            }, 0.2)
        }
    }, [isOpen])

    // ── PAGE TRANSITION ──
    const navigateTo = useCallback((e, href) => {
        e.preventDefault()
        if (isTransitioning.current) return
        isTransitioning.current = true

        const allContent = [headerRef.current, socialRef.current, footerRef.current, ...linksRef.current.filter(Boolean)].filter(Boolean)
        gsap.killTweensOf(allContent)

        const tl = gsap.timeline({
            onComplete: () => { isTransitioning.current = false }
        })

        tl.to(allContent, {
            opacity: 0, y: -30, duration: 0.3, stagger: 0.02, ease: "power2.inOut"
        }, 0)

        tl.call(() => {
            const lenis = window.__lenis
            const target = document.querySelector(href)
            if (lenis && target) {
                lenis.scrollTo(target, { immediate: true })
            } else if (target) {
                target.scrollIntoView()
            }
        }, null, 0.4)

        tl.call(() => { onClose() }, null, 0.6)
    }, [onClose])

    // ── HOVER: dim siblings with italic skew ──
    const handleLinkEnter = (index) => {
        linksRef.current.forEach((el, i) => {
            if (!el) return
            if (i !== index) {
                gsap.to(el, {
                    opacity: 0.2,
                    skewX: -2,
                    filter: "blur(1px)",
                    duration: 0.4,
                    ease: "power2.out",
                })
            } else {
                gsap.to(el, {
                    opacity: 1,
                    skewX: 0,
                    filter: "blur(0px)",
                    duration: 0.3,
                    ease: "power2.out",
                })
            }
        })
    }

    const handleLinkLeave = () => {
        linksRef.current.forEach((el) => {
            if (!el) return
            gsap.to(el, {
                opacity: 1,
                skewX: 0,
                filter: "blur(0px)",
                duration: 0.5,
                ease: "power2.out",
            })
        })
    }

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-200"
            style={{ display: "none", visibility: "hidden", pointerEvents: isOpen ? "auto" : "none" }}
        >
            {/* ── CURTAIN BARS ── */}
            <div className="absolute inset-0 flex w-full h-full">
                {[...Array(BAR_COUNT)].map((_, i) => (
                    <div
                        key={i}
                        ref={(el) => (barsRef.current[i] = el)}
                        className="h-full flex-1 -ml-px first:ml-0"
                        style={{ background: "#0a0a0a" }}
                    />
                ))}
            </div>

            {/* ── CONTENT LAYER ── */}
            <div className="absolute inset-0 z-10 flex flex-col">

                {/* Header */}
                <div ref={headerRef} className="flex items-center justify-between px-6 md:px-12 lg:px-16 pt-24 pb-4 shrink-0">
                    <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/25">
                        Navigation
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/15">
                        Menu
                    </span>
                </div>

                {/* Main content */}
                <div className="flex-1 flex flex-col lg:flex-row px-6 md:px-12 lg:px-16 overflow-hidden">

                    {/* Left: Nav Links (Giant) */}
                    <div className="flex-1 flex flex-col justify-center py-4 lg:py-0">
                        {links.map((link, i) => (
                            <NavLink
                                key={link.label}
                                link={link}
                                index={i}
                                total={links.length}
                                onNavigate={navigateTo}
                                linksRef={linksRef}
                                linkLinesRef={linkLinesRef}
                                onEnter={handleLinkEnter}
                                onLeave={handleLinkLeave}
                            />
                        ))}
                    </div>

                    {/* Right: Social + Info */}
                    <div
                        ref={socialRef}
                        className="lg:w-[35%] xl:w-[30%] flex flex-col justify-end lg:justify-center gap-8 lg:gap-12 pb-8 lg:pb-0 lg:pl-12"
                    >
                        {/* Social Links */}
                        <div>
                            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/25 mb-4">
                                Connect
                            </p>
                            <div className="flex flex-wrap gap-x-6 gap-y-2">
                                {SOCIAL_LINKS.map((social) => (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-medium text-white/50 hover:text-white transition-colors duration-300 capitalize"
                                    >
                                        {social.name}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Contact */}
                        <div>
                            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/25 mb-3">
                                Get in touch
                            </p>
                            <a
                                href="https://mail.google.com/mail/?view=cm&to=tuanngdinh.1608@gmail.com&su=Collaboration+Inquiry+%E2%80%93+From+Your+Portfolio&body=Hi+Tuan%2C%0A%0AI+came+across+your+portfolio+and+was+impressed+by+your+work.+I%E2%80%99d+love+to+discuss+a+potential+opportunity.%0A%0ABest+regards%2C%0A%5BYour+Name%5D"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-white/50 hover:text-white transition-colors duration-300"
                            >
                                tuanngdinh.1608@gmail.com
                            </a>
                        </div>

                        {/* Status */}
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-mono text-white/30 uppercase tracking-wider">
                                Available for work
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div ref={footerRef} className="px-6 md:px-12 lg:px-16 pb-6 shrink-0">
                    <div className="h-px bg-white/8 mb-4" />
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-white/20 uppercase tracking-wider">
                            © {new Date().getFullYear()} Tuan Nguyen
                        </span>
                        <span className="text-[10px] font-mono text-white/20 uppercase tracking-wider">
                            Ho Chi Minh City, Vietnam
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
