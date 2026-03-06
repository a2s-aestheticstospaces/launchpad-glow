import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import Scene3D from './Scene3D';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-stretch overflow-hidden">

      {/* ─── Left column: text content ─── */}
      <div className="relative z-10 flex flex-col justify-center px-8 md:px-16 lg:px-20 py-32 w-full lg:w-1/2 min-h-screen">

        {/* Left-side gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/92 to-background/30 pointer-events-none" />

        <div className="relative z-10 max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/80 backdrop-blur-sm mb-8 shadow-sm"
          >
            <Sparkles size={13} className="text-copper" />
            <span className="text-xs font-body text-muted-foreground tracking-wide">
              Launching March 2026 · 28,000+ Products at Launch
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.38 }}
            className="font-display text-5xl md:text-6xl xl:text-7xl font-bold leading-[0.95] tracking-tight mb-6"
          >
            <span className="text-gradient-hero">Design Your</span>
            <br />
            <span className="text-gradient-teal">Perfect Space</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.55 }}
            className="font-body text-base md:text-lg text-muted-foreground max-w-lg mb-10 leading-relaxed"
          >
            India's first AI-powered design infrastructure. Room-specific catalogs,
            cross-platform price intelligence, and an AI assistant that builds your
            dream room from a single prompt.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-start gap-3 mb-14"
          >
            <a
              href="#waitlist"
              className="group flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground font-display font-semibold text-sm hover:opacity-90 transition-all duration-300 bg-glow-teal"
            >
              Join the Waitlist
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#demo"
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl border border-border text-foreground font-display font-medium text-sm hover:bg-muted transition-all duration-300"
            >
              See Product Demo
            </a>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="flex items-center gap-8 pt-6 border-t border-border/50"
          >
            {[
              { value: '28,000+', label: 'Products at Launch' },
              { value: 'AI-Powered', label: 'Design Assistant' },
              { value: 'Cross-Platform', label: 'Price Intelligence' },
            ].map((stat) => (
              <div key={stat.label} className="text-left">
                <div className="font-display text-lg md:text-xl font-bold text-gradient-copper">
                  {stat.value}
                </div>
                <div className="font-body text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ─── Right column: 3D scene ─── */}
      <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-1/2 h-full">
        {/* Edge fade so 3D blends into left col */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-transparent z-[1] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-[1] pointer-events-none" />
        <Scene3D />
      </div>

      {/* Mobile: full-bleed background scene */}
      <div className="lg:hidden absolute inset-0 z-0 opacity-30">
        <Scene3D />
      </div>
      <div className="lg:hidden absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background z-[1] pointer-events-none" />
    </section>
  );
}
