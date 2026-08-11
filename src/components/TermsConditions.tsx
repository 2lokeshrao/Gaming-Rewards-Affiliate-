import React from 'react';

export const TermsConditions: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 py-12 px-4 font-sans">
      <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <h1 className="text-3xl font-black text-white mb-6">Terms & Conditions</h1>
        <p className="mb-4">Last Updated: {new Date().toLocaleDateString()}</p>
        
        <div className="space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-slate-100 mb-2">1. Agreement to Terms</h2>
            <p>These Terms of Use constitute a legally binding agreement made between you and BonusPromoCode.in concerning your access to and use of the website.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-100 mb-2">2. Nature of the Website</h2>
            <p>BonusPromoCode.in is an independent affiliate promotional portal. We provide reviews, bonus codes, and informational content regarding third-party gaming and sports platforms. We are not an operator of gaming or gambling services.</p>
            <p className="mt-2 text-amber-400 font-semibold">Important: Users must be 18 years of age or older to use any services linked from this website. Please gamble responsibly.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-100 mb-2">3. Third-Party Links & Offers</h2>
            <p>The Site contains links to other websites ("Third-Party Websites") as well as articles, photographs, text, graphics, pictures, designs, video, information, and applications originating from third parties. Such Third-Party Websites and Third-Party Content are not investigated, monitored, or checked for accuracy, appropriateness, or completeness by us.</p>
            <p className="mt-2 text-slate-400">We are not responsible for any promotions, deposits, withdrawals, or issues you may face on third-party platforms. Any disputes must be handled directly with the respective platform operator.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-100 mb-2">4. Disclaimer</h2>
            <p>The information provided on the site is for general informational purposes only. We make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.</p>
          </section>

          <div className="mt-8 pt-6 border-t border-slate-800">
            <a href="/" onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); }} className="text-amber-400 hover:text-amber-300 font-bold">&larr; Back to Home</a>
          </div>
        </div>
      </div>
    </div>
  );
};
