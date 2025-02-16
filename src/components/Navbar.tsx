"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

function Navbar() {
    const pathname = usePathname();
    return (
        <div className="px-4 py-3 bg-primary text-primary-foreground text-2xl flex gap-4 fixed w-full">
            <Link
                href="/radix"
                className={cn("hover:underline", {"font-extrabold": pathname === "/radix"})}
            >
                Radix
            </Link>
            <Link
                href="/trie"
                className={cn("hover:underline", {"font-extrabold": pathname === "/trie"})}

            >
                Trie
            </Link>
        </div>
    );
}

export default Navbar;
