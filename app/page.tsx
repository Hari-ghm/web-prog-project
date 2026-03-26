import Link from 'next/link';
import { Activity, BarChart3, Leaf } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full relative overflow-hidden py-32 sm:py-48 lg:py-56 flex justify-center items-center flex-col">
        {/* Abstract Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/20 dark:bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-400/20 dark:bg-teal-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sky-300/20 dark:bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background dark:from-background/60 dark:to-background backdrop-blur-[2px]"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-in fade-in slide-in-from-bottom-5 duration-1000">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-md">
            <span className="text-sm font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">v2.0 Smart Analytics Now Live</span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-8">
            <span className="text-foreground">Smarter Energy,</span><br/>
            <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 dark:from-blue-400 dark:via-cyan-300 dark:to-teal-300 bg-clip-text text-transparent">Sustainable Future</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-secondary max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Monitor, analyze, and optimize your energy consumption with real-time data and actionable AI-driven insights. Designed for the modern grid.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/register" 
              className="px-8 py-4 rounded-full bg-foreground text-background dark:bg-blue-600 dark:text-white font-semibold text-lg hover:scale-105 transition-all duration-300 shadow-xl dark:shadow-[0_0_20px_-5px_rgba(59,130,246,0.6)] flex items-center justify-center gap-2 group"
            >
              Get Started
              <Activity className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </Link>
          
            <Link 
              href="/dashboard" 
              className="px-8 py-4 rounded-full glass hover:bg-black/5 dark:hover:bg-white/5 text-foreground font-semibold text-lg transition-all duration-300"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="w-full py-24 bg-background relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-border pt-24">
          <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-4xl font-bold text-foreground mb-4">Why Choose EnerGrid?</h2>
            <p className="text-secondary text-lg max-w-2xl mx-auto">A comprehensive suite of tools engineered to provide complete control over modern energy ecosystems.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Real-time Monitoring",
                desc: "Track energy usage as it happens with sub-second latency and pinpoint accuracy.",
                icon: <Activity className="w-8 h-8 text-blue-500 dark:text-blue-400" />
              },
              {
                title: "AI Data Analytics",
                desc: "Data-driven forecasts leveraging machine learning to prevent outages and optimize cost.",
                icon: <BarChart3 className="w-8 h-8 text-cyan-500 dark:text-cyan-400" />
              },
              {
                title: "Green Integration",
                desc: "Seamlessly manage and distribute solar, wind, and traditional power sources efficiently.",
                icon: <Leaf className="w-8 h-8 text-teal-500 dark:text-teal-400" />
              }
            ].map((feature, idx) => (
              <div key={idx} className="flex flex-col p-8 rounded-3xl glass hover:shadow-2xl transition-all duration-500 group border border-border/60 hover:border-blue-500/30">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-slate-900/50 flex items-center justify-center mb-6 border border-blue-100 dark:border-slate-800 group-hover:scale-110 transition-transform duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-3 font-display">
                  {feature.title}
                </h3>
                <p className="text-secondary leading-relaxed font-light">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
