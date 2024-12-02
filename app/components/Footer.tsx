import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';


export default function Footer() {
  return (
    <footer className="bg-gray-600 py-6 text-white">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="flex flex-col sm:flex-row items-center">
          <h2 className="text-sm font-bold">Thank You for Visiting!</h2>
          <p className="text-xs ml-2">&copy; 2024 MyJobPortal. All Rights Reserved.</p>
        </div>
        <div className="flex space-x-1">
          <a href="/about" className="hover:text-gray-300 transition duration-200 text-sm">About Us</a>
          <span className="hidden sm:inline">|</span>
          <a href="/contact" className="hover:text-gray-300 transition duration-200 text-sm">Contact</a>
          <span className="hidden sm:inline">|</span>
          <a href="/privacy" className="hover:text-gray-300 transition duration-200 text-sm">Privacy Policy</a>
        </div>
        <div className="flex space-x-4">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition duration-200">
            <FaFacebook className="text-lg" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition duration-200">
            <FaTwitter className="text-lg" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition duration-200">
            <FaInstagram className="text-lg" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition duration-200">
            <FaLinkedin className="text-lg" />
          </a>
        </div>
      </div>
    </footer>
  );
}
