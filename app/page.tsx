import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full relative overflow-hidden py-32 sm:py-48 lg:py-56">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950/80 to-slate-950"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent mb-6">
            Smart Energy Management <br /> for a Sustainable Future
          </h1>
          <p className="mt-4 text-xl text-slate-400 max-w-3xl mx-auto mb-10">
            Monitor, analyze, and optimize your energy consumption with real-time data and actionable insights. Join the revolution in energy efficiency.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/register" 
              className="px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-lg transition-all shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)] hover:shadow-[0_0_25px_-5px_rgba(59,130,246,0.7)]"
            >
              Get Started
            </Link>
          
            <Link 
              href="/dashboard" 
              className="px-8 py-4 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-semibold text-lg border border-slate-700 transition-all"
            >
              Dashboard
            </Link>
            
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="w-full py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Why Choose EnerGrid?</h2>
            <p className="text-slate-400">Everything you need to manage your energy systems effectively.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Real-time Monitoring",
                desc: "Track energy usage as it happens with sub-second latency.",
                imagePlaceholder: "https://media.istockphoto.com/id/152131833/photo/control-room.jpg?s=612x612&w=0&k=20&c=8EOxs7tXetLcEc9UhV3k2IB5sJLpKD2D78QtJGqTFXY="
              },
              {
                title: "Data Analytics",
                desc: "Data-driven forecasts to prevent outages and optimize cost.",
                imagePlaceholder: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000"
              },
              {
                title: "Green Integration",
                desc: "Seamlessly manage solar, wind, and traditional power sources.",
                imagePlaceholder: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=1000"
              }
            ].map((feature, idx) => (
              <div key={idx} className="flex flex-col overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-all group">
                <div className="h-48 w-full bg-slate-800 relative flex items-center justify-center border-b border-slate-800 overflow-hidden">
                  <img src={feature.imagePlaceholder} alt={feature.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
