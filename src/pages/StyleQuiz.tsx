import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { useCart } from "@/hooks/useCart";

const questions = [
  {
    id: 1,
    question: "What's your preferred style?",
    options: [
      { value: "casual", label: "Casual & Comfortable" },
      { value: "formal", label: "Formal & Professional" },
      { value: "sporty", label: "Sporty & Active" },
      { value: "trendy", label: "Trendy & Fashion-Forward" },
    ],
  },
  {
    id: 2,
    question: "What's your typical budget for fashion items?",
    options: [
      { value: "budget", label: "Budget-Friendly (Under KSh 5,000)" },
      { value: "mid", label: "Mid-Range (KSh 5,000 - 15,000)" },
      { value: "premium", label: "Premium (KSh 15,000 - 30,000)" },
      { value: "luxury", label: "Luxury (Above KSh 30,000)" },
    ],
  },
  {
    id: 3,
    question: "Which colors do you gravitate towards?",
    options: [
      { value: "neutrals", label: "Neutrals (Black, White, Gray, Beige)" },
      { value: "pastels", label: "Pastels (Soft Pink, Blue, Mint)" },
      { value: "bold", label: "Bold Colors (Red, Yellow, Purple)" },
      { value: "earth", label: "Earth Tones (Brown, Olive, Rust)" },
    ],
  },
  {
    id: 4,
    question: "What's your shopping priority?",
    options: [
      { value: "quality", label: "Quality & Durability" },
      { value: "price", label: "Best Price & Deals" },
      { value: "brand", label: "Brand Names" },
      { value: "unique", label: "Unique & Rare Finds" },
    ],
  },
  {
    id: 5,
    question: "How would you describe your lifestyle?",
    options: [
      { value: "active", label: "Active & Outdoorsy" },
      { value: "professional", label: "Professional & Corporate" },
      { value: "creative", label: "Creative & Artistic" },
      { value: "relaxed", label: "Relaxed & Laid-back" },
    ],
  },
];

const StyleQuiz = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [questions[currentQuestion].id]: value });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const getStyleProfile = () => {
    const styleValues = Object.values(answers);
    if (styleValues.includes("casual") && styleValues.includes("relaxed")) {
      return {
        name: "The Comfort Enthusiast",
        description: "You value comfort and practicality without sacrificing style. Perfect for everyday wear with a relaxed vibe.",
        recommendations: ["Casual Wear", "Loungewear", "Comfortable Footwear"],
      };
    } else if (styleValues.includes("formal") && styleValues.includes("professional")) {
      return {
        name: "The Corporate Pro",
        description: "You appreciate clean lines, quality fabrics, and professional aesthetics that make a statement in the workplace.",
        recommendations: ["Business Attire", "Designer Bags", "Professional Accessories"],
      };
    } else if (styleValues.includes("sporty") && styleValues.includes("active")) {
      return {
        name: "The Active Achiever",
        description: "You love functionality and performance in your wardrobe. Athletic wear that transitions from gym to casual outings.",
        recommendations: ["Sportswear", "Athletic Shoes", "Fitness Accessories"],
      };
    } else if (styleValues.includes("trendy")) {
      return {
        name: "The Fashion Forward",
        description: "You're always ahead of trends and love making bold fashion statements. You're not afraid to experiment.",
        recommendations: ["Latest Fashion", "Statement Pieces", "Trendy Accessories"],
      };
    }
    return {
      name: "The Versatile Stylist",
      description: "You have an eclectic taste that blends different styles. You appreciate variety and adaptability in your wardrobe.",
      recommendations: ["Mix & Match Basics", "Versatile Accessories", "Seasonal Collections"],
    };
  };

  const styleProfile = showResults ? getStyleProfile() : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartCount={cartItems.length} onCartClick={() => navigate("/cart")} />

      <main className="flex-grow bg-background py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          {!showResults ? (
            <>
              <div className="mb-8">
                <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="h-8 w-8 text-primary" />
                  <h1 className="text-3xl font-bold">Style Quiz</h1>
                </div>
                <p className="text-muted-foreground mb-4">
                  Answer a few questions to discover your unique style profile and get personalized recommendations.
                </p>
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-muted-foreground mt-2">
                  Question {currentQuestion + 1} of {questions.length}
                </p>
              </div>

              <Card className="p-6 md:p-8">
                <h2 className="text-xl font-semibold mb-6">
                  {questions[currentQuestion].question}
                </h2>

                <RadioGroup
                  value={answers[questions[currentQuestion].id]}
                  onValueChange={handleAnswer}
                  className="space-y-4"
                >
                  {questions[currentQuestion].options.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-3 p-4 rounded-lg border-2 hover:border-primary transition-colors cursor-pointer"
                    >
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value} className="flex-grow cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={!answers[questions[currentQuestion].id]}
                  >
                    {currentQuestion === questions.length - 1 ? "See Results" : "Next"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-4">
                  <Sparkles className="h-10 w-10 text-primary" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Your Style Profile</h1>
                <p className="text-muted-foreground">Here's what we learned about your style!</p>
              </div>

              <Card className="p-6 md:p-8 mb-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-primary mb-3">
                    {styleProfile?.name}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {styleProfile?.description}
                  </p>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">Recommended Categories:</h3>
                  <div className="grid gap-3">
                    {styleProfile?.recommendations.map((rec, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-muted rounded-lg flex items-center justify-between"
                      >
                        <span>{rec}</span>
                        <Button size="sm" onClick={() => navigate("/lifestyle")}>
                          Browse
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setCurrentQuestion(0);
                    setAnswers({});
                    setShowResults(false);
                  }}
                  className="flex-1"
                >
                  Retake Quiz
                </Button>
                <Button onClick={() => navigate("/lifestyle")} className="flex-1">
                  Start Shopping
                </Button>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StyleQuiz;
