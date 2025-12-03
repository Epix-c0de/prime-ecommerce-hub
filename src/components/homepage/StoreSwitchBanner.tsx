import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Monitor, Shirt } from "lucide-react";

interface StoreSwitchBannerProps {
  currentStore: 'tech' | 'lifestyle';
}

export const StoreSwitchBanner = ({ currentStore }: StoreSwitchBannerProps) => {
  const navigate = useNavigate();

  if (currentStore === 'tech') {
    return (
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2.5 px-4">
        <div className="container mx-auto flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Shirt className="w-4 h-4" />
            <span className="text-sm font-medium">Looking for Lifestyle Products?</span>
            <span className="hidden md:inline text-xs opacity-90">Fashion, beauty, toys, home décor & more!</span>
          </div>
          <Button
            onClick={() => navigate("/lifestyle")}
            variant="secondary"
            size="sm"
            className="bg-white text-purple-600 hover:bg-white/90 border-0"
          >
            Visit Lifestyle Store
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-primary to-secondary text-primary-foreground py-2.5 px-4">
      <div className="container mx-auto flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Monitor className="w-4 h-4" />
          <span className="text-sm font-medium">Looking for Tech & Electronics?</span>
          <span className="hidden md:inline text-xs opacity-90">Smartphones, laptops, TVs & appliances!</span>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => navigate("/style-quiz")}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
          >
            Take Style Quiz
          </Button>
          <Button
            onClick={() => navigate("/")}
            variant="secondary"
            size="sm"
            className="bg-white text-primary hover:bg-white/90 border-0"
          >
            Visit Tech Store
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
