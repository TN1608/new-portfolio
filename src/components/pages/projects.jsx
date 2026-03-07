"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { PROJECTS } from "@/assets/data/PROJECT.js"
import { ExternalLink, Github, ArrowUpRight } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

export const ProjectsPage = () => {
    const mainRef = useRef(null)
    const transitionRef = useRef(null)
    const showcaseRef = useRef(null)
    const previewRef = useRef(null)
    const listRef = useRef(null)
    const overlayRef = useRef(null)

    const [hoveredIndex, setHoveredIndex] = useState(0)
    const [selectedProject, setSelectedProject] = useState(null)
    const [isAnimating, setIsAnimating] = useState(false)

    // ── 1. TRANSITION ANIMATION (Hero -> Projects) ──
    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: transitionRef.current,
                    start: "top top",
                    end: "+=150%",
                    scrub: 1,
                    pin: true,
                }
            })

            gsap.utils.toArray(".transition-img").forEach((img, i) => {
                const speed = 1 + (i * 0.5)
                const yDir = i % 2 === 0 ? -100 : 100
                const xDir = i % 3 === 0 ? -50 : 50
                tl.to(img, {
                    y: yDir * speed,
                    x: xDir * speed,
                    rotation: i % 2 === 0 ? 15 : -15,
                    opacity: 0,
                    ease: "power1.inOut"
                }, 0)
            })

            tl.to(".transition-title", {
                scale: 1.5, opacity: 0, ease: "power2.in"
            }, 0)

            tl.to(".zoom-mask", {
                scale: 30, opacity: 0, ease: "power3.in"
            }, 0.2)

            tl.fromTo(showcaseRef.current, {
                opacity: 0, y: 100,
            }, {
                opacity: 1, y: 0, duration: 0.5, ease: "power3.out"
            }, 0.5)

        }, mainRef)

        return () => ctx.revert()
    }, [])

    // ── 2. HOVER ANIMATION ──
    const handleHover = useCallback((index) => {
        if (index === hoveredIndex || isAnimating) return
        setHoveredIndex(index)

        const preview = previewRef.current
        if (!preview) return
        const img = preview.querySelector("img")

        gsap.to(img, {
            opacity: 0, scale: 0.95, duration: 0.15, ease: "power2.in",
            onComplete: () => {
                if (img) img.src = PROJECTS[index].image
                gsap.to(img, { opacity: 1, scale: 1, duration: 0.35, ease: "power3.out" })
            }
        })
    }, [hoveredIndex, isAnimating])

    // ── 3. OPEN DETAIL (GSAP Shared Element) ──
    const openDetail = useCallback((project) => {
        if (isAnimating || selectedProject) return
        setIsAnimating(true)
        setSelectedProject(project)

        const overlay = overlayRef.current
        const previewCard = previewRef.current
        const list = listRef.current
        if (!overlay || !previewCard) return

        // Lock body scroll
        document.body.style.overflow = "hidden"

        // Get preview card position for the "fly" effect
        const rect = previewCard.getBoundingClientRect()

        // Setup overlay
        const overlayImg = overlay.querySelector(".detail-image")
        const overlayTitle = overlay.querySelector(".detail-title")
        const overlayContent = overlay.querySelector(".detail-content")

        gsap.set(overlay, { display: "flex", opacity: 1 })

        // Animate the preview card out (fade out in place)
        gsap.to(previewCard, { opacity: 0, scale: 0.9, duration: 0.3, ease: "power2.in" })

        // Animate the list out
        if (list) {
            gsap.to(list, { opacity: 0, x: 60, duration: 0.3, ease: "power2.in" })
        }

        // Timeline for detail overlay entrance
        const tl = gsap.timeline({
            onComplete: () => setIsAnimating(false)
        })

        // Title flies in from top
        tl.fromTo(overlayTitle, {
            opacity: 0, y: -60, scale: 0.9,
        }, {
            opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power3.out"
        }, 0.15)

        // Image scales in from the preview card position
        tl.fromTo(overlayImg, {
            opacity: 0, y: 40, scale: 0.85,
        }, {
            opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out"
        }, 0.2)

        // Content fades in from below
        tl.fromTo(overlayContent, {
            opacity: 0, y: 50,
        }, {
            opacity: 1, y: 0, duration: 0.6, ease: "power3.out"
        }, 0.4)
    }, [isAnimating, selectedProject])

    // ── 4. CLOSE DETAIL ──
    const closeDetail = useCallback(() => {
        if (isAnimating || !selectedProject) return
        setIsAnimating(true)

        const overlay = overlayRef.current
        const previewCard = previewRef.current
        const list = listRef.current

        const overlayImg = overlay.querySelector(".detail-image")
        const overlayTitle = overlay.querySelector(".detail-title")
        const overlayContent = overlay.querySelector(".detail-content")

        const tl = gsap.timeline({
            onComplete: () => {
                setSelectedProject(null)
                setIsAnimating(false)
                document.body.style.overflow = "unset"
                gsap.set(overlay, { display: "none" })
            }
        })

        // Reverse: content out first
        tl.to(overlayContent, {
            opacity: 0, y: 30, duration: 0.25, ease: "power2.in"
        }, 0)

        // Image shrinks back
        tl.to(overlayImg, {
            opacity: 0, y: 30, scale: 0.9, duration: 0.3, ease: "power2.in"
        }, 0.05)

        // Title flies up
        tl.to(overlayTitle, {
            opacity: 0, y: -40, duration: 0.3, ease: "power2.in"
        }, 0.1)

        // Bring back the preview + list
        tl.to(previewCard, {
            opacity: 1, scale: 1, duration: 0.4, ease: "power3.out"
        }, 0.25)

        if (list) {
            tl.to(list, {
                opacity: 1, x: 0, duration: 0.4, ease: "power3.out"
            }, 0.3)
        }
    }, [isAnimating, selectedProject])

    const currentProject = PROJECTS[hoveredIndex]

    return (
        <div ref={mainRef} className="bg-neutral-100 text-neutral-900">

            {/* ── TRANSITION SECTION ── */}
            <section
                ref={transitionRef}
                className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-white"
            >
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <h2 className="transition-title text-[12vw] font-black text-neutral-900 tracking-tighter leading-none text-center">
                        SELECTED<br />WORKS
                    </h2>
                </div>

                <img src="/img/aboutme.jpg" alt="" className="transition-img absolute top-[10%] left-[10%] w-48 h-64 object-cover rounded-2xl shadow-2xl skew-y-6" />
                <img src="/img/aboutme2.jpg" alt="" className="transition-img absolute bottom-[15%] right-[15%] w-64 h-48 object-cover rounded-2xl shadow-2xl -skew-y-3" />
                <img src="/img/aboutme.jpg" alt="" className="transition-img absolute top-[20%] right-[20%] w-40 h-40 object-cover rounded-full shadow-2xl" />

                <div className="zoom-mask absolute w-32 h-32 md:w-64 md:h-64 rounded-xl border-4 border-neutral-900 shadow-2xl flex items-center justify-center bg-neutral-100">
                    <span className="text-xs font-bold uppercase tracking-widest text-neutral-900">Scroll</span>
                </div>
            </section>

            {/* ── PROJECTS SHOWCASE (Skiper80) ── */}
            <section
                id="projects"
                ref={showcaseRef}
                className="relative h-screen bg-neutral-100 overflow-hidden flex items-center justify-center"
            >
                {/* Default List View */}
                <div className="container mx-auto px-6 md:px-16 flex flex-col lg:flex-row items-center justify-between h-full w-full">

                    {/* Left: Preview Card */}
                    <div className="w-full lg:w-1/2 flex justify-center lg:justify-start items-center h-full pt-20 lg:pt-0">
                        <div
                            ref={previewRef}
                            className="relative w-full max-w-[480px] aspect-video rounded-[2rem] overflow-hidden shadow-2xl border border-neutral-200 bg-neutral-900 cursor-pointer group"
                            onClick={() => openDetail(currentProject)}
                        >
                            <img
                                src={currentProject?.image}
                                alt={currentProject?.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                                <span className="bg-white/90 backdrop-blur-sm text-neutral-900 text-sm font-bold px-6 py-3 rounded-full opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2">
                                    View Details <ArrowUpRight className="w-4 h-4" />
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Project List */}
                    <div ref={listRef} className="w-full lg:w-1/2 flex flex-col items-start lg:items-end justify-center h-full pb-20 lg:pb-0 z-10">
                        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-400 mb-8 flex items-center gap-4">
                            My Projects <span className="w-12 h-px bg-neutral-300 inline-block" />
                        </span>

                        <div className="flex flex-col items-start lg:items-end gap-1">
                            {PROJECTS.map((project, i) => {
                                const isActive = i === hoveredIndex
                                return (
                                    <button
                                        key={project.title}
                                        onMouseEnter={() => handleHover(i)}
                                        onClick={() => openDetail(project)}
                                        className="group relative py-2 cursor-pointer text-left lg:text-right"
                                    >
                                        <span
                                            className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight transition-all duration-400 block ${isActive
                                                ? "text-neutral-900 font-medium translate-x-0"
                                                : "text-neutral-400 hover:text-neutral-500 font-light lg:-translate-x-4 hover:-translate-x-2"
                                                }`}
                                        >
                                            {project.title}
                                            {isActive && (
                                                <span className="inline-block ml-3 font-black text-neutral-900">·</span>
                                            )}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* ── DETAIL OVERLAY (GSAP animated, hidden by default) ── */}
                <div
                    ref={overlayRef}
                    className="fixed inset-0 z-50 hidden flex-col items-center bg-neutral-100 overflow-y-auto"
                    onClick={(e) => {
                        if (e.target === e.currentTarget || e.target.closest(".detail-close-area")) {
                            closeDetail()
                        }
                    }}
                >
                    {/* Fixed close button */}
                    <button
                        onClick={closeDetail}
                        className="fixed top-6 right-8 z-[60] w-12 h-12 rounded-full bg-neutral-900 text-white flex items-center justify-center hover:bg-black transition-colors shadow-lg cursor-pointer"
                    >
                        ✕
                    </button>

                    <div className="w-full max-w-4xl mx-auto px-6 md:px-8 pt-[6vh] pb-32 flex flex-col items-center">

                        {/* Title */}
                        <h2
                            className="detail-title detail-close-area text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-neutral-900 tracking-tighter mb-8 text-center cursor-pointer leading-tight"
                        >
                            {selectedProject?.title}
                        </h2>

                        {/* Image */}
                        <div
                            className="detail-image detail-close-area w-full max-w-2xl aspect-video rounded-2xl overflow-hidden shadow-xl bg-neutral-900 cursor-pointer flex-shrink-0"
                        >
                            <img
                                src={selectedProject?.image}
                                alt={selectedProject?.title}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Scrollable Content */}
                        <div className="detail-content w-full max-w-2xl mt-12 flex flex-col" onClick={(e) => e.stopPropagation()}>

                            {/* Tagline + Line */}
                            <div className="flex items-center gap-4 mb-6">
                                <h3 className="text-lg md:text-2xl font-bold text-neutral-900 tracking-tight">
                                    {selectedProject?.tagline || selectedProject?.description || selectedProject?.title}
                                </h3>
                                <div className="flex-1 h-px bg-neutral-300" />
                            </div>

                            {/* Tech Stack */}
                            {(selectedProject?.stack || selectedProject?.tags) && (
                                <div className="flex flex-wrap gap-2 mb-10">
                                    {(selectedProject.stack || selectedProject.tags).map((tech, i) => (
                                        <span key={i} className="text-xs font-mono font-bold px-3 py-1.5 rounded-full bg-neutral-200 text-neutral-700 border border-neutral-300">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* ── PROBLEM ── */}
                            {selectedProject?.problem && (
                                <div className="mb-10">
                                    <h4 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-neutral-400 mb-3 flex items-center gap-3">
                                        <span className="w-3 h-3 rounded-full bg-red-400/60 inline-block" />
                                        The Problem
                                    </h4>
                                    <p className="text-base md:text-lg text-neutral-600 leading-relaxed font-medium">
                                        {selectedProject.problem}
                                    </p>
                                </div>
                            )}

                            {/* ── SOLUTION ── */}
                            {selectedProject?.solution && (
                                <div className="mb-10">
                                    <h4 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-neutral-400 mb-3 flex items-center gap-3">
                                        <span className="w-3 h-3 rounded-full bg-emerald-400/60 inline-block" />
                                        The Solution
                                    </h4>
                                    <p className="text-base md:text-lg text-neutral-600 leading-relaxed font-medium">
                                        {selectedProject.solution}
                                    </p>
                                </div>
                            )}

                            {/* ── ARCHITECTURE ── */}
                            {selectedProject?.architecture && (
                                <div className="mb-10">
                                    <h4 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-neutral-400 mb-3 flex items-center gap-3">
                                        <span className="w-3 h-3 rounded-full bg-blue-400/60 inline-block" />
                                        Architecture
                                    </h4>
                                    {Array.isArray(selectedProject.architecture) ? (
                                        <ul className="space-y-2">
                                            {selectedProject.architecture.map((item, i) => (
                                                <li key={i} className="flex items-start gap-3 text-base md:text-lg text-neutral-600 font-medium">
                                                    <span className="text-neutral-300 mt-1.5">▸</span> {item}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-base md:text-lg text-neutral-600 leading-relaxed font-medium">
                                            {selectedProject.architecture}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* ── MY ROLE ── */}
                            {(selectedProject?.role || selectedProject?.myRole) && (
                                <div className="mb-10">
                                    <h4 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-neutral-400 mb-3 flex items-center gap-3">
                                        <span className="w-3 h-3 rounded-full bg-amber-400/60 inline-block" />
                                        My Role
                                    </h4>
                                    {Array.isArray(selectedProject.role || selectedProject.myRole) ? (
                                        <ul className="space-y-2">
                                            {(selectedProject.role || selectedProject.myRole).map((item, i) => (
                                                <li key={i} className="flex items-start gap-3 text-base md:text-lg text-neutral-600 font-medium">
                                                    <span className="text-neutral-300 mt-1.5">▸</span> {item}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-base md:text-lg text-neutral-600 leading-relaxed font-medium">
                                            {selectedProject.role || selectedProject.myRole}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* ── RESULT ── */}
                            {selectedProject?.result && (
                                <div className="mb-12">
                                    <h4 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-neutral-400 mb-3 flex items-center gap-3">
                                        <span className="w-3 h-3 rounded-full bg-violet-400/60 inline-block" />
                                        Result
                                    </h4>
                                    {Array.isArray(selectedProject.result) ? (
                                        <ul className="space-y-2">
                                            {selectedProject.result.map((item, i) => (
                                                <li key={i} className="flex items-start gap-3 text-base md:text-lg text-neutral-600 font-medium">
                                                    <span className="text-neutral-300 mt-1.5">▸</span> {item}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-base md:text-lg text-neutral-600 leading-relaxed font-medium">
                                            {selectedProject.result}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* ── CTA BUTTONS ── */}
                            <div className="border-t border-neutral-200 pt-8 flex flex-wrap items-center gap-4">
                                {(selectedProject?.links?.demo || selectedProject?.demo) && (
                                    <a
                                        href={selectedProject.links?.demo || selectedProject.demo}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-8 py-3.5 bg-neutral-900 text-white font-bold rounded-xl hover:bg-black transition-colors flex items-center gap-2 text-sm"
                                    >
                                        Live Preview <ExternalLink className="w-4 h-4" />
                                    </a>
                                )}
                                {(selectedProject?.links?.github || selectedProject?.github) && (
                                    <a
                                        href={selectedProject.links?.github || selectedProject.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-8 py-3.5 bg-white text-neutral-900 border border-neutral-300 font-bold rounded-xl hover:bg-neutral-50 transition-colors flex items-center gap-2 text-sm"
                                    >
                                        See Source Code <Github className="w-4 h-4" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}