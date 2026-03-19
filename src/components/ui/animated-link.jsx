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
                "before:pointer-events-none before:absolute before:left-0 before:w-full before:bg-gray-500/20 before:-z-10 before:content-['']",
                "before:scale-x-0 before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.76,0,0.24,1)]",
                "before:origin-left before:h-full px-2 hover:before:scale-x-100 hover:text-foreground transition-colors"
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
