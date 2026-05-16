"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Instagram, ChevronUp } from 'lucide-react';
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

type NavLinkItem = {
    href: string;
    label: string;
    badge?: string;
};

const navigationLinks: NavLinkItem[] = [
    { href: "/en/sports", label: "Sport", badge: "hot" },
    { href: "/en/sports?page=live", label: "LIVE SPORTS", badge: "new" },
    { href: "/en/games/crash-games/play/33194/real", label: "AVIATOR", badge: "hot" },
    { href: "/en/games/crash-games/play/22461/real", label: "SPACEMAN", badge: "hot" },
    { href: "/en/games/crash-games", label: "Crash", badge: "hot" },
    { href: "/en/games/casino", label: "Casino" },
    { href: "/en/games/casino-live", label: "Live Casino" },
    { href: "/en/sports?page=virtual", label: "Virtuals" },
    { href: "/en/promotions", label: "Promotions", badge: "new" },
];

const supportLinks: NavLinkItem[] = [
    { href: "/en/cms/faq", label: "FAQ" },
    { href: "/en/blog", label: "Blog", badge: "hot" },
    { href: "/en/cms/contact-us", label: "Contact Us" },
    { href: "/en/cms/about-us", label: "About Us" },
    { href: "/en/cms/how-to-register-an-account", label: "How to Register an Account" },
    { href: "/en/cms/how-to-deposit-funds", label: "How to Deposit Funds" },
];

const legalLinks: NavLinkItem[] = [
    { href: "/en/cms/terms-and-conditions", label: "Terms & Conditions" },
    { href: "/en/cms/responsible-gaming", label: "Responsible Gaming" },
    { href: "/en/cms/bonus-general-terms", label: "General Bonus Terms & Conditions" },
    { href: "/en/cms/privacy-policy", label: "Privacy Policy" },
];

const NavLinkList = ({ links }: { links: NavLinkItem[] }) => (
    <ul className="flex flex-col gap-2.5 my-3">
        {links.map((link) => (
            <li key={link.href}>
                <Link href={link.href} className="flex items-center text-sm text-neutral-400 hover:text-white transition-colors">
                    <span className="truncate">{link.label}</span>
                    {link.badge && (
                        <span className="ml-2 bg-red-600 text-[10px] uppercase font-bold text-white px-1.5 py-0.5 rounded">
                            {link.badge}
                        </span>
                    )}
                </Link>
            </li>
        ))}
    </ul>
);

const Footer = () => {
    const handleScrollTop = () => {
        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const disclaimerText = "We encourage responsible gambling and have put in measures to ensure only safe gambling is carried out on this platform. Please only gamble with funds that you can afford to lose. We do our best to make sure all the information that we provide on this site is correct. However from time to time mista...";

    return (
        <footer className="flex flex-col p-4 text-neutral-400 bg-[#1D1D1D]">
            <div className="max-w-7xl mx-auto px-4 w-full">

                <div className="flex justify-center mb-8">
                    <Button
                        onClick={handleScrollTop}
                        aria-label="to top"
                        className="bg-[#2a2a2a] hover:bg-neutral-700 text-white rounded-md p-2 h-auto"
                    >
                        <ChevronUp className="h-6 w-6" />
                    </Button>
                </div>

                <div className="lg:hidden mt-1">
                    <Accordion type="multiple" className="w-full">
                        <AccordionItem value="navigation" className="border-b border-neutral-800">
                            <AccordionTrigger className="text-white text-base">Navigation</AccordionTrigger>
                            <AccordionContent><NavLinkList links={navigationLinks} /></AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="support" className="border-b border-neutral-800">
                            <AccordionTrigger className="text-white text-base">Support</AccordionTrigger>
                            <AccordionContent><NavLinkList links={supportLinks} /></AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="legal" className="border-b border-neutral-800">
                            <AccordionTrigger className="text-white text-base">Legal</AccordionTrigger>
                            <AccordionContent><NavLinkList links={legalLinks} /></AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="disclaimer" className="border-b-0 border-neutral-800">
                            <AccordionTrigger className="text-white text-base uppercase">Disclaimer</AccordionTrigger>
                            <AccordionContent><p className="text-sm mt-3">{disclaimerText}</p></AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>

                <div className="hidden lg:block">
                    <div className="flex flex-wrap -mx-3">
                        <div className="w-full lg:w-3/12 xl:w-2/12 px-3 mb-4">
                            <Link href="/">
                                <Image src="/logo.jpg" alt="JK222 Logo" width={280} height={96} className="w-auto h-24 object-contain" />
                            </Link>
                        </div>
                        <div className="w-full lg:w-3/12 xl:w-2/12 px-3 mb-2">
                            <h3 className="text-base text-white font-bold mb-0">Navigation</h3>
                            <NavLinkList links={navigationLinks} />
                        </div>
                        <div className="w-full lg:w-3/12 xl:w-2/12 px-3 mb-2">
                            <h3 className="text-base text-white font-bold mb-0">Support</h3>
                            <NavLinkList links={supportLinks} />
                        </div>
                        <div className="w-full lg:w-3/12 xl:w-2/12 px-3 mb-2">
                            <h3 className="text-base text-white font-bold mb-0">Legal</h3>
                            <NavLinkList links={legalLinks} />
                        </div>
                        <div className="w-full lg:w-full xl:w-3/12 px-3 mb-2 mt-8 lg:mt-0">
                            <h3 className="text-base text-white font-bold uppercase">Disclaimer</h3>
                            <p className="text-sm mt-3">{disclaimerText}</p>
                        </div>
                    </div>
                </div>

                <hr className="my-8 hidden md:block border-neutral-800" />

                <div className="flex flex-col lg:flex-row justify-center lg:justify-between items-center my-8 gap-8 lg:gap-2">
                    <div className="flex items-center justify-center gap-4">
                        <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center text-sm font-bold border-[3px] border-red-600 rounded-full bg-black text-white">18+</div>
                        <span className="text-white">Play Responsibly</span>
                    </div>
                </div>

                <div className="flex flex-col gap-4 my-4 text-center lg:text-left text-sm">
                    <div className="flex justify-center lg:justify-start">
                        <a href="https://about.nla.gd/" target="_blank" rel="noopener noreferrer">
                            <Image src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/16c2f736-4711-42f5-bec1-8d23c4be6c23-nicebet-com-lr/assets/images/nla-1.png" alt="NLA Logo" width={75} height={75} />
                        </a>
                    </div>
                    <div>You must be 18 years or older to register or play at Nicebet Liberia.</div>
                    <div>Nicebet Liberia is owned and operated by ML Entertainment LLC a company regulated by the gaming regulatory Laws of the Republic of Liberia and National Lottery Authority Liberia with registration number 053753175.</div>
                </div>

                <div className="text-xs mb-4 text-center lg:text-left">Version: 12.1.3</div>

                <div className="flex flex-col-reverse lg:flex-row items-center justify-center lg:justify-between pb-24 md:pb-8">
                    <div className="text-center lg:text-left mt-4 lg:mt-0">All rights reserved.</div>
                    <div className="flex gap-4 justify-center items-center">
                        <a href="https://www.facebook.com/people/nicebet/61577034884242/" aria-label="Visit our FACEBOOK page" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white">
                            <Facebook className="w-6 h-6" />
                        </a>
                        <a href="https://www.instagram.com/nicebet_liberia/" aria-label="Visit our INSTAGRAM page" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white">
                            <Instagram className="w-6 h-6" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;