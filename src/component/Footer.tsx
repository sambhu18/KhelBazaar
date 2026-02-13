export default function Footer() {
  return (
    <footer className="w-full bg-[#0a0a0a] text-white py-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">

        {/* Brand Section */}
        <div className="col-span-1 md:col-span-1">
          <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400 tracking-tighter mb-6">
            KHEL BAZAAR
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            Nepal's premier destination for high-performance sports gear and community engagement. Built for champions.
          </p>
          <div className="flex gap-4">
            <span className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-teal-500 transition-colors cursor-pointer">FB</span>
            <span className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-teal-500 transition-colors cursor-pointer">TW</span>
            <span className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-teal-500 transition-colors cursor-pointer">IG</span>
          </div>
        </div>

        {/* Links Section */}
        <div>
          <h3 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Explore</h3>
          <ul className="space-y-4 text-sm text-gray-400">
            <li><a href="/" className="hover:text-teal-400 transition-colors">Home</a></li>
            <li><a href="/products" className="hover:text-teal-400 transition-colors">Shop All Gear</a></li>
            <li><a href="/community" className="hover:text-teal-400 transition-colors">Elite Community</a></li>
            <li><a href="/dashboard" className="hover:text-teal-400 transition-colors">MVP Dashboard</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Account</h3>
          <ul className="space-y-4 text-sm text-gray-400">
            <li><a href="/auth/Login" className="hover:text-teal-400 transition-colors">Sign In</a></li>
            <li><a href="/auth/register" className="hover:text-teal-400 transition-colors">Create Account</a></li>
            <li><a href="/cart" className="hover:text-teal-400 transition-colors">View Cart</a></li>
            <li><a href="/wishlist" className="hover:text-teal-400 transition-colors">Wishlist</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Stay in the Game</h3>
          <p className="text-gray-400 text-sm mb-4">Get early access to drops and exclusive offers.</p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Email"
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-teal-500 w-full"
            />
            <button className="bg-teal-500 px-4 py-2 rounded-lg text-sm font-bold hover:bg-teal-600 transition-all">
              →
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">
          © {new Date().getFullYear()} KHEL BAZAAR. ENGINEERED IN NEPAL.
        </p>
        <div className="flex gap-8 text-[10px] uppercase font-bold tracking-widest text-gray-500">
          <a href="#" className="hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-white">Terms of Sale</a>
        </div>
      </div>
    </footer>
  );
}
