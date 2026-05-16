import { HeaderNavigation } from "@/components/sections/header-navigation";
import Footer from "@/components/sections/footer";
import BetsSection from "@/components/account/bets-section";

export default function BetsPage() {
  return (
    <div className="min-h-screen bg-background">
      <HeaderNavigation />
      <BetsSection />
      <Footer />
    </div>
  );
}