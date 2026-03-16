"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, Float, ContactShadows } from "@react-three/drei"
import { Model as Smartphone } from "@/assets/3d/Smartphone"
import BlurText from "@/components/BlurText"
import CountUp from "@/components/CountUp"
import { SKILL_CATEGORIES, EXPERIENCE, SKILLS_STATS } from "@/assets/data/SKILLS"

gsap.registerPlugin(ScrollTrigger)

// Shared GSAP proxy object to perfectly sync the DOM timeline with the R3F Canvas
const proxy = {
    x: 0,
    y: -0.5,
    z: 0,
    rotX: 0,
    rotY: 0,
    rotZ: 0,
    scale: 2.2
}

const PhoneAnimator = () => {
    const groupRef = useRef(null)

    // Smoothly apply the proxy updates per-frame to the 3D model
    useFrame(() => {
        if (!groupRef.current) return
        groupRef.current.position.set(proxy.x, proxy.y, proxy.z)
        groupRef.current.rotation.set(proxy.rotX, proxy.rotY, proxy.rotZ)
        groupRef.current.scale.set(proxy.scale, proxy.scale, proxy.scale)
    })

    return (
        <group ref={groupRef}>
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                <Smartphone />
            </Float>
        </group>
    )
}

export const SkillsPage = () => {
    const sectionRef = useRef(null)
    const containerRef = useRef(null)

    // Elements refs
    const titleRef = useRef(null)
    const skillsListRef = useRef(null)
    const xpListRef = useRef(null)
    const statsRef = useRef(null)
    const cursorRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Reset proxy on mount
            proxy.x = 0
            proxy.y = -0.5
            proxy.rotX = 0
            proxy.rotY = 0
            proxy.rotZ = 0
            proxy.screenOpacity = 0
            proxy.scale = window.innerWidth < 768 ? 1.8 : 2.2

            const isMobile = window.innerWidth < 1024

            // Set up SVG Timeline Path drawing
            const xpPath = document.querySelector(".xp-timeline-path")
            if (xpPath) {
                const length = xpPath.getTotalLength()
                gsap.set(xpPath, { strokeDasharray: length, strokeDashoffset: length })
            }

            // Create main timeline
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=800%", // Longer scroll for sequential reading (expanded for manual xp loop)
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1
                }
            })

            // ── PHASE 1: Move Phone, Title out, Rotate slightly ──
            // On desktop: phone moves left. On mobile: phone moves up.
            const p1_x = isMobile ? 0 : -2.5
            const p1_y = isMobile ? 2.5 : -0.5
            tl.to(proxy, { x: p1_x, y: p1_y, z: 0.5, rotX: 0.15, rotY: Math.PI / 6, rotZ: 0.05, screenOpacity: 1, ease: "power2.inOut", duration: 1.2 }, 0)
            tl.to(titleRef.current, { opacity: 0, scale: 0.8, duration: 1 }, 0)

            // Show Skills container
            tl.to(skillsListRef.current, { opacity: 1, display: "flex", duration: 0.1 }, 0.9)

            const sparks = cursorRef.current.querySelectorAll(".spark")
            const arrowImg = cursorRef.current.querySelector(".cursor-arrow")
            const handImg = cursorRef.current.querySelector(".cursor-hand")

            // Cursor moves to phone area
            tl.fromTo(cursorRef.current,
                { opacity: 0, x: "50vw", y: "80vh", scale: 1, rotate: 20 },
                { opacity: 1, x: isMobile ? "50vw" : "25vw", y: isMobile ? "20vh" : "55vh", rotate: 0, duration: 1, ease: "power2.out" },
                0.5
            )

            // Switch to hand cursor right before the first click
            tl.set(arrowImg, { opacity: 0 }, 1.4)
            tl.set(handImg, { opacity: 1 }, 1.4)

            // Sequence through each skill category with a dynamic "burst/hologram" effect
            const categories = gsap.utils.toArray(".skill-category-item")

            categories.forEach((cat, i) => {
                const startTime = 1.5 + (i * 2) // Gave it a bit more time to breathe (2s instead of 1.5s)
                const clickTime = startTime - 0.2

                // Lively Cursor click: scale down and bounce back
                tl.to(cursorRef.current, { scale: 0.8, rotate: -5, duration: 0.1, yoyo: true, repeat: 1 }, clickTime)

                // Exploding sparks effect (Playful multicoloured particle burst)
                tl.fromTo(sparks,
                    { x: 0, y: 0, scale: 1, opacity: 1 },
                    {
                        x: (index) => Math.cos(index * (Math.PI * 2) / 6) * 45,
                        y: (index) => Math.sin(index * (Math.PI * 2) / 6) * 45,
                        scale: 0,
                        opacity: 0,
                        duration: 0.5,
                        ease: "expo.out",
                        stagger: 0
                    },
                    clickTime
                )

                // ── Fancy Skill Tags Burst Reveal ──
                // Select the category title and individual skill tags within it
                const catTitle = cat.querySelector(".cat-title")
                const tags = cat.querySelectorAll(".skill-tag")

                // Make the category container visible
                tl.set(cat, { opacity: 1 }, startTime)

                // The 3D Phone reacts to the click/burst!
                // It does a subtle tilt/swivel as if emitting the hologram
                tl.to(proxy, {
                    rotX: () => 0.15 + gsap.utils.random(-0.05, 0.05),
                    rotY: () => (Math.PI / 6) + gsap.utils.random(-0.1, 0.1),
                    z: () => 0.5 + gsap.utils.random(0.1, 0.4), // slight zoom bounce
                    duration: 0.8,
                    ease: "back.out(2)"
                }, clickTime)
                // settle phone back
                tl.to(proxy, { z: 0.5, duration: 1.2, ease: "power2.out" }, clickTime + 0.8)

                // 1. Reveal the Category Title dropping down
                tl.fromTo(catTitle,
                    { opacity: 0, y: -20, scale: 0.9 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.5)" },
                    startTime
                )

                // 2. Playful Stagger Reveal from Natural Flexbox Positions
                tl.fromTo(tags,
                    {
                        opacity: 0,
                        y: 40,
                        scale: 0.5,
                        rotation: () => gsap.utils.random(-45, 45) // Start heavily rotated
                    },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        rotation: () => gsap.utils.random(-6, 6), // End with a slight playful tilt
                        duration: 0.8,
                        ease: "back.out(2)",
                        stagger: { amount: 0.3, from: "start" } // Stagger them naturally
                    },
                    startTime + 0.1
                )

                // 3. Scrub-safe subtle wiggle/float
                tl.to(tags, {
                    y: "-=12", // Drift slightly up
                    rotation: () => gsap.utils.random(-12, 12), // Gentle wiggle
                    duration: 1.5,
                    ease: "sine.inOut"
                }, startTime + 1.0)

                // Fade Out: Pop them down and fade away cleanly
                if (i < categories.length - 1) {
                    tl.to([catTitle, tags], {
                        opacity: 0,
                        y: 20,
                        scale: 0.8,
                        rotation: () => gsap.utils.random(-30, 30),
                        duration: 0.4,
                        stagger: 0.05,
                        ease: "power2.in"
                    }, startTime + 1.8)
                }
            })

            const afterSkillsTime = 1.5 + (categories.length * 2)

            // Fade out cursor before phase 2
            tl.to(cursorRef.current, { opacity: 0, duration: 0.5 }, afterSkillsTime - 0.5)
            // Reset back to arrow cursor for its travel phase
            tl.set(arrowImg, { opacity: 1 }, afterSkillsTime)
            tl.set(handImg, { opacity: 0 }, afterSkillsTime)

            // ── PHASE 2: Move Phone, Extreme Camera Swivel ──
            // On desktop: phone lands on the right. On mobile: stays top but swivels.
            const p2_x = isMobile ? 0 : 2.2
            const p2_y = isMobile ? 2.5 : -0.5
            // Phone pushes back slightly (z: -1), does a large swivel
            tl.to(proxy, { x: 0, y: isMobile ? 3 : 0, z: -1, rotY: Math.PI, ease: "power1.inOut", duration: 0.7 }, afterSkillsTime)
            tl.to(proxy, { x: p2_x, y: p2_y, z: 0.5, rotX: 0.1, rotY: -Math.PI / 6, rotZ: -0.05, ease: "power2.out", duration: 0.8 }, afterSkillsTime + 0.7)

            // Fade out last skill category and entire skills container
            tl.to(categories[categories.length - 1].querySelectorAll(".cat-title, .skill-tag"), {
                opacity: 0,
                x: -100,
                stagger: 0.05,
                duration: 0.5,
                ease: "power2.in"
            }, afterSkillsTime)
            tl.to(skillsListRef.current, { opacity: 0, display: "none", duration: 0.5 }, afterSkillsTime + 0.5)

            // Fade in experience container
            tl.fromTo(xpListRef.current,
                { opacity: 0, x: -100, display: "none" },
                { opacity: 1, x: 0, display: "flex", ease: "power2.out", duration: 0.8 }, afterSkillsTime + 0.5
            )

            // Move cursor to phone area for experience clicking
            const xpStart = afterSkillsTime + 1
            tl.fromTo(cursorRef.current,
                { opacity: 0, x: "50vw", y: "80vh", scale: 1 },
                { opacity: 1, x: isMobile ? "50vw" : "75vw", y: isMobile ? "20vh" : "55vh", duration: 0.8, ease: "power2.out" },
                xpStart
            )

            // Switch to hand cursor right before clicking sequences begin
            tl.set(arrowImg, { opacity: 0 }, xpStart + 0.8)
            tl.set(handImg, { opacity: 1 }, xpStart + 0.8)

            // Sequence through each experience item 
            const xpItems = gsap.utils.toArray(".xp-item")
            const xpDots = gsap.utils.toArray(".xp-dot")
            const xpPathAnim = xpPath ? xpPath.getTotalLength() : 0

            // Base SVG line draw: gradually draw the whole line while items appear
            if (xpPath) {
                tl.to(xpPath, {
                    strokeDashoffset: 0,
                    duration: xpItems.length * 1.5,
                    ease: "none"
                }, xpStart + 0.5)
            }

            xpItems.forEach((xp, i) => {
                const xpTime = xpStart + 0.8 + (i * 1.5)
                const clickTime = xpTime - 0.2

                // Lively Cursor click
                tl.to(cursorRef.current, { scale: 0.8, rotate: -5, duration: 0.1, yoyo: true, repeat: 1 }, clickTime)

                // Exploding sparks effect
                tl.fromTo(sparks,
                    { x: 0, y: 0, scale: 1, opacity: 1 },
                    {
                        x: (index) => Math.cos(index * (Math.PI * 2) / 6) * 45,
                        y: (index) => Math.sin(index * (Math.PI * 2) / 6) * 45,
                        scale: 0,
                        opacity: 0,
                        duration: 0.5,
                        ease: "expo.out",
                        stagger: 0
                    },
                    clickTime
                )

                // The timeline dot pops in
                if (xpDots[i]) {
                    tl.fromTo(xpDots[i],
                        { scale: 0, opacity: 0 },
                        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2)" },
                        clickTime + 0.1
                    )
                }

                // Fade In item with an energetic bouncy spring from below and slightly skewed
                tl.fromTo(xp,
                    { opacity: 0, y: 60, scale: 0.8, rotation: 3 },
                    { opacity: 1, y: 0, scale: 1, rotation: 0, duration: 1, ease: "elastic.out(1, 0.7)" },
                    xpTime
                )
            })

            const holdXpTime = xpStart + 0.8 + (xpItems.length * 1.5)

            // Fade out cursor
            tl.to(cursorRef.current, { opacity: 0, duration: 0.5 }, holdXpTime - 0.5)
            tl.to({}, { duration: 1 }) // Hold XP on screen

            // ── PHASE 3: Rotate Landscape & Center for Stats ──
            const statsTime = holdXpTime + 0.5

            // Fade out xp
            tl.to(xpListRef.current, { opacity: 0, y: -50, duration: 0.8 }, statsTime)

            // Phone turns horizontal (landscape) and zooms in a bit
            tl.to(proxy, {
                x: 0,
                y: isMobile ? 1 : 0,
                z: isMobile ? 1 : 3,
                rotX: 0,
                rotY: 0,
                rotZ: -Math.PI / 2, // Rotate exactly 90 degrees
                scale: isMobile ? 1.5 : 2.2,
                ease: "power3.inOut",
                duration: 1.5
            }, statsTime)

            // Show Stats using a dynamic stagger bounce
            const statsItems = gsap.utils.toArray(".stat-item")
            tl.fromTo(statsRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.1 }, statsTime + 1
            )
            tl.fromTo(statsItems,
                { opacity: 0, scale: 0.3, y: 40, rotationY: 45 },
                { opacity: 1, scale: 1, y: 0, rotationY: 0, duration: 0.8, stagger: 0.15, ease: "back.out(1.5)" },
                statsTime + 1.1
            )

            // ── PHASE 4: Zoom Into Screen (Transition to next section) ──
            const finalZoomTime = statsTime + 3

            // Fade out stats
            tl.to(statsRef.current, { opacity: 0, scale: 1.2, duration: 0.5 }, finalZoomTime)

            // Extreme zoom into the screen, spinning it wildly like being pulled into a portal
            tl.to(proxy, {
                z: 15, // Zoom past the camera
                rotZ: "+=" + (Math.PI * 2), // Full barrel roll
                scale: 3,
                ease: "expo.in",
                duration: 1.5
            }, finalZoomTime + 0.2)

            // Fade the entire scene to black/white at the very end
            tl.to(containerRef.current, { opacity: 0, ease: "power2.in", duration: 1 }, finalZoomTime + 0.5)

        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <section ref={sectionRef} id="skills" className="relative h-screen bg-secondary overflow-hidden text-foreground">

            {/* 3D CANVAS BACKGROUND */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                <Canvas camera={{ position: [0, 0, 10], fov: 35 }}>
                    <ambientLight intensity={1.5} />
                    <directionalLight position={[10, 10, 5]} intensity={2} />
                    <directionalLight position={[-10, -10, -5]} intensity={1} color="#f0f0f0" />
                    <Environment preset="city" />

                    <PhoneAnimator />

                    <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2} far={4} />
                </Canvas>
            </div>

            {/* HTML OVERLAY CONENT */}
            <div ref={containerRef} className="absolute inset-0 z-20 w-full h-full pointer-events-none flex items-center justify-center">

                {/* ── IMAGE CURSORS & SPARKS ── */}
                <div ref={cursorRef} className="absolute top-0 left-0 z-50 pointer-events-none w-10 h-10 opacity-0 transform-origin-top-left -ml-2 -mt-2">
                    {/* Multicolored Click Sparks Effect */}
                    <div className="cursor-sparks absolute top-0 left-0 w-full h-full origin-center">
                        <div className="spark absolute w-1.5 h-1.5 bg-yellow-400 rounded-full top-2 left-2 opacity-0" />
                        <div className="spark absolute w-1.5 h-1.5 bg-sky-400 rounded-full top-2 left-2 opacity-0" />
                        <div className="spark absolute w-1.5 h-1.5 bg-pink-400 rounded-full top-2 left-2 opacity-0" />
                        <div className="spark absolute w-1.5 h-1.5 bg-emerald-400 rounded-full top-2 left-2 opacity-0" />
                        <div className="spark absolute w-1.5 h-1.5 bg-purple-400 rounded-full top-2 left-2 opacity-0" />
                        <div className="spark absolute w-1.5 h-1.5 bg-orange-400 rounded-full top-2 left-2 opacity-0" />
                    </div>

                    {/* PNG Assets */}
                    <img src="/img/cursor.png" className="cursor-arrow absolute top-0 left-0 w-8 h-8 object-contain drop-shadow-md z-10" alt="cursor" />
                    <img src="/img/cursor_hand.png" className="cursor-hand absolute top-0 left-0 w-8 h-8 object-contain drop-shadow-md z-20 opacity-0" alt="cursor hover" />
                </div>

                {/* ── HERO TITLE ── */}
                <div ref={titleRef} className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 w-full h-full">
                    <span className="text-xs md:text-sm font-mono tracking-[0.3em] uppercase text-muted-foreground mb-6">
                        Skills & Expertise
                    </span>
                    <div className="text-5xl sm:text-7xl md:text-8xl lg:text-[100px] font-black tracking-tighter leading-[0.9] text-foreground drop-shadow-sm">
                        <BlurText
                            text="Building Digital"
                            delay={30}
                            className="text-foreground"
                        />
                        <BlurText
                            text="Experiences"
                            delay={30}
                            className="text-foreground"
                        />
                    </div>
                </div>

                {/* ── SKILLS LIST ── */}
                <div
                    ref={skillsListRef}
                    className="absolute inset-0 w-full lg:w-1/2 lg:left-1/2 flex flex-col justify-end lg:justify-center px-4 md:px-12 lg:pr-24 lg:pl-12 opacity-0 pointer-events-auto pb-8 lg:pb-0"
                    style={{ display: 'none' }}
                >
                    {/* The container for the burst effect centering. 
                        We use relative here, and all items inside are absolute so they burst FROM the center. */}
                    <div className="relative w-full max-w-lg mx-auto lg:ml-0 h-[45vh] lg:h-[40vh] flex items-center justify-center">
                        {SKILL_CATEGORIES.map((cat, idx) => (
                            <div key={idx} className="skill-category-item absolute inset-0 flex flex-col items-center justify-center opacity-0">
                                {/* Category Title */}
                                <h3 className="cat-title text-sm md:text-base font-mono uppercase tracking-widest font-bold text-foreground mb-8 flex items-center gap-3">
                                    <span className="w-8 h-[2px] bg-foreground" />
                                    {cat.title}
                                    <span className="w-8 h-[2px] bg-foreground" />
                                </h3>

                                {/* Skill Tags (Flex layout to prevent messy overlapping, but animated dynamically) */}
                                <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 max-w-sm md:max-w-md">
                                    {cat.skills.map((skill, i) => {
                                        // Playful, vibrant colors for the tags
                                        const vColors = [
                                            "bg-pink-100 border-pink-400 text-pink-900 shadow-pink-300",
                                            "bg-emerald-100 border-emerald-400 text-emerald-900 shadow-emerald-300",
                                            "bg-sky-100 border-sky-400 text-sky-900 shadow-sky-300",
                                            "bg-purple-100 border-purple-400 text-purple-900 shadow-purple-300",
                                            "bg-yellow-100 border-yellow-400 text-yellow-900 shadow-yellow-300",
                                            "bg-orange-100 border-orange-400 text-orange-900 shadow-orange-300",
                                        ];
                                        const randomColor = vColors[i % vColors.length]; // Deterministic based on index

                                        return (
                                            <span
                                                key={skill}
                                                className={`skill-tag px-4 py-2 md:px-6 md:py-3 text-xs md:text-sm font-black uppercase tracking-wider rounded-xl border-2 shadow-[2px_2px_0_0] lg:shadow-[4px_4px_0_0] cursor-default ${randomColor}`}
                                            >
                                                {skill}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── EXPERIENCE LIST ── */}
                <div
                    ref={xpListRef}
                    className="absolute inset-0 w-full lg:w-1/2 flex flex-col justify-end lg:justify-center px-4 md:px-12 lg:pl-24 lg:pr-12 opacity-0 pointer-events-auto pb-8 lg:pb-0"
                    style={{ display: 'none' }}
                >
                    <div className="relative space-y-12 lg:space-y-16 w-full max-w-lg mx-auto lg:mr-0 h-[50vh] lg:h-auto overflow-y-auto no-scrollbar pointer-events-auto">

                        {/* THE SVG TIMELINE LINE */}
                        <svg
                            className="absolute top-0 left-0 w-8 h-full -z-10 pointer-events-none"
                            style={{ overflow: "visible" }}
                        >
                            {/* A fun curvy path routing through the items. */}
                            <path
                                className="xp-timeline-path"
                                d="M 12,-20 V 50 C 12,80 32,90 32,120 C 32,150 12,160 12,190 V 260 C 12,290 32,300 32,330 C 32,360 12,370 12,400 V 600"
                                fill="none"
                                stroke="#d4d4d4"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>

                        {EXPERIENCE.map((xp, idx) => {
                            // Alternate left/right indentation to match the curvy path
                            const isCurvedAlign = idx % 2 !== 0;
                            return (
                                <div key={idx} className={`xp-item relative transition-colors duration-500 ${isCurvedAlign ? "pl-14" : "pl-8"}`}>
                                    {/* Timeline Dot */}
                                    <div className={`xp-dot absolute top-1.5 w-4 h-4 rounded-full bg-secondary border-2 border-neutral-900 opacity-0 ${isCurvedAlign ? "left-[24px]" : "left-[4px]"}`} />

                                    <span className="text-xs font-mono font-bold text-muted-foreground mb-1 block">
                                        {xp.period}
                                    </span>
                                    <h3 className="text-2xl md:text-4xl font-black text-foreground tracking-tight leading-none mb-2">
                                        {xp.company}
                                    </h3>
                                    <h4 className="text-lg md:text-xl font-bold text-muted-foreground mb-4">
                                        {xp.role}
                                    </h4>

                                    <ul className="space-y-2">
                                        {xp.highlights.map((hlt, i) => (
                                            <li key={i} className="flex items-start gap-3 text-secondary-foreground font-medium text-sm md:text-base">
                                                <span className="text-muted mt-1 shrink-0">▸</span>
                                                {hlt}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* ── STATS ROW ── */}
                <div
                    ref={statsRef}
                    className="absolute inset-0 flex items-end lg:items-center justify-center opacity-0 pointer-events-auto pb-12 lg:pb-0"
                >
                    {/* Shifted and rotated to match the phone's natural 3D perspective resting angle */}
                    <div className="w-full max-w-5xl mx-auto px-4 lg:px-6 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 relative z-50 lg:-translate-x-12 lg:-translate-y-4 lg:rotate-[14deg] lg:scale-[0.9]">
                        {SKILLS_STATS.map((stat, i) => {
                            let content;

                            // Handle specific stat formats manually for perfection
                            if (stat.label === "Projects Completed") {
                                content = <><CountUp from={0} to={6} duration={2} />+</>
                            } else if (stat.label === "Graduated") {
                                content = <>May&nbsp;<CountUp from={2000} to={2025} duration={2} separator="" startWhen={true} /></>
                            } else if (stat.label === "Years Experience") {
                                content = <><CountUp from={0} to={1.5} duration={2} />+</>
                            } else if (stat.label === "GPA") {
                                content = <>(<CountUp from={0} to={3.42} duration={2} />/4.00)</>
                            } else {
                                content = stat.value
                            }

                            return (
                                <div key={i} className="stat-item flex flex-col items-center text-center">
                                    <span className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground tracking-tighter mb-2 font-mono flex items-center">
                                        {content}
                                    </span>
                                    <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                                        {stat.label}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>

            </div>
        </section>
    )
}