"use client";

import { useState, useEffect } from 'react';
import { Coins, CreditCard, Smartphone, CheckCircle, XCircle, Loader2, ChevronLeft, History, Headphones, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import Image from 'next/image';

interface BuyCoinsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const DEPOSIT_AMOUNTS = [100, 200, 500, 1000, 3000, 5000, 10000, 15000, 20000, 25000];

export const BuyCoinsDialog = ({ open, onOpenChange, onSuccess }: BuyCoinsDialogProps) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('bkash');
  const [selectedChannel, setSelectedChannel] = useState<string>('bkash_vip');
  const [amount, setAmount] = useState<number | ''>('');
  const [selectedPromotion, setSelectedPromotion] = useState<string>('none');
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState<'select' | 'processing' | 'success' | 'error'>('select');

  const handleAmountSelect = (val: number) => {
    setAmount(val);
  };

  const handleNext = async () => {
    if (!amount || Number(amount) < 100) {
      toast.error('Please enter a valid amount (min 100)');
      return;
    }

    setProcessing(true);
    setStep('processing');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In a real implementation, this would create an order and redirect to payment gateway
      setStep('success');
      toast.success('Deposit initiated successfully!');

      setTimeout(() => {
        onOpenChange(false);
        onSuccess?.();
        setStep('select');
        setAmount('');
      }, 2000);
    } catch (error) {
      setStep('error');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden h-[90vh] flex flex-col bg-[#f5f5f5] text-black">
        {/* Header */}
        <div className="bg-[#1a1a1a] text-white p-4 flex items-center justify-between shrink-0">
          <button onClick={() => onOpenChange(false)} className="p-1">
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-lg font-bold">Deposit</h2>
          <div className="flex gap-4">
            <History size={24} />
            <Headphones size={24} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {step === 'select' ? (
            <>
              {/* Deposit Method */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-4 bg-orange-500 rounded-full"></div>
                  <h3 className="font-bold text-gray-800">Deposit Method</h3>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedMethod('bkash')}
                    className={`relative flex-1 p-3 rounded-lg border-2 flex flex-col items-center gap-2 bg-white transition-all ${selectedMethod === 'bkash' ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
                  >
                    {selectedMethod === 'bkash' && (
                      <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-bl-lg flex items-center justify-center">
                        <CheckCircle size={10} className="text-white" />
                      </div>
                    )}
                    <div className="w-10 h-10 bg-pink-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">Bkash</div>
                    <span className="text-xs font-bold text-gray-700">Bkash VIP</span>
                    <span className="absolute top-0 left-0 bg-orange-500 text-white text-[10px] px-1 rounded-br-lg">HOT</span>
                  </button>
                  <button
                    onClick={() => setSelectedMethod('nagad')}
                    className={`relative flex-1 p-3 rounded-lg border-2 flex flex-col items-center gap-2 bg-white transition-all ${selectedMethod === 'nagad' ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
                  >
                    {selectedMethod === 'nagad' && (
                      <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-bl-lg flex items-center justify-center">
                        <CheckCircle size={10} className="text-white" />
                      </div>
                    )}
                    <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">Nagad</div>
                    <span className="text-xs font-bold text-gray-700">NAGAD VIP</span>
                    <span className="absolute top-0 left-0 bg-orange-500 text-white text-[10px] px-1 rounded-br-lg">HOT</span>
                  </button>
                </div>
              </section>

              {/* Warning Note */}
              <div className="bg-white p-3 rounded-lg border border-red-100">
                <p className="text-xs text-red-600 leading-relaxed font-medium">
                  <span className="font-bold text-lg mr-1">! ! !</span>
                  NOTE : অনুগ্রহ করে আপনার ডিপোজিট করার পরে অবশ্যই আপনার Trx-ID আইডি সাবমিট করবেন। তাহলে খুব দ্রুত আপনার একাউন্টের মধ্যে টাকা যোগ হয়ে যাবে।
                  <span className="font-bold text-lg ml-1">! ! !</span>
                </p>
              </div>

              {/* Payment Channels */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-4 bg-green-500 rounded-full"></div>
                  <h3 className="font-bold text-gray-800">Payment channels</h3>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedChannel('bkash_vip')}
                    className={`relative p-3 rounded-lg border-2 bg-white min-w-[120px] text-left transition-all ${selectedChannel === 'bkash_vip' ? 'border-red-500' : 'border-gray-200'}`}
                  >
                    {selectedChannel === 'bkash_vip' && (
                      <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-bl-lg flex items-center justify-center">
                        <CheckCircle size={10} className="text-white" />
                      </div>
                    )}
                    <span className="text-xs font-bold text-red-800">Bkash VIP | GDP</span>
                    <span className="absolute top-0 left-0 bg-orange-500 text-white text-[10px] px-1 rounded-br-lg">HOT</span>
                  </button>
                </div>

                {/* Repeated Warning Note */}
                <div className="mt-4 bg-white p-3 rounded-lg border border-red-100">
                  <p className="text-xs text-red-600 leading-relaxed font-medium">
                    <span className="font-bold text-lg mr-1">! ! !</span>
                    NOTE : অনুগ্রহ করে আপনার ডিপোজিট করার পরে অবশ্যই আপনার Trx-ID আইডি সাবমিট করবেন। তাহলে খুব দ্রুত আপনার একাউন্টের মধ্যে টাকা যোগ হয়ে যাবে।
                    <span className="font-bold text-lg ml-1">! ! !</span>
                  </p>
                </div>
              </section>

              {/* Deposit Amounts */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-4 bg-purple-500 rounded-full"></div>
                  <h3 className="font-bold text-gray-800">Deposit Amounts</h3>
                </div>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {DEPOSIT_AMOUNTS.map((val) => (
                    <button
                      key={val}
                      onClick={() => handleAmountSelect(val)}
                      className={`py-2 px-1 rounded border text-sm font-semibold transition-all ${amount === val ? 'bg-red-500 text-white border-red-500' : 'bg-white text-gray-700 border-gray-200 hover:border-red-300'}`}
                    >
                      {val.toLocaleString()}
                    </button>
                  ))}
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-center">
                  <span className="text-gray-500 font-bold mr-2">৳</span>
                  <input
                    type="number"
                    placeholder="100 - 25,000"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full outline-none text-gray-800 font-semibold bg-transparent"
                  />
                </div>
                <div className="mt-2 text-red-800 font-medium text-sm">
                  Deposit Info: 24/24
                </div>
              </section>

              {/* Promotions */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-4 bg-pink-500 rounded-full"></div>
                  <h3 className="font-bold text-gray-800">Promotions</h3>
                </div>
                <div className="space-y-3">
                  <div
                    onClick={() => setSelectedPromotion('promo1')}
                    className="bg-white p-3 rounded-lg border border-gray-200 flex items-center gap-3 cursor-pointer"
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPromotion === 'promo1' ? 'border-red-500' : 'border-gray-300'}`}>
                      {selectedPromotion === 'promo1' && <div className="w-2.5 h-2.5 bg-red-500 rounded-full" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">আপনার প্রথম ডিপোজিটে ৮২% বোনাস উপ...</p>
                    </div>
                    <span className="text-xs text-gray-400">≥ ৳ 100.00</span>
                  </div>

                  <div
                    onClick={() => setSelectedPromotion('promo2')}
                    className="bg-white p-3 rounded-lg border border-gray-200 flex items-center gap-3 cursor-pointer"
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPromotion === 'promo2' ? 'border-red-500' : 'border-gray-300'}`}>
                      {selectedPromotion === 'promo2' && <div className="w-2.5 h-2.5 bg-red-500 rounded-full" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">আপনার প্রথম ডিপোজিটে ৮২% বোনাস উপ...</p>
                    </div>
                    <span className="text-xs text-gray-400">≥ ৳ 100.00</span>
                  </div>

                  <div
                    onClick={() => setSelectedPromotion('none')}
                    className={`bg-red-50 p-3 rounded-lg border flex items-center gap-3 cursor-pointer ${selectedPromotion === 'none' ? 'border-red-200' : 'border-transparent'}`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPromotion === 'none' ? 'border-red-500' : 'border-gray-300'}`}>
                      {selectedPromotion === 'none' && <div className="w-2.5 h-2.5 bg-red-500 rounded-full" />}
                    </div>
                    <p className="text-xs font-bold text-gray-800">Do not participate in any promotions</p>
                  </div>
                </div>
              </section>
            </>
          ) : step === 'processing' ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader2 className="animate-spin text-red-500 mb-4" size={48} />
              <h3 className="text-lg font-bold text-gray-800">Processing...</h3>
            </div>
          ) : step === 'success' ? (
            <div className="flex flex-col items-center justify-center h-full">
              <CheckCircle className="text-green-500 mb-4" size={64} />
              <h3 className="text-lg font-bold text-gray-800">Deposit Successful!</h3>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <XCircle className="text-red-500 mb-4" size={64} />
              <h3 className="text-lg font-bold text-gray-800">Deposit Failed</h3>
              <button onClick={() => setStep('select')} className="mt-4 px-4 py-2 bg-gray-200 rounded-lg text-sm font-bold">Try Again</button>
            </div>
          )}
        </div>

        {/* Footer Button */}
        {step === 'select' && (
          <div className="p-4 bg-white border-t border-gray-200 shrink-0">
            <button
              onClick={handleNext}
              className="w-full bg-[#d4d4d4] hover:bg-red-500 hover:text-white text-white font-bold py-3 rounded-full transition-colors flex items-center justify-center gap-2"
              style={{ backgroundColor: amount ? '#ef4444' : '#d4d4d4' }}
            >
              Next
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};