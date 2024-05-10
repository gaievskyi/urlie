import { ExternalLinkIcon } from "lucide-react"

export const CreatorLink = ({ text }: { text: string }) => {
  return (
    <a
      href="https://gaievskyi.com/"
      target="__blank"
      className="group relative inline-block cursor-pointer rounded-xl bg-slate-900 p-px text-xs font-semibold leading-6 text-white no-underline shadow-2xl shadow-zinc-900"
    >
      <span className="absolute inset-0 overflow-hidden rounded-xl">
        <span className="absolute inset-0 rounded-xl bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
      </span>
      <div className="relative z-10 flex items-center space-x-2 rounded-xl bg-zinc-950 px-4 py-1.5 ring-1 ring-white/10 ">
        <span className="py-1 leading-tight">{text}</span>
        <ExternalLinkIcon className="size-3" />
      </div>
      <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40"></span>
    </a>
  )
}
