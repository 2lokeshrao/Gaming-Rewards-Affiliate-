import React from 'react';
import { GlobalConfig } from '../types';
import { Send, Instagram, Video, MessageSquare, Youtube, ExternalLink } from 'lucide-react';

interface SocialMediaBarProps {
  config: GlobalConfig;
  variant?: 'header' | 'footer' | 'banner';
}

export const SocialMediaBar: React.FC<SocialMediaBarProps> = ({ config, variant = 'header' }) => {
  const hasSocials = config.telegramUrl || config.instagramUrl || config.tiktokUrl || config.whatsappGroupUrl || config.youtubeUrl;

  if (!hasSocials) return null;

  if (variant === 'banner') {
    return (
      <div className="bg-gradient-to-r from-slate-950 via-purple-950/90 to-slate-950 border-y border-purple-500/30 py-2.5 px-3 sm:px-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-2.5 text-center lg:text-left">
          <div className="shrink-0">
            <span className="text-[11px] sm:text-xs font-black text-amber-400 uppercase tracking-wider block">
              💬 JOIN OUR OFFICIAL VIP GAMING CHANNELS
            </span>
            <p className="text-slate-300 text-[11px] sm:text-xs font-medium">
              Get daily secret promo codes, aviator signal updates, and exclusive cashback deals!
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-center lg:justify-end max-w-full py-1">
            {config.telegramUrl && (
              <a
                href={config.telegramUrl}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-300 text-[11px] sm:text-xs font-extrabold flex items-center gap-1.5 transition-all hover:scale-105 shrink-0 whitespace-nowrap"
              >
                <Send className="w-3.5 h-3.5 text-sky-400" />
                <span>Telegram Channel</span>
              </a>
            )}

            {config.whatsappGroupUrl && (
              <a
                href={config.whatsappGroupUrl}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-[11px] sm:text-xs font-extrabold flex items-center gap-1.5 transition-all hover:scale-105 shrink-0 whitespace-nowrap"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp VIP Group</span>
              </a>
            )}

            {config.instagramUrl && (
              <a
                href={config.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/40 text-pink-300 text-[11px] sm:text-xs font-extrabold flex items-center gap-1.5 transition-all hover:scale-105 shrink-0 whitespace-nowrap"
              >
                <Instagram className="w-3.5 h-3.5 text-pink-400" />
                <span>Instagram</span>
              </a>
            )}

            {config.tiktokUrl && (
              <a
                href={config.tiktokUrl}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-[11px] sm:text-xs font-extrabold flex items-center gap-1.5 transition-all hover:scale-105 shrink-0 whitespace-nowrap"
              >
                <Video className="w-3.5 h-3.5 text-cyan-400" />
                <span>TikTok</span>
              </a>
            )}

            {config.youtubeUrl && (
              <a
                href={config.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 text-[11px] sm:text-xs font-extrabold flex items-center gap-1.5 transition-all hover:scale-105 shrink-0 whitespace-nowrap"
              >
                <Youtube className="w-3.5 h-3.5 text-red-400" />
                <span>YouTube</span>
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2 flex-wrap max-w-full">
      {config.telegramUrl && (
        <a
          href={config.telegramUrl}
          target="_blank"
          rel="noreferrer"
          title="Official Telegram Channel"
          className="p-2 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-400 transition-all hover:scale-105"
        >
          <Send className="w-4 h-4" />
        </a>
      )}

      {config.whatsappGroupUrl && (
        <a
          href={config.whatsappGroupUrl}
          target="_blank"
          rel="noreferrer"
          title="WhatsApp VIP Group"
          className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 transition-all hover:scale-105"
        >
          <MessageSquare className="w-4 h-4" />
        </a>
      )}

      {config.instagramUrl && (
        <a
          href={config.instagramUrl}
          target="_blank"
          rel="noreferrer"
          title="Instagram Page"
          className="p-2 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-pink-400 transition-all hover:scale-105"
        >
          <Instagram className="w-4 h-4" />
        </a>
      )}

      {config.tiktokUrl && (
        <a
          href={config.tiktokUrl}
          target="_blank"
          rel="noreferrer"
          title="TikTok Official"
          className="p-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 transition-all hover:scale-105"
        >
          <Video className="w-4 h-4" />
        </a>
      )}

      {config.youtubeUrl && (
        <a
          href={config.youtubeUrl}
          target="_blank"
          rel="noreferrer"
          title="YouTube Channel"
          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 transition-all hover:scale-105"
        >
          <Youtube className="w-4 h-4" />
        </a>
      )}
    </div>
  );
};
