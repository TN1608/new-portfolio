import { cn } from "@/lib/utils.js";

export const AnimatedLink = ({ children, href, className, ...props }) => {
    const isExternal = href?.startsWith("http")
    return (
        <a
            href={href}
            {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            {...props}
            className={cn(
                className,
                "group relative flex items-center",
                "before:pointer-events-none before:absolute before:left-0 before:w-full before:bg-neutral-900 before:content-['']",
                "before:scale-x-1 before:transition-all before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)]",
                "before:origin-left md:before:top-0",
                "before:z-1 px-2 before:h-full before:scale-x-0 before:mix-blend-difference hover:before:scale-x-100"
            )}
        >
            {children}
            <svg
                className="z-0 ml-[0.6em] mt-[0em] size-[0.55em] -translate-x-1 rotate-45 opacity-0 transition-all duration-300 [motion-reduce:transition-none] group-hover:translate-x-0 group-hover:opacity-100 motion-reduce:transition-none"
                fill="none"
                viewBox="0 0 10 10"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                <path
                    d="M1.004 9.166 9.337.833m0 0v8.333m0-8.333H1.004"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                ></path>
            </svg>
        </a>
    )
}
