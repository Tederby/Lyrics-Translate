import Link from "next/link";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/tags", label: "Tags" },
  { href: "/artists", label: "Artists" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-40 border-b border-zinc-200/50 bg-white/70 backdrop-blur-md transition-colors dark:border-zinc-800/50 dark:bg-zinc-950/70">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="text-lg font-bold text-zinc-900 transition-colors hover:text-indigo-600 dark:text-zinc-100 dark:hover:text-indigo-400"
        >
          Lyrics Translation
        </Link>
        <ul className="flex gap-6">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="group relative text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-indigo-500 transition-all duration-300 ease-out group-hover:w-full"></span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
