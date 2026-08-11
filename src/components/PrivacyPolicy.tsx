import React from 'react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 py-12 px-4 font-sans">
      <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <h1 className="text-3xl font-black text-white mb-6">Privacy Policy</h1>
        <p className="mb-4">Last Updated: {new Date().toLocaleDateString()}</p>
        
        <div className="space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-slate-100 mb-2">1. Introduction</h2>
            <p>Welcome to BonusPromoCode.in. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-100 mb-2">2. Information We Collect</h2>
            <p>We may collect information about you in a variety of ways, including:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-400">
              <li><strong>Personal Data:</strong> We may collect your email address if you voluntarily submit it to us through forms or email checkers on our site.</li>
              <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the site, such as your IP address, browser type, operating system, and access times.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-100 mb-2">3. Use of Your Information</h2>
            <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. We may use information collected about you via the Site to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-400">
              <li>Deliver targeted advertising, coupons, newsletters, and other information regarding promotions.</li>
              <li>Monitor and analyze usage and trends to improve your experience with the Site.</li>
              <li>Compile anonymous statistical data and analysis for use internally or with third parties.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-100 mb-2">4. Third-Party Websites</h2>
            <p>The Site may contain links to third-party websites and applications of interest, including advertisements and external services, that are not affiliated with us. Once you have used these links to leave the Site, any information you provide to these third parties is not covered by this Privacy Policy.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-100 mb-2">5. Cookies and Tracking Technologies</h2>
            <p>We may use cookies, web beacons, tracking pixels, and other tracking technologies on the Site to help customize the Site and improve your experience. When you access the Site, your personal information is not collected through the use of tracking technology.</p>
          </section>
          
          <div className="mt-8 pt-6 border-t border-slate-800">
            <a href="/" onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); }} className="text-amber-400 hover:text-amber-300 font-bold">&larr; Back to Home</a>
          </div>
        </div>
      </div>
    </div>
  );
};
