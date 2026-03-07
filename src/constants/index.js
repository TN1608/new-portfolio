import { Code, Mail } from "lucide-react"
import { FaGithub } from "react-icons/fa"

export const PROJECTS = [
    {
        title: "Pacific Travel",
        description: "A travel website integrated with AI API, payment API, beautiful effects, and built with modern technologies.",
        tags: ["Gemini API", "ReactJS", "Java Spring boot", "Tailwind", "VNPAY API", "SQL Server"],
        image: "/img/pacific.png",
        github: "https://github.com/Khang1z2t/Pacific",
        demo: "https://pacific-vn.vercel.app/",
    },
    {
        title: "Vieclamsanxuat",
        description: "A modernized job search website for factory workers, migrated from a legacy system with full responsiveness and built using up-to-date technologies.",
        tags: ["ReactJS", "Oracle ", "C#", "Responsive", "Tailwind"],
        image: "/img/vieclamsanxuat.png",
        // github: "https://gitlab.com/websitetuyendung/vieclamsanxuat_v2/-/blob/DinhTuan",
        demo: "https://vieclamsanxuat.vercel.app/",
    },
    {
        title: "TNIzStore",
        description: "A gaming and media service website offering game codes, monthly packs, and social media bundles with integrated AI chat and sleek UI.",
        tags: ["NextJS", "Tailwind", "Framer Motion", "GSAP", "Gemini API", "Java Spring boot", "Postgresql", "ShadcnUI"],
        image: "/img/tnizstore.png",
        github: "https://github.com/TN1608/TNIzStore",
        demo: "https://tnizstore.vercel.app/",
    },
    {
        title: "SKIPLI's Home Landing Page",
        description: "High-conversion landing page for Skipli's home services, modernized by migrating from MUI to shadcn/ui with enhanced animations and performance optimizations.",
        tags: ["ReactJS", "JavaScript", "TailwindCSS", "Shadcn/UI", "Framer Motion"],
        image: "/img/homeskipli.png",
        demo: "https://skiplinow.com",
    },
    {
        title: "SKIPLI Salona Beauty Website",
        description: "Comprehensive POS and management platform for beauty salons, featuring a custom AI chatbot (Gemini API) and high-performance SEO-friendly Next.js interface.",
        tags: ["NextJS", "JavaScript", "TailwindCSS", "Shadcn/UI", "Framer Motion", "Gemini API"],
        image: "/img/getsalona.png",
        demo: "https://www.getsalona.com/",
    }
]

export const SKILLS = [
    { name: "React", level: 90 },
    { name: "Next.js", level: 85 },
    { name: "TypeScript", level: 80 },
    { name: "Java", level: 75 },
    { name: "Tailwind CSS", level: 90 },
    { name: "Three.js", level: 70 },
    { name: "Spring boot", level: 75 },
    { name: "Framer Motion", level: 85 },
]

export const SKILLS_STATS = [
    { label: "Projects Completed", value: "3+" },
    { label: "Graduated", value: "May 5, 2025" },
    { label: "Years Experience", value: "1+" },
    { label: "GPA", value: "(3.42/4.00)" },
]

export const CONTACT_INFO = [
    { icon: Mail, label: "Email", value: "tuanngdinh.1608@gmail.com" },
    { icon: FaGithub, label: "GitHub", value: "https://github.com/TN1608" },
    { icon: Code, label: "Website", value: "https://tunzngportfolio.id.vn" },
]

export const SOCIAL_LINKS = [
    { name: "github", href: "https://github.com/TN1608" },
    { name: "twitter", href: "https://twitter.com" },
    { name: "linkedin", href: "www.linkedin.com/in/tuấn-nguyễn-đình-70a790359" },
    { name: "facebook", href: "https://www.facebook.com/TuanNguyen160804/" },
]

export const ABOUT_ME_LINKS = [
    { name: "LinkedIn", href: "https://www.linkedin.com/in/tuấn-nguyễn-đình-70a790359", icon: "Linkedin" },
    { name: "Facebook", href: "https://www.facebook.com/TuanNguyen160804/", icon: "Facebook" },
    { name: "Github", href: "https://github.com/TN1608", icon: "Github" },
]
