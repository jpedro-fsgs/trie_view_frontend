import Link from "next/link";

export default function Home() {
    return (
        <div className="min-h-dvh flex flex-col md:flex-row">
            <div className="flex-1 flex items-center justify-center transition-colors duration-300 text-primary hover:bg-secondary">
                <Link
                    href="/radix"
                    className="text-6xl hover:underline"
                >
                    Radix
                </Link>
            </div>
            <div className="flex-1 flex items-center justify-center transition-colors duration-300 text-primary hover:bg-secondary">
                <Link
                    href="/trie"
                    className="text-6xl hover:underline"
                >
                    Trie
                </Link>
            </div>
            <div className="flex-1 flex items-center justify-center transition-colors duration-300 text-primary hover:bg-secondary">
                <Link
                    href="/wordslist"
                    className="text-6xl hover:underline"
                >
                    Words List
                </Link>
            </div>
        </div>
    );
}
