export const PROJECTS = [
    {
        id: "pacific-travel",
        title: "Pacific Travel",
        tagline: "AI-powered travel booking platform",
        image: "/img/pacific.png",
        stack: [
            "React",
            "Spring Boot",
            "SQL Server",
            "Tailwind",
            "Gemini API",
            "VNPAY API"
        ],
        links: {
            demo: "https://pacific-vn.vercel.app/",
            github: "https://github.com/Khang1z2t/Pacific"
        },
        problem:
            "Traditional travel booking websites often suffer from outdated UI, complex payment flows, and lack intelligent user assistance.",
        solution:
            "Rebuilt the platform with a modern React frontend and Spring Boot backend while integrating AI assistance and secure payment processing.",
        architecture: [
            "React Frontend",
            "Spring Boot REST API",
            "SQL Server Database",
            "VNPAY Payment Gateway",
            "Gemini AI API"
        ],
        myRole: [
            "Developed frontend UI using React and Tailwind",
            "Designed REST APIs using Spring Boot",
            "Implemented JWT authentication and Spring Security",
            "Integrated VNPAY payment flow",
            "Implemented AI assistant using Gemini API"
        ],
        result: [
            "Modernized travel booking experience",
            "Secure payment workflow",
            "AI-assisted travel consultation"
        ]
    },
    {
        title: "Vieclamsanxuat",
        description: "A modernized job search website for factory workers, migrated from a legacy system with full responsiveness and built using up-to-date technologies.",
        tags: ["ReactJS", "Oracle", "C#", "Responsive", "Tailwind"],
        image: "/img/vieclamsanxuat.png",
        demo: "https://vieclamsanxuat.vercel.app/",

        problem:
            "Factory workers had difficulty accessing job listings due to an outdated UI and inefficient job search functionality.",

        solution:
            "Modernized the platform with responsive UI components and improved job search filters integrated with backend APIs.",

        architecture:
            "ReactJS frontend connected to .NET backend services. Oracle database used for storing job listings and user data.",

        role:
            "Implemented responsive UI with ReactJS and TailwindCSS while integrating frontend components with backend APIs and database queries.",

        result:
            "Improved accessibility and usability of the platform, enabling users to search and apply for jobs more efficiently."
    },
    {
        title: "TNIzStore",
        description: "A gaming and media service website offering game codes, monthly packs, and social media bundles with integrated AI chat and sleek UI.",
        tags: ["NextJS", "Tailwind", "Framer Motion", "GSAP", "Gemini API", "Java Spring boot", "Postgresql", "ShadcnUI"],
        image: "/img/tnizstore.png",
        github: "https://github.com/TN1608/TNIzStore",
        demo: "https://tnizstore.vercel.app/",

        problem:
            "Online digital product stores often lack automation for customer support and have slow UI interactions.",

        solution:
            "Built a full-stack platform with AI chatbot support and smooth UI animations to enhance user engagement and automate support.",

        architecture:
            "Next.js frontend with TailwindCSS and Shadcn UI components. Backend powered by Spring Boot with PostgreSQL database. Gemini AI API used for chatbot functionality.",

        role:
            "Designed the full-stack architecture, implemented UI animations, integrated AI chatbot features, and handled backend API logic.",

        result:
            "Created a scalable digital store platform with AI-assisted user interaction and smooth UI performance."
    },
    {
        title: "SKIPLI's Home Landing Page",
        description: "High-conversion landing page for Skipli's home services, modernized by migrating from MUI to shadcn/ui with enhanced animations and performance optimizations.",
        tags: ["ReactJS", "JavaScript", "TailwindCSS", "Shadcn/UI", "Framer Motion"],
        image: "/img/homeskipli.png",
        demo: "https://skiplinow.com",

        problem:
            "The original landing page used heavy UI frameworks and had poor performance and inconsistent design components.",

        solution:
            "Refactored the UI by migrating from MUI to Shadcn/UI and TailwindCSS while introducing motion effects and improved layout structure.",

        architecture:
            "ReactJS frontend architecture with modular UI components using TailwindCSS and Shadcn UI design system.",

        role:
            "Led the UI refactor process, redesigned reusable components, and optimized frontend performance and animation flows.",

        result:
            "Delivered a faster, cleaner, and more maintainable landing page aligned with modern design systems."
    },
    {
        title: "SKIPLI Salona Beauty Website",
        description: "Comprehensive POS and management platform for beauty salons, featuring a custom AI chatbot (Gemini API) and high-performance SEO-friendly Next.js interface.",
        tags: ["NextJS", "JavaScript", "TailwindCSS", "Shadcn/UI", "Framer Motion", "Gemini API"],
        image: "/img/getsalona.png",
        demo: "https://www.getsalona.com/",

        problem:
            "Beauty salons needed an automated system to manage bookings, customer consultations, and POS workflows.",

        solution:
            "Built a full management platform with AI-powered chatbot support and optimized frontend architecture for fast performance.",

        architecture:
            "Next.js frontend with TailwindCSS and Shadcn UI. AI chatbot powered by Gemini API. Backend services optimized with caching and request throttling.",

        role:
            "Implemented both frontend interface and backend AI chatbot logic, optimized API performance and designed scalable UI architecture.",

        result:
            "Reduced response time for AI interactions and delivered a high-performance management platform for salon operations."
    },
    {
        title: "3D Car Landing Experience",
        description: "Interactive 3D landing page showcasing car models with dynamic lighting, shading and scroll-driven animations.",
        tags: ["ReactJS", "JavaScript", "TailwindCSS", "Three.js", "GSAP", "GLTF models", "WebGL"],
        image: "/img/3d-cars-landingpage.png",
        demo: "https://3d-cars-landing-page.vercel.app/",

        problem:
            "Traditional landing pages rely on static visuals and lack immersive interaction.The goal was to explore how 3D WebGL rendering and scroll animation can create a cinematic product experience.",

        solution:
            "Implemented a 3D product showcase using Three.js with GSAP timelines to synchronize camera motion, model rotation and UI transitions.",

        architecture: [
            "React UI layer",
            "Three.js scene",
            "GSAP scroll timeline",
            "GLTF model loading"
        ],
        role: [
            "Developed the entire interactive experience including:",
            "3D scene setup",
            "lighting and shading configuration",
            "scroll-driven animation using GSAP",
            "camera motion choreography"
        ],

        result:
            "Created a high-performance 3D landing experience demonstrating real-time rendering and cinematic scroll storytelling."
    }
]