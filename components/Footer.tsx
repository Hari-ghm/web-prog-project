export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Energy Management Dashboard
            </h3>
            <p className="text-slate-400 text-sm">
              Empowering the future with smart energy management and real-time analytics.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Dashboard</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Analytics</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Reports</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">API Status</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Guides</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} EnerGrid. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {/* Social Icons Placeholders */}
            <div className="w-5 h-5 bg-slate-700 rounded-full hover:bg-blue-500 cursor-pointer transition-colors"></div>
            <div className="w-5 h-5 bg-slate-700 rounded-full hover:bg-blue-500 cursor-pointer transition-colors"></div>
            <div className="w-5 h-5 bg-slate-700 rounded-full hover:bg-blue-500 cursor-pointer transition-colors"></div>
          </div>
        </div>
      </div>
    </footer>
  );
}
