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

        const isMobile = window.innerWidth < 1024;

        if (isDetailActive) {
            // Detail state: Monitor shifts slightly off-center but remains visible on the left
            gsap.to(monitorRef.current.position, {
                x: isMobile ? 0 : -5.5,
                y: isMobile ? 3 : -1.5,
                z: isMobile ? 12.5 : 2,
                duration: 1.2,
                ease: "power4.inOut"
            })
            gsap.to(monitorRef.current.rotation, {
                x: isMobile ? 0.2 : 0.05,
                y: isMobile ? 0 : 0.6,
                z: -0.02,
                duration: 1.2,
                ease: "power4.inOut"
            })
        } else {
            // Idle state: Move monitor to the Left side and position lower than before
            gsap.to(monitorRef.current.position, {
                x: isMobile ? 0 : -5,
                y: isMobile ? 3.5 : -2, // Moved lower
                z: isMobile ? 2 : 0,
                duration: 1.2,
                ease: "power4.inOut"
            })
            gsap.to(monitorRef.current.rotation, {
                x: isMobile ? 0.15 : 0.1,
                y: isMobile ? 0 : 0.4,
                z: -0.05,
                duration: 1.2,
                ease: "power4.inOut"
            })
        }
    }, [isDetailActive])

    return (
        <group ref={monitorRef} position={[-4, -2, 0]} rotation={[0.1, 0.4, -0.05]} scale={0.02}>
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
    const waveRef = useRef(null)

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

            // Title wave, zoom, and fade out
            tl.to(".transition-char", {
                y: (i) => Math.sin(i * 0.5) * -100 - 150,
                opacity: 0,
                scale: 2.5,
                stagger: 0.02,
                ease: "power2.inOut",
                duration: 1.2
            }, 0)

            // Zoom Reveal Animation for Images
            const wrappers = gsap.utils.toArray(".transition-img-wrapper")
            const images = gsap.utils.toArray(".transition-img")

            wrappers.forEach((wrapper, i) => {
                const img = images[i]
                const speed = 1 + (i * 0.3)

                // Set initial states: wrapper is positioned lower and hidden
                gsap.set(wrapper, {
                    opacity: 0,
                    y: 150 + (50 * i),
                    rotation: i % 2 === 0 ? -15 : 15
                })

                // Reveal wrappers (move up + straighten)
                tl.to(wrapper, {
                    opacity: 1,
                    y: -50 * speed,
                    rotation: i % 2 === 0 ? 3 : -3,
                    ease: "power3.out",
                    duration: 1.5
                }, i * 0.15) 

                // Parallax inside the image (just movement, no scale)
                tl.to(img, {
                    yPercent: -10,
                    ease: "none",
                    duration: 1.5
                }, i * 0.15)
                
                // Fade out softly as they go past
                tl.to(wrapper, {
                    opacity: 0,
                    y: -150 * speed,
                    ease: "power2.inOut",
                    duration: 0.8
                }, 1.4 + (i * 0.1))
            })
        }, mainRef)
        return () => ctx.revert()
    }, [])

    // ── SCROLL ANIMATIONS (Projects Section Entrance/Exit) ──
    useEffect(() => {
        const ctx = gsap.context(() => {
            const isMobile = window.innerWidth < 1024;

            // Single synchronized timeline for both Entrance and Exit
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: showcaseRef.current,
                    start: "top 90%",
                    end: "bottom 0%",
                    scrub: 1.5
                }
            })

            // 1. Entrance phase (0% to ~37% of scroll distance)
            tl.fromTo(".canvas-container",
                { y: isMobile ? "-15vh" : "-60vh", opacity: 0, scale: isMobile ? 0.9 : 0.8, rotationZ: isMobile ? 0 : -0.1 },
                { y: "0vh", opacity: 1, scale: 1, rotationZ: 0, ease: "none", duration: 37 }, 0)
            
            tl.fromTo(".ui-layer",
                { y: "40vh", opacity: 0 },
                { y: "0vh", opacity: 1, ease: "none", duration: 37 }, 0)

            // 2. Idle Hold phase (37% to 79%)
            // We use a dummy tween or just let GSAP handle the empty space by absolute positioning the next tweens.
            
            // 3. Exit phase (79% to 100% of scroll distance)
            tl.to(".canvas-container", 
                { y: "50vh", opacity: 0, scale: 0.9, rotationZ: 0.1, ease: "power2.in", duration: 21 }, 79)
            
            tl.to(".ui-layer", 
                { y: "-30vh", opacity: 0, ease: "power2.in", duration: 21 }, 79)

            // SVG Curve stretching effect
            gsap.fromTo(".svg-curve-container",
                { scaleY: 0.2, transformOrigin: "bottom" },
                {
                    scaleY: 1,
                    ease: "none",
                    scrollTrigger: {
                        trigger: showcaseRef.current,
                        start: "top 100%",
                        end: "top 50%",
                        scrub: 1
                    }
                }
            )

        }, showcaseRef)
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

    // ── OPEN DETAIL (Card Transition) ──
    const openDetail = useCallback((project) => {
        if (isAnimating) return
        setIsAnimating(true)
        setSelectedProject(project)

        // Lock background scroll
        if (window.__lenis) window.__lenis.stop()

        const listView = listViewRef.current
        const detailView = detailViewRef.current

        const tl = gsap.timeline({ onComplete: () => setIsAnimating(false) })

        // Ensure detail view is visible but transparent and moved right
        tl.set(detailView, { display: "flex", pointerEvents: "auto", opacity: 0, x: 50 }, 0)

        // Fade out and move list view card to the left
        tl.to(listView, {
            opacity: 0, x: -50, duration: 0.6, ease: "power3.inOut",
            onComplete: () => gsap.set(listView, { display: "none", pointerEvents: "none" })
        }, 0)

        // Slide in detail view from the right
        tl.to(detailView, {
            opacity: 1, x: 0, duration: 0.8, ease: "power3.out"
        }, 0.3)

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
                // Unlock background scroll
                if (window.__lenis) window.__lenis.start()
            }
        })

        // Fade out and move detail view card to the right
        tl.to(detailView, { 
            opacity: 0, x: 50, duration: 0.6, ease: "power3.inOut",
            onComplete: () => gsap.set(detailView, { display: "none", pointerEvents: "none" })
        }, 0)
        
        // Bring back the list view card from the left
        tl.set(listView, { display: "flex", pointerEvents: "auto", x: -50 }, 0.3)
        tl.to(listView, { 
            opacity: 1, x: 0, duration: 0.8, ease: "power3.out" 
        }, 0.3)

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
                    <h2 className="text-[12vw] font-black text-neutral-900 tracking-tighter leading-none text-center" style={{ perspective: "1000px" }}>
                        {"SELECTED".split("").map((c, i) => <span key={`sel-${i}`} className="transition-char inline-block" style={{ transformStyle: "preserve-3d" }}>{c}</span>)}
                        <br />
                        {"WORKS".split("").map((c, i) => <span key={`wor-${i}`} className="transition-char inline-block" style={{ transformStyle: "preserve-3d" }}>{c}</span>)}
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
                className="relative h-screen bg-[#e8ded5] overflow-visible"
            >
                {/* SVG Transition Curve from White to Beige */}
                <div className="svg-curve-container absolute top-0 left-0 w-full overflow-hidden leading-none z-10 transform -translate-y-[99%] pointer-events-none">
                    <svg className="w-full h-[8vh] md:h-[12vh] block" viewBox="0 0 1440 100" preserveAspectRatio="none">
                        <path fill="#e8ded5" d="M0,100 L1440,100 L1440,50 Q720,150 0,50 Z"></path>
                    </svg>
                </div>
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

                {/* ─── UI LAYER ─── */}
                <div className="ui-layer absolute inset-0 container mx-auto px-0 md:px-8 z-10 pointer-events-none flex items-center justify-center lg:justify-end h-full py-0 lg:py-24">
                    
                    {/* The Right Side Interactive Area */}
                    <div className="w-full lg:w-[50%] h-full max-h-[85vh] relative flex items-end lg:items-center justify-center lg:justify-end pb-8 lg:pb-0">
                        
                        {/* LIST CARD */}
                        <div
                            ref={listViewRef}
                            className="absolute bottom-6 md:bottom-12 lg:bottom-auto lg:right-0 w-[94%] md:w-[80%] lg:w-full h-[55%] lg:h-full max-h-[450px] lg:max-h-none max-w-xl bg-white/70 lg:bg-white/40 backdrop-blur-3xl rounded-[2rem] lg:rounded-[2.5rem] p-6 lg:p-12 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] flex flex-col pointer-events-auto border border-white/60 will-change-transform"
                        >
                            <div className="mb-8 shrink-0">
                                <span className="text-neutral-500 font-bold tracking-widest uppercase text-sm font-sans flex items-center gap-3">
                                    Selected Projects <div className="h-px bg-neutral-300 flex-1"></div>
                                </span>
                            </div>

                            <div className="flex-1 overflow-y-auto overflow-x-hidden fancy-scrollbar pr-2 lg:pr-6 flex flex-col gap-8" data-lenis-prevent="true">
                                {PROJECTS.map((project, i) => {
                                    const isActive = i === activeIndex
                                    return (
                                        <button
                                            key={project.title}
                                            onMouseEnter={() => handleHover(i)}
                                            onClick={() => openDetail(project)}
                                            className="group text-left cursor-pointer transition-all duration-300 w-full focus:outline-none"
                                        >
                                            <h4 className={`text-4xl lg:text-5xl font-serif font-bold tracking-tight transition-all duration-400 ${isActive ? 'text-neutral-900 translate-x-3' : 'text-neutral-400 group-hover:text-neutral-600 group-hover:translate-x-1'}`}>
                                                {project.title}
                                            </h4>
                                            
                                            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isActive ? 'max-h-20 opacity-100 mt-3 translate-x-3' : 'max-h-0 opacity-0 mt-0 translate-x-0'}`}>
                                                <p className="text-[11px] font-mono tracking-[0.2em] font-bold text-neutral-500 uppercase">
                                                    {(project.stack || project.tags)?.slice(0, 4).join(" • ")}
                                                </p>
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* DETAIL CARD */}
                        <div
                            ref={detailViewRef}
                            className="absolute bottom-6 md:bottom-12 lg:bottom-auto lg:right-0 w-[94%] md:w-[80%] lg:w-full h-[70%] lg:h-full max-h-[550px] lg:max-h-none max-w-2xl bg-white/80 lg:bg-white/50 backdrop-blur-3xl rounded-[2rem] lg:rounded-[2.5rem] p-6 lg:p-12 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] flex-col pointer-events-none hidden border border-white/60 will-change-transform"
                        >
                            <div className="flex items-center justify-between mb-8 shrink-0">
                                <button
                                    onClick={closeDetail}
                                    className="flex items-center justify-center gap-2 text-sm font-bold font-sans tracking-wide text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer group uppercase"
                                >
                                    <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                                    </div>
                                    Back
                                </button>
                                
                                <div className="flex items-center gap-3">
                                    {(selectedProject?.links?.demo || selectedProject?.demo) && (
                                        <a href={selectedProject.links?.demo || selectedProject.demo} target="_blank" rel="noopener noreferrer" 
                                            className="px-5 py-2.5 bg-neutral-900 text-white rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-black transition-colors flex items-center gap-2">
                                            Visit <ExternalLink className="w-3.5 h-3.5" />
                                        </a>
                                    )}
                                     {(selectedProject?.links?.github || selectedProject?.github) && (
                                        <a href={selectedProject.links?.github || selectedProject.github} target="_blank" rel="noopener noreferrer" 
                                            className="px-3 py-2.5 bg-white text-neutral-900 rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-neutral-50 border border-neutral-200 transition-colors flex items-center justify-center">
                                            <Github className="w-4 h-4" />
                                        </a>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto overflow-x-hidden fancy-scrollbar pr-2 lg:pr-6 flex flex-col" data-lenis-prevent="true">
                                <div className="mb-10">
                                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black text-neutral-900 tracking-tight leading-none mb-6">
                                        {selectedProject?.title}
                                    </h2>
                                    
                                    <p className="text-xs font-mono tracking-[0.2em] font-bold text-neutral-500 uppercase border-b border-neutral-300/50 pb-6 mb-8">
                                        {(selectedProject?.stack || selectedProject?.tags)?.join(" • ")}
                                    </p>

                                    <p className="text-xl lg:text-2xl font-serif text-neutral-800 leading-relaxed italic">
                                        "{selectedProject?.tagline || selectedProject?.description}"
                                    </p>
                                </div>

                                <div className="flex flex-col gap-10">
                                    {/* Additional detailed sections */}
                                    {selectedProject?.problem && (
                                        <div>
                                            <h4 className="text-[11px] font-sans font-bold uppercase tracking-widest text-neutral-400 mb-3 flex items-center gap-3">
                                                The Problem <span className="h-px bg-neutral-300/50 flex-1"></span>
                                            </h4>
                                            <div className="pl-4 border-l-2 border-neutral-200">
                                                <RenderField data={selectedProject.problem} />
                                            </div>
                                        </div>
                                    )}

                                    {selectedProject?.solution && (
                                        <div>
                                            <h4 className="text-[11px] font-sans font-bold uppercase tracking-widest text-neutral-400 mb-3 flex items-center gap-3">
                                                Solution <span className="h-px bg-neutral-300/50 flex-1"></span>
                                            </h4>
                                            <div className="pl-4 border-l-2 border-neutral-300">
                                                <RenderField data={selectedProject.solution} />
                                            </div>
                                        </div>
                                    )}

                                    {selectedProject?.architecture && (
                                        <div>
                                            <h4 className="text-[11px] font-sans font-bold uppercase tracking-widest text-neutral-400 mb-3 flex items-center gap-3">
                                                Architecture <span className="h-px bg-neutral-300/50 flex-1"></span>
                                            </h4>
                                            <div className="pl-4 border-l-2 border-neutral-200">
                                                <RenderField data={selectedProject.architecture} />
                                            </div>
                                        </div>
                                    )}

                                    {(selectedProject?.role || selectedProject?.myRole) && (
                                        <div>
                                            <h4 className="text-[11px] font-sans font-bold uppercase tracking-widest text-neutral-400 mb-3 flex items-center gap-3">
                                                My Role <span className="h-px bg-neutral-300/50 flex-1"></span>
                                            </h4>
                                            <div className="pl-4 border-l-2 border-neutral-200">
                                                <RenderField data={selectedProject.role || selectedProject.myRole} />
                                            </div>
                                        </div>
                                    )}

                                    {selectedProject?.result && (
                                        <div>
                                            <h4 className="text-[11px] font-sans font-bold uppercase tracking-widest text-neutral-400 mb-3 flex items-center gap-3">
                                                Result <span className="h-px bg-neutral-300/50 flex-1"></span>
                                            </h4>
                                            <div className="pl-4 border-l-2 border-neutral-200">
                                                <RenderField data={selectedProject.result} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="h-12 w-full shrink-0"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}