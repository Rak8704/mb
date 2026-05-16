"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HeaderNavigation } from "@/components/sections/header-navigation";
import { MobileBottomNav } from "@/components/sections/mobile-bottom-nav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Copy,
  Share2,
  Users,
  TrendingUp,
  DollarSign,
  Gift,
  MessageCircle,
  Send,
  Facebook,
  ChevronRight,
  Trophy,
  Calendar,
  Search,
  ChevronDown
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import Image from "next/image";

export default function InvitePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [activeTab, setActiveTab] = useState("overview");
  const [referralCode, setReferralCode] = useState("");
  const [referralLink, setReferralLink] = useState("");
  const [loading, setLoading] = useState(true);

  // Mock data for stats
  const stats = {
    todayIncome: 0.00,
    yesterdayIncome: 0.00,
    registers: 0,
    validReferrals: 0,
    totalRevenue: 1000.00,
  };

  // Fetch user's referral code
  useEffect(() => {
    const fetchReferralCode = async () => {
      if (!session?.user) {
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("bearer_token");
        const response = await fetch('/api/user/referral-code', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (response.ok) {
          const data = await response.json();
          setReferralCode(data.referralCode);
        } else {
          toast.error("Failed to load referral code");
        }
      } catch (error) {
        console.error("Error fetching referral code:", error);
        toast.error("Error loading referral code");
      } finally {
        setLoading(false);
      }
    };

    fetchReferralCode();
  }, [session]);

  useEffect(() => {
    if (session?.user && referralCode) {
      const baseUrl = window.location.origin;
      setReferralLink(`${baseUrl}/register?ref=${referralCode}`);
    }
  }, [session, referralCode]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      toast.success("Referral link copied!");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const vipLevels = [
    { level: "VIP0", bonus: "100TR", req: "Deposit 400TR & Bet 2000TR" },
    { level: "VIP1-5", bonus: "150TR", req: "Deposit 400TR & Bet 2000TR" },
    { level: "VIP6-8", bonus: "250TR", req: "Deposit 1000TR & Bet 5000TR" },
    { level: "VIP9", bonus: "500TR", req: "Deposit 3000TR & Bet 10000TR" },
    { level: "VIP10-18", bonus: "1000TR + Golden EGG", req: "Deposit 4000TR & Bet 80000TR" },
    { level: "VIP19-25", bonus: "2000TR + Golden EGG", req: "Deposit 5000TR & Bet 100000TR" },
    { level: "VIP26-30", bonus: "5000TR + Golden EGG", req: "Deposit 5000TR & Bet 100000TR" },
  ];

  const rewards = [
    { count: 3, amount: 30.00, claimed: false },
    { count: 7, amount: 40.00, claimed: false },
    { count: 12, amount: 50.00, claimed: false },
    { count: 20, amount: 100.00, claimed: false },
    { count: 50, amount: 300.00, claimed: false },
    { count: 100, amount: 500.00, claimed: false },
    { count: 200, amount: 1000.00, claimed: false },
    { count: 500, amount: 3000.00, claimed: false },
    { count: 1000, amount: 5000.00, claimed: false },
    { count: 2000, amount: 10000.00, claimed: false },
    { count: 3000, amount: 15000.00, claimed: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <HeaderNavigation />

      <main className="container mx-auto px-0 md:px-4 max-w-md md:max-w-4xl bg-white min-h-screen">
        <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
          <div className="sticky top-16 z-30 bg-white border-b border-gray-200 px-4 pt-2">
            <TabsList className="w-full justify-between bg-transparent h-auto p-0 border-b border-transparent">
              {["Overview", "Rewards", "Incomes", "Records", "Invited List"].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab.toLowerCase().replace(" ", "-")}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#0088cc] data-[state=active]:text-[#0088cc] px-2 py-3 text-xs md:text-sm font-medium text-gray-500"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="p-4">
            {/* OVERVIEW TAB */}
            <TabsContent value="overview" className="space-y-6 mt-0">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-blue-400 rounded-lg p-3 text-white text-center">
                  <p className="text-xs opacity-90">Today's Income</p>
                  <p className="text-lg font-bold">৳ {stats.todayIncome.toFixed(2)}</p>
                </div>
                <div className="bg-purple-400 rounded-lg p-3 text-white text-center">
                  <p className="text-xs opacity-90">Yesterday's Income</p>
                  <p className="text-lg font-bold">৳ {stats.yesterdayIncome.toFixed(2)}</p>
                </div>
                <div className="bg-purple-500 rounded-lg p-3 text-white text-center">
                  <p className="text-xs opacity-90">Registers</p>
                  <p className="text-lg font-bold">{stats.registers}</p>
                </div>
                <div className="bg-blue-500 rounded-lg p-3 text-white text-center">
                  <p className="text-xs opacity-90">Valid Referral</p>
                  <p className="text-lg font-bold">{stats.validReferrals}</p>
                </div>
              </div>


              {/* Referral Code Section */}
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-6 shadow-sm border-2 border-primary/20">
                <div className="text-center mb-4">
                  <h3 className="font-bold text-gray-800 mb-1 flex items-center justify-center gap-2">
                    <Gift className="text-primary" size={20} />
                    Your Referral Code
                  </h3>
                  <p className="text-xs text-gray-600">Share this code to invite friends</p>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  </div>
                ) : referralCode ? (
                  <div className="space-y-3">
                    <code className="block text-2xl font-bold font-mono bg-white px-4 py-3 rounded-lg border-2 border-primary/30 text-center text-primary">
                      {referralCode}
                    </code>
                    <Button
                      className="w-full bg-primary hover:bg-primary/90 h-10"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(referralCode);
                          toast.success("Referral code copied!");
                        } catch (err) {
                          toast.error("Failed to copy code");
                        }
                      }}
                    >
                      <Copy size={16} className="mr-2" />
                      Copy Referral Code
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <p className="text-sm">No referral code available</p>
                  </div>
                )}
              </div>

              {/* Share Section */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h3 className="text-center font-bold text-gray-800 mb-4">Share to your friends</h3>
                <div className="flex justify-center gap-4 mb-4">
                  <button className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
                    <Facebook size={20} />
                  </button>
                  <button className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                    <MessageCircle size={20} />
                  </button>
                  <button className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white">
                    <span className="font-bold text-xs">X</span>
                  </button>
                  <button className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center text-white">
                    <Send size={20} />
                  </button>
                  <button className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white">
                    <MessageCircle size={20} />
                  </button>
                </div>
                <div className="flex gap-2 bg-gray-100 p-2 rounded-lg items-center">
                  <span className="text-xs text-gray-500 truncate flex-1">{referralLink || "Loading..."}</span>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 h-8 text-xs" onClick={handleCopyLink}>
                    Copy
                  </Button>
                </div>
              </div>

              {/* My Tier */}
              <div className="bg-gradient-to-r from-blue-100 to-blue-50 rounded-xl p-4 border border-blue-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-gray-700">My Tier</span>
                  <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">Rules</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">L1</h2>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Directly Qualified Members</span>
                      <span>0/5</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-0"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Directly Deposit Amounts</span>
                      <span>0/30000</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-0"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Member Valid Bet</span>
                      <span>0/700000</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-0"></div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-blue-200">
                  <div className="text-center">
                    <div className="text-orange-500 font-bold text-lg">2.2%</div>
                    <div className="text-xs text-gray-500">Invite up Bonus</div>
                  </div>
                  <div className="text-center">
                    <div className="text-orange-500 font-bold text-lg">0.6%</div>
                    <div className="text-xs text-gray-500">Betting Bonus</div>
                  </div>
                </div>
              </div>

              {/* Estimated Revenue */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl p-6 text-white text-center relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Trophy className="text-yellow-300" />
                    <span className="font-medium text-lg">Estimated revenue</span>
                  </div>
                  <div className="text-3xl font-bold mb-2">৳ {stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                  <p className="text-xs opacity-80">Invite 1 person and earn up to 1000TR</p>
                </div>
              </div>

              {/* Event Details */}
              <div className="text-center space-y-2">
                <h3 className="font-bold text-gray-800 flex items-center justify-center gap-2">
                  <Gift className="text-red-500" size={18} />
                  EVENT DETAILS
                </h3>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>Share your unique link</p>
                  <p>Maximum Earn per Invitation: <span className="text-green-600 font-bold">1000TR</span></p>
                  <p>Earn <span className="text-green-600 font-bold">2.2%</span> on lower level deposits</p>
                  <p>Lower level earns <span className="text-green-600 font-bold">0.6%</span> on every bet</p>
                  <p>The higher your VIP level, the higher the invitation rewards</p>
                </div>
              </div>

              {/* Agency Recommendation Award */}
              <div>
                <h3 className="font-bold text-yellow-600 text-center mb-4 flex items-center justify-center gap-2">
                  <Trophy size={16} />
                  AGENCY RECOMMENDATION AWARD
                </h3>
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <table className="w-full text-xs">
                    <thead className="bg-teal-700 text-white">
                      <tr>
                        <th className="p-2 text-left">VIP Level</th>
                        <th className="p-2 text-center">Referral Bonus/Person</th>
                        <th className="p-2 text-right">Requirements</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {vipLevels.map((level, idx) => (
                        <tr key={idx} className="bg-white">
                          <td className="p-2 font-medium text-gray-700">{level.level}</td>
                          <td className="p-2 text-center font-bold text-gray-800">{level.bonus}</td>
                          <td className="p-2 text-right text-gray-500">{level.req}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-[10px] text-yellow-600 text-center mt-2">* Rewards automatically credited within 24 hours</p>
              </div>

              {/* Rewards Released */}
              <div className="space-y-3">
                <h3 className="font-bold text-center text-gray-800">Rewards Released to Date</h3>
                <div className="bg-blue-50 p-3 rounded-lg flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-500">
                    <Gift size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Invitation Rewards</p>
                    <p className="font-bold text-gray-800">৳ 7,013,584.00</p>
                  </div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-500">
                    <Trophy size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Achievement Rewards</p>
                    <p className="font-bold text-gray-800">৳ 225,281.00</p>
                  </div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-500">
                    <DollarSign size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Deposit Rebate</p>
                    <p className="font-bold text-gray-800">৳ 4,893,227.36</p>
                  </div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-500">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Betting Rebate</p>
                    <p className="font-bold text-gray-800">৳ 7,962,152.62</p>
                  </div>
                </div>
              </div>

              {/* Income Calculator */}
              <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-4 text-white">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-yellow-400 rounded flex items-center justify-center text-black font-bold">$</div>
                  <div>
                    <h3 className="font-bold">Income calculator</h3>
                  </div>
                </div>
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold">৳ 1,000.00</div>
                  <div className="text-xs opacity-70">Invite 1 active users expected revenue</div>
                </div>
                <input type="range" className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer" />
              </div>
            </TabsContent>

            {/* REWARDS TAB */}
            <TabsContent value="rewards" className="space-y-4 mt-0">
              <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                <span>Over 3 valid referral in total.</span>
                <span className="text-blue-500">0/3</span>
              </div>

              {rewards.map((reward, idx) => (
                <div key={idx} className="bg-white border border-gray-100 rounded-lg p-4 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 relative">
                      {/* Placeholder for medal icon */}
                      <div className={`w-full h-full rounded-full flex items-center justify-center ${idx < 3 ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-50 text-blue-500'}`}>
                        <Trophy size={24} />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Over {reward.count} valid referral in total.</p>
                      <p className="font-bold text-gray-700 flex items-center gap-1">
                        <DollarSign size={12} /> {reward.amount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-400 mb-1">0<span className="text-xs">/{reward.count}</span></p>
                    <Button size="sm" disabled className="bg-blue-300 text-white h-7 text-xs px-3">Available</Button>
                  </div>
                </div>
              ))}
            </TabsContent>

            {/* INCOMES TAB */}
            <TabsContent value="incomes" className="space-y-6 mt-0">
              <div className="text-center py-6 bg-white border-b border-gray-100">
                <p className="text-gray-500 text-sm mb-1">Today's Income: <span className="text-blue-600 font-bold">৳ 0.00</span></p>
              </div>

              <div className="space-y-4">
                {[
                  { label: "Invitation Rewards", amount: "0.00" },
                  { label: "Achievement Rewards", amount: "0.00" },
                  { label: "Deposit Rebate", amount: "0.00" },
                  { label: "Betting Rebate", amount: "0.00" },
                  { label: "Registers", amount: "0", isCount: true },
                  { label: "Valid Referral", amount: "0", isCount: true },
                  { label: "Depositors", amount: "0", isCount: true },
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center px-4">
                    <span className="text-gray-600 font-medium text-sm">{item.label}</span>
                    <span className={`font-bold text-sm ${item.isCount ? 'text-gray-800' : 'text-blue-600'}`}>
                      {item.isCount ? '' : '৳ '}{item.amount}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="text-center mb-6">
                  <p className="text-gray-500 text-sm mb-1">Total Income <span className="text-blue-600 font-bold">৳ 0.00</span></p>
                </div>
                <div className="space-y-4">
                  {[
                    { label: "Invitation Rewards", amount: "0.00" },
                    { label: "Achievement Rewards", amount: "0.00" },
                    { label: "Deposit Rebate", amount: "0.00" },
                    { label: "Betting Rebate", amount: "0.00" },
                    { label: "Registers", amount: "0", isCount: true },
                    { label: "Valid Referral", amount: "0", isCount: true },
                    { label: "Depositors", amount: "0", isCount: true },
                  ].map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center px-4">
                      <span className="text-gray-600 font-medium text-sm">{item.label}</span>
                      <span className={`font-bold text-sm ${item.isCount ? 'text-gray-800' : 'text-blue-600'}`}>
                        {item.isCount ? '' : '৳ '}{item.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-xs text-gray-400 text-center mt-8">Note : The system updates the data every 15 minutes.</p>
            </TabsContent>

            {/* RECORDS TAB */}
            <TabsContent value="records" className="space-y-4 mt-0">
              <div className="flex gap-2 mb-4">
                <div className="flex-1 border border-blue-400 rounded p-2 flex justify-between items-center text-blue-500 text-sm">
                  <span>Invitation Rewards</span>
                  <ChevronDown size={16} />
                </div>
                <div className="flex-1 border border-blue-400 rounded p-2 flex justify-between items-center text-blue-500 text-sm">
                  <Calendar size={16} />
                  <span>12/04- 12/04</span>
                </div>
              </div>

              <div className="bg-gray-50 p-2 grid grid-cols-3 text-xs text-gray-500 font-medium text-center">
                <div>Registration date</div>
                <div>Username</div>
                <div>Amount</div>
              </div>

              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Send size={48} className="text-blue-300 mb-4 rotate-[-45deg]" />
                <p className="text-lg font-medium text-blue-400">No data</p>
              </div>

              <div className="flex justify-between items-center px-4 py-2 border-t border-gray-100 text-sm text-gray-600">
                <span>Total</span>
                <span>0.00</span>
              </div>
            </TabsContent>

            {/* INVITED LIST TAB */}
            <TabsContent value="invited-list" className="space-y-4 mt-0">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 rounded-lg p-3 flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">V</div>
                  <div>
                    <p className="text-xs text-blue-500">Registers</p>
                    <p className="font-bold text-blue-600 text-lg">0</p>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center text-blue-500">
                    <Users size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-blue-500">Valid Referral</p>
                    <p className="font-bold text-blue-600 text-lg">0</p>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 rounded-lg p-3 space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-orange-800 font-medium">Today</span>
                  <span className="text-orange-800 font-bold">+0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-orange-800 font-medium">Yesterday</span>
                  <span className="text-orange-800 font-bold">+0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-orange-800 font-medium">Current Month</span>
                  <span className="text-orange-800 font-bold">+0</span>
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                <div className="w-1/3 border border-gray-300 rounded p-2 flex justify-between items-center text-gray-600 text-sm">
                  <span>All</span>
                  <ChevronDown size={16} />
                </div>
                <div className="w-1/3 bg-blue-500 rounded p-2 flex justify-center items-center text-white text-sm font-medium">
                  <span className="mr-1">✓</span> Today
                </div>
                <div className="w-1/3 border border-blue-400 rounded p-2 flex justify-between items-center text-blue-500 text-sm">
                  <Calendar size={16} />
                  <span>12/04- 12/04</span>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Send size={48} className="text-blue-300 mb-4 rotate-[-45deg]" />
                <p className="text-lg font-medium text-blue-400">No data</p>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </main>

      <MobileBottomNav />
    </div>
  );
}
