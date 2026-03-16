"use client"

import { cn } from "@/lib/utils.js"

/**
 * TextRoll — Awwwards-style text hover animation.
 *
 * On hover (of the parent `group`), the primary text slides up while
 * a duplicate slides into view from below, creating a "roll" effect.
 * Each character/word staggers for a cascading animation.
 *
 * Usage:
 *   <a className="group">
 *     <TextRoll text="Projects" className="text-3xl font-bold text-background/80" />
 *   </a>
 */
export const TextRoll = ({
    text,
    className = "",
    hoverClassName = "",
    as: Tag = "span",
    charSplit = true,
    staggerMs = 20,
    ...props
}) => {
    const units = charSplit ? text.split("") : text.split(" ")

    return (
        <Tag
            className={cn("relative flex overflow-hidden", props.wrapperClassName)}
            {...props}
        >
            {/* ── TOP ROW: visible by default, rolls up on hover ── */}
            <span className="flex" aria-label={text}>
                {units.map((unit, i) => (
                    <span key={`t-${i}`} className="inline-block overflow-hidden">
                        <span
                            className={cn(
                                "inline-block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]",
                                "group-hover:-translate-y-full",
                                className
                            )}
                            style={{ transitionDelay: `${i * staggerMs}ms` }}
                        >
                            {unit === " " ? "\u00A0" : unit}
                            {!charSplit && i < units.length - 1 ? "\u00A0" : ""}
                        </span>
                    </span>
                ))}
            </span>

            {/* ── BOTTOM ROW: hidden below, rolls up into view on hover ── */}
            <span className="absolute top-0 left-0 flex" aria-hidden="true">
                {units.map((unit, i) => (
                    <span key={`b-${i}`} className="inline-block overflow-hidden">
                        <span
                            className={cn(
                                "inline-block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]",
                                "translate-y-full group-hover:translate-y-0",
                                hoverClassName || className
                            )}
                            style={{ transitionDelay: `${i * staggerMs}ms` }}
                        >
                            {unit === " " ? "\u00A0" : unit}
                            {!charSplit && i < units.length - 1 ? "\u00A0" : ""}
                        </span>
                    </span>
                ))}
            </span>
        </Tag>
    )
}
