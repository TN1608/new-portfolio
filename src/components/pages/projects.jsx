"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { gsap } from "gsap"
import { PROJECTS } from "@/assets/data/PROJECT.js"
import { ProjectDetail } from "@/components/ProjectDetail"
import { ExternalLink, Github, ArrowUpRight } from "lucide-react"

export const ProjectsPage = () => {
    const sectionRef = useRef(null)
    const previewRef = useRef(null)
    const infoRef = useRef(null)
    const [hoveredIndex, setHoveredIndex] = useState(0)
    const [selectedProject, setSelectedProject] = useState(null)
    const [detailOpen, setDetailOpen] = useState(false)

    // Animate preview image + info when hovering project names
    const handleHover = useCallback((index) => {
        if (index === hoveredIndex) return
        setHoveredIndex(index)

        const preview = previewRef.current
        const info = infoRef.current
        if (!preview) return

        const img = preview.querySelector("img")

        // Crossfade image
        gsap.to(img, {
            opacity: 0,
            scale: 0.95,
            duration: 0.15,
            ease: "power2.in",
            onComplete: () => {
                if (img) img.src = PROJECTS[index].image
                gsap.to(img, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.35,
                    ease: "power3.out"
                })
            }
        })

        // Animate info content
        if (info) {
            gsap.fromTo(info, {
                opacity: 0,
                y: 12,
            }, {
                opacity: 1,
                y: 0,
                duration: 0.4,
                ease: "power3.out",
                delay: 0.1,
            })
        }
    }, [hoveredIndex])

    const handleOpenDetail = (project) => {
        setSelectedProject(project)
        setDetailOpen(true)
    }

    const currentProject = PROJECTS[hoveredIndex]
    const tags = currentProject?.stack || currentProject?.tags || []
    const description = currentProject?.tagline || currentProject?.description || ""
    const demoLink = currentProject?.links?.demo || currentProject?.demo || ""
    const githubLink = currentProject?.links?.github || currentProject?.github || ""

    return (
        <>
            <section
                ref={sectionRef}
                id="projects"
                className="relative min-h-screen bg-neutral-950 flex items-center overflow-hidden py-16 md:py-0"
            >
                <div className="container mx-auto px-6 md:px-16 flex flex-col lg:flex-row items-start gap-8 lg:gap-16 w-full">
                    {/* Left — Preview Image + Brief Info */}
                    <div className="w-full lg:w-[58%] order-1">
                        {/* Image */}
                        <div
                            ref={previewRef}
                            className="relative aspect-video rounded-2xl overflow-hidden cursor-pointer group bg-neutral-900 mb-5"
                            onClick={() => handleOpenDetail(currentProject)}
                        >
                            <img
                                src={currentProject?.image}
                                alt={currentProject?.title}
                                className="w-full h-full object-cover will-change-transform"
                            />
                            {/* Hover CTA */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                                <span className="flex items-center gap-2 bg-white text-neutral-900 text-xs sm:text-sm font-semibold font-mono px-4 py-2 rounded-full shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                                    View Details <ArrowUpRight className="w-4 h-4" />
                                </span>
                            </div>
                        </div>

                        {/* Brief Info */}
                        <div ref={infoRef}>
                            {/* Title + Description */}
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight mb-2">
                                {currentProject?.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-4 max-w-xl line-clamp-2">
                                {description}
                            </p>

                            {/* Tags + Links */}
                            <div className="flex flex-wrap items-center gap-2">
                                {tags.slice(0, 4).map((tag, i) => (
                                    <span
                                        key={i}
                                        className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-white/5 text-neutral-500 border border-white/6"
                                    >
                                        {tag}
                                    </span>
                                ))}
                                {tags.length > 4 && (
                                    <span className="text-[10px] font-mono text-neutral-600">
                                        +{tags.length - 4}
                                    </span>
                                )}

                                {(demoLink || githubLink) && (
                                    <div className="w-px h-3.5 bg-neutral-700 mx-1" />
                                )}

                                {demoLink && (
                                    <a
                                        href={demoLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-[11px] font-mono text-neutral-400 hover:text-white transition-colors"
                                    >
                                        <ExternalLink className="w-3 h-3" /> Live
                                    </a>
                                )}
                                {githubLink && (
                                    <a
                                        href={githubLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-[11px] font-mono text-neutral-400 hover:text-white transition-colors"
                                    >
                                        <Github className="w-3 h-3" /> Source
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right — Project List */}
                    <div className="w-full lg:w-[42%] order-2">
                        <div className="flex flex-col items-start lg:items-end">
                            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-500 mb-4 flex items-center gap-2">
                                My Projects <span className="w-8 h-px bg-neutral-600 inline-block" />
                            </span>

                            <div className="flex flex-col items-start lg:items-end gap-0.5">
                                {PROJECTS.map((project, i) => {
                                    const isActive = i === hoveredIndex
                                    return (
                                        <button
                                            key={project.title}
                                            onMouseEnter={() => handleHover(i)}
                                            onClick={() => handleOpenDetail(project)}
                                            className="group relative py-1 cursor-pointer text-left lg:text-right w-full lg:w-auto"
                                        >
                                            <span
                                                className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium transition-all duration-400 block ${isActive
                                                        ? "text-white font-bold translate-x-0"
                                                        : "text-neutral-600 hover:text-neutral-400 lg:translate-x-2 hover:translate-x-0"
                                                    }`}
                                            >
                                                {project.title}
                                                {isActive && (
                                                    <span className="inline-block ml-2 text-white/40"> ·</span>
                                                )}
                                            </span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sheet Detail */}
            <ProjectDetail
                project={selectedProject}
                open={detailOpen}
                onOpenChange={setDetailOpen}
            />
        </>
    )
}