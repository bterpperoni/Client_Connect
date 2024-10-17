"use client"
import Link from "next/link";
import { type AnchorHTMLAttributes, type ButtonHTMLAttributes } from "react";


export type ButtonProps = {
  href?: string;
  children: React.ReactNode;
  onClick?: () => void;
  classList?: string;
} & ButtonHTMLAttributes<HTMLButtonElement> &
  AnchorHTMLAttributes<HTMLAnchorElement>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Button({ href, onClick, children, classList, ...props }: ButtonProps) {
  // Si on fournit un href, on rend un lien (<Link>)
  if (href) {
    return (
      
      <a
        href={href}
        className={`${classList} group relative inline-flex items-center overflow-hidden rounded-full border-2 border-purple-950 bg-white px-12 py-3 text-md font-medium text-purple-950 hover:bg-gray-50 hover:text-white`}
      >
        
        <span className="duration-400 ease absolute left-0 top-1/2 block h-0 w-full bg-purple-950 opacity-100 transition-all group-hover:top-0 group-hover:h-full"></span>
        <span className="ease absolute right-0 flex h-10 w-10 translate-x-full transform items-center justify-start duration-300 group-hover:translate-x-0">
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            ></path>
          </svg>
        </span>
        <span className="relative">{children}</span>
      </a>
    );
  }
  // sinon un simple bouton (<button>)
  else {
    return (
      <>
        <button
          className={`group relative m-1 cursor-pointer overflow-hidden rounded-xl border-2 border-purple-950 px-3.5 py-2 text-md font-medium text-purple-950 ${classList}`}
          onClick={onClick}
          {...props}
        >
          <span className="ease absolute top-1/2 h-0 w-64 origin-center -translate-x-20 rotate-45 bg-purple-950 transition-all duration-300 group-hover:h-64 group-hover:-translate-y-32"></span>
          <span className="ease relative text-purple-950 transition duration-300 group-hover:text-white">
            {children}
          </span>
        </button>
      </>
    );
  }
}

export default Button;
