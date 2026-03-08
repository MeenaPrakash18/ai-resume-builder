"use client";

import Link from "next/link";
import { Sparkles, Zap, Shield, ArrowRight, Star, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-premium-gold/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-premium-gold/5 rounded-full blur-[120px]" />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-premium-gold/20 bg-premium-gold/5 backdrop-blur-md"
          >
            <Star className="w-4 h-4 text-premium-gold fill-premium-gold" />
            <span className="text-xs font-bold tracking-widest uppercase text-premium-gold">
              Predictive AI Technology
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black tracking-tighter leading-none"
          >
            THE GOLD STANDARD <br />
            <span className="text-gold-gradient">FOR RESUMES.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-lg text-premium-gold/60 font-medium leading-relaxed"
          >
            Build ultra-premium, AI-augmented resumes in a professional Black & Gold aesthetic. Real-time preview, deep customization, and ATS-optimized excellence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              href="/create"
              className="btn-gold group px-10 py-5 rounded-2xl text-lg font-bold flex items-center gap-3 transition-all"
            >
              Start Building Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <div className="flex items-center gap-2 px-6 py-4 rounded-2xl border border-premium-gold/10 bg-premium-gold/5">
              <CheckCircle2 className="w-5 h-5 text-premium-gold" />
              <span className="text-sm font-bold text-premium-gold/80 uppercase tracking-tighter">100% Free to Export</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Sparkles className="w-6 h-6" />,
                title: "AI Live Assistant",
                desc: "Watch your resume transform in real-time as our AI suggests professional improvements for every section."
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: "Premium Customization",
                desc: "Choose from 15+ elite templates. Adjust font sizes, styles, and add professional profile pictures."
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: "ATS Optimized",
                desc: "Our gold-standard formats are engineered to bypass complex tracking systems with 99% accuracy."
              }
            ].map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="glass-card p-10 space-y-6 flex flex-col items-center text-center group"
              >
                <div className="w-14 h-14 rounded-2xl bg-premium-gold border border-premium-gold/20 flex items-center justify-center text-black group-hover:bg-premium-gold/90 transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)] group-hover:shadow-[0_0_30px_rgba(212,175,55,0.6)]">
                  {f.icon}
                </div>
                <h3 className="text-xl font-black text-premium-gold uppercase tracking-tight">{f.title}</h3>
                <p className="text-premium-gold/40 text-sm leading-relaxed font-medium">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Preview Teaser */}
      <section className="py-20 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto glass-card p-2 border-premium-gold/10 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
          <div className="bg-black/80 rounded-lg p-10 flex flex-col items-center justify-center min-h-[400px]">
            <h2 className="text-3xl font-extrabold text-gold-gradient mb-4">Elite Black & Gold Editor</h2>
            <p className="text-white/60 mb-8 max-w-lg text-center font-medium">Experience the smoothest live-preview editor ever built. Customize every detail with surgical precision.</p>
            <div className="w-full max-w-3xl rounded-xl border border-white/5 bg-white/[0.02] h-64 shadow-inner flex items-center justify-center overflow-hidden">
              <div className="animate-pulse space-y-4 w-full px-20">
                <div className="h-4 bg-premium-gold/20 rounded w-1/4 mx-auto" />
                <div className="h-8 bg-premium-gold/10 rounded w-1/2 mx-auto" />
                <div className="space-y-2 pt-4">
                  <div className="h-2 bg-white/5 rounded w-full" />
                  <div className="h-2 bg-white/5 rounded w-2/3" />
                  <div className="h-2 bg-white/5 rounded w-3/4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
