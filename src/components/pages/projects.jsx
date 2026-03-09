"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { PROJECTS } from "@/assets/data/PROJECT.js"
import { ExternalLink, Github, ArrowUpRight, ArrowLeft } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "../ui/separator"
import { Canvas, useThree } from "@react-three/fiber"
import { Environment, ContactShadows } from "@react-three/drei"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import { Model as CrtMonitor } from "@/assets/3d/Crt_monitor.jsx"
import { Suspense } from "react"

gsap.registerPlugin(ScrollTrigger)

// Helper: 3D Monitor Scene with imperative GSAP animation
const MonitorScene = ({ isDetailActive, project }) => {
    const monitorRef = useRef()

    useEffect(() => {
        if (!monitorRef.current) return;

        if (isDetailActive) {
            // Zoom in: camera-like zoom toward monitor — smooth cinematic
            gsap.to(monitorRef.current.position, {
                x: 0,
                y: 0,
                z: 11.5,
                duration: 1.2,
                ease: "power4.inOut"
            })
            gsap.to(monitorRef.current.rotation, {
                x: 0,
                y: 0,
                z: 0,
                duration: 1.2,
                ease: "power4.inOut"
            })
        } else {
            // Idle: subtle positioning
            const isMobile = window.innerWidth < 1024;
            gsap.to(monitorRef.current.position, {
                x: isMobile ? 0 : -5,
                y: isMobile ? 2 : 0,
                z: isMobile ? -5 : 0,
                duration: 1.2,
                ease: "power4.inOut"
            })
            gsap.to(monitorRef.current.rotation, {
                x: 0.1,
                y: 0.4,
                z: -0.05,
                duration: 1.2,
                ease: "power4.inOut"
            })
        }
    }, [isDetailActive])

    return (
        <group ref={monitorRef} position={[-5, 0, 0]} rotation={[0.1, 0.4, -0.05]} scale={0.02}>
            {/* Always pass the hovered/active project image so the screen updates immediately */}
            <CrtMonitor image={project?.image} />
        </group>
    )
}

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
                    end: "+=200%",
                    scrub: 1,
                    pin: true,
                }
            })

            // Title parallax and fade out
            tl.to(".transition-title", {
                y: -150,
                opacity: 0,
                scale: 1.2,
                ease: "power2.inOut",
                duration: 1
            }, 0)

            // Advanced Image Parallax Reveal Animation (Skiper71 style)
            const wrappers = gsap.utils.toArray(".transition-img-wrapper")
            const images = gsap.utils.toArray(".transition-img")

            wrappers.forEach((wrapper, i) => {
                const img = images[i]
                const speed = 1 + (i * 0.3)

                // Set initial states: wrapper is clipped from the bottom, image is scaled up
                gsap.set(wrapper, {
                    y: 100 + (50 * i),
                    clipPath: "inset(100% 0% 0% 0%)",
                    rotation: i % 2 === 0 ? -5 : 5
                })
                gsap.set(img, {
                    scale: 1.6
                })

                // Reveal wrappers (unclip + move up + straighten)
                tl.to(wrapper, {
                    y: -50 * speed,
                    clipPath: "inset(0% 0% 0% 0%)",
                    rotation: i % 2 === 0 ? 3 : -3,
                    ease: "power3.inOut",
                    duration: 1.5
                }, i * 0.15) // Stagger 

                // Parallax scale down the image inside the wrapper simultaneously
                tl.to(img, {
                    scale: 1,
                    ease: "power3.inOut",
                    duration: 1.5
                }, i * 0.15)

                // Fade/Move them out at the very end to reveal the Projects List
                tl.to(wrapper, {
                    opacity: 0,
                    y: -150 * speed,
                    ease: "power2.in",
                    duration: 0.6
                }, 1.6 + (i * 0.1))
            })

            // Reveal Showcase Section (Projects List)
            tl.fromTo(showcaseRef.current,
                { opacity: 0, y: 150 },
                { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 1.8)
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
            opacity: 0, scale: 0.95, y: 20, duration: 0.4, ease: "power2.inOut",
            onComplete: () => gsap.set(listView, { display: "none" })
        }, 0)

        // Fade out the 3D Canvas smoothly while the camera zooms in
        tl.to(".canvas-container", {
            opacity: 0, duration: 1, ease: "power2.inOut"
        }, 0.2)

        // Show and fade in centered detail view
        tl.set(detailView, { display: "flex" }, 0.4)
        tl.fromTo(detailView, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" }, 0.4)

        // Slide up the center card
        tl.fromTo(".detail-content",
            { opacity: 0, y: 80, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power4.out" },
            0.6
        )
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

        tl.to(".detail-content", { opacity: 0, y: 40, scale: 0.95, duration: 0.3, ease: "power2.inOut" }, 0)
        tl.to(detailView, { opacity: 0, duration: 0.3, ease: "power2.inOut" }, 0.1)

        // Fade the 3D Canvas back in
        tl.to(".canvas-container", { opacity: 1, duration: 0.8, ease: "power2.inOut" }, 0.2)

        // Bring back the list
        tl.set(listView, { display: "flex" }, 0.3)
        tl.to(listView, { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "power4.out" }, 0.3)
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
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
                    <h2 className="transition-title text-[12vw] font-black text-neutral-900 tracking-tighter leading-none text-center">
                        SELECTED<br />WORKS
                    </h2>
                </div>

                {/* Advanced Parallax Image Reveals */}
                <div className="absolute inset-0 z-20 pointer-events-none">
                    <div className="transition-img-wrapper absolute top-[15%] left-[5%] md:left-[10%] w-32 md:w-56 h-48 md:h-72 rounded-2xl overflow-hidden shadow-2xl">
                        <img src={PROJECTS[0]?.image} alt={PROJECTS[0]?.title} className="transition-img w-full h-full object-cover" />
                    </div>

                    <div className="transition-img-wrapper absolute bottom-[10%] right-[5%] md:right-[15%] w-48 md:w-72 h-32 md:h-48 rounded-2xl overflow-hidden shadow-2xl">
                        <img src={PROJECTS[1]?.image} alt={PROJECTS[1]?.title} className="transition-img w-full h-full object-cover" />
                    </div>

                    <div className="transition-img-wrapper absolute top-[25%] right-[10%] md:right-[20%] w-24 md:w-48 h-24 md:h-48 rounded-2xl overflow-hidden shadow-2xl">
                        <img src={PROJECTS[2]?.image} alt={PROJECTS[2]?.title} className="transition-img w-full h-full object-cover" />
                    </div>

                    <div className="transition-img-wrapper absolute bottom-[25%] left-[10%] md:left-[25%] w-40 md:w-72 h-40 md:h-56 rounded-3xl overflow-hidden shadow-2xl">
                        <img src={PROJECTS[3]?.image || PROJECTS[0]?.image} alt="Preview 4" className="transition-img w-full h-full object-cover" />
                    </div>
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
                {/* ─── 3D BACKGROUND CANVAS ─── */}
                <div className="canvas-container absolute inset-0 z-0 pointer-events-none">
                    <Canvas camera={{ position: [0, 0, 15], fov: 45 }} gl={{ toneMapped: true }}>
                        <Suspense fallback={null}>
                            <ambientLight intensity={1.5} />
                            <Environment preset="city" />
                            <MonitorScene isDetailActive={selectedProject !== null} project={currentProject} />
                            <ContactShadows position={[0, -4, 0]} opacity={0.4} scale={20} blur={2} />

                            {/* Subtle Bloom for CRT screen light bleed */}
                            <EffectComposer>
                                <Bloom
                                    intensity={0.3}
                                    luminanceThreshold={0.8}
                                    luminanceSmoothing={0.9}
                                    mipmapBlur
                                />
                            </EffectComposer>
                        </Suspense>
                    </Canvas>
                </div>

                {/* ─── LIST VIEW ─── */}
                <div
                    ref={listViewRef}
                    className="absolute inset-0 flex flex-col lg:flex-row items-stretch container mx-auto px-4 md:px-16 z-10 pointer-events-none"
                >
                    {/* Left: Preview + Quick Info (recruiter-friendly) */}
                    <div className="w-full lg:w-[55%] flex flex-col justify-end lg:justify-center h-full pointer-events-none relative">
                        {/* 3D Monitor occupies this space visually */}

                        {/* Quick Identity: Title + Tagline pinned to the bottom left so it doesn't overlap the monitor */}
                        <div className="relative lg:absolute bottom-0 lg:bottom-16 left-0 right-0 lg:right-auto lg:max-w-[500px] pointer-events-auto backdrop-blur-md bg-white/40 p-4 lg:p-6 rounded-t-2xl lg:rounded-2xl shadow-sm border border-white/50 mb-0 lg:mb-0">
                            <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight mb-1">
                                {currentProject?.title}
                            </h3>
                            <p className="text-sm text-neutral-600 leading-relaxed mb-3">
                                {currentTagline}
                            </p>

                            {/* Stack pills */}
                            <div className="flex flex-wrap items-center gap-1.5 mb-4">
                                {currentTags.slice(0, 5).map((tag, i) => (
                                    <span key={i} className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-white text-neutral-700 border border-neutral-200 shadow-sm">
                                        {tag}
                                    </span>
                                ))}
                                {currentTags.length > 5 && (
                                    <span className="text-[11px] font-mono text-neutral-500">+{currentTags.length - 5}</span>
                                )}
                            </div>

                            {/* Quick links */}
                            <div className="flex items-center gap-4">
                                {currentDemo && (
                                    <a href={currentDemo} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 text-xs font-bold font-mono text-neutral-900 hover:text-cyan-600 transition-colors bg-white px-3 py-1.5 rounded-lg shadow-sm border border-neutral-100">
                                        <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                                    </a>
                                )}
                                {currentGithub && (
                                    <a href={currentGithub} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 text-xs font-bold font-mono text-neutral-600 hover:text-neutral-900 transition-colors bg-white px-3 py-1.5 rounded-lg shadow-sm border border-neutral-100">
                                        <Github className="w-3.5 h-3.5" /> Source
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Project Names */}
                    <div className="w-full lg:w-[45%] absolute top-16 right-4 lg:relative lg:top-auto lg:right-auto flex flex-col items-end lg:items-end justify-start lg:justify-center lg:h-full pointer-events-auto z-20">
                        <span className="text-xs font-mono uppercase tracking-[0.3em] text-neutral-400 mb-3 lg:mb-6 flex items-center gap-3">
                            My Projects <span className="w-10 h-px bg-neutral-300 inline-block" />
                        </span>
                        <div className="flex flex-col items-end gap-0.5 lg:gap-1">
                            {PROJECTS.map((project, i) => {
                                const isActive = i === activeIndex
                                return (
                                    <button
                                        key={project.title}
                                        onMouseEnter={() => handleHover(i)}
                                        onClick={() => openDetail(project)}
                                        className="py-1 cursor-pointer text-right group"
                                    >
                                        <span className={`text-lg sm:text-xl md:text-2xl lg:text-4xl tracking-tight transition-all duration-300 block ${isActive
                                            ? "text-neutral-900 font-bold"
                                            : "text-neutral-400 group-hover:text-neutral-600 font-light"
                                            }`}>
                                            {project.title}
                                            {isActive && <span className="inline-block ml-2 text-cyan-500">·</span>}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* ─── DETAIL VIEW (Centered Overlay) ─── */}
                <div
                    ref={detailViewRef}
                    className="absolute inset-0 hidden items-center justify-center z-10 pointer-events-none p-4"
                >
                    {/* Centered Scrollable Content */}
                    <div className="detail-content w-full max-w-4xl max-h-[85vh] flex flex-col bg-white/95 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.2)] rounded-3xl pointer-events-auto border border-white/40 overflow-hidden relative">

                        <div className="overflow-y-auto w-full flex-1 relative min-h-0 custom-scrollbar">
                            <div className="py-8 lg:py-10 px-6 lg:px-12 flex flex-col gap-6 w-full mx-auto">
                                {/* Back + Title */}
                                <div className="text-center relative">
                                    <button
                                        onClick={closeDetail}
                                        className="lg:hidden absolute left-0 top-0 p-2 bg-neutral-100 rounded-full shadow-sm z-50 hover:bg-neutral-200"
                                    >
                                        <ArrowLeft className="w-4 h-4 text-neutral-900" />
                                    </button>
                                    <button
                                        onClick={closeDetail}
                                        className="hidden lg:inline-flex items-center justify-center gap-2 text-sm font-mono text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer mb-2 group"
                                    >
                                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                                        Back to projects
                                    </button>
                                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-neutral-900 tracking-tight leading-tight mb-2 mt-8 lg:mt-0">
                                        {selectedProject?.title}
                                    </h2>

                                    {/* CTA */}
                                    <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
                                        {(selectedProject?.links?.demo || selectedProject?.demo) && (
                                            <a
                                                href={selectedProject.links?.demo || selectedProject.demo}
                                                target="_blank" rel="noopener noreferrer"
                                                className="px-5 py-2.5 bg-neutral-900 text-white font-bold rounded-xl hover:bg-black transition-colors flex items-center justify-center gap-2 text-sm shadow-md"
                                            >
                                                Live Preview <ExternalLink className="w-4 h-4" />
                                            </a>
                                        )}
                                        {(selectedProject?.links?.github || selectedProject?.github) && (
                                            <a
                                                href={selectedProject.links?.github || selectedProject.github}
                                                target="_blank" rel="noopener noreferrer"
                                                className="px-5 py-2.5 bg-white text-neutral-900 border border-neutral-300 font-bold rounded-xl hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
                                            >
                                                Source Code <Github className="w-4 h-4" />
                                            </a>
                                        )}
                                    </div>
                                    <p className="text-sm md:text-base text-neutral-500 italic block mt-4">
                                        {selectedProject?.tagline || selectedProject?.description}
                                    </p>
                                </div>

                                {/* Stack */}
                                {(selectedProject?.stack || selectedProject?.tags) && (
                                    <div className="flex flex-wrap justify-center gap-2 mt-2">
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
                        </div>
                    </div>
                </div >
            </section >
        </div >
    )
}