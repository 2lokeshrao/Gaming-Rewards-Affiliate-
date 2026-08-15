import React, { useState, useEffect } from 'react';
import { WinnerTickerItem } from '../types';
import { Trophy, X } from 'lucide-react';

interface LiveWinnersTickerProps {
  initialWinners: WinnerTickerItem[];
  enabled: boolean;
}

export const LiveWinnersTicker: React.FC<LiveWinnersTickerProps> = ({ initialWinners, enabled }) => {
  const [currentWinner, setCurrentWinner] = useState<WinnerTickerItem | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled || initialWinners.length === 0) return;

    let index = 0;

    const showNext = () => {
      setCurrentWinner(initialWinners[index % initialWinners.length]);
      setVisible(true);

      // Hide toast after 4.5 seconds
      setTimeout(() => {
        setVisible(false);
      }, 4500);

      index++;
    };

    // First show after 3 seconds
    const timer = setTimeout(showNext, 3000);

    // Loop every 9 seconds
    const interval = setInterval(showNext, 9000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [enabled, initialWinners]);

  if (!enabled || !currentWinner || !visible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-40 max-w-xs sm:max-w-sm bg-slate-900/95 border border-purple-500/40 rounded-2xl p-3 shadow-2xl shadow-purple-950/80 backdrop-blur-md text-white animate-slideUp transition-all duration-300">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center shrink-0 shadow-md">
          <Trophy className="w-5 h-5 text-slate-950 fill-slate-950" />
        </div>

        <div className="flex-1 pr-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400  inline-block" /> LIVE PAYOUT
            </span>
            <span>{currentWinner.timeAgo}</span>
          </div>

          <div className="text-xs font-bold text-slate-200 mt-0.5">
            {currentWinner.flagEmoji} {currentWinner.userName} from {currentWinner.country}
          </div>

          <div className="text-xs font-extrabold text-amber-300 mt-0.5">
            Won <span className="text-white underline">{currentWinner.amount}</span> on {currentWinner.platformName}!
          </div>
        </div>

        <button
          onClick={() => setVisible(false)}
          className="text-slate-500 hover:text-slate-300 p-1"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
