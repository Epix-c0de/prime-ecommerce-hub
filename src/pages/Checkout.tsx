import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const Checkout = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("mpesa");

  const handlePlaceOrder = () => {
    toast.success("Order placed successfully!", {
      description: "You will receive a confirmation email shortly.",
    });
    setTimeout(() => {
      navigate("/dashboard/orders");
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartCount={2} onCartClick={() => navigate("/cart")} />

      <main className="flex-grow bg-background">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 1 ? 'bg-primary text-white' : 'bg-muted'}`}>
                1
              </div>
              <div className={`w-20 h-1 ${step >= 2 ? 'bg-primary' : 'bg-muted'}`}></div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 2 ? 'bg-primary text-white' : 'bg-muted'}`}>
                2
              </div>
              <div className={`w-20 h-1 ${step >= 3 ? 'bg-primary' : 'bg-muted'}`}></div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 3 ? 'bg-primary text-white' : 'bg-muted'}`}>
                3
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              {step === 1 && (
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-6">Shipping Address</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input id="firstName" placeholder="John" required />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input id="lastName" placeholder="Doe" required />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input id="email" type="email" placeholder="john@example.com" required />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input id="phone" placeholder="+254 700 000 000" required />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="address">Street Address *</Label>
                      <Input id="address" placeholder="123 Main Street" required />
                    </div>
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input id="city" placeholder="Nairobi" required />
                    </div>
                    <div>
                      <Label htmlFor="postal">Postal Code</Label>
                      <Input id="postal" placeholder="00100" />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="notes">Delivery Notes (Optional)</Label>
                      <Input id="notes" placeholder="Additional instructions..." />
                    </div>
                  </div>
                  <Button
                    onClick={() => setStep(2)}
                    className="w-full mt-6 bg-primary hover:bg-primary-hover"
                  >
                    Continue to Payment
                  </Button>
                </Card>
              )}

              {step === 2 && (
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-6">Payment Method</h2>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="mpesa" id="mpesa" />
                        <Label htmlFor="mpesa" className="flex-grow cursor-pointer">
                          <div className="font-medium">M-Pesa</div>
                          <div className="text-sm text-muted-foreground">
                            Pay with M-Pesa mobile money
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex-grow cursor-pointer">
                          <div className="font-medium">Credit/Debit Card</div>
                          <div className="text-sm text-muted-foreground">
                            Visa, Mastercard, or American Express
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="cod" id="cod" />
                        <Label htmlFor="cod" className="flex-grow cursor-pointer">
                          <div className="font-medium">Cash on Delivery</div>
                          <div className="text-sm text-muted-foreground">
                            Pay when you receive your order
                          </div>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>

                  {paymentMethod === "card" && (
                    <div className="mt-6 space-y-4">
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input id="expiry" placeholder="MM/YY" />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" placeholder="123" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 mt-6">
                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                      Back
                    </Button>
                    <Button onClick={() => setStep(3)} className="flex-1 bg-primary hover:bg-primary-hover">
                      Review Order
                    </Button>
                  </div>
                </Card>
              )}

              {step === 3 && (
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-6">Review Your Order</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <h3 className="font-semibold mb-2">Shipping Address</h3>
                      <p className="text-sm text-muted-foreground">
                        John Doe<br />
                        123 Main Street<br />
                        Nairobi, 00100<br />
                        +254 700 000 000
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Payment Method</h3>
                      <p className="text-sm text-muted-foreground">
                        {paymentMethod === "mpesa" && "M-Pesa"}
                        {paymentMethod === "card" && "Credit/Debit Card"}
                        {paymentMethod === "cod" && "Cash on Delivery"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2 mb-6">
                    <Checkbox id="terms" />
                    <label htmlFor="terms" className="text-sm text-muted-foreground">
                      I agree to the Terms & Conditions and Privacy Policy
                    </label>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                      Back
                    </Button>
                    <Button onClick={handlePlaceOrder} className="flex-1 bg-primary hover:bg-primary-hover">
                      Place Order
                    </Button>
                  </div>
                </Card>
              )}
            </div>

            {/* Order Summary */}
            <div>
              <Card className="p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Items (2)</span>
                    <span className="font-medium">KSh 154,998</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-success font-medium">FREE</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>KSh 154,998</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
