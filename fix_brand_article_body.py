import re

with open('src/components/BrandArticlePage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# We need to find where the article content is rendered and replace it with a comprehensive long-form article.
# Let's search for the main article wrapper.
pattern = r'(<article className="prose prose-invert max-w-none">.*?)</article>'

new_article = '''<article className="prose prose-invert max-w-none lg:prose-lg">
                <h2>{platform.name} Review & Promo Code for {geoContext.country}</h2>
                <p>Welcome to the ultimate guide for <strong>{platform.name}</strong>. If you are looking for the best online gaming experience in {geoContext.country}, combined with the highest welcome bonus available, you are in the right place. By using our exclusive promo code <strong>{platform.promoCode}</strong>, new users can instantly claim a massive {localizedBonus}.</p>
                
                <div className="bg-slate-800/50 border border-amber-500/30 p-6 rounded-2xl my-8">
                  <h3 className="text-amber-400 mt-0">Exclusive {new Date().getFullYear()} Offer</h3>
                  <p className="mb-0">Use promo code <strong>{platform.promoCode}</strong> during your registration to unlock your welcome package. This offer is verified and active as of {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.</p>
                </div>

                <h3>Why Choose {platform.name}?</h3>
                <p>{platform.name} has established itself as a premier destination for players globally, offering an expansive selection of casino games, live dealer rooms, and sports betting options. The platform is renowned for its user-friendly interface, robust security measures, and commitment to fair play.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 not-prose">
                  <div className="bg-emerald-950/20 border border-emerald-900/50 p-5 rounded-xl">
                    <h4 className="text-emerald-400 font-bold mb-3 flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Pros</h4>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-start gap-2"><ArrowRight className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" /> Massive {localizedBonus} Welcome Bonus</li>
                      <li className="flex items-start gap-2"><ArrowRight className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" /> Supports local {geoContext.payment} & Crypto</li>
                      <li className="flex items-start gap-2"><ArrowRight className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" /> Instant deposits & rapid withdrawals</li>
                      <li className="flex items-start gap-2"><ArrowRight className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" /> 24/7 Live Customer Support</li>
                    </ul>
                  </div>
                  <div className="bg-rose-950/20 border border-rose-900/50 p-5 rounded-xl">
                    <h4 className="text-rose-400 font-bold mb-3 flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Cons</h4>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-start gap-2"><ArrowRight className="w-4 h-4 mt-0.5 text-rose-500 shrink-0" /> KYC verification required for large withdrawals</li>
                      <li className="flex items-start gap-2"><ArrowRight className="w-4 h-4 mt-0.5 text-rose-500 shrink-0" /> Bonus wagering requirements apply</li>
                    </ul>
                  </div>
                </div>

                <h3>How to Claim the {platform.promoCode} Promo Code</h3>
                <ol>
                  <li><strong>Visit the Official Site:</strong> Click our secure link to visit the official {platform.name} website.</li>
                  <li><strong>Create an Account:</strong> Click on the 'Registration' button. You can usually sign up via email, phone number, or social networks.</li>
                  <li><strong>Enter the Promo Code:</strong> In the registration form, find the 'Promo Code' field and carefully type or paste <strong>{platform.promoCode}</strong>.</li>
                  <li><strong>Make a Deposit:</strong> Choose your preferred payment method (like {geoContext.payment} or Crypto) and make your first qualifying deposit.</li>
                  <li><strong>Enjoy Your Bonus:</strong> Your account will be instantly credited with the {localizedBonus} match bonus!</li>
                </ol>

                <h3>Payment Methods & Withdrawal Speed</h3>
                <p>One of the strongest advantages of {platform.name} is its cashier system. Deposits are entirely free of charge and processed instantly. When it comes to withdrawing your winnings, speed is a priority.</p>
                <ul>
                  <li><strong>Local Methods ({geoContext.payment}):</strong> Deposits are instant. Withdrawals typically process within 15 to 30 minutes during business hours.</li>
                  <li><strong>Cryptocurrency (USDT, BTC, ETH):</strong> Completely anonymous and processed within 5 to 15 minutes, 24/7.</li>
                  <li><strong>E-Wallets & Cards:</strong> Standard processing times apply, usually 1-3 business days for bank cards.</li>
                </ul>
                <p><em>Note: For your first withdrawal, you may be asked to complete a quick identity verification (KYC) process to ensure account security.</em></p>

                <h3>Who Should Use {platform.name}?</h3>
                <p>If you are a player who values massive bonuses, a huge variety of games, and fast payouts, {platform.name} is an excellent choice. It perfectly balances a premium casino experience with a comprehensive sportsbook. Whether you are a casual player or a high roller, the VIP program and ongoing promotions ensure consistent value.</p>
                
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 mt-10">
                  <h4 className="text-sm text-slate-400 uppercase tracking-wider mb-2 font-bold">Responsible Gambling Disclaimer</h4>
                  <p className="text-xs text-slate-500 mb-0 leading-relaxed">Online gambling should be entertaining and done responsibly. Only wager what you can afford to lose. You must be 18+ (or the legal age in your jurisdiction) to participate. If you feel you have a gambling problem, please seek help from organizations like BeGambleAware. Welcome bonuses are subject to terms and conditions, including wagering requirements. Information on this page is for educational purposes.</p>
                </div>
              </article>'''

content = re.sub(pattern, new_article, content, count=1, flags=re.DOTALL)

with open('src/components/BrandArticlePage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
