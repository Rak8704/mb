import { HeaderNavigation } from "@/components/sections/header-navigation";
import Footer from "@/components/sections/footer";
import AccountSection from "@/components/account/account-section";

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-background">
      <HeaderNavigation />
      <AccountSection />
      <Footer />
    </div>
  );
}