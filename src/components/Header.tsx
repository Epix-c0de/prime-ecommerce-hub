import { ShoppingCart, Heart, User, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
}

const Header = ({ cartCount, onCartClick }: HeaderProps) => {
  return (
    <>
      {/* Top banner */}
      <div className="bg-primary text-primary-foreground text-center text-xs md:text-sm py-2 px-4">
        <p>Free delivery on orders above Ksh 5,000 | Same day delivery in Nairobi</p>
      </div>

      {/* Main header */}
      <header className="bg-card sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a href="/" className="flex items-center">
                <h1 className="font-bold text-xl md:text-2xl">
                  <span className="text-primary">Prime</span>{" "}
                  <span className="text-foreground">Enterprises Kimahuri</span>
                </h1>
              </a>
            </div>

            {/* Search bar */}
            <div className="flex-grow max-w-3xl mx-4 order-3 md:order-2 w-full md:w-auto">
              <form className="flex items-center gap-2">
                <div className="relative flex-grow">
                  <Input
                    type="text"
                    placeholder="Search products, brands and categories..."
                    className="pr-10"
                  />
                </div>
                <Button type="submit" className="bg-primary hover:bg-primary-hover">
                  <Search className="h-5 w-5" />
                </Button>
              </form>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-4 md:gap-6 order-2 md:order-3">
              <button className="flex flex-col items-center hover:text-primary transition-colors">
                <Heart className="h-6 w-6" />
                <span className="text-xs mt-1 hidden md:block">Wishlist</span>
              </button>
              <button className="flex flex-col items-center hover:text-primary transition-colors">
                <User className="h-6 w-6" />
                <span className="text-xs mt-1 hidden md:block">Account</span>
              </button>
              <button 
                onClick={onCartClick}
                className="flex flex-col items-center hover:text-primary transition-colors relative"
              >
                <ShoppingCart className="h-6 w-6" />
                <span className="text-xs mt-1 hidden md:block">Cart</span>
                {cartCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-primary">
                    {cartCount}
                  </Badge>
                )}
              </button>
            </div>
          </div>

          {/* Categories navbar */}
          <nav className="mt-3 border-t pt-2">
            <ul className="flex flex-wrap items-center gap-1 md:gap-6 text-sm md:text-base overflow-x-auto">
              <li>
                <a href="#" className="flex items-center gap-1 p-2 hover:text-primary transition-colors font-medium">
                  <Menu className="h-4 w-4" /> All Categories
                </a>
              </li>
              <li><a href="#" className="p-2 hover:text-primary transition-colors">Phones & Tablets</a></li>
              <li><a href="#" className="p-2 hover:text-primary transition-colors">TVs & Audio</a></li>
              <li><a href="#" className="p-2 hover:text-primary transition-colors">Computing</a></li>
              <li><a href="#" className="p-2 hover:text-primary transition-colors">Home Appliances</a></li>
              <li className="hidden md:block"><a href="#" className="p-2 hover:text-primary transition-colors">Official Stores</a></li>
              <li className="hidden md:block"><a href="#" className="p-2 hover:text-primary transition-colors">Daily Deals</a></li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
