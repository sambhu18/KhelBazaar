export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-white py-6 mt-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">

        {/* Left Section */}
        <p className="text-sm">
          © {new Date().getFullYear()} KhelBazaar E-Commerce System. All Rights Reserved.
        </p>

        {/* Center Links */}
        <ul className="flex gap-6 text-sm">
          <li>
            <a href="/" className="hover:text-blue-400">Home</a>
          </li>
          <li>
            <a href="/login" className="hover:text-blue-400">Login</a>
          </li>
          <li>
            <a href="/signup" className="hover:text-blue-400">Signup</a>
          </li>
        </ul>

        {/* Right Section */}
        <p className="text-sm">Developed by Sambhu Kamti</p>
      </div>
    </footer>
  );
}
