"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { PROJECTS } from "@/assets/data/PROJECT.js"
import { ExternalLink, Github, ArrowUpRight, ArrowLeft } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "../ui/separator"

gsap.registerPlugin(ScrollTrigger)

// Helper: render string or array
const RenderField = ({ data }) => {
    if (!data) return null
    if (Array.isArray(data)) {
        return (
            <ul className="space-y-1">
                {data.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-neutral-600 leading-relaxed">
                        <span className="text-neutral-300 mt-0.5 shrink-0">▸</span>
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        )
    }
    return <p className="text-sm text-neutral-600 leading-relaxed">{data}</p>
}

export const ProjectsPage = () => {
    const mainRef = useRef(null)
    const transitionRef = useRef(null)
    const showcaseRef = useRef(null)
    const listViewRef = useRef(null)
    const detailViewRef = useRef(null)

    const [activeIndex, setActiveIndex] = useState(0)
    const [selectedProject, setSelectedProject] = useState(null)
    const [isAnimating, setIsAnimating] = useState(false)

    // ── TRANSITION ANIMATION (Hero -> Projects) ──
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
                tl.to(img, {
                    y: (i % 2 === 0 ? -1 : 1) * 100 * speed,
                    x: (i % 3 === 0 ? -1 : 1) * 50 * speed,
                    rotation: i % 2 === 0 ? 15 : -15,
                    opacity: 0, ease: "power1.inOut"
                }, 0)
            })

            tl.to(".transition-title", { scale: 1.5, opacity: 0, ease: "power2.in" }, 0)
            tl.to(".zoom-mask", { scale: 30, opacity: 0, ease: "power3.in" }, 0.2)
            tl.fromTo(showcaseRef.current,
                { opacity: 0, y: 100 },
                { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, 0.5)
        }, mainRef)
        return () => ctx.revert()
    }, [])

    // ── HOVER ──
    const handleHover = useCallback((index) => {
        if (index === activeIndex || isAnimating) return
        setActiveIndex(index)
    }, [activeIndex, isAnimating])

    const currentProject = PROJECTS[activeIndex]
    const currentTags = currentProject?.stack || currentProject?.tags || []
    const currentTagline = currentProject?.tagline || currentProject?.description || ""
    const currentDemo = currentProject?.links?.demo || currentProject?.demo || ""
    const currentGithub = currentProject?.links?.github || currentProject?.github || ""

    // ── OPEN DETAIL (in-section, not overlay) ──
    const openDetail = useCallback((project) => {
        if (isAnimating) return
        setIsAnimating(true)
        setSelectedProject(project)

        const listView = listViewRef.current
        const detailView = detailViewRef.current

        const tl = gsap.timeline({ onComplete: () => setIsAnimating(false) })

        // Fade out list view
        tl.to(listView, {
            opacity: 0, scale: 0.97, duration: 0.3, ease: "power2.in",
            onComplete: () => gsap.set(listView, { display: "none" })
        }, 0)

        // Show and fade in detail view
        tl.set(detailView, { display: "flex" }, 0.2)
        tl.fromTo(detailView, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" }, 0.25)

        // Stagger detail children
        tl.fromTo(".detail-left", { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" }, 0.3)
        tl.fromTo(".detail-right", { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" }, 0.35)
    }, [isAnimating])

    // ── CLOSE DETAIL ──
    const closeDetail = useCallback(() => {
        if (isAnimating || !selectedProject) return
        setIsAnimating(true)

        const listView = listViewRef.current
        const detailView = detailViewRef.current

        const tl = gsap.timeline({
            onComplete: () => {
                setSelectedProject(null)
                setIsAnimating(false)
                gsap.set(detailView, { display: "none" })
            }
        })

        tl.to(detailView, { opacity: 0, duration: 0.25, ease: "power2.in" }, 0)
        tl.set(listView, { display: "flex" }, 0.2)
        tl.to(listView, { opacity: 1, scale: 1, duration: 0.35, ease: "power3.out" }, 0.25)
    }, [isAnimating, selectedProject])

    // Escape key
    useEffect(() => {
        const fn = (e) => { if (e.key === "Escape") closeDetail() }
        window.addEventListener("keydown", fn)
        return () => window.removeEventListener("keydown", fn)
    }, [closeDetail])

    return (
        <div ref={mainRef}>

            {/* ── TRANSITION ── */}
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

            {/* ═══════════════════════════════════════
                PROJECTS SECTION — h-screen container
                Both list view and detail view live here
            ═══════════════════════════════════════ */}
            <section
                id="projects"
                ref={showcaseRef}
                className="relative h-screen overflow-hidden"
            >
                {/* ─── LIST VIEW ─── */}
                <div
                    ref={listViewRef}
                    className="absolute inset-0 flex flex-col lg:flex-row items-center container mx-auto px-6 md:px-16"
                >
                    {/* Left: Preview + Quick Info (recruiter-friendly) */}
                    <div className="w-full lg:w-[55%] flex flex-col justify-center h-full gap-5 pt-12 lg:pt-0">
                        {/* Image */}
                        <div
                            className="relative w-full max-w-[520px] aspect-video rounded-2xl overflow-hidden shadow-lg border border-neutral-200 bg-neutral-200 cursor-pointer group"
                            onClick={() => openDetail(currentProject)}
                        >
                            <img
                                src={currentProject?.image}
                                alt={currentProject?.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-300 flex items-end p-5">
                                <span className="bg-white text-neutral-900 text-xs font-bold px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-1.5 shadow-md">
                                    View Case Study <ArrowUpRight className="w-3.5 h-3.5" />
                                </span>
                            </div>
                        </div>

                        {/* Quick Identity: Title + Tagline */}
                        <div className="max-w-[520px]">
                            <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight mb-1">
                                {currentProject?.title}
                            </h3>
                            <p className="text-sm text-neutral-500 leading-relaxed mb-3">
                                {currentTagline}
                            </p>

                            {/* Stack pills */}
                            <div className="flex flex-wrap items-center gap-1.5 mb-3">
                                {currentTags.slice(0, 5).map((tag, i) => (
                                    <span key={i} className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-neutral-200 text-neutral-600 border border-neutral-200">
                                        {tag}
                                    </span>
                                ))}
                                {currentTags.length > 5 && (
                                    <span className="text-[11px] font-mono text-neutral-400">+{currentTags.length - 5}</span>
                                )}
                            </div>

                            {/* Quick links */}
                            <div className="flex items-center gap-3">
                                {currentDemo && (
                                    <a href={currentDemo} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-xs font-mono text-neutral-500 hover:text-neutral-900 transition-colors">
                                        <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                                    </a>
                                )}
                                {currentGithub && (
                                    <a href={currentGithub} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-xs font-mono text-neutral-500 hover:text-neutral-900 transition-colors">
                                        <Github className="w-3.5 h-3.5" /> Source
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Project Names */}
                    <div className="w-full lg:w-[45%] flex flex-col items-start lg:items-end justify-center h-full pb-12 lg:pb-0">
                        <span className="text-xs font-mono uppercase tracking-[0.3em] text-neutral-400 mb-6 flex items-center gap-3">
                            My Projects <span className="w-10 h-px bg-neutral-300 inline-block" />
                        </span>
                        <div className="flex flex-col items-start lg:items-end gap-1">
                            {PROJECTS.map((project, i) => {
                                const isActive = i === activeIndex
                                return (
                                    <button
                                        key={project.title}
                                        onMouseEnter={() => handleHover(i)}
                                        onClick={() => openDetail(project)}
                                        className="py-1.5 cursor-pointer text-left lg:text-right"
                                    >
                                        <span className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-tight transition-all duration-300 block ${isActive
                                            ? "text-neutral-900 font-semibold"
                                            : "text-neutral-400 hover:text-neutral-600 font-light"
                                            }`}>
                                            {project.title}
                                            {isActive && <span className="inline-block ml-2 text-neutral-300">·</span>}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* ─── DETAIL VIEW (in-section, uses ScrollArea) ─── */}
                <div
                    ref={detailViewRef}
                    className="absolute inset-0 hidden flex-row"
                >


                    {/* Left: Image */}
                    <div className="detail-left w-full lg:w-[45%] h-full flex flex-col gap-8 items-center justify-center p-6 lg:p-12">
                        <div className="w-full max-w-md aspect-video rounded-2xl overflow-hidden shadow-lg">
                            <img
                                src={selectedProject?.image}
                                alt={selectedProject?.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="h-px w-1/2 bg-neutral-200" />

                        {/* CTA */}
                        <div className="flex flex-wrap gap-3 pb-8">
                            {(selectedProject?.links?.demo || selectedProject?.demo) && (
                                <a
                                    href={selectedProject.links?.demo || selectedProject.demo}
                                    target="_blank" rel="noopener noreferrer"
                                    className="px-6 py-2.5 bg-neutral-900 text-white font-bold rounded-xl hover:bg-black transition-colors flex items-center gap-2 text-sm"
                                >
                                    Live Preview <ExternalLink className="w-4 h-4" />
                                </a>
                            )}
                            {(selectedProject?.links?.github || selectedProject?.github) && (
                                <a
                                    href={selectedProject.links?.github || selectedProject.github}
                                    target="_blank" rel="noopener noreferrer"
                                    className="px-6 py-2.5 bg-white text-neutral-900 border border-neutral-300 font-bold rounded-xl hover:bg-neutral-50 transition-colors flex items-center gap-2 text-sm"
                                >
                                    Source Code <Github className="w-4 h-4" />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Right: Scrollable Content */}
                    <div className="detail-right w-full lg:w-[55%] h-full flex flex-col">
                        <ScrollArea className="h-full w-full">
                            <div className="py-10 lg:py-16 pr-8 lg:pr-16 pl-4 lg:pl-0 flex flex-col gap-8 max-w-xl">
                                {/* Back + Title */}
                                <div>
                                    <button
                                        onClick={closeDetail}
                                        className="flex items-center gap-2 text-sm font-mono text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer mb-4 group"
                                    >
                                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                                        Back to projects
                                    </button>
                                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-neutral-900 tracking-tight leading-tight mb-2">
                                        {selectedProject?.title}
                                    </h2>
                                    <p className="text-base text-neutral-500 italic">
                                        {selectedProject?.tagline || selectedProject?.description}
                                    </p>
                                </div>

                                {/* Stack */}
                                {(selectedProject?.stack || selectedProject?.tags) && (
                                    <div className="flex flex-wrap gap-2">
                                        {(selectedProject.stack || selectedProject.tags).map((tech, i) => (
                                            <span key={i} className="text-xs font-mono px-3 py-1 rounded-full bg-neutral-200 text-neutral-600 border border-neutral-200">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="h-px w-full bg-neutral-200" />

                                {/* Problem */}
                                {selectedProject?.problem && (
                                    <div>
                                        <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400 mb-2">Problem</h4>
                                        <RenderField data={selectedProject.problem} />
                                    </div>
                                )}

                                {/* Solution */}
                                {selectedProject?.solution && (
                                    <div>
                                        <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400 mb-2">Solution</h4>
                                        <RenderField data={selectedProject.solution} />
                                    </div>
                                )}

                                {/* Architecture */}
                                {selectedProject?.architecture && (
                                    <div>
                                        <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400 mb-2">Architecture</h4>
                                        <RenderField data={selectedProject.architecture} />
                                    </div>
                                )}

                                {/* Role */}
                                {(selectedProject?.role || selectedProject?.myRole) && (
                                    <div>
                                        <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400 mb-2">My Role</h4>
                                        <RenderField data={selectedProject.role || selectedProject.myRole} />
                                    </div>
                                )}

                                {/* Result */}
                                {selectedProject?.result && (
                                    <div>
                                        <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400 mb-2">Result</h4>
                                        <RenderField data={selectedProject.result} />
                                    </div>
                                )}

                                <div className="h-px w-full bg-neutral-200" />
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </section>
        </div>
    )
}