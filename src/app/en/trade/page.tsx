import { HeaderNavigation } from "@/components/sections/header-navigation";
import Footer from "@/components/sections/footer";
import BinaryOptionsInterface from "@/components/sections/binary-options-interface";

export default function TradePage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <HeaderNavigation />
            <main className="flex-grow w-full max-w-[1600px] mx-auto px-4 py-6">
                <BinaryOptionsInterface />
            </main>
            <Footer />
        </div>
    );
}
