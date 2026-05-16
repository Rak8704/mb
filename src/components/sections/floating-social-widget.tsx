"use client";

import { useState, useEffect } from 'react';
import { MessageCircle, X, Phone, Send, Facebook, Headphones, Move } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SocialContact {
  id: number;
  platform: string;
  label: string;
  value: string;
  iconColor: string;
  displayOrder: number;
}

export const FloatingSocialWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [contacts, setContacts] = useState<SocialContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/social-contacts');
      const data = await response.json();
      if (data.contacts) {
        setContacts(data.contacts);
      }
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'whatsapp':
        return <MessageCircle className="w-6 h-6" />;
      case 'telegram':
        return <Send className="w-6 h-6" />;
      case 'facebook':
        return <Facebook className="w-6 h-6" />;
      case 'support':
        return <Headphones className="w-6 h-6" />;
      default:
        return <Phone className="w-6 h-6" />;
    }
  };

  const handleContactClick = (contact: SocialContact) => {
    let url = contact.value;
    
    if (contact.platform === 'whatsapp') {
      const phoneNumber = contact.value.replace(/[^0-9]/g, '');
      url = `https://wa.me/${phoneNumber}`;
    } else if (contact.platform === 'telegram' && !contact.value.startsWith('http')) {
      url = `https://t.me/${contact.value.replace('@', '')}`;
    } else if (contact.platform === 'support' && contact.value.startsWith('+')) {
      url = `tel:${contact.value}`;
    }
    
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (isLoading) {
    return null;
  }

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.2}
      dragConstraints={{
        top: -window.innerHeight + 200,
        left: -window.innerWidth + 200,
        right: window.innerWidth - 200,
        bottom: window.innerHeight - 200,
      }}
      className="fixed bottom-24 right-6 z-[9999] cursor-grab active:cursor-grabbing"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="mb-4 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
            style={{ width: '280px' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary/20 to-secondary/20 px-4 py-3 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Move className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <h3 className="font-semibold text-foreground">Contact Us</h3>
                    <p className="text-xs text-muted-foreground">Drag to move</p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Contact List */}
            <div className="p-3 space-y-2 max-h-96 overflow-y-auto">
              {contacts.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No contacts available
                </p>
              ) : (
                contacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleContactClick(contact);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-accent transition-all duration-200 group"
                  >
                    <div
                      className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: contact.iconColor }}
                    >
                      {getIcon(contact.platform)}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-foreground text-sm">
                        {contact.label}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {contact.value}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-muted/20 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                Available 24/7 for support
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-2xl flex items-center justify-center hover:shadow-primary/50 transition-shadow relative group pointer-events-auto"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-7 h-7" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-7 h-7" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Drag hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute -top-10 left-1/2 -translate-x-1/2 bg-card border border-border px-3 py-1.5 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg"
        >
          <Move className="w-3 h-3 inline mr-1" />
          Drag to move
        </motion.div>
      </motion.button>
    </motion.div>
  );
};