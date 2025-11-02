import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-10 pb-4 mt-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1 */}
          <div>
            <h3 className="text-lg font-bold mb-4">About Us</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-primary transition">About Prime Enterprises</a></li>
              <li><a href="#" className="hover:text-primary transition">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition">Corporate Responsibility</a></li>
              <li><a href="#" className="hover:text-primary transition">Press Center</a></li>
              <li><a href="#" className="hover:text-primary transition">Become a Seller</a></li>
            </ul>
          </div>
          
          {/* Column 2 */}
          <div>
            <h3 className="text-lg font-bold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-primary transition">Help Center</a></li>
              <li><a href="#" className="hover:text-primary transition">Return Policy</a></li>
              <li><a href="#" className="hover:text-primary transition">Shipping Info</a></li>
              <li><a href="#" className="hover:text-primary transition">Order Tracking</a></li>
              <li><a href="#" className="hover:text-primary transition">Contact Us</a></li>
            </ul>
          </div>
          
          {/* Column 3 */}
          <div>
            <h3 className="text-lg font-bold mb-4">Payment & Delivery</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-primary transition">Payment Methods</a></li>
              <li><a href="#" className="hover:text-primary transition">Buy Now, Pay Later</a></li>
              <li><a href="#" className="hover:text-primary transition">Shipping Options</a></li>
              <li><a href="#" className="hover:text-primary transition">Delivery Tracking</a></li>
              <li><a href="#" className="hover:text-primary transition">Collection Points</a></li>
            </ul>
          </div>
          
          {/* Column 4 */}
          <div>
            <h3 className="text-lg font-bold mb-4">Connect With Us</h3>
            <div className="flex gap-4 mb-4">
              <a href="#" className="bg-gray-700 hover:bg-primary transition h-10 w-10 rounded-full flex items-center justify-center">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-700 hover:bg-primary transition h-10 w-10 rounded-full flex items-center justify-center">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-700 hover:bg-primary transition h-10 w-10 rounded-full flex items-center justify-center">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-700 hover:bg-primary transition h-10 w-10 rounded-full flex items-center justify-center">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="flex flex-wrap justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-400">© 2025 Prime Enterprises Kimahuri. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
