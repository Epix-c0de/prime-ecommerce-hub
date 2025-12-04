import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ConfigProvider } from "./contexts/ConfigContext";
import { RealtimeSyncProvider } from "./contexts/RealtimeSyncContext";
import { SiteUrlProvider } from "./contexts/SiteUrlContext";
import { CMSProvider } from "./cms/state/CmsContext";
import Index from "./pages/Index";
import LifestyleStore from "./pages/LifestyleStore";
import CategoryPage from "./pages/CategoryPage";
import SearchPage from "./pages/SearchPage";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import GiftRegistry from "./pages/GiftRegistry";
import StyleQuiz from "./pages/StyleQuiz";
import OutfitMatcher from "./pages/OutfitMatcher";
import NotFound from "./pages/NotFound";
import AdminControls from "./pages/AdminControls";
import MultiStoreAdmin from "./pages/MultiStoreAdmin";
import CMSPage from "./pages/CMSPage";
import CMSPreview from "./pages/CMSPreview";
import SamplePages from "./pages/SamplePages";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ConfigProvider>
        <SiteUrlProvider>
          <RealtimeSyncProvider>
            <CMSProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
              <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/lifestyle" element={<LifestyleStore />} />
                <Route path="/category/:slug" element={<CategoryPage storeType="tech" />} />
                <Route path="/lifestyle/category/:slug" element={<CategoryPage storeType="lifestyle" />} />
                <Route path="/search" element={<SearchPage storeType="tech" />} />
                <Route path="/lifestyle/search" element={<SearchPage storeType="lifestyle" />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/orders" element={<Dashboard />} />
              <Route path="/registry/:shareCode" element={<GiftRegistry />} />
              <Route path="/style-quiz" element={<StyleQuiz />} />
              <Route path="/outfit-matcher" element={<OutfitMatcher />} />
              <Route path="/admin" element={<AdminControls />} />
              <Route path="/admin/multi-store" element={<MultiStoreAdmin />} />
              <Route path="/page/:slug" element={<CMSPage />} />
              <Route path="/preview/:slug" element={<CMSPreview />} />
              <Route path="/demo" element={<SamplePages />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
              </Routes>
              </BrowserRouter>
              </TooltipProvider>
            </CMSProvider>
          </RealtimeSyncProvider>
        </SiteUrlProvider>
      </ConfigProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
