"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"

export default function Preloader() {
    const containerRef = useRef(null)
    const textContainerRef = useRef(null)
    const counterRef = useRef(null)
    const progressRef = useRef(null)
    const orbRef = useRef(null)
    const [isComplete, setIsComplete] = useState(false)

    useEffect(() => {
        const tl = gsap.timeline({
            onComplete: () => setIsComplete(true)
        })

        const container = containerRef.current
        const textWrapper = textContainerRef.current
        const counter = counterRef.current
        const progress = progressRef.current
        const orb = orbRef.current

        if (container && textWrapper && counter && progress) {
            document.body.style.overflow = "hidden"

            const bars = container.querySelectorAll(".reveal-bar")
            const words = textWrapper.querySelectorAll(".word-wrapper")
            const chars = textWrapper.querySelectorAll(".char")

            // 1. Loading Counter & Progress Bar
            let progressValue = { val: 0 }
            tl.to(progressValue, {
                val: 100,
                duration: 2.2,
                ease: "power4.inOut",
                onUpdate: () => {
                    if (counter) {
                        counter.textContent = Math.round(progressValue.val) + "%"
                    }
                }
            }, 0)
                .to(progress, {
                    scaleX: 1,
                    duration: 2.2,
                    ease: "power4.inOut"
                }, 0)
                // Add a subtle glowing effect to the progress bar when complete
                .to(progress, {
                    opacity: 0.5,
                    duration: 0.3
                })

                // 2. Hide counter & progress smoothly
                .to([counter, progressRef.current?.parentElement], {
                    y: -30,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power3.inOut"
                }, "-=0.2")

                // 3. Reveal chars
                .fromTo(chars, {
                    y: "110%",
                    rotateX: -90,
                    opacity: 0
                }, {
                    y: "0%",
                    rotateX: 0,
                    opacity: 1,
                    duration: 1,
                    stagger: 0.03,
                    ease: "power4.out"
                }, "-=0.8")

                // 4. Subtle scale effect on words & background orb
                .to(words, {
                    scale: 1.05,
                    duration: 1.5,
                    ease: "power1.inOut"
                }, "-=0.5")
                .to(orb, {
                    scale: 1.2,
                    opacity: 0.8,
                    duration: 1.5,
                    ease: "power1.inOut"
                }, "<")

                // 5. Hide Chars and Orb
                .to(chars, {
                    y: "-110%",
                    opacity: 0,
                    duration: 0.6,
                    stagger: 0.02,
                    ease: "power3.in"
                })
                .to(orb, {
                    opacity: 0,
                    scale: 0.8,
                    duration: 0.6,
                    ease: "power3.in"
                }, "<")

                // 6. Reveal underlying site by sliding bars off (Alternating Up & Down)
                .to(bars, {
                    yPercent: (i) => i % 2 === 0 ? -100 : 100,
                    duration: 1.4,
                    ease: "expo.inOut",
                    stagger: 0.08,
                    onComplete: () => {
                        document.body.style.overflow = ""
                    }
                }, "-=0.4")
        }

        return () => {
            document.body.style.overflow = ""
        }
    }, [])

    if (isComplete) return null

    const splitText = (text) => {
        return text.split('').map((char, index) => (
            <span
                key={index}
                className="char inline-block whitespace-pre origin-bottom"
                style={{ perspective: "1000px" }}
            >
                {char}
            </span>
        ));
    }

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-9999 flex flex-col items-center justify-center pointer-events-none font-sans"
        >
            {/* Reveal Bars Background (Alternating Shutters) */}
            <div className="absolute inset-0 flex w-full h-full pointer-events-auto overflow-hidden">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="reveal-bar h-full flex-1 bg-[#0a0a0a] -ml-px first:ml-0"
                    />
                ))}
            </div>

            {/* Subtle glowing abstract orb in the background */}
            <div
                ref={orbRef}
                className="absolute inset-0 z-5 flex items-center justify-center pointer-events-none opacity-20 scale-100"
            >
                <div className="w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-neutral-100/10 rounded-full blur-[120px] mix-blend-screen" />
            </div>

            {/* Counter and Progress Line */}
            <div className="absolute bottom-10 left-8 md:bottom-16 md:left-16 right-8 md:right-16 flex flex-col gap-3 z-10">
                <div
                    ref={counterRef}
                    className="text-7xl md:text-[8rem] font-black text-white/5 tracking-tighter text-right leading-none"
                    style={{ WebkitTextStroke: "1px rgba(255,255,255,0.1)" }}
                >
                    0%
                </div>
                <div className="w-full h-[2px] bg-white/5 relative overflow-hidden rounded-full">
                    <div
                        ref={progressRef}
                        className="absolute top-0 left-0 h-full w-full bg-linear-to-r from-neutral-600 via-neutral-300 to-white origin-left scale-x-0 rounded-full"
                    />
                </div>
            </div>

            {/* Center Text Container */}
            <div
                ref={textContainerRef}
                className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 text-white p-6"
            >
                {/* Wrap each word in overflow-hidden to create the nice reveal mask */}
                <div className="word-wrapper overflow-hidden pb-4 px-2">
                    <span className="inline-flex text-5xl md:text-8xl font-black uppercase tracking-tighter mix-blend-difference drop-shadow-2xl font-mono">
                        {splitText("Tuan's")}
                    </span>
                </div>
                <div className="word-wrapper overflow-hidden pb-4 px-2">
                    <span className="inline-flex text-5xl md:text-8xl font-light italic uppercase tracking-widest text-[#d4d4d4] mix-blend-difference drop-shadow-lg font-mono">
                        {splitText("Portfolio")}
                    </span>
                </div>
            </div>
        </div>
    )
}
