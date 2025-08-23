// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaTwitter, FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from "react-icons/hi";

function Footer() {
  return (
    <footer className="bg-[#0f172a] text-gray-300">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10 border-b border-gray-700">
        
        {/* Brand + Desc */}
        <div>
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 text-white rounded-xl p-2">
              <span className="text-xl">📅</span>
            </div>
            <h2 className="text-xl font-bold text-white">Eventify</h2>
          </div>
          <p className="mt-4 text-gray-400 text-sm leading-relaxed">
            Your premier destination for discovering and managing events. 
            Connect, learn, and grow with our vibrant community of event enthusiasts.
          </p>

          {/* Social Icons */}
          <div className="flex space-x-3 mt-5">
            <Link to="https://x.com/" className="bg-gray-800 hover:bg-indigo-600 p-2 rounded-md">
              <FaTwitter className="text-white" />
            </Link>
            <Link to="https://facebook.com/" className="bg-gray-800 hover:bg-indigo-600 p-2 rounded-md">
              <FaFacebookF className="text-white" />
            </Link>
            <Link to="https://instagram.com/" className="bg-gray-800 hover:bg-indigo-600 p-2 rounded-md">
              <FaInstagram className="text-white" />
            </Link>
            <Link to="#https://linkedin.com/" className="bg-gray-800 hover:bg-indigo-600 p-2 rounded-md">
              <FaLinkedinIn className="text-white" />
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/events" className="hover:text-white">Events</Link></li>
            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-white font-semibold mb-4">Contact Info</h3>
          <ul className="space-y-3 text-gray-400 text-sm">
            <li className="flex items-center space-x-2">
              <HiOutlineMail className="text-indigo-400 text-lg" />
              <span>info@eventify.com</span>
            </li>
            <li className="flex items-center space-x-2">
              <HiOutlinePhone className="text-indigo-400 text-lg" />
              <span>+1 (555) 123-4567</span>
            </li>
            <li className="flex items-center space-x-2">
              <HiOutlineLocationMarker className="text-indigo-400 text-lg" />
              <span>123 Event St, City, State 12345</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
        <p>© 2024 Eventify. All rights reserved.</p>
        <div className="flex space-x-4 mt-3 md:mt-0">
          <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-white">Terms of Service</Link>
          <Link to="/cookies" className="hover:text-white">Cookie Policy</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
