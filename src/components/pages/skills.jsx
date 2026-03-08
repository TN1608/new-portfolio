"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, Float, ContactShadows } from "@react-three/drei"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
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
    screenOpacity: 0,
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
                <Smartphone screenOpacity={proxy.screenOpacity}>
                    {/* The UI inside the phone screen */}
                    <div className="w-full h-full flex flex-col justify-between p-6 tracking-tight relative">
                        <div className="flex justify-between items-center text-white/50 text-[10px] font-mono mb-4 w-full">
                            <span>9:41</span>
                            <div className="flex gap-1">
                                <div className="w-4 h-2 rounded-sm bg-white/50"></div>
                                <div className="w-5 h-2 rounded-sm bg-white/50"></div>
                            </div>
                        </div>

                        <div className="space-y-4 flex-1 mt-8">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-400 opacity-80 shadow-[0_0_30px_rgba(56,189,248,0.6)]"></div>
                            <h2 className="text-[2.5rem] font-black text-white leading-[0.9] tracking-tighter">PORT<br />FOLIO<br />SYS_</h2>
                            <p className="text-white/60 text-xs font-mono mt-4">INITIALIZING SEQUENCE...</p>
                        </div>

                        <div className="h-24 w-full bg-white/5 rounded-2xl border border-white/10 p-4 flex flex-col gap-3 relative overflow-hidden backdrop-blur-md">
                            <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-3/4 shadow-[0_0_15px_rgba(59,130,246,0.8)]"></div>
                            </div>
                            <span className="text-[10px] text-white/50 font-mono tracking-widest uppercase">LOADING SKILLS_OBJ</span>
                        </div>
                    </div>
                </Smartphone>
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

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Reset proxy on mount
            proxy.x = 0
            proxy.y = -0.5
            proxy.rotX = 0
            proxy.rotY = 0
            proxy.rotZ = 0
            proxy.screenOpacity = 0
            proxy.scale = 2.2

            // Create main timeline
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=600%", // Longer scroll for sequential reading
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1
                }
            })

            // ── PHASE 1: Move Phone Left, Title out, Rotate slightly ──
            tl.to(proxy, { x: -2.5, z: 0.5, rotX: 0.15, rotY: Math.PI / 6, rotZ: 0.05, screenOpacity: 1, ease: "power2.inOut", duration: 1.2 }, 0)
            tl.to(titleRef.current, { opacity: 0, scale: 0.8, duration: 1 }, 0)

            // Show Skills container
            tl.to(skillsListRef.current, { opacity: 1, display: "flex", duration: 0.1 }, 0.9)

            // Sequence through each skill category (fade in, hold, fade out)
            const categories = gsap.utils.toArray(".skill-category-item")
            categories.forEach((cat, i) => {
                const startTime = 1 + (i * 1.5)

                // Fade In
                tl.fromTo(cat,
                    { opacity: 0, y: 50 },
                    { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
                    startTime
                )

                // Hold
                tl.to({}, { duration: 0.5 })

                // Fade Out (except the last one which fades out with the container)
                if (i < categories.length - 1) {
                    tl.to(cat, { opacity: 0, x: -50, duration: 0.5, ease: "power2.in" }, startTime + 1)
                }
            })

            const afterSkillsTime = 1 + (categories.length * 1.5)

            // ── PHASE 2: Move Phone Right, Extreme Camera Swivel ──
            // Phone pushes back slightly (z: -1), does a large swivel, then lands on the right
            tl.to(proxy, { x: 0, z: -1, rotY: Math.PI, ease: "power1.inOut", duration: 0.7 }, afterSkillsTime)
            tl.to(proxy, { x: 2.2, z: 0.5, rotX: 0.1, rotY: -Math.PI / 6, rotZ: -0.05, ease: "power2.out", duration: 0.8 }, afterSkillsTime + 0.7)

            // Fade out last skill category and entire skills container
            tl.to(categories[categories.length - 1], { opacity: 0, x: -50, duration: 0.5 }, afterSkillsTime)
            tl.to(skillsListRef.current, { opacity: 0, display: "none", duration: 0.5 }, afterSkillsTime + 0.5)

            // Fade in experience container
            tl.fromTo(xpListRef.current,
                { opacity: 0, x: -100, display: "none" },
                { opacity: 1, x: 0, display: "flex", ease: "power2.out", duration: 0.8 }, afterSkillsTime + 0.5
            )
            // Stagger experience items
            tl.fromTo(".xp-item",
                { opacity: 0, x: -50 },
                { opacity: 1, x: 0, stagger: 0.4, duration: 0.8, ease: "back.out(1.2)" }, afterSkillsTime + 1
            )

            const holdXpTime = afterSkillsTime + 2.5
            tl.to({}, { duration: 1 }) // Hold XP on screen

            // ── PHASE 3: Center & Show Stats (Dramatic Upward Tilt) ──
            tl.to(proxy, { x: 0, y: 0.5, z: 1, rotX: -0.3, rotY: 0, rotZ: 0, ease: "power3.inOut", duration: 1.5 }, holdXpTime)

            // Fade out xp
            tl.to(xpListRef.current, { opacity: 0, y: -50, duration: 0.8 }, holdXpTime)

            // Show Stats at bottom
            tl.fromTo(statsRef.current,
                { opacity: 0, y: 100 },
                { opacity: 1, y: 0, duration: 1, ease: "back.out(1.5)" }, holdXpTime + 0.5
            )

            tl.fromTo(".stat-item",
                { opacity: 0, scale: 0.8 },
                { opacity: 1, scale: 1, stagger: 0.2, duration: 0.8 }, holdXpTime + 0.8
            )

        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <section ref={sectionRef} id="skills" className="relative h-screen bg-neutral-100 overflow-hidden text-neutral-900">

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

                {/* ── HERO TITLE ── */}
                <div ref={titleRef} className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 w-full h-full">
                    <span className="text-xs md:text-sm font-mono tracking-[0.3em] uppercase text-neutral-500 mb-6">
                        Skills & Expertise
                    </span>
                    <div className="text-5xl sm:text-7xl md:text-8xl lg:text-[100px] font-black tracking-tighter leading-[0.9] text-neutral-900 drop-shadow-sm">
                        <BlurText
                            text="Building Digital"
                            delay={30}
                            className="text-neutral-900"
                        />
                        <BlurText
                            text="Experiences"
                            delay={30}
                            className="text-neutral-900"
                        />
                    </div>
                </div>

                {/* ── SKILLS LIST (RIGHT SIDE) ── */}
                <div
                    ref={skillsListRef}
                    className="absolute right-0 w-full lg:w-1/2 h-full flex flex-col justify-center px-6 lg:pr-24 pl-6 lg:pl-12 opacity-0 pointer-events-auto"
                    style={{ display: 'none' }}
                >
                    <div className="relative w-full max-w-lg mx-auto lg:ml-0 h-[40vh]">
                        {SKILL_CATEGORIES.map((cat, idx) => (
                            <div key={idx} className="skill-category-item absolute top-1/2 left-0 -translate-y-1/2 w-full opacity-0">
                                <h3 className="text-sm font-mono uppercase tracking-widest text-neutral-400 mb-4 flex items-center gap-3">
                                    <span className="w-8 h-px bg-neutral-300" />
                                    {cat.title}
                                </h3>
                                <div className="flex flex-wrap gap-2.5">
                                    {cat.skills.map(skill => (
                                        <span
                                            key={skill}
                                            className="px-4 py-2 md:px-5 md:py-2.5 text-sm md:text-base font-bold rounded-2xl bg-white border border-neutral-200 shadow-sm text-neutral-800 hover:scale-105 hover:border-neutral-400 transition-all cursor-default"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── EXPERIENCE LIST (LEFT SIDE) ── */}
                <div
                    ref={xpListRef}
                    className="absolute left-0 w-full lg:w-1/2 h-full flex flex-col justify-center px-6 lg:pl-24 pr-6 lg:pr-12 gap-8 opacity-0 pointer-events-auto"
                    style={{ display: 'none' }}
                >
                    <div className="space-y-12 w-full max-w-lg mx-auto lg:mr-0">
                        {EXPERIENCE.map((xp, idx) => (
                            <div key={idx} className="xp-item relative pl-8 border-l-2 border-neutral-200 hover:border-neutral-900 transition-colors duration-500">
                                {/* Timeline Dot */}
                                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-neutral-100 border-2 border-neutral-900" />

                                <span className="text-xs font-mono font-bold text-neutral-500 mb-1 block">
                                    {xp.period}
                                </span>
                                <h3 className="text-3xl md:text-4xl font-black text-neutral-900 tracking-tight leading-none mb-2">
                                    {xp.company}
                                </h3>
                                <h4 className="text-lg md:text-xl font-bold text-neutral-500 mb-4">
                                    {xp.role}
                                </h4>

                                <ul className="space-y-2">
                                    {xp.highlights.map((hlt, i) => (
                                        <li key={i} className="flex items-start gap-3 text-neutral-600 font-medium text-sm md:text-base">
                                            <span className="text-neutral-300 mt-1 shrink-0">▸</span>
                                            {hlt}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── STATS ROW (BOTTOM CENTER) ── */}
                <div
                    ref={statsRef}
                    className="absolute bottom-12 w-full flex justify-center opacity-0 pointer-events-auto"
                >
                    <div className="w-full max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">
                        {SKILLS_STATS.map((stat, i) => {
                            // Extract numeric portion if it exists for CountUp
                            const numMatch = stat.value.match(/(\d+(?:\.\d+)?)/)
                            const numValue = numMatch ? parseFloat(numMatch[1]) : null
                            const hasPlus = stat.value.includes('+')
                            const prefix = stat.value.split(numMatch?.[0])[0] || ""
                            const suffix = (stat.value.split(numMatch?.[0])[1] || "") + (hasPlus && !stat.value.split(numMatch?.[0])[1]?.includes('+') ? "+" : "")

                            return (
                                <div key={i} className="stat-item flex flex-col items-center text-center">
                                    <span className="text-4xl md:text-5xl font-black text-neutral-900 tracking-tighter mb-2 flex items-center">
                                        {prefix}
                                        {numValue !== null ? (
                                            <CountUp
                                                from={0}
                                                to={numValue}
                                                duration={2}
                                                separator=","
                                            />
                                        ) : (
                                            stat.value
                                        )}
                                        {suffix}
                                    </span>
                                    <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
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