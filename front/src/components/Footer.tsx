import { FaInstagram, FaTwitter, FaFacebook, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="mt-16 bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-10 flex items-center justify-between">
        <p className="text-sm text-gray-400">© {new Date().getFullYear()} Teste Lab</p>
        <div className="flex items-center gap-4 text-xl">
          <a href="#" aria-label="Instagram" className="hover:text-gray-300"><FaInstagram /></a>
          <a href="#" aria-label="Twitter" className="hover:text-gray-300"><FaTwitter /></a>
          <a href="#" aria-label="Facebook" className="hover:text-gray-300"><FaFacebook /></a>
          <a href="#" aria-label="LinkedIn" className="hover:text-gray-300"><FaLinkedin /></a>
        </div>
      </div>
    </footer>
  );
}
