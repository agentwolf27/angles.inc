"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/button";

export function HomeHero() {
  return (
    <section className="relative isolate min-h-[88vh] overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1920&q=85"
        alt=""
        fill
        priority
        className="object-cover brightness-[0.45]"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-end px-4 pb-20 pt-32 sm:px-6 md:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl space-y-6"
        >
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-white/80">
            {siteConfig.name}
          </p>
          <h1 className="font-serif text-4xl font-medium leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Imagery that sells the experience—before words ever could.
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-white/85">
            {siteConfig.tagline}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-white text-foreground hover:bg-white/90"
            >
              <Link href="/portfolio">
                View portfolio
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white/20"
            >
              <Link href="/booking">Book a shoot</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
