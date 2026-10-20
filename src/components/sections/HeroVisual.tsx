"use client";

import { useRef, type ReactNode } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { BadgeCheck, Bug, CheckCircle2, Search, ShieldCheck, Workflow } from "lucide-react";
import { person } from "@/data/site";
import { cn } from "@/lib/cn";

type FloatingProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  offset: MotionValue<number>;
};

function Floating({ children, className, delay = 0, offset }: FloatingProps) {
  return (
    <motion.div style={{ y: offset }} className={cn("absolute z-20", className)}>
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 + delay, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5 + delay * 2, repeat: Infinity, ease: "easeInOut", delay: delay * 1.5 }}
        >
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export function HeroVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const factor = reduce ? 0 : 1;
  const slow = useTransform(scrollYProgress, [0, 1], [0, -40 * factor]);
  const medium = useTransform(scrollYProgress, [0, 1], [0, -80 * factor]);
  const fast = useTransform(scrollYProgress, [0, 1], [0, -120 * factor]);
  const photo = useTransform(scrollYProgress, [0, 1], [0, 30 * factor]);

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[30rem] px-6 sm:px-10 lg:px-4">
      <div className="relative aspect-[4/5]">
        <div
          aria-hidden
          className="animate-rise absolute inset-x-2 top-6 bottom-0 overflow-hidden rounded-[2.5rem] bg-ink-900"
          style={{ animationDelay: "120ms" }}
        >
          <div className="bg-grid-dark absolute inset-0" />
          <div className="absolute -top-20 -right-16 size-64 rounded-full bg-ember-500/40 blur-3xl" />
          <div className="absolute -bottom-24 -left-10 size-64 rounded-full bg-azure-500/35 blur-3xl" />
          <svg viewBox="0 0 400 400" className="absolute inset-0 size-full opacity-40" fill="none">
            <circle cx="200" cy="210" r="120" stroke="white" strokeOpacity="0.25" strokeDasharray="4 8" />
            <circle cx="200" cy="210" r="175" stroke="white" strokeOpacity="0.15" />
            <circle cx="200" cy="210" r="230" stroke="white" strokeOpacity="0.1" strokeDasharray="2 10" />
          </svg>
        </div>

        <motion.div
          style={{ y: photo }}
          className="animate-rise absolute inset-x-8 top-0 bottom-10 overflow-hidden rounded-[2rem] border-[6px] border-white bg-ink-800 shadow-lift sm:inset-x-10"
        >
          <Image
            src={person.photo}
            alt={`Portrait of ${person.name}, Software QA Engineer and SEO Specialist`}
            fill
            preload
            fetchPriority="high"
            sizes="(min-width: 1024px) 400px, (min-width: 640px) 380px, 80vw"
            className="object-cover object-[50%_20%]"
          />
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink-950/70 to-transparent"
          />
          <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 text-white">
            <div>
              <p className="font-display text-sm font-bold sm:text-base">{person.name}</p>
              <p className="text-xs text-white/75">{person.location}</p>
            </div>
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/15 backdrop-blur">
              <BadgeCheck aria-hidden className="size-5 text-mint-400" />
            </span>
          </div>
        </motion.div>

        <div aria-hidden>
          <Floating offset={medium} className="top-10 -left-4 sm:-left-8" delay={0}>
            <div className="w-40 rounded-2xl border border-line bg-white p-3 shadow-lift sm:w-48 sm:p-3.5">
              <div className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-lg bg-mint-50 text-mint-700">
                  <ShieldCheck className="size-4.5" />
                </span>
                <span className="font-display text-xs font-bold text-ink-950 sm:text-sm">Quality Assurance</span>
              </div>
              <ul className="mt-2.5 hidden space-y-1.5 text-xs text-muted sm:block">
                {["Test cases", "Regression", "Cross-browser"].map((item) => (
                  <li key={item} className="flex items-center gap-1.5">
                    <CheckCircle2 className="size-3.5 text-mint-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Floating>

          <Floating offset={fast} className="top-[38%] -right-3 sm:-right-8" delay={0.25}>
            <div className="w-40 rounded-2xl border border-line bg-white p-3 shadow-lift sm:w-52 sm:p-3.5">
              <div className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-lg bg-azure-50 text-azure-600">
                  <Search className="size-4.5" />
                </span>
                <span className="font-display text-xs font-bold text-ink-950 sm:text-sm">SEO</span>
              </div>
              <div className="mt-2.5 hidden items-center gap-2 rounded-lg bg-canvas px-2.5 py-2 text-xs text-muted sm:flex">
                <Search className="size-3.5 text-subtle" />
                <span className="truncate">technical seo audit</span>
              </div>
              <div className="mt-2 hidden flex-wrap gap-1 sm:flex">
                {["Crawl", "Index", "Metadata"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-azure-50 px-1.5 py-0.5 text-[0.68rem] font-semibold text-azure-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Floating>

          <Floating offset={slow} className="-bottom-3 -left-2 sm:-left-6" delay={0.5}>
            <div className="flex items-center gap-2.5 rounded-2xl border border-line bg-white p-2.5 pr-4 shadow-lift">
              <span className="grid size-9 place-items-center rounded-xl bg-ember-50 text-ember-600">
                <Workflow className="size-4.5" />
              </span>
              <span>
                <span className="block font-display text-xs font-bold text-ink-950 sm:text-sm">Operations</span>
                <span className="hidden text-[0.7rem] text-muted sm:block">Teams · Tasks · Reporting</span>
              </span>
            </div>
          </Floating>

          <Floating offset={medium} className="-top-2 right-6 sm:right-2" delay={0.75}>
            <span className="grid size-11 place-items-center rounded-full bg-ember-600 text-white shadow-glow">
              <Bug className="size-5" />
            </span>
          </Floating>
        </div>
      </div>
    </div>
  );
}
