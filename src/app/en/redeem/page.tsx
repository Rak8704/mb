"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HeaderNavigation } from "@/components/sections/header-navigation";
import { MobileBottomNav } from "@/components/sections/mobile-bottom-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Ticket } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import Image from "next/image";

export default function RedeemPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const [promoCode, setPromoCode] = useState("");

    return (
        <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
            <HeaderNavigation />

            <main className="container mx-auto px-0 md:px-4 max-w-md md:max-w-4xl bg-white min-h-screen">
                {/* Mobile Header matching screenshot */}
                <div className="bg-black text-white p-4 flex items-center gap-4 sticky top-0 z-10">
                    <button onClick={() => router.back()}>
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="text-lg font-bold flex-1 text-center mr-8">Redeem Promo Code</h1>
                </div>

                {/* User Info Section with Bubbles */}
                <div className="relative bg-gradient-to-b from-cyan-400 to-cyan-200 p-6 pb-16 overflow-hidden">
                    {/* Bubbles */}
                    <div className="absolute top-4 right-10 w-12 h-12 bg-white/20 rounded-full blur-[1px]"></div>
                    <div className="absolute top-10 right-4 w-20 h-20 bg-white/20 rounded-full blur-[2px]"></div>
                    <div className="absolute bottom-10 left-4 w-24 h-24 bg-white/10 rounded-full blur-[4px]"></div>
                    <div className="absolute top-20 left-20 w-8 h-8 bg-white/10 rounded-full"></div>

                    <div className="relative z-10 flex items-center gap-4 mt-2">
                        <div className="w-16 h-16 rounded-full border-2 border-white/50 p-0.5 overflow-hidden bg-white shrink-0">
                            <Image
                                src="https://github.com/shadcn.png"
                                alt="User"
                                width={64}
                                height={64}
                                className="w-full h-full object-cover rounded-full"
                            />
                        </div>
                        <div className="text-white">
                            <p className="font-medium text-lg opacity-90">{session?.user?.name || session?.user?.email || "Guest"}</p>
                            <p className="text-3xl font-bold">৳ 0.00</p>
                        </div>
                    </div>

                    {/* Wave shape at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-16 w-full">
                        <svg viewBox="0 0 1440 320" className="w-full h-full text-white fill-current opacity-40 absolute bottom-0">
                            <path fillOpacity="1" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                        </svg>
                        <svg viewBox="0 0 1440 320" className="w-full h-full text-white fill-current opacity-60 absolute bottom-0 translate-y-2">
                            <path fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,208C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                        </svg>
                    </div>
                </div>

                {/* Input Section */}
                <div className="px-4 -mt-7 relative z-20">
                    <div className="bg-white rounded-lg p-1.5 shadow-md flex gap-2 items-center">
                        <Input
                            placeholder="Fill in your promo code"
                            className="border-none shadow-none bg-transparent text-base h-12 focus-visible:ring-0"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                        />
                        <Button className="bg-gray-200 text-gray-400 hover:bg-gray-300 hover:text-gray-500 font-medium px-6 h-10 rounded-md">
                            Redeem
                        </Button>
                    </div>
                </div>

                {/* List Section */}
                <div className="p-6 text-center mt-8">
                    <h2 className="text-gray-600 font-bold text-lg mb-12">Promo Code List</h2>

                    <div className="flex flex-col items-center justify-center">
                        <div className="relative w-40 h-40 mb-6">
                            {/* Ticket Illustration */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-32 bg-yellow-200 rounded-lg rotate-[-15deg] flex flex-col items-center justify-center p-2 shadow-sm">
                                <div className="w-full h-full border-2 border-dashed border-yellow-400 rounded flex flex-col items-center justify-center gap-2">
                                    <div className="w-12 h-12 bg-white rounded-full opacity-50"></div>
                                    <div className="w-16 h-2 bg-white rounded opacity-50"></div>
                                </div>
                            </div>
                            <div className="absolute top-2 right-4 w-24 h-24 bg-red-300 rounded-lg rotate-[30deg] shadow-sm"></div>
                            <div className="absolute bottom-0 left-4 w-24 h-32 bg-purple-300 rounded-lg rotate-[10deg] flex flex-col items-center justify-center p-2 shadow-md z-10">
                                <div className="w-full h-full border-2 border-dashed border-purple-400 rounded flex flex-col items-center justify-center gap-2">
                                    <div className="flex gap-1">
                                        <div className="w-3 h-3 bg-white rounded-full"></div>
                                        <div className="w-3 h-3 bg-white rounded-full"></div>
                                        <div className="w-3 h-3 bg-white rounded-full"></div>
                                    </div>
                                    <div className="w-16 h-4 bg-pink-400 rounded-full"></div>
                                    <div className="w-10 h-2 bg-purple-500 rounded-full opacity-30"></div>
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-500 font-medium text-lg">No promotion code is currently available.</p>
                    </div>
                </div>

            </main>
            <MobileBottomNav />
        </div>
    );
}
