"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { XIcon, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface AnnouncementSlide {
  id: number;
  image?: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink?: string;
}

export function AnnouncementDialog() {
  const [open, setOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [announcementSlides, setAnnouncementSlides] = useState<AnnouncementSlide[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch announcements from API
  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/announcements');
      if (res.ok) {
        const data = await res.json();
        if (data.announcements && data.announcements.length > 0) {
          setAnnouncementSlides(data.announcements.map((a: any) => ({
            id: a.id,
            image: a.imageUrl,
            title: a.title,
            description: a.description,
            buttonText: a.buttonText,
            buttonLink: a.buttonLink,
          })));
        }
      }
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();

    // Poll for updates every 30 seconds
    const interval = setInterval(fetchAnnouncements, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (loading || announcementSlides.length === 0) return;

    // Check if user has already seen the announcement today
    const lastSeen = localStorage.getItem("announcement_last_seen");
    const today = new Date().toDateString();

    if (lastSeen !== today) {
      // Show announcement after a short delay
      const timer = setTimeout(() => {
        setOpen(true);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [loading, announcementSlides]);

  const handleClose = () => {
    setOpen(false);
    // Store that user has seen the announcement today
    localStorage.setItem("announcement_last_seen", new Date().toDateString());
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % announcementSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? announcementSlides.length - 1 : prev - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const currentAnnouncement = announcementSlides[currentSlide];

  // Don't render if no announcements or still loading
  if (loading || !currentAnnouncement) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="max-w-[90vw] sm:max-w-lg md:max-w-xl p-0 gap-0 bg-[#2a2a2a] border-[#444] overflow-hidden"
        showCloseButton={false}
      >
        {/* Header */}
        <div className="relative flex items-center justify-center py-4 px-6 border-b border-[#444]">
          <DialogTitle className="text-white text-xl font-bold">
            Announcement
          </DialogTitle>
          <button
            onClick={handleClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="relative">
          {/* Slide Content */}
          <div className="p-6 pb-4">
            {/* Promotional Image */}
            <div className="relative w-full aspect-[16/9] sm:aspect-[2/1] mb-6 rounded-lg overflow-hidden bg-gradient-to-br from-purple-600 via-pink-600 to-red-600">
              <div className="absolute inset-0 flex items-center justify-center text-white">
                {/* Placeholder for promotional image */}
                <div className="text-center p-4">
                  <div className="text-4xl sm:text-5xl font-bold mb-2 text-yellow-400">
                    JK222
                  </div>
                  <div className="text-xl sm:text-2xl font-bold">
                    {currentAnnouncement.title}
                  </div>
                </div>
              </div>
            </div>

            {/* Title & Description */}
            <div className="mb-6">
              <h3 className="text-yellow-400 text-xl sm:text-2xl font-bold mb-3 text-center">
                {currentAnnouncement.title}
              </h3>
              <p className="text-white/90 text-sm sm:text-base leading-relaxed text-center">
                {currentAnnouncement.description}
              </p>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => {
                if (currentAnnouncement.buttonLink) {
                  window.location.href = currentAnnouncement.buttonLink;
                }
                handleClose();
              }}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] text-base sm:text-lg"
            >
              {currentAnnouncement.buttonText}
            </button>
          </div>

          {/* Navigation Arrows */}
          {announcementSlides.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Slide Indicators */}
        {announcementSlides.length > 1 && (
          <div className="flex items-center justify-center gap-2 py-4 bg-[#2a2a2a]">
            {announcementSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide
                  ? "w-8 bg-white"
                  : "w-2 bg-white/40 hover:bg-white/60"
                  }`}
              />
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
