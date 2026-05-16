"use client";

import { motion } from 'framer-motion';

export function FullScreenLoader() {
    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="relative">
                <motion.div
                    className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    className="absolute inset-0 flex items-center justify-center text-xs font-bold text-primary"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    NB
                </motion.div>
            </div>
        </div>
    );
}

export function SkeletonCard() {
    return (
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <div className="h-48 rounded-md bg-muted animate-pulse mb-4" />
            <div className="h-6 w-2/3 rounded bg-muted animate-pulse mb-2" />
            <div className="h-4 w-full rounded bg-muted animate-pulse mb-2" />
            <div className="h-4 w-1/2 rounded bg-muted animate-pulse" />
        </div>
    );
}
