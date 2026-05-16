"use client";

import { useState, useRef, useMemo, createRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Flame, ThumbsUp, LayoutGrid, Spade, Trophy, Gamepad2, Bird, Club, Fish, Ticket, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// Types
export interface Game {
    id: string;
    name: string;
    image: string;
    provider?: string;
    isHot?: boolean;
    isNew?: boolean;
    tag?: string;
}

export interface CategorySection {
    id: string;
    title: string;
    icon: any;
    count: number;
    games: Game[];
    color: string; // Icon color
}

// Mock Data
export const categories: CategorySection[] = [
    {
        id: 'hot',
        title: 'Hot',
        icon: Flame,
        count: 21,
        color: 'text-orange-500',
        games: [
            { id: 'h1', name: 'Super Ace', image: '/67.賺金蛋_越.png', provider: 'JILI' },
            { id: 'h2', name: 'Aviator', image: '/68.悟空偷桃_越.png', provider: 'SPRIBE' },
            { id: 'h3', name: 'Boxing King', image: '/69.發財神_越.png', provider: 'JILI' },
            { id: 'h4', name: 'Wild Bounty Showdown', image: '/70.萬飽龍_越.png', provider: 'PG' },
            { id: 'h5', name: 'Super Elements', image: '/72.好運年年_越.png', provider: 'FC' },
            { id: 'h6', name: 'Fortune Gems', image: '/73.Lion_King_vi.png', provider: 'JILI' },
            { id: 'h7', name: 'Pinata Wins', image: '/74.聚寶盆_越.png', provider: 'PG' },
            { id: 'h8', name: 'Ultimate Sic Bo', image: '/75.金寶熊_越.png', provider: 'BNG' },
            { id: 'h9', name: 'Magic Ace Wind Lock', image: '/76.旺旺旺_vi.png', provider: 'JDB' },
            { id: 'h10', name: 'Money Coming', image: '/77.火鳳凰_vi.png', provider: 'JILI', tag: '10000X' },
            { id: 'h11', name: 'Crazy Time', image: '/78.阿波羅_越.png', provider: 'Evolution' },
            { id: 'h12', name: 'Circus Joker 4096', image: '/66.火爆777_越.png', provider: 'JILI' },
            { id: 'h13', name: 'Treasures of Aztec', image: '/64.宙斯_越.png', provider: 'PG' },
            { id: 'h14', name: 'Fruity Bonanza', image: '/61_天天吃豆_越.png', provider: 'JDB' },
            { id: 'h15', name: 'High Flyer', image: '/60.叢林舞會_越.png', provider: 'Gemini' },
            { id: 'h16', name: '9Wickets', image: '/59.夏日猩情_越.png', provider: '9Wickets' },
            { id: 'h17', name: '777 Classic Style', image: '/58.金雞報囍2_越.png', provider: 'JILI' },
            { id: 'h18', name: 'Mega Wheel', image: '/57.神獸爭霸_越.png', provider: 'Pragmatic Play' },
            { id: 'h19', name: 'Money Rush', image: '/54.火草泥馬_越.png', provider: 'JILI' },
            { id: 'h20', name: 'Up Coming Hot Fire 3x3', image: '/51.嗨爆大馬戲_越.png', provider: 'JILI' },
            { id: 'h21', name: 'Jackpot Joker', image: '/50.鴻福齊天_越.png', provider: 'TF' },
        ]
    },
    {
        id: 'recommend',
        title: 'Recommend',
        icon: ThumbsUp,
        count: 100,
        color: 'text-orange-400',
        games: [
            { id: 'r1', name: 'Fruity Bonanza', image: '/1.鑽石水果王_越.png', provider: 'JDB' },
            { id: 'r2', name: 'Jackpot Joker', image: '/2.棋聖_越.png', provider: 'JILI' },
            { id: 'r3', name: '3 Coin Volcano', image: '/3.血之吻_越.png', provider: 'BNG' },
            { id: 'r4', name: 'Free Drop', image: '/4.森林泰后_越.png', provider: 'Gemini' },
            { id: 'r5', name: 'Lucky Neko', image: '/5.金大款_越.png', provider: 'PG' },
            { id: 'r6', name: 'Gates of Olympus', image: '/7_RaveJump_越200X200.png', provider: 'Pragmatic Play' },
            { id: 'r7', name: 'Sweet Bonanza', image: '/8.甜蜜蜜_vi.png', provider: 'Pragmatic Play' },
            { id: 'r8', name: 'Sugar Rush', image: '/9.鍾馗運財_越.png', provider: 'Pragmatic Play' },
            { id: 'r9', name: 'Starlight Princess', image: '/10.五福臨門_越南.png', provider: 'Pragmatic Play' },
            { id: 'r10', name: 'Book of Dead', image: '/12.金玉滿堂_越.png', provider: 'Play\'n GO' },
            { id: 'r11', name: 'Gonzo\'s Quest', image: '/13.櫻花妹子_越.png', provider: 'NetEnt' },
            { id: 'r12', name: 'Starburst', image: '/15.金雞報喜_越.png', provider: 'NetEnt' },
            { id: 'r13', name: 'Big Bass Bonanza', image: '/16.五行_越.png', provider: 'Pragmatic Play' },
            { id: 'r14', name: 'Wolf Gold', image: '/17.祥獅獻瑞_越.png', provider: 'Pragmatic Play' },
            { id: 'r15', name: 'Aztec Gems', image: '/19.風火輪_vi.png', provider: 'Pragmatic Play' },
            { id: 'r16', name: 'Fire Strike', image: '/20.發發發_越.png', provider: 'Pragmatic Play' },
            { id: 'r17', name: 'Mega Moolah', image: '/21.野狼ICON_越.png', provider: 'Microgaming' },
            { id: 'r18', name: 'Immortal Romance', image: '/22.庶務西遊二課_越.png', provider: 'Microgaming' },
            { id: 'r19', name: 'Thunderstruck II', image: '/23.金元寶_越.png', provider: 'Microgaming' },
            { id: 'r20', name: 'Dead or Alive', image: '/24_Rave Jump2_越200X200.png', provider: 'NetEnt' },
            { id: 'r21', name: 'Reactoonz', image: '/24.跳起來2_vi.png', provider: 'Play\'n GO' },
            { id: 'r22', name: 'Moon Princess', image: '/26.777_越.png', provider: 'Play\'n GO' },
            { id: 'r23', name: 'Jammin\' Jars', image: '/27.魔法世界_越.png', provider: 'Push Gaming' },
            { id: 'r24', name: 'Razor Shark', image: '/29.水世界_越.png', provider: 'Push Gaming' },
            { id: 'r25', name: 'The Dog House', image: '/31.武聖_越.png', provider: 'Pragmatic Play' },
            { id: 'r26', name: 'Extra Chilli', image: 'https://v3.fal.media/files/penguin/jwLf3S55fiBQKLHvfJyVH_output.png', provider: 'BTG' },
            { id: 'r27', name: 'Bonanza', image: 'https://v3.fal.media/files/penguin/4h35WftNO-_GdhZusBMWQ_output.png', provider: 'BTG' },
            { id: 'r28', name: 'White Rabbit', image: 'https://v3.fal.media/files/penguin/VTYYyOoJHSasqapk8hPr3_output.png', provider: 'BTG' },
            { id: 'r29', name: 'Vikings Go Berzerk', image: 'https://v3.fal.media/files/koala/EhxVmzU0Pqk9zvk6p8G5K_output.png', provider: 'Yggdrasil' },
            { id: 'r30', name: 'Valley of the Gods', image: 'https://v3.fal.media/files/panda/Y3n9ZFl8RePKuonGulImg_output.png', provider: 'Yggdrasil' },
            { id: 'r31', name: 'Buffalo King', image: 'https://v3.fal.media/files/elephant/qfLxnZgwR4BWxB98iQlri_output.png', provider: 'Pragmatic Play' },
            { id: 'r32', name: 'Mustang Gold', image: 'https://v3.fal.media/files/zebra/Yfq5lsnIUPdueGPNBBIGs_output.png', provider: 'Pragmatic Play' },
            { id: 'r33', name: 'John Hunter', image: 'https://v3.fal.media/files/tiger/US1z1oBBnUZGRKtXXb86w_output.png', provider: 'Pragmatic Play' },
            { id: 'r34', name: 'Fruit Party', image: 'https://v3.fal.media/files/lion/Xyv0y15d0vP068fqefxTi_output.png', provider: 'Pragmatic Play' },
            { id: 'r35', name: 'Madame Destiny', image: 'https://v3.fal.media/files/rabbit/qdpVP77rdxngzKTAT2uk4_output.png', provider: 'Pragmatic Play' },
            { id: 'r36', name: 'Great Rhino', image: 'https://v3.fal.media/files/koala/VeCElJ_VB0Ku6Xmo8Vz4h_output.png', provider: 'Pragmatic Play' },
            { id: 'r37', name: 'Chilli Heat', image: 'https://v3.fal.media/files/monkey/Dll0mczrVKZYCTOigIoLL_output.png', provider: 'Pragmatic Play' },
            { id: 'r38', name: 'Wild West Gold', image: 'https://v3.fal.media/files/elephant/ILkEO6gBUSCsrh9b-bBtH_output.png', provider: 'Pragmatic Play' },
            { id: 'r39', name: 'Aztec Bonanza', image: 'https://v3.fal.media/files/penguin/cWeb1Nu0nz79XOQzC1lRV_output.png', provider: 'Pragmatic Play' },
            { id: 'r40', name: 'Joker King', image: 'https://v3.fal.media/files/koala/0AnBO-Dx8RCvMj5vssF9v_output.png', provider: 'Pragmatic Play' },
            { id: 'r41', name: 'Diamond Strike', image: 'https://v3.fal.media/files/tiger/fxGXhvVyUzh7XBkPkrLOk_output.png', provider: 'Pragmatic Play' },
            { id: 'r42', name: 'Hot Safari', image: 'https://v3.fal.media/files/rabbit/aLEXMOKgAiZv66Qq8zAVc_output.png', provider: 'Pragmatic Play' },
            { id: 'r43', name: 'Pirate Gold', image: 'https://v3.fal.media/files/penguin/8bEOMfjhp6GRTLreMg1ID_output.png', provider: 'Pragmatic Play' },
            { id: 'r44', name: 'Triple Tigers', image: 'https://v3.fal.media/files/rabbit/2GXI-xlBfTSc04d-2ZCqh_output.png', provider: 'Pragmatic Play' },
            { id: 'r45', name: 'Vegas Magic', image: 'https://v3.fal.media/files/kangaroo/lYHaR_DETnLxNzv5Qx5vs_output.png', provider: 'Pragmatic Play' },
            { id: 'r46', name: 'Dragon Kingdom', image: 'https://v3.fal.media/files/panda/8PzjIC3DLmmzqirl5FTyl_output.png', provider: 'Pragmatic Play' },
            { id: 'r47', name: 'Leprechaun Song', image: 'https://v3.fal.media/files/monkey/Oya4bNlocaOjMzIHnkPiN_output.png', provider: 'Pragmatic Play' },
            { id: 'r48', name: 'Magic Crystals', image: 'https://v3.fal.media/files/tiger/US1z1oBBnUZGRKtXXb86w_output.png', provider: 'Pragmatic Play' },
            { id: 'r49', name: 'Peking Luck', image: 'https://v3.fal.media/files/kangaroo/ZPFKXr5kPwJ25rDgOBpVe_output.png', provider: 'Pragmatic Play' },
            { id: 'r50', name: 'Safari King', image: 'https://v3.fal.media/files/penguin/jwLf3S55fiBQKLHvfJyVH_output.png', provider: 'Pragmatic Play' },
            { id: 'r51', name: 'Lucky Dragons', image: 'https://v3.fal.media/files/penguin/4h35WftNO-_GdhZusBMWQ_output.png', provider: 'Pragmatic Play' },
            { id: 'r52', name: 'Ancient Egypt', image: 'https://v3.fal.media/files/penguin/VTYYyOoJHSasqapk8hPr3_output.png', provider: 'Pragmatic Play' },
            { id: 'r53', name: 'Hercules Son', image: 'https://v3.fal.media/files/koala/EhxVmzU0Pqk9zvk6p8G5K_output.png', provider: 'Pragmatic Play' },
            { id: 'r54', name: 'Dwarven Gold', image: 'https://v3.fal.media/files/panda/Y3n9ZFl8RePKuonGulImg_output.png', provider: 'Pragmatic Play' },
            { id: 'r55', name: 'Jade Butterfly', image: 'https://v3.fal.media/files/elephant/qfLxnZgwR4BWxB98iQlri_output.png', provider: 'Pragmatic Play' },
            { id: 'r56', name: 'Aladdin Treasure', image: 'https://v3.fal.media/files/zebra/Yfq5lsnIUPdueGPNBBIGs_output.png', provider: 'Pragmatic Play' },
            { id: 'r57', name: 'Queen of Gold', image: 'https://v3.fal.media/files/tiger/US1z1oBBnUZGRKtXXb86w_output.png', provider: 'Pragmatic Play' },
            { id: 'r58', name: 'Panther Queen', image: 'https://v3.fal.media/files/lion/Xyv0y15d0vP068fqefxTi_output.png', provider: 'Pragmatic Play' },
            { id: 'r59', name: 'Monkey Madness', image: 'https://v3.fal.media/files/rabbit/qdpVP77rdxngzKTAT2uk4_output.png', provider: 'Pragmatic Play' },
            { id: 'r60', name: 'Treasure Horse', image: 'https://v3.fal.media/files/koala/VeCElJ_VB0Ku6Xmo8Vz4h_output.png', provider: 'Pragmatic Play' },
            { id: 'r61', name: 'Hot Chilli', image: 'https://v3.fal.media/files/monkey/Dll0mczrVKZYCTOigIoLL_output.png', provider: 'Pragmatic Play' },
            { id: 'r62', name: 'Caishen Gold', image: 'https://v3.fal.media/files/elephant/ILkEO6gBUSCsrh9b-bBtH_output.png', provider: 'Pragmatic Play' },
            { id: 'r63', name: 'Fire 88', image: 'https://v3.fal.media/files/penguin/cWeb1Nu0nz79XOQzC1lRV_output.png', provider: 'Pragmatic Play' },
            { id: 'r64', name: 'Lucky New Year', image: 'https://v3.fal.media/files/koala/0AnBO-Dx8RCvMj5vssF9v_output.png', provider: 'Pragmatic Play' },
            { id: 'r65', name: 'Golden Ox', image: 'https://v3.fal.media/files/tiger/fxGXhvVyUzh7XBkPkrLOk_output.png', provider: 'Pragmatic Play' },
            { id: 'r66', name: 'Dragon Hot', image: 'https://v3.fal.media/files/rabbit/aLEXMOKgAiZv66Qq8zAVc_output.png', provider: 'Pragmatic Play' },
            { id: 'r67', name: '888 Dragons', image: 'https://v3.fal.media/files/penguin/8bEOMfjhp6GRTLreMg1ID_output.png', provider: 'Pragmatic Play' },
            { id: 'r68', name: 'Leprechaun Carol', image: 'https://v3.fal.media/files/rabbit/2GXI-xlBfTSc04d-2ZCqh_output.png', provider: 'Pragmatic Play' },
            { id: 'r69', name: 'Santa', image: 'https://v3.fal.media/files/kangaroo/lYHaR_DETnLxNzv5Qx5vs_output.png', provider: 'Pragmatic Play' },
            { id: 'r70', name: 'Wild Pixies', image: 'https://v3.fal.media/files/panda/8PzjIC3DLmmzqirl5FTyl_output.png', provider: 'Pragmatic Play' },
            { id: 'r71', name: 'Fairytale Fortune', image: 'https://v3.fal.media/files/monkey/Oya4bNlocaOjMzIHnkPiN_output.png', provider: 'Pragmatic Play' },
            { id: 'r72', name: 'Glorious Rome', image: 'https://v3.fal.media/files/tiger/US1z1oBBnUZGRKtXXb86w_output.png', provider: 'Pragmatic Play' },
            { id: 'r73', name: 'Journey to the West', image: 'https://v3.fal.media/files/kangaroo/ZPFKXr5kPwJ25rDgOBpVe_output.png', provider: 'Pragmatic Play' },
            { id: 'r74', name: 'Master Chen Fortune', image: 'https://v3.fal.media/files/penguin/jwLf3S55fiBQKLHvfJyVH_output.png', provider: 'Pragmatic Play' },
            { id: 'r75', name: 'Aztec King', image: 'https://v3.fal.media/files/penguin/4h35WftNO-_GdhZusBMWQ_output.png', provider: 'Pragmatic Play' },
            { id: 'r76', name: 'Egyptian Fortunes', image: 'https://v3.fal.media/files/penguin/VTYYyOoJHSasqapk8hPr3_output.png', provider: 'Pragmatic Play' },
            { id: 'r77', name: 'Gems Bonanza', image: 'https://v3.fal.media/files/koala/EhxVmzU0Pqk9zvk6p8G5K_output.png', provider: 'Pragmatic Play' },
            { id: 'r78', name: 'Release the Kraken', image: 'https://v3.fal.media/files/panda/Y3n9ZFl8RePKuonGulImg_output.png', provider: 'Pragmatic Play' },
            { id: 'r79', name: 'Mysterious Egypt', image: 'https://v3.fal.media/files/elephant/qfLxnZgwR4BWxB98iQlri_output.png', provider: 'Pragmatic Play' },
            { id: 'r80', name: 'Wild Gladiators', image: 'https://v3.fal.media/files/zebra/Yfq5lsnIUPdueGPNBBIGs_output.png', provider: 'Pragmatic Play' },
            { id: 'r81', name: 'Chicken Drop', image: 'https://v3.fal.media/files/tiger/US1z1oBBnUZGRKtXXb86w_output.png', provider: 'Pragmatic Play' },
            { id: 'r82', name: 'Fruit Rainbow', image: 'https://v3.fal.media/files/lion/Xyv0y15d0vP068fqefxTi_output.png', provider: 'Pragmatic Play' },
            { id: 'r83', name: 'Elemental Gems', image: 'https://v3.fal.media/files/rabbit/qdpVP77rdxngzKTAT2uk4_output.png', provider: 'Pragmatic Play' },
            { id: 'r84', name: 'Pyramid Bonanza', image: 'https://v3.fal.media/files/koala/VeCElJ_VB0Ku6Xmo8Vz4h_output.png', provider: 'Pragmatic Play' },
            { id: 'r85', name: 'Tropical Tiki', image: 'https://v3.fal.media/files/monkey/Dll0mczrVKZYCTOigIoLL_output.png', provider: 'Pragmatic Play' },
            { id: 'r86', name: 'Candy Stars', image: 'https://v3.fal.media/files/elephant/ILkEO6gBUSCsrh9b-bBtH_output.png', provider: 'Pragmatic Play' },
            { id: 'r87', name: 'Floating Dragon', image: 'https://v3.fal.media/files/penguin/cWeb1Nu0nz79XOQzC1lRV_output.png', provider: 'Pragmatic Play' },
            { id: 'r88', name: 'Aztec Blaze', image: 'https://v3.fal.media/files/koala/0AnBO-Dx8RCvMj5vssF9v_output.png', provider: 'Pragmatic Play' },
            { id: 'r89', name: 'Piggy Bank Bills', image: 'https://v3.fal.media/files/tiger/fxGXhvVyUzh7XBkPkrLOk_output.png', provider: 'Pragmatic Play' },
            { id: 'r90', name: 'Cash Bonanza', image: 'https://v3.fal.media/files/rabbit/aLEXMOKgAiZv66Qq8zAVc_output.png', provider: 'Pragmatic Play' },
            { id: 'r91', name: 'Drill That Gold', image: 'https://v3.fal.media/files/penguin/8bEOMfjhp6GRTLreMg1ID_output.png', provider: 'Pragmatic Play' },
            { id: 'r92', name: 'Fruit Party 2', image: 'https://v3.fal.media/files/rabbit/2GXI-xlBfTSc04d-2ZCqh_output.png', provider: 'Pragmatic Play' },
            { id: 'r93', name: 'Cowboy Coins', image: 'https://v3.fal.media/files/kangaroo/lYHaR_DETnLxNzv5Qx5vs_output.png', provider: 'Pragmatic Play' },
            { id: 'r94', name: 'Cleocatra', image: 'https://v3.fal.media/files/panda/8PzjIC3DLmmzqirl5FTyl_output.png', provider: 'Pragmatic Play' },
            { id: 'r95', name: 'Aztec Powernudge', image: 'https://v3.fal.media/files/monkey/Oya4bNlocaOjMzIHnkPiN_output.png', provider: 'Pragmatic Play' },
            { id: 'r96', name: 'Big Bass Splash', image: 'https://v3.fal.media/files/tiger/US1z1oBBnUZGRKtXXb86w_output.png', provider: 'Pragmatic Play' },
            { id: 'r97', name: 'Candy Village', image: 'https://v3.fal.media/files/kangaroo/ZPFKXr5kPwJ25rDgOBpVe_output.png', provider: 'Pragmatic Play' },
            { id: 'r98', name: 'Forge of Olympus', image: 'https://v3.fal.media/files/penguin/jwLf3S55fiBQKLHvfJyVH_output.png', provider: 'Pragmatic Play' },
            { id: 'r99', name: 'Starlight Christmas', image: 'https://v3.fal.media/files/penguin/4h35WftNO-_GdhZusBMWQ_output.png', provider: 'Pragmatic Play' },
            { id: 'r100', name: 'Gates of Gatot Kaca', image: 'https://v3.fal.media/files/penguin/VTYYyOoJHSasqapk8hPr3_output.png', provider: 'Pragmatic Play' },
        ]
    },
    {
        id: 'sports',
        title: 'Sports',
        icon: Trophy,
        count: 9,
        color: 'text-orange-500',
        games: [
            { id: 'sp1', name: '9Wickets', image: '/49.寂寞星球_vi.png', provider: '9Wickets' },
            { id: 'sp2', name: 'Lucky Sports', image: '/47.法老寶藏_越.png', provider: 'Lucky' },
            { id: 'sp3', name: 'FB Sports', image: '/46.狼月moonwolf_vi.png', provider: 'FB' },
            { id: 'sp4', name: 'Cricket Exchange', image: '/44.豪華水果王_越.png', provider: 'Betfair' },
            { id: 'sp5', name: 'Live Cricket Betting', image: '/42.福爾摩斯_越.png', provider: 'Bet365' },
            { id: 'sp6', name: 'IPL Betting', image: '/39.飛天_vi.png', provider: '1xBet' },
            { id: 'sp7', name: 'T20 World Cup', image: '/38.舞力全開_vi.png', provider: 'Parimatch' },
            { id: 'sp8', name: 'Cricket Sportsbook', image: '/36.夜店大亨_越.png', provider: '22Bet' },
            { id: 'sp9', name: 'Virtual Cricket', image: '/37.虎虎虎_vi.png', provider: 'Betwinner' },
        ]
    },
    {
        id: 'slots',
        title: 'Slots',
        icon: LayoutGrid,
        count: 150,
        color: 'text-orange-500',
        games: [
            { id: 's1', name: 'Super Ace', image: '/89_BigRedWay_韓128X128_B.png', provider: 'JILI' },
            { id: 's2', name: 'Wild Bounty Showdown', image: '/GO06_Paradise2_越200X200.png', provider: 'PG' },
            { id: 's3', name: 'Super Elements', image: '/GB14_Funky Bingo_越200X200.png', provider: 'FC' },
            { id: 's4', name: 'Aviator', image: '/GB15_Hero of the 3 Kingdoms - cao cao_越200X200.png', provider: 'SPRIBE' },
            { id: 's5', name: 'Boxing King', image: '/GB16_CHICAGOⅡ_越200X200.png', provider: 'JILI' },
            { id: 's6', name: 'Fortune Gems', image: '/Go02_HeroFishing_越200X200.png', provider: 'JILI' },
            ...Array.from({ length: 144 }, (_, i) => ({
                id: `s${i + 7}`,
                name: [
                    'Dragon Fortune', 'Lucky Leprechaun', 'Mega Moolah', 'Book of Ra', 'Cleopatra Gold',
                    'Zeus Lightning', 'Pharaoh Treasure', 'Viking Voyage', 'Pirate Plunder', 'Aztec Temple',
                    'Golden Goddess', 'Diamond Mine', 'Ruby Riches', 'Emerald Isle', 'Sapphire Seas',
                    'Crystal Cavern', 'Mystic Moon', 'Solar Flare', 'Cosmic Cash', 'Stellar Spins',
                    'Rainbow Riches', 'Pot of Gold', 'Lucky Charms', 'Four Leaf Clover', 'Irish Eyes',
                    'Celtic Crown', 'Highland Fling', 'Scottish Treasure', 'Welsh Wealth', 'English Rose',
                    'French Fortune', 'Italian Ice', 'Spanish Gold', 'Greek Gods', 'Roman Empire',
                    'Egyptian Queen', 'Mayan Magic', 'Inca Idol', 'Samurai Spirit', 'Ninja Night',
                    'Geisha Garden', 'Panda Paradise', 'Dragon Dance', 'Tiger Treasure', 'Lion Pride',
                    'Elephant Expedition', 'Rhino Rush', 'Gorilla Gold', 'Monkey Money', 'Koala Cash',
                    'Kangaroo Kingdom', 'Outback Opal', 'Safari Sunset', 'Jungle Jackpot', 'Tropical Treat',
                    'Ocean Odyssey', 'Deep Sea Dive', 'Coral Reef', 'Mermaid Magic', 'Poseidon Power',
                    'Neptune Nuggets', 'Atlantis Adventure', 'Underwater World', 'Shark Attack', 'Dolphin Delight',
                    'Whale Wins', 'Octopus Oasis', 'Jellyfish Jewels', 'Starfish Sparkle', 'Seahorse Spin',
                    'Treasure Island', 'Pirate Bay', 'Buccaneer Bounty', 'Corsair Cash', 'Privateer Prize',
                    'Captain Quest', 'Sailor Slots', 'Anchor Away', 'Ship Shape', 'Port Prosperity',
                    'Volcano Eruption', 'Earthquake', 'Tsunami Treasure', 'Tornado Twist', 'Hurricane Hit',
                    'Lightning Strike', 'Thunder Storm', 'Blizzard Blast', 'Avalanche', 'Landslide Luck',
                    'Fire Frenzy', 'Ice Age', 'Desert Dunes', 'Arctic Adventure', 'Tundra Trek',
                    'Rainforest Riches', 'Mountain Majesty', 'Valley Victory', 'Canyon Cash', 'Plateau Prize',
                    'Space Station', 'Alien Attack', 'UFO Unidentified', 'Martian Money', 'Venus Vault',
                    'Jupiter Jackpot', 'Saturn Spins', 'Mercury Magic', 'Pluto Prize', 'Galaxy Gold',
                    'Nebula Nuggets', 'Comet Cash', 'Asteroid Adventure', 'Meteor Millions', 'Black Hole Bonus',
                    'Time Travel', 'Future Fortune', 'Past Prize', 'Present Prosperity', 'Eternal Earnings',
                    'Medieval Money', 'Renaissance Riches', 'Victorian Vault', 'Roaring Twenties', 'Fifties Fortune',
                    'Sixties Spin', 'Seventies Slots', 'Eighties Earnings', 'Nineties Nuggets', 'Millennium Magic',
                    'Wild West', 'Cowboy Cash', 'Outlaw Oasis', 'Sheriff Slots', 'Bandit Bounty',
                    'Gold Rush', 'Silver Strike', 'Bronze Bonus', 'Copper Cash', 'Platinum Prize',
                    'Diamond Dynasty', 'Ruby Reign', 'Emerald Empire', 'Sapphire Supreme', 'Topaz Treasure',
                    'Amethyst Adventure', 'Opal Odyssey', 'Pearl Paradise', 'Jade Journey', 'Turquoise Trek',
                    'Garnet Gold', 'Citrine Cash', 'Aquamarine Ace', 'Peridot Prize', 'Tanzanite Triumph',
                    'Moonstone Magic', 'Sunstone Spin', 'Bloodstone Bonus', 'Onyx Oasis', 'Agate Adventure'
                ][i % 144],
                image: [
                    '/GO01_DragonBallDozer_越200X200.png',
                    '/GO05_ONESTICK FISHING_越200X200.png',
                    '/AT06_水滸劈魚_越南200x200去背.png',
                    '/AT101_Supercar_越200x200去背.png',
                    '/AT102_JungleTreasure_越南200x200_去背.png',
                    '/BT02_BankerDice Bull-Bull_越200X200.png',
                    '/BT03_Peeking Banker Bull-Bull_越200X200.png',
                    '/GB9_Football Fever_越200X200.png',
                    '/GB11_Thai Fish Prawn Crab_越200X200.png',
                    '/GB12_Myeong ryang_越200X200.png',
		    '/GB13_Football FeverM_越200X200.png',
		    '/AT04_雷電戰機_越200x200去背.png',
		    '/AT01_ONESHOT FISHING_越200X200_bg.png',
		    '/AB3_黃金漁場 Paradise_越200X200.png',
		    '/1010.五福jp_vi.png',
		    '/1067.金蛋_jp角標_vi.png',
		    '/1074.聚寶盆jp_vi.png',
		    '/5007_Da Fa Cai_越200X200.png',
		    '/5008_Da Hong Zhong_越200X200.png',
		    '/5009_Uproar in heaven_越200X200.png',
		    '/105_JumpingMobile_越200X200.png',
		    '/111_Fly Out_越200X200.png',
		    '/112_Pyramid Raider_越200X200.png',
		    '/181_MahjongRichWays_越200X200.png',
		    '/216_XocDia_越200X200.png',
		    '/252_WildDiscoNight_越200X200.png',
		    '/253_SungWukong_越200X200.png',
		    '/79.變色龍_越.png',
		    '/80.傳奇海神_vi.png',
		    '/81.金銀島_越.png',
		    '/83.Fire Queen火之女王_vi.png',
		    '/89_BigRedWay_韓128X128_B.png',
		    '/89_Thor_越200X200.png',
		    '/92.2018世界盃_越.png',
		    '/95_世界盃球鞋_vi.png',
		    '/96足球寶貝200_vi.png',
		    '/98世界盃全明星_vi.png'
                ][i % 37],
                provider: ['JILI', 'PG', 'Pragmatic Play', 'NetEnt', 'Microgaming', 'Play\'n GO', 'BTG', 'Yggdrasil', 'Push Gaming', 'Red Tiger'][i % 37]
            }))
        ]
    },
    {
        id: 'live',
        title: 'Live',
        icon: Spade,
        count: 100,
        color: 'text-orange-400',
        games: [
            { id: 'l1', name: 'Crazy Time', image: 'https://v3.fal.media/files/rabbit/2GXI-xlBfTSc04d-2ZCqh_output.png', provider: 'Evolution' },
            { id: 'l2', name: 'Mega Wheel', image: 'https://v3.fal.media/files/monkey/Dll0mczrVKZYCTOigIoLL_output.png', provider: 'Pragmatic Play' },
            { id: 'l3', name: 'Live Roulette', image: 'https://v3.fal.media/files/koala/VeCElJ_VB0Ku6Xmo8Vz4h_output.png', provider: 'Evolution' },
            ...Array.from({ length: 97 }, (_, i) => ({
                id: `l${i + 4}`,
                name: [
                    'Lightning Roulette', 'Dream Catcher', 'Monopoly Live', 'Deal or No Deal', 'Football Studio',
                    'Dragon Tiger', 'Baccarat Squeeze', 'Speed Baccarat', 'Lightning Baccarat', 'No Commission Baccarat',
                    'Blackjack Party', 'Infinite Blackjack', 'Speed Blackjack', 'VIP Blackjack', 'Salon Prive Blackjack',
                    'Casino Hold\'em', 'Caribbean Stud', 'Three Card Poker', 'Ultimate Texas Hold\'em', 'Side Bet City',
                    'Lightning Dice', 'Sic Bo', 'Super Sic Bo', 'Craps Live', 'Mega Ball',
                    'Cash or Crash', 'Gonzo\'s Treasure Hunt', 'Adventures Beyond Wonderland', 'Funky Time', 'Sweet Bonanza Candyland',
                    'Auto Roulette', 'Immersive Roulette', 'Speed Roulette', 'Double Ball Roulette', 'American Roulette',
                    'French Roulette', 'European Roulette', 'VIP Roulette', 'Gold Roulette', 'Diamond Roulette',
                    'Andar Bahar', 'Teen Patti', 'Poker Live', 'Bet on Poker', 'Texas Hold\'em Bonus',
                    'Live Keno', 'Mega Fire Blaze Roulette', 'Quantum Roulette', 'XXXtreme Lightning Roulette', 'Instant Roulette',
                    'Mega Sic Bo', 'Fan Tan', 'Wheel of Fortune', 'Money Wheel', 'Spin a Win',
                    'Live Lottery', 'Bingo Live', 'Keno Live', 'Scratch Cards Live', 'Virtual Sports Live',
                    'Blackjack Classic', 'Blackjack VIP', 'Blackjack Platinum', 'Blackjack Gold', 'Blackjack Silver',
                    'Baccarat Classic', 'Baccarat VIP', 'Baccarat Platinum', 'Baccarat Gold', 'Baccarat Silver',
                    'Roulette Classic', 'Roulette VIP', 'Roulette Platinum', 'Roulette Gold', 'Roulette Silver',
                    'Live Game Show', 'Mega Fortune Live', 'Hall of Gods Live', 'Arabian Nights Live', 'Divine Fortune Live',
                    'Jackpot Live', 'Progressive Jackpot Live', 'Daily Jackpot Live', 'Hourly Jackpot Live', 'Mega Jackpot Live',
                    'Live Dealer Poker', 'Live Dealer Blackjack', 'Live Dealer Roulette', 'Live Dealer Baccarat', 'Live Dealer Sic Bo',
                    'VIP Live Casino', 'High Roller Live', 'Premium Live Casino', 'Exclusive Live Tables', 'Private Live Tables',
                    'Mobile Live Casino', 'HD Live Casino', '4K Live Casino', 'VR Live Casino', '360 Live Casino'
                ][i % 97],
                image: [
                    'https://v3.fal.media/files/rabbit/2GXI-xlBfTSc04d-2ZCqh_output.png',
                    'https://v3.fal.media/files/monkey/Dll0mczrVKZYCTOigIoLL_output.png',
                    'https://v3.fal.media/files/koala/VeCElJ_VB0Ku6Xmo8Vz4h_output.png',
                    'https://v3.fal.media/files/koala/EhxVmzU0Pqk9zvk6p8G5K_output.png',
                    'https://v3.fal.media/files/panda/Y3n9ZFl8RePKuonGulImg_output.png',
                    'https://v3.fal.media/files/elephant/qfLxnZgwR4BWxB98iQlri_output.png',
                    'https://v3.fal.media/files/lion/Xyv0y15d0vP068fqefxTi_output.png',
                    'https://v3.fal.media/files/rabbit/qdpVP77rdxngzKTAT2uk4_output.png',
                    'https://v3.fal.media/files/zebra/Yfq5lsnIUPdueGPNBBIGs_output.png',
                    'https://v3.fal.media/files/tiger/US1z1oBBnUZGRKtXXb86w_output.png'
                ][i % 10],
                provider: ['Evolution', 'Pragmatic Play', 'Ezugi', 'Playtech', 'NetEnt', 'Authentic Gaming', 'Vivo Gaming', 'Asia Gaming', 'SA Gaming', 'Sexy Gaming'][i % 10]
            }))
        ]
    },
    {
        id: 'esports',
        title: 'E-sports',
        icon: Gamepad2,
        count: 2,
        color: 'text-orange-400',
        games: [
            { id: 'es1', name: 'TF Gaming', image: '/32.通天神探狄仁傑_越.png', provider: 'TF' },
            { id: 'es2', name: 'IA E-Sports', image: '/33.火燒連環船_vi.png', provider: 'IA' },
        ]
    },
    {
        id: 'cockfight',
        title: 'Cockfight',
        icon: Bird,
        count: 1,
        color: 'text-orange-500',
        games: [
            { id: 'cf1', name: 'SV388', image: '/34地鼠戰役200X200_vi.png', provider: 'Venus' },
        ]
    },
    {
        id: 'poker',
        title: 'Poker',
        icon: Club,
        count: 100,
        color: 'text-orange-400',
        games: [
            { id: 'pk1', name: 'Andar Bahar', image: 'https://v3.fal.media/files/penguin/4h35WftNO-_GdhZusBMWQ_output.png', provider: 'JILI' },
            { id: 'pk2', name: '7 Up 7 Down', image: 'https://v3.fal.media/files/penguin/cWeb1Nu0nz79XOQzC1lRV_output.png', provider: 'KingMaker' },
            { id: 'pk3', name: 'Rummy', image: 'https://v3.fal.media/files/penguin/8bEOMfjhp6GRTLreMg1ID_output.png', provider: 'JILI' },
            { id: 'pk4', name: 'Jogo do Bozo', image: 'https://v3.fal.media/files/elephant/ILkEO6gBUSCsrh9b-bBtH_output.png', provider: 'KingMaker' },
            ...Array.from({ length: 96 }, (_, i) => ({
                id: `pk${i + 5}`,
                name: [
                    'Texas Hold\'em', 'Omaha Poker', 'Seven Card Stud', 'Five Card Draw', 'Razz Poker',
                    'Pineapple Poker', 'Crazy Pineapple', 'Short Deck Poker', 'Chinese Poker', 'Open Face Chinese',
                    'Caribbean Stud Poker', 'Three Card Poker', 'Four Card Poker', 'Pai Gow Poker', 'Let It Ride',
                    'Casino Hold\'em', 'Ultimate Texas Hold\'em', 'Texas Hold\'em Bonus', 'Poker Pursuit', 'Red Dog Poker',
                    'Teen Patti', 'Teen Patti Gold', 'Teen Patti Master', 'Teen Patti Live', 'Teen Patti Pro',
                    'Rummy Circle', 'Rummy Gold', 'Rummy Master', 'Rummy Pro', 'Gin Rummy',
                    'Indian Rummy', 'Points Rummy', 'Pool Rummy', 'Deals Rummy', '13 Card Rummy',
                    '21 Card Rummy', 'Rummy 500', 'Canasta', 'Kalooki', 'Oklahoma Gin',
                    'Blackjack Switch', 'Spanish 21', 'Pontoon', 'Double Exposure', 'Super Fun 21',
                    'Baccarat', 'Mini Baccarat', 'Punto Banco', 'Chemin de Fer', 'Baccarat Banque',
                    'Dragon Tiger', 'War', 'In Between', 'Acey Deucey', 'Red or Black',
                    'Hi-Lo', 'High Card Flush', 'Mississippi Stud', 'DJ Wild', 'Jacks or Better',
                    'Deuces Wild', 'Joker Poker', 'Aces and Faces', 'Tens or Better', 'Bonus Poker',
                    'Double Bonus Poker', 'Double Double Bonus', 'Triple Bonus Poker', 'All American Poker', 'Megapoker',
                    'Poker Dice', 'Liar\'s Dice', 'Yahtzee Poker', 'Baloot', 'Tarneeb',
                    'Trix', 'Hand', 'Kout Bo 6', '400', 'Estimation',
                    'Spades', 'Hearts', 'Bridge', 'Whist', 'Euchre',
                    'Pinochle', 'Cribbage', 'Gin', 'Knock Rummy', 'Conquian',
                    'Buraco', 'Burraco', 'Scala 40', 'Ramino', 'Machiavelli',
                    'Tute', 'Mus', 'Chinchón', 'Continental Rummy', 'Liverpool Rummy',
                    'Shanghai Rummy', 'Contract Rummy', 'Progressive Rummy', 'Dummy Rummy', 'Kaluki'
                ][i % 96],
                image: [
                    'https://v3.fal.media/files/penguin/4h35WftNO-_GdhZusBMWQ_output.png',
                    'https://v3.fal.media/files/penguin/cWeb1Nu0nz79XOQzC1lRV_output.png',
                    'https://v3.fal.media/files/penguin/8bEOMfjhp6GRTLreMg1ID_output.png',
                    'https://v3.fal.media/files/elephant/ILkEO6gBUSCsrh9b-bBtH_output.png',
                    'https://v3.fal.media/files/koala/EhxVmzU0Pqk9zvk6p8G5K_output.png',
                    'https://v3.fal.media/files/panda/Y3n9ZFl8RePKuonGulImg_output.png',
                    'https://v3.fal.media/files/lion/Xyv0y15d0vP068fqefxTi_output.png',
                    'https://v3.fal.media/files/rabbit/qdpVP77rdxngzKTAT2uk4_output.png',
                    'https://v3.fal.media/files/zebra/Yfq5lsnIUPdueGPNBBIGs_output.png',
                    'https://v3.fal.media/files/tiger/US1z1oBBnUZGRKtXXb86w_output.png'
                ][i % 10],
                provider: ['JILI', 'KingMaker', 'Pragmatic Play', 'Evolution', 'Ezugi', 'Playtech', 'NetEnt', 'Microgaming', 'Play\'n GO', 'Red Tiger'][i % 10]
            }))
        ]
    },
    {
        id: 'fish',
        title: 'Fish',
        icon: Fish,
        count: 100,
        color: 'text-orange-500',
        games: [
            { id: 'f1', name: 'Fortune King', image: 'https://v3.fal.media/files/tiger/fxGXhvVyUzh7XBkPkrLOk_output.png', provider: 'JILI' },
            { id: 'f2', name: 'Jackpot Fishing', image: 'https://v3.fal.media/files/kangaroo/Ok1Pi6_uTGoThL7eivq90_output.png', provider: 'JILI' },
            { id: 'f3', name: 'Fortune Zombie', image: 'https://v3.fal.media/files/penguin/VTYYyOoJHSasqapk8hPr3_output.png', provider: 'JILI' },
            { id: 'f4', name: 'Happy Fishing', image: 'https://v3.fal.media/files/rabbit/aLEXMOKgAiZv66Qq8zAVc_output.png', provider: 'JILI' },
            ...Array.from({ length: 96 }, (_, i) => ({
                id: `f${i + 5}`,
                name: [
                    'Ocean King', 'Fish Hunter', 'Fishing War', 'Fishing God', 'Mega Fishing',
                    'Dragon Fortune Fish', 'Phoenix Fishing', 'Golden Toad Fishing', 'Dinosaur Tycoon', 'Alien Hunter',
                    'Bombing Fishing', 'Cai Shen Fishing', 'Dragon King Fishing', 'Fishing Disco', 'Fishing Frenzy',
                    'Fishing Master', 'Fishing Mania', 'Fishing Paradise', 'Fishing Party', 'Fishing Saga',
                    'Fishing Tycoon', 'Fishing World', 'Fortune Fishing', 'Golden Fish', 'Happy Fish',
                    'Jackpot Fish', 'King of Fishing', 'Lucky Fishing', 'Mega Fish', 'Monster Fishing',
                    'Ocean Adventure', 'Ocean Hunter', 'Ocean Paradise', 'Ocean Treasure', 'Phoenix Realm',
                    'Pirate Fishing', 'Royal Fishing', 'Sea King', 'Sea Monster', 'Shark Attack',
                    'Super Fishing', 'Thunder Dragon', 'Tiger Strike', 'Treasure Fish', 'Underwater World',
                    'Wild Shark', 'Fish Catch', 'Fish Shooting', 'Fish Table', 'Arcade Fishing',
                    'Big Fish', 'Deep Sea', 'Fish Game', 'Fish Hunt', 'Fish Kingdom',
                    'Fish Legend', 'Fish Ocean', 'Fish Quest', 'Fish Realm', 'Fish Rush',
                    'Fish Storm', 'Fish Strike', 'Fish War', 'Fish Zone', 'Golden Dragon Fish',
                    'Golden Fish Tank', 'Golden Ocean', 'Golden Sea', 'Golden Shark', 'Golden Whale',
                    'Mega Ocean', 'Mega Sea', 'Mega Shark', 'Mega Whale', 'Monster Hunter',
                    'Monster Ocean', 'Monster Sea', 'Ocean Boss', 'Ocean Champion', 'Ocean Dragon',
                    'Ocean Emperor', 'Ocean Fortune', 'Ocean Gold', 'Ocean Jackpot', 'Ocean King 2',
                    'Ocean King 3', 'Ocean Legend', 'Ocean Master', 'Ocean Plus', 'Ocean Star',
                    'Phoenix Fish', 'Phoenix Ocean', 'Phoenix Sea', 'Pirate Ocean', 'Pirate Sea',
                    'Royal Ocean', 'Royal Sea', 'Sea Adventure', 'Sea Boss', 'Sea Champion'
                ][i % 96],
                image: [
                    'https://v3.fal.media/files/tiger/fxGXhvVyUzh7XBkPkrLOk_output.png',
                    'https://v3.fal.media/files/kangaroo/Ok1Pi6_uTGoThL7eivq90_output.png',
                    'https://v3.fal.media/files/penguin/VTYYyOoJHSasqapk8hPr3_output.png',
                    'https://v3.fal.media/files/rabbit/aLEXMOKgAiZv66Qq8zAVc_output.png',
                    'https://v3.fal.media/files/koala/EhxVmzU0Pqk9zvk6p8G5K_output.png',
                    'https://v3.fal.media/files/panda/Y3n9ZFl8RePKuonGulImg_output.png',
                    'https://v3.fal.media/files/elephant/qfLxnZgwR4BWxB98iQlri_output.png',
                    'https://v3.fal.media/files/lion/Xyv0y15d0vP068fqefxTi_output.png',
                    'https://v3.fal.media/files/zebra/Yfq5lsnIUPdueGPNBBIGs_output.png',
                    'https://v3.fal.media/files/monkey/Dll0mczrVKZYCTOigIoLL_output.png'
                ][i % 10],
                provider: ['JILI', 'JDB', 'CQ9', 'KA Gaming', 'Spadegaming', 'PlayStar', 'Funky Games', 'YGG', 'Habanero', 'SimplePlay'][i % 10]
            }))
        ]
    },
    {
        id: 'lottery',
        title: 'Lottery',
        icon: Ticket,
        count: 1,
        color: 'text-orange-400',
        games: [
            { id: 'lt1', name: 'TC Gaming', image: '/35.瘋狂哪吒_越.png', provider: 'TC Gaming' },
        ]
    },
];

const GameCard = ({ game, sectionId }: { game: Game; sectionId: string }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const router = useRouter();

    // Instant authentication check using localStorage (no API delay)
    const isAuthenticated = () => {
        if (typeof window === 'undefined') return false;
        const token = localStorage.getItem('bearer_token');
        return !!token;
    };

    const handleGameClick = () => {
        // Instant check - no delay
        if (!isAuthenticated()) {
            toast.info("Please login to play games");
            router.push('/login');
            return;
        }

        // User is logged in
        toast.success(`Launching ${game.name}...`);
    };

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!isAuthenticated()) {
            toast.info("Please login to add favorites");
            router.push('/login');
            return;
        }

        setIsFavorite(!isFavorite);
        toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
    };

    return (
        <div
            className="relative group flex-shrink-0 w-28 md:w-32 cursor-pointer"
            onClick={handleGameClick}
        >
            <div className="relative overflow-hidden rounded-xl border border-border bg-card aspect-[3/4]">
                <Image
                    src={game.image}
                    alt={game.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                {/* Automatic Flash/Shine Animation Effect */}
                <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                    <div
                        className="absolute top-0 left-0 w-full h-full animate-card-shine"
                        style={{
                            background: 'linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)',
                        }}
                    />
                </div>

                {/* Provider Logo / Name */}
                <div className="absolute bottom-2 left-0 right-0 text-center">
                    {game.provider && (
                        <span className="text-[10px] font-bold text-white/90 uppercase tracking-wider drop-shadow-md">
                            {game.provider}
                        </span>
                    )}
                </div>

                {/* Favorite Button */}
                <button
                    onClick={handleFavoriteClick}
                    className="absolute top-1.5 right-1.5 p-1.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm transition-colors z-10"
                >
                    <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-white text-white' : 'text-white'}`} />
                </button>

                {/* Tag (e.g. 10000X) */}
                {game.tag && (
                    <div className="absolute top-0 left-0 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-br-lg shadow-sm z-10">
                        {game.tag}
                    </div>
                )}
            </div>

            {/* Game Name */}
            <div className="mt-1.5 text-center">
                <h3 className="text-xs font-medium text-foreground line-clamp-1 leading-tight">
                    {game.name}
                </h3>
            </div>

            {/* CSS Animation */}
            <style jsx>{`
                @keyframes card-shine {
                    0% {
                        transform: translateX(-100%) skewX(-15deg);
                    }
                    100% {
                        transform: translateX(200%) skewX(-15deg);
                    }
                }
                .animate-card-shine {
                    animation: card-shine 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

const SectionHeader = ({
    title,
    icon: Icon,
    count,
    color,
    sectionId,
    scrollContainerRef
}: {
    title: string;
    icon: any;
    count: number;
    color: string;
    sectionId: string;
    scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}) => {
    const router = useRouter();

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    const handleViewAll = () => {
        router.push(`/en/category/${sectionId}`);
    };

    return (
        <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
                <Icon className={`w-5 h-5 ${color}`} />
                <h2 className="text-lg font-bold text-foreground">{title}</h2>
            </div>
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-3 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 text-xs font-bold rounded-full"
                    onClick={handleViewAll}
                >
                    All {count}
                </Button>
                <div className="flex gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-full bg-accent hover:bg-accent/80 text-muted-foreground"
                        onClick={scrollLeft}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-full bg-orange-500 hover:bg-orange-600 text-white"
                        onClick={scrollRight}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default function LobbyContent() {
    // Create refs for each category's scroll container using useMemo
    const scrollRefs = useMemo(() => {
        const refs: { [key: string]: React.RefObject<HTMLDivElement | null> } = {};
        categories.forEach((category) => {
            refs[category.id] = createRef<HTMLDivElement>();
        });
        return refs;
    }, []);

    return (
        <div className="space-y-8 pb-20">
            {categories.map((category) => {
                const scrollRef = scrollRefs[category.id];

                return (
                    <section key={category.id} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <SectionHeader
                            title={category.title}
                            icon={category.icon}
                            count={category.count}
                            color={category.color}
                            sectionId={category.id}
                            scrollContainerRef={scrollRef}
                        />

                        <div
                            ref={scrollRef}
                            className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide"
                            style={{
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none',
                                WebkitOverflowScrolling: 'touch'
                            }}
                        >
                            {category.games.map((game) => (
                                <GameCard key={game.id} game={game} sectionId={category.id} />
                            ))}
                        </div>
                    </section>
                );
            })}
        </div>
    );
}
