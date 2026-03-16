"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet"
import { ExternalLink, Github, AlertTriangle, Lightbulb, Layers, User, Trophy } from "lucide-react"

export function ProjectDetail({ project, open, onOpenChange }) {
    const contentRef = useRef(null)

    useEffect(() => {
        if (open && contentRef.current) {
            const sections = contentRef.current.querySelectorAll(".detail-section")
            gsap.fromTo(sections, {
                y: 40,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.1,
                ease: "power3.out",
                delay: 0.2
            })
        }
    }, [open, project])

    if (!project) return null

    // Normalize inconsistent data fields
    const tags = project.stack || project.tags || []
    const description = project.tagline || project.description || ""
    const role = project.myRole || project.role || ""
    const demoLink = project.links?.demo || project.demo || ""
    const githubLink = project.links?.github || project.github || ""

    const renderListOrText = (data) => {
        if (Array.isArray(data)) {
            return (
                <ul className="space-y-2">
                    {data.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                            <span className="w-1.5 h-1.5 rounded-full bg-foreground/30 flex-shrink-0 mt-1.5" />
                            {item}
                        </li>
                    ))}
                </ul>
            )
        }
        return <p className="text-sm text-muted-foreground leading-relaxed">{data}</p>
    }

    const detailSections = [
        { icon: AlertTriangle, title: "Problem", data: project.problem, color: "text-red-400" },
        { icon: Lightbulb, title: "Solution", data: project.solution, color: "text-yellow-400" },
        { icon: Layers, title: "Architecture", data: project.architecture, color: "text-blue-400" },
        { icon: User, title: "My Role", data: role, color: "text-purple-400" },
        { icon: Trophy, title: "Result", data: project.result, color: "text-green-400" },
    ].filter(s => s.data && (typeof s.data === "string" ? s.data.length > 0 : s.data.length > 0))

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="right"
                className="!w-full sm:!w-[540px] sm:!max-w-[540px] overflow-y-auto p-0 bg-background border-l border-border/50"
            >
                <div ref={contentRef}>
                    {/* Hero Image */}
                    <div className="detail-section relative w-full h-[240px] overflow-hidden">
                        <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent" />

                        {/* Links floating over image */}
                        <div className="absolute bottom-4 right-4 flex items-center gap-2">
                            {demoLink && (
                                <a
                                    href={demoLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 bg-background/10 backdrop-blur-md text-background text-xs font-mono px-3 py-1.5 rounded-full hover:bg-background/20 transition-colors"
                                >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    Live Demo
                                </a>
                            )}
                            {githubLink && (
                                <a
                                    href={githubLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 bg-background/10 backdrop-blur-md text-background text-xs font-mono px-3 py-1.5 rounded-full hover:bg-background/20 transition-colors"
                                >
                                    <Github className="w-3.5 h-3.5" />
                                    Source
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Header */}
                    <SheetHeader className="px-6 pt-4 pb-2">
                        <SheetTitle className="text-2xl font-black tracking-tight text-foreground">
                            {project.title}
                        </SheetTitle>
                        <SheetDescription className="text-sm text-muted-foreground leading-relaxed">
                            {description}
                        </SheetDescription>
                    </SheetHeader>

                    {/* Tags */}
                    <div className="detail-section px-6 pb-4">
                        <div className="flex flex-wrap gap-1.5">
                            {tags.map((tag, i) => (
                                <span
                                    key={i}
                                    className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-foreground/5 text-muted-foreground border border-border/50"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Separator */}
                    <div className="detail-section mx-6 h-px bg-border/50" />

                    {/* Detail Sections */}
                    <div className="p-6 space-y-6">
                        {detailSections.map((section, i) => (
                            <div key={i} className="detail-section space-y-2.5">
                                <div className="flex items-center gap-2.5">
                                    <div className={`w-8 h-8 rounded-lg bg-foreground/5 flex items-center justify-center ${section.color}`}>
                                        <section.icon className="w-4 h-4" />
                                    </div>
                                    <h4 className="text-sm font-bold uppercase tracking-wider text-foreground font-mono">
                                        {section.title}
                                    </h4>
                                </div>
                                {renderListOrText(section.data)}
                            </div>
                        ))}
                    </div>

                    {/* Bottom padding */}
                    <div className="h-8" />
                </div>
            </SheetContent>
        </Sheet>
    )
}
