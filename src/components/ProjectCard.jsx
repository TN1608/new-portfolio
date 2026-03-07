"use client"

import { useRef } from "react"
import { gsap } from "gsap"
import { ArrowUpRight } from "lucide-react"

export function ProjectCard({ project, index, total, onClick }) {
    const cardRef = useRef(null)
    const imageRef = useRef(null)
    const shineRef = useRef(null)

    const tags = project.stack || project.tags || []
    const description = project.tagline || project.description || ""

    const handleMouseEnter = () => {
        const card = cardRef.current
        const image = imageRef.current
        const shine = shineRef.current
        if (!card || !image) return

        gsap.to(image, { scale: 1.12, duration: 0.8, ease: "power2.out" })
        gsap.to(card, { y: -6, duration: 0.4, ease: "power2.out" })
        gsap.fromTo(shine, { x: "-100%" }, { x: "100%", duration: 0.6, ease: "power2.inOut" })
        gsap.to(card.querySelector(".card-cta"), { opacity: 1, y: 0, duration: 0.3, delay: 0.1 })
    }

    const handleMouseLeave = () => {
        const card = cardRef.current
        const image = imageRef.current
        if (!card || !image) return

        gsap.to(image, { scale: 1, duration: 0.8, ease: "power2.out" })
        gsap.to(card, { y: 0, duration: 0.4, ease: "power2.out" })
        gsap.to(card.querySelector(".card-cta"), { opacity: 0, y: 8, duration: 0.2 })
    }

    return (
        <div
            ref={cardRef}
            className="project-card group cursor-pointer relative will-change-transform"
            onClick={onClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="relative rounded-xl overflow-hidden bg-neutral-900 border border-white/[0.06]">
                {/* Image */}
                <div className="relative w-full aspect-[16/10] overflow-hidden">
                    <img
                        ref={imageRef}
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover will-change-transform"
                    />

                    {/* Shine sweep effect */}
                    <div
                        ref={shineRef}
                        className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] pointer-events-none"
                    />

                    {/* Permanent bottom gradient */}
                    <div className="absolute inset-0 bg-linear-to-t from-neutral-900 via-neutral-900/20 to-transparent pointer-events-none" />

                    {/* Index badge */}
                    <div className="absolute top-3 right-3 z-10">
                        <span className="text-[10px] font-mono text-white/50 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/[0.06]">
                            {String(index + 1).padStart(2, "0")}
                        </span>
                    </div>

                    {/* CTA on hover */}
                    <div className="card-cta absolute bottom-4 right-4 z-10 opacity-0 translate-y-2 flex items-center gap-1.5 bg-white text-neutral-900 text-xs font-semibold font-mono px-3 py-1.5 rounded-full shadow-lg">
                        View Case Study
                        <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                </div>

                {/* Content area */}
                <div className="relative p-5 space-y-3">
                    <h3 className="text-base md:text-lg font-bold text-white tracking-tight leading-snug group-hover:text-white/90 transition-colors">
                        {project.title}
                    </h3>
                    <p className="text-xs md:text-sm text-neutral-400 leading-relaxed line-clamp-2">
                        {description}
                    </p>

                    {/* Tags row */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                        {tags.slice(0, 4).map((tag, i) => (
                            <span
                                key={i}
                                className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.04] text-neutral-500 border border-white/[0.06]"
                            >
                                {tag}
                            </span>
                        ))}
                        {tags.length > 4 && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.04] text-neutral-500">
                                +{tags.length - 4}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
