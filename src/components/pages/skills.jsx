"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, Float, ContactShadows } from "@react-three/drei"
import { Model as Iphone17Pro } from "@/components/models/Iphone17Pro"
import BlurText from "@/components/BlurText"
import { SKILL_CATEGORIES, EXPERIENCE } from "@/assets/data/SKILLS"

gsap.registerPlugin(ScrollTrigger)

const proxy = {
    x: 0, y: 15, z: -10,
    rotX: Math.PI * 2, rotY: Math.PI * 4, rotZ: Math.PI,
    scale: 0.1
}

const PhoneAnimator = () => {
    const groupRef = useRef(null)
    useFrame(() => {
        if (!groupRef.current) return
        groupRef.current.position.set(proxy.x, proxy.y, proxy.z)
        groupRef.current.rotation.set(proxy.rotX, proxy.rotY, proxy.rotZ)
        groupRef.current.scale.set(proxy.scale, proxy.scale, proxy.scale)
    })

    return (
        <group ref={groupRef}>
            <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
                {/* Screen content is now a CanvasTexture, no children needed */}
                <Iphone17Pro />
            </Float>
        </group>
    )
}

export const SkillsPage = () => {
    const sectionRef = useRef(null)
    const containerRef = useRef(null)
    const introRef = useRef(null)
    const skillNodesRef = useRef([])
    const xpScenesRef = useRef([])

    useEffect(() => {
        const ctx = gsap.context(() => {
            const isMobile = window.innerWidth < 1024

            gsap.set(proxy, { x: 0, y: 15, z: -10, rotX: Math.PI * 2, rotY: Math.PI * 4, rotZ: Math.PI, scale: 0.1 })
            gsap.set(skillNodesRef.current, { opacity: 0, scale: 0 })
            gsap.set(".fade-out-overlay", { opacity: 0 })
            gsap.set(".stats-highlight-overlay", { opacity: 0 })

            // XP scenes: hide all initially + set entrance states
            xpScenesRef.current.forEach(scene => {
                if (!scene) return
                gsap.set(scene, { opacity: 0, display: "none" })
                gsap.set(scene.querySelectorAll(".xp-company-char"), { yPercent: 120, rotateX: -60, opacity: 0 })
                gsap.set(scene.querySelector(".xp-role"), { opacity: 0, x: -60 })
                gsap.set(scene.querySelectorAll(".xp-highlight"), { opacity: 0, x: -80, y: 30 })
                gsap.set(scene.querySelector(".xp-period"), { opacity: 0, scale: 0.3, rotation: -25 })
                gsap.set(scene.querySelector(".xp-decor-line"), { scaleX: 0, transformOrigin: "left center" })
                gsap.set(scene.querySelector(".xp-watermark"), { opacity: 0, x: 200 })
                gsap.set(scene.querySelector(".xp-index"), { opacity: 0, scale: 0 })
            })

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=1400%",
                    scrub: 1.5,
                    pin: true,
                    anticipatePin: 1
                }
            })

            // ── PHASE 1: iPhone Drops In ──
            tl.to(proxy, {
                x: 0, y: 0, z: 0,
                rotX: 0.1, rotY: isMobile ? 0 : Math.PI / 12, rotZ: 0,
                scale: isMobile ? 12 : 18,
                ease: "power4.out", duration: 1.5
            }, 0)
            tl.to(introRef.current, { opacity: 0, scale: 1.1, filter: "blur(10px)", duration: 1 }, 0.5)

            // ── PHASE 2: Skills Orbit Burst ──
            tl.to(proxy, { z: -5, rotX: -0.15, rotY: Math.PI / 8, ease: "power2.inOut", duration: 1.5 }, 1.5)

            skillNodesRef.current.forEach((node, i) => {
                const angle = (i / skillNodesRef.current.length) * Math.PI * 2 - Math.PI / 2
                const radius = isMobile ? (110 + (i % 2) * 50) : (350 + (i % 2) * 100)
                tl.to(node, {
                    opacity: 1, x: Math.cos(angle) * radius * (isMobile ? 1 : 1.4), y: Math.sin(angle) * radius * 0.85,
                    scale: 1, rotation: gsap.utils.random(-12, 12),
                    ease: "elastic.out(1, 0.7)", duration: 1.5
                }, 1.8 + i * 0.1)
            })
            tl.to(skillNodesRef.current, { y: "+=15", rotation: "+=3", yoyo: true, repeat: 1, duration: 1.5, ease: "sine.inOut" }, 3.5)

            // ── PHASE 3: Zoom Stats ──
            tl.to(skillNodesRef.current, { opacity: 0, x: 0, y: 0, scale: 0, duration: 1, ease: "power4.in" }, 5)
            tl.to(proxy, {
                x: 0, y: isMobile ? 0.3 : -0.2, z: 0,
                rotX: 0, rotY: 0, rotZ: 0,
                scale: isMobile ? 30 : 44,
                ease: "expo.inOut", duration: 2.2
            }, 5.5)
            tl.to(".stats-highlight-overlay", { opacity: 0.7, duration: 1.5 }, 6.5)
            tl.to({}, { duration: 2 }) // Hold

            // ── PHASE 4: Editorial Experience Scenes ──
            tl.to(".stats-highlight-overlay", { opacity: 0, duration: 1 }, 8.5)
            tl.to(proxy, { y: 20, z: -50, rotX: Math.PI / 6, scale: 3, ease: "power3.inOut", duration: 2 }, 8.5)

            let xpBaseTime = 10
            xpScenesRef.current.forEach((scene, i) => {
                if (!scene) return
                const enterTime = xpBaseTime + (i * 5)

                tl.set(scene, { display: "flex", opacity: 1 }, enterTime)
                tl.to(scene.querySelector(".xp-watermark"), { opacity: 0.04, x: 0, duration: 2, ease: "power3.out" }, enterTime)
                tl.to(scene.querySelector(".xp-index"), { opacity: 1, scale: 1, duration: 1, ease: "back.out(2)" }, enterTime + 0.2)
                tl.to(scene.querySelectorAll(".xp-company-char"), {
                    yPercent: 0, rotateX: 0, opacity: 1,
                    stagger: 0.04, duration: 1.2, ease: "back.out(1.4)"
                }, enterTime + 0.3)
                tl.to(scene.querySelector(".xp-decor-line"), { scaleX: 1, duration: 1.2, ease: "power3.out" }, enterTime + 0.5)
                tl.to(scene.querySelector(".xp-period"), { opacity: 1, scale: 1, rotation: 0, duration: 0.8, ease: "back.out(2)" }, enterTime + 0.7)
                tl.to(scene.querySelector(".xp-role"), { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" }, enterTime + 0.9)
                tl.to(scene.querySelectorAll(".xp-highlight"), {
                    opacity: 1, x: 0, y: 0,
                    stagger: 0.2, duration: 1.2, ease: "elastic.out(1, 0.8)"
                }, enterTime + 1.2)

                if (i < EXPERIENCE.length - 1) {
                    const exitTime = enterTime + 4
                    tl.to(scene.querySelectorAll(".xp-company-char"), { yPercent: -120, opacity: 0, stagger: 0.02, duration: 0.6, ease: "power3.in" }, exitTime)
                    tl.to(scene.querySelectorAll(".xp-role, .xp-highlight, .xp-decor-line, .xp-period, .xp-watermark, .xp-index"), { opacity: 0, x: 100, stagger: 0.04, duration: 0.5, ease: "power3.in" }, exitTime)
                    tl.set(scene, { display: "none" }, exitTime + 0.8)
                }
            })

            // ── PHASE 5: Exit Dive ──
            const exitTime = xpBaseTime + (EXPERIENCE.length * 5) + 0.5
            const lastScene = xpScenesRef.current[EXPERIENCE.length - 1]
            if (lastScene) {
                tl.to(lastScene, { opacity: 0, scale: 0.95, filter: "blur(10px)", duration: 1.5 }, exitTime)
            }
            tl.to(proxy, { x: 0, y: 0, z: 25, rotX: 0, rotY: 0, rotZ: -Math.PI / 2, scale: 120, duration: 2, ease: "expo.in" }, exitTime + 0.5)
            tl.to(".fade-out-overlay", { opacity: 1, duration: 1.5 }, exitTime + 1.5)

        }, sectionRef)
        return () => ctx.revert()
    }, [])

    return (
        <section ref={sectionRef} id="skills" className="relative h-screen bg-[#e8ded5] overflow-hidden text-neutral-900">
            <div className="stats-highlight-overlay absolute inset-0 bg-[#0a0a0a] z-[5] pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-10 transform -translate-y-full pointer-events-none">
                <svg className="w-full h-[8vh] md:h-[12vh] block" viewBox="0 0 1440 100" preserveAspectRatio="none">
                    <path fill="#e8ded5" d="M0,100 L1440,100 L1440,50 Q720,150 0,50 Z"></path>
                </svg>
            </div>

            {/* 3D CANVAS */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                <Canvas camera={{ position: [0, 0, 10], fov: 35 }}>
                    <ambientLight intensity={1.8} />
                    <directionalLight position={[10, 20, 10]} intensity={2.5} />
                    <directionalLight position={[-10, -20, -10]} intensity={1.5} color="#ffffff" />
                    <Environment preset="city" />
                    <PhoneAnimator />
                    <ContactShadows position={[0, -3.5, 0]} opacity={0.3} scale={25} blur={3} far={10} />
                </Canvas>
            </div>

            {/* DOM OVERLAYS */}
            <div ref={containerRef} className="absolute inset-0 z-20 w-full h-full pointer-events-none flex flex-col items-center justify-center">
                {/* ── INTRO ── */}
                <div ref={introRef} className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 will-change-transform">
                    <span className="text-xs md:text-sm font-mono tracking-[0.4em] uppercase text-neutral-400 mb-6 font-bold">Skills & Expertise</span>
                    <div className="text-6xl sm:text-7xl md:text-8xl lg:text-[100px] font-black tracking-tighter leading-[0.85] text-neutral-900 opacity-90">
                        <BlurText text="Building Digital"
                            delay={200}
                            animateBy="words"
                            direction="top"
                        />
                        <BlurText text="Experiences"
                            animateBy="words"
                            direction="top"
                            delay={200}
                        />
                    </div>
                </div>

                {/* ── SKILLS ORBIT ── */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                    {SKILL_CATEGORIES.map((cat, idx) => (
                        <div key={idx} ref={el => skillNodesRef.current[idx] = el}
                            className="absolute flex flex-col items-center justify-center gap-2.5 will-change-[transform,opacity] pointer-events-none"
                            style={{ transformOrigin: 'center center' }}>
                            <h3 className="text-[9px] md:text-[11px] font-mono uppercase tracking-[0.3em] font-black text-[#8b8276] bg-white/60 px-3.5 py-1.5 rounded-full backdrop-blur-md border border-white/80 shadow-sm">{cat.title}</h3>
                            <div className="flex flex-wrap items-center justify-center px-3 md:px-5 w-max max-w-[200px] md:max-w-[300px] gap-1.5">
                                {cat.skills.map((skill) => (
                                    <span key={skill} className="px-3.5 py-1.5 text-[10px] md:text-[13px] font-bold uppercase tracking-wider rounded-full bg-white/95 border border-white/80 shadow-[0_8px_25px_rgba(0,0,0,0.06)] text-[#2a2723] pointer-events-auto transition-all duration-300 hover:scale-110 hover:-translate-y-1 cursor-default">{skill}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── EDITORIAL EXPERIENCE SCENES ── */}
                {EXPERIENCE.map((xp, idx) => (
                    <div key={idx} ref={el => xpScenesRef.current[idx] = el}
                        className="absolute inset-0 w-full h-full flex flex-col lg:flex-row items-center pointer-events-none z-40 opacity-0 overflow-hidden"
                        style={{ display: "none" }}>

                        {/* Giant Watermark Background */}
                        <div className="xp-watermark absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black text-[#2a2723]/[0.02] select-none z-0 whitespace-nowrap tracking-tighter pointer-events-none">
                            {xp.company}
                        </div>

                        {/* Left Column: Title & Meta */}
                        <div className="relative z-10 w-full lg:w-1/2 px-8 md:px-16 lg:pl-24 flex flex-col justify-center lg:items-start pt-20 lg:pt-0">
                            <div className="xp-index text-5xl md:text-7xl font-black text-[#2a2723]/10 mb-6 font-mono -ml-1">
                                {String(idx + 1).padStart(2, '0')}
                            </div>

                            <div className="mb-8 flex flex-wrap gap-x-4 md:gap-x-6 gap-y-2" style={{ perspective: "1000px" }}>
                                {xp.company.split(" ").map((word, wIdx) => (
                                    <div key={wIdx} className="overflow-hidden flex">
                                        {word.split("").map((char, cIdx) => (
                                            <span key={cIdx} className="xp-company-char inline-block text-[13vw] sm:text-[11vw] lg:text-[8vw] font-black tracking-tighter leading-[0.8] text-[#2a2723] uppercase" style={{ transformStyle: "preserve-3d" }}>
                                                {char}
                                            </span>
                                        ))}
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center gap-6 mb-8 lg:mb-12">
                                <div className="xp-decor-line w-16 md:w-24 h-[3px] bg-[#2a2723] rounded-full origin-left"></div>
                                <div className="xp-period bg-[#2a2723] text-[#f4f2ef] text-[10px] md:text-xs font-bold px-5 py-2.5 rounded-full uppercase tracking-widest shadow-xl">
                                    {xp.period}
                                </div>
                            </div>

                            <p className="xp-role text-lg md:text-2xl lg:text-3xl font-bold text-[#8b8276] uppercase tracking-[0.15em]">
                                {xp.role}
                            </p>
                        </div>

                        {/* Right Column: Highlights */}
                        <div className="relative z-10 w-full lg:w-1/2 px-8 md:px-16 lg:pr-24 mt-12 lg:mt-0 flex flex-col justify-center">
                            <div className="flex flex-col gap-6 lg:gap-10 max-w-xl lg:ml-auto">
                                {xp.highlights.map((hlt, i) => (
                                    <div key={i} className="xp-highlight flex items-start gap-5 lg:gap-8 group pointer-events-auto cursor-default">
                                        <div className="text-sm md:text-base font-bold text-[#b0a79d] group-hover:text-[#2a2723] transition-colors duration-300 mt-1 font-mono">
                                            /0{i + 1}
                                        </div>
                                        <p className="text-[15px] md:text-lg lg:text-xl font-medium text-[#5a554f] group-hover:text-[#1a1815] transition-colors duration-300 leading-relaxed tracking-tight">
                                            {hlt}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}

                <div className="fade-out-overlay absolute inset-0 z-50 bg-[#060606] opacity-0 pointer-events-none"></div>
            </div>
        </section>
    )
}