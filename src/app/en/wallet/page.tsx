import { HeaderNavigation } from "@/components/sections/header-navigation";
import Footer from "@/components/sections/footer";
import WalletSection from "@/components/account/wallet-section";

export default function WalletPage() {
  return (
    <div className="min-h-screen bg-background">
      <HeaderNavigation />
      <WalletSection />
      <Footer />
    </div>
  );
}