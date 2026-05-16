"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { ArrowUp, ArrowDown, History, TrendingUp, Clock, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
type Trade = {
    id: string;
    asset: string;
    amount: number;
    direction: 'UP' | 'DOWN';
    entryPrice: number;
    duration: number; // seconds
    startTime: number;
    result: 'PENDING' | 'WIN' | 'LOSS';
    payout: number;
};

type DataPoint = {
    time: string;
    price: number;
    timestamp: number;
};

const ASSETS = [
    { symbol: 'BTC/USD', name: 'Bitcoin', payout: 85 },
    { symbol: 'ETH/USD', name: 'Ethereum', payout: 82 },
    { symbol: 'EUR/USD', name: 'Euro', payout: 80 },
    { symbol: 'GBP/USD', name: 'British Pound', payout: 80 },
];

const DURATIONS = [
    { label: '30s', value: 30 },
    { label: '1m', value: 60 },
    { label: '3m', value: 180 },
    { label: '5m', value: 300 },
];

export default function BinaryOptionsInterface() {
    const [selectedAsset, setSelectedAsset] = useState(ASSETS[0]);
    const [currentPrice, setCurrentPrice] = useState<number>(50000);
    const [priceHistory, setPriceHistory] = useState<DataPoint[]>([]);
    const [amount, setAmount] = useState<number>(10);
    const [duration, setDuration] = useState<number>(60); // seconds
    const [trades, setTrades] = useState<Trade[]>([]);
    const [balance, setBalance] = useState<number>(1000); // Demo balance

    // Simulate live price feed
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

            setCurrentPrice(prev => {
                const change = (Math.random() - 0.5) * 50; // Random fluctuation
                const newPrice = prev + change;

                setPriceHistory(history => {
                    const newHistory = [...history, { time: timeString, price: newPrice, timestamp: now.getTime() }];
                    if (newHistory.length > 50) return newHistory.slice(newHistory.length - 50);
                    return newHistory;
                });

                return newPrice;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Check active trades
    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            setTrades(prevTrades => {
                return prevTrades.map(trade => {
                    if (trade.result !== 'PENDING') return trade;

                    const endTime = trade.startTime + (trade.duration * 1000);
                    if (now >= endTime) {
                        // Trade finished
                        const isWin = trade.direction === 'UP'
                            ? currentPrice > trade.entryPrice
                            : currentPrice < trade.entryPrice;

                        const payout = isWin ? trade.amount + (trade.amount * (selectedAsset.payout / 100)) : 0;

                        if (isWin) {
                            setBalance(b => b + payout);
                        }

                        return {
                            ...trade,
                            result: isWin ? 'WIN' : 'LOSS',
                            payout: payout
                        };
                    }
                    return trade;
                });
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [currentPrice, selectedAsset.payout]);

    const placeTrade = (direction: 'UP' | 'DOWN') => {
        if (balance < amount) return; // Insufficient balance

        setBalance(b => b - amount);

        const newTrade: Trade = {
            id: Math.random().toString(36).substr(2, 9),
            asset: selectedAsset.symbol,
            amount,
            direction,
            entryPrice: currentPrice,
            duration,
            startTime: Date.now(),
            result: 'PENDING',
            payout: 0,
        };

        setTrades(prev => [newTrade, ...prev]);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-100px)]">
            {/* Main Chart Area */}
            <div className="flex-grow flex flex-col gap-4">
                {/* Asset Selector */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {ASSETS.map(asset => (
                        <Button
                            key={asset.symbol}
                            variant={selectedAsset.symbol === asset.symbol ? "default" : "outline"}
                            onClick={() => setSelectedAsset(asset)}
                            className="flex flex-col items-start h-auto py-2 px-4 min-w-[120px]"
                        >
                            <div className="flex justify-between w-full">
                                <span className="font-bold">{asset.symbol}</span>
                                <span className="text-xs bg-green-500/20 text-green-500 px-1 rounded">{asset.payout}%</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{asset.name}</span>
                        </Button>
                    ))}
                </div>

                {/* Chart */}
                <Card className="flex-grow flex flex-col bg-card/50 backdrop-blur-sm border-border">
                    <CardHeader className="flex flex-row items-center justify-between py-4">
                        <div className="flex items-center gap-4">
                            <CardTitle>{selectedAsset.symbol}</CardTitle>
                            <div className="text-2xl font-mono font-bold text-primary">
                                {currentPrice.toFixed(2)}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {DURATIONS.map(d => (
                                <Button
                                    key={d.value}
                                    variant={duration === d.value ? "secondary" : "ghost"}
                                    size="sm"
                                    onClick={() => setDuration(d.value)}
                                >
                                    {d.label}
                                </Button>
                            ))}
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow min-h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={priceHistory}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis dataKey="time" hide />
                                <YAxis
                                    domain={['auto', 'auto']}
                                    orientation="right"
                                    tick={{ fill: '#666' }}
                                    tickFormatter={(val) => val.toFixed(2)}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="price"
                                    stroke="#0ea5e9"
                                    strokeWidth={2}
                                    dot={false}
                                    isAnimationActive={false}
                                />
                                {/* Show active trade entry lines */}
                                {trades.filter(t => t.result === 'PENDING' && t.asset === selectedAsset.symbol).map(trade => (
                                    <ReferenceLine
                                        key={trade.id}
                                        y={trade.entryPrice}
                                        stroke={trade.direction === 'UP' ? '#22c55e' : '#ef4444'}
                                        strokeDasharray="3 3"
                                        label={{ position: 'right', value: trade.direction, fill: trade.direction === 'UP' ? '#22c55e' : '#ef4444' }}
                                    />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Trading Panel */}
            <div className="w-full lg:w-80 flex flex-col gap-4 flex-shrink-0">
                <Card className="bg-card border-border">
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                            <span>Trade</span>
                            <Badge variant="outline" className="flex gap-1 items-center">
                                <Wallet className="w-3 h-3" />
                                {balance.toFixed(2)}
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm text-muted-foreground">Amount</label>
                            <div className="flex gap-2">
                                <Button variant="outline" size="icon" onClick={() => setAmount(Math.max(1, amount - 1))}>-</Button>
                                <Input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(parseFloat(e.target.value))}
                                    className="text-center font-bold"
                                />
                                <Button variant="outline" size="icon" onClick={() => setAmount(amount + 1)}>+</Button>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Min: 1</span>
                                <span>Max: 1000</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Profit</span>
                                <span className="text-green-500 font-bold">+{selectedAsset.payout}%</span>
                            </div>
                            <div className="text-2xl font-bold text-center">
                                ${(amount + (amount * selectedAsset.payout / 100)).toFixed(2)}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                className="h-16 bg-green-600 hover:bg-green-700 text-white flex flex-col gap-1"
                                onClick={() => placeTrade('UP')}
                            >
                                <ArrowUp className="w-6 h-6" />
                                <span className="font-bold">HIGHER</span>
                            </Button>
                            <Button
                                className="h-16 bg-red-600 hover:bg-red-700 text-white flex flex-col gap-1"
                                onClick={() => placeTrade('DOWN')}
                            >
                                <ArrowDown className="w-6 h-6" />
                                <span className="font-bold">LOWER</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Trades */}
                <Card className="flex-grow overflow-hidden flex flex-col bg-card border-border">
                    <CardHeader className="py-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                            <History className="w-4 h-4" />
                            Recent Trades
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow overflow-y-auto p-0">
                        <div className="divide-y divide-border">
                            {trades.map(trade => (
                                <div key={trade.id} className="p-3 flex items-center justify-between text-sm">
                                    <div className="flex flex-col">
                                        <span className="font-bold">{trade.asset}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {trade.direction === 'UP' ? <span className="text-green-500">▲ UP</span> : <span className="text-red-500">▼ DOWN</span>}
                                            {' • '}${trade.amount}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        {trade.result === 'PENDING' ? (
                                            <Badge variant="secondary" className="animate-pulse">Pending</Badge>
                                        ) : (
                                            <span className={cn("font-bold", trade.result === 'WIN' ? "text-green-500" : "text-red-500")}>
                                                {trade.result === 'WIN' ? `+$${trade.payout.toFixed(2)}` : `-$${trade.amount}`}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {trades.length === 0 && (
                                <div className="p-4 text-center text-muted-foreground text-xs">
                                    No trades yet
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
