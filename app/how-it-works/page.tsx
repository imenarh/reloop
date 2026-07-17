import Link from 'next/link';

export default function HowItWorks() {
  return (
    <>

<header>
  <nav>
    <Link href="/" className="logo"><span className="dot"></span>ReLoop</Link>

    <div className="search-bar">
      <div className="search-input-wrap">
        <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input type="text" className="search-input" placeholder="Search for items" />
      </div>
    </div>

    <div className="navcta">
      <Link href="/login" className="btn btn-outline btn-sm">Log in</Link>
      <a href="/#shop" className="btn btn-ochre btn-sm">List an item</a>
    </div>
  </nav>

  <div className="category-bar">
    <div className="wrap">
      <a href="/#shop">Women</a>
      <a href="/#shop">Men</a>
      <a href="/#shop">Kids</a>
      <a href="/#shop">Home</a>
      <a href="/#shop">Electronics</a>
      <a href="/#shop">Hobbies &amp; collectibles</a>
    </div>
  </div>
</header>

<div className="trim"></div>

{/* HERO */}
<section className="hero">
  <div className="wrap" style={{ gridTemplateColumns: '1fr' }}>
    <div style={{ maxWidth: '640px' }}>
      <div className="eyebrow">How ReLoop works</div>
      <h1>From your closet<br />to <em>someone else&apos;s</em>, step by step.</h1>
      <p className="lede" style={{ maxWidth: '560px' }}>
        Every listing starts the exact same way. Where it ends up — a buyer&apos;s doorstep or a
        charity partner&apos;s hands — is entirely up to you.
      </p>
    </div>
  </div>
</section>

<div className="trim"></div>

{/* THE TWO PATHS, IN DETAIL */}
<section id="paths">
  <div className="wrap">
    <div className="section-head">
      <div className="eyebrow">Two ways to re-loop</div>
      <h2>Pick your path when you list.</h2>
      <p>Both start with the same three taps. Here&apos;s exactly what happens after that.</p>
    </div>

    <div className="paths">
      <div className="path-card path-sell">
        <div className="path-icon">💰</div>
        <h3>Sell it</h3>
        <p className="desc">You set the price. ReLoop connects you with a buyer, handles tracking, and only releases your money once the sale is confirmed.</p>
        <ul className="step-list">
          <li><span className="step-num">1</span>Take a few clear photos and describe the item honestly — size, condition, any wear.</li>
          <li><span className="step-num">2</span>Set your price and publish the listing. It appears in the relevant category instantly.</li>
          <li><span className="step-num">3</span>A buyer orders and pays for shipping on top of your price — that part is never deducted from you.</li>
          <li><span className="step-num">4</span>You package the item and drop it at a pickup point. The buyer can track it the whole way.</li>
          <li><span className="step-num">5</span>Once the buyer confirms it matches the listing, your full asking price is released to you.</li>
        </ul>
        <div className="loop-note">If an item doesn&apos;t match its description, the buyer can flag it before funds are released — that&apos;s what keeps sellers honest and buyers confident.</div>
      </div>

      <div className="path-card path-donate">
        <div className="path-icon">🤝</div>
        <h3>Donate it</h3>
        <p className="desc">No price, no fees. You're clearing space and someone else is getting something they need.</p>
        <ul className="step-list">
          <li><span className="step-num">1</span>Take the same clear photos, but select &quot;Donate&quot; instead of setting a price.</li>
          <li><span className="step-num">2</span>ReLoop reviews the photos to confirm the item is clean and usable.</li>
          <li><span className="step-num">3</span>Once approved, we match it with one of our charity partners in Kigali.</li>
          <li><span className="step-num">4</span>You drop it at the same pickup point sellers use — no separate process to learn.</li>
          <li><span className="step-num">5</span>We handle delivery to the partner organization. You&apos;ll see which one received it.</li>
        </ul>
        <div className="loop-note">Donated items are never resold by ReLoop or by our partners — they go directly to people who need them.</div>
      </div>
    </div>
  </div>
</section>

<div className="trim"></div>

{/* TRUST / LOGISTICS */}
<section style={{ background: 'var(--paper-dim)' }}>
  <div className="wrap">
    <div className="section-head">
      <div className="eyebrow">The details that make it work</div>
      <h2>Trust isn&apos;t automatic. We build it into every step.</h2>
    </div>

    <div className="info-grid">
      <div className="info-card">
        <div className="path-icon" style={{ background: 'var(--indigo-deep)' }}>🔒</div>
        <h3>Payment protection</h3>
        <p>Money from a sale sits with ReLoop until the buyer confirms the item arrived as described. Sellers never ship into the unknown, and buyers never pay for a surprise.</p>
      </div>
      <div className="info-card">
        <div className="path-icon" style={{ background: 'var(--teal-deep)' }}>📦</div>
        <h3>Tracked shipping</h3>
        <p>Every sold item gets a tracking number the buyer can follow from pickup to delivery. Shipping is paid by the buyer, on top of the item&apos;s price.</p>
      </div>
      <div className="info-card">
        <div className="path-icon" style={{ background: 'var(--clay)' }}>✅</div>
        <h3>Condition checks</h3>
        <p>Donated items are reviewed before they&apos;re routed to a partner, so charities only receive things that are genuinely usable.</p>
      </div>
    </div>
  </div>
</section>

<div className="trim"></div>

{/* FAQ */}
<section>
  <div className="wrap">
    <div className="section-head">
      <div className="eyebrow">Common questions</div>
      <h2>Still wondering about something?</h2>
    </div>

    <div className="faq-list">
      <details className="faq-item">
        <summary>How do I get paid after a sale?</summary>
        <p>Once your buyer confirms the item matches the listing, your full asking price is released to your ReLoop balance, which you can withdraw to mobile money or your bank account.</p>
      </details>
      <details className="faq-item">
        <summary>Can I change a listing from &quot;Sell&quot; to &quot;Donate&quot; later?</summary>
        <p>Yes — as long as no buyer has purchased it yet, you can switch a listing between selling and donating at any time from your dashboard.</p>
      </details>
      <details className="faq-item">
        <summary>Who pays for shipping?</summary>
        <p>The buyer pays shipping on top of the item&apos;s price when they check out. Sellers are never charged for postage, and donations ship for free.</p>
      </details>
      <details className="faq-item">
        <summary>What happens if my donated item isn&apos;t accepted?</summary>
        <p>If an item doesn&apos;t pass our condition check, we&apos;ll let you know why and you can choose to collect it again or dispose of it responsibly.</p>
      </details>
      <details className="faq-item">
        <summary>Which charities does ReLoop work with?</summary>
        <p>Currently Imbuto Foundation, Rwanda Women&apos;s Network, and Caritas Rwanda — all based in Kigali. You can see which partner received your donation from your account.</p>
      </details>
    </div>
  </div>
</section>

{/* FINAL CTA */}
<section className="final-cta">
  <div className="wrap">
    <h2>Ready to clear out your closet?</h2>
    <p>Sell it, give it away, or a bit of both — the choice is yours every time you list.</p>
    <div className="hero-ctas">
      <a href="/#shop" className="btn btn-ochre">Sell an item →</a>
      <a href="/#shop" className="btn btn-teal">Donate an item →</a>
    </div>
  </div>
</section>

{/* FOOTER */}
<footer>
  <div className="wrap">
    <div className="footer-top">
      <div className="footer-brand">
        <div className="logo"><span className="dot"></span>ReLoop</div>
        <p>A Kigali-born marketplace for second-hand clothes, shoes, furniture and accessories — sold or given, your choice.</p>
      </div>
      <div className="footer-col">
        <h4>Marketplace</h4>
        <ul>
          <li><a href="/#shop">Browse listings</a></li>
          <li><a href="/#shop">Sell an item</a></li>
          <li><a href="/#shop">Donate an item</a></li>
          <li><Link href="/how-it-works">How it works</Link></li>
        </ul>
      </div>
      <div className="footer-col">
        <h4>Trust &amp; shipping</h4>
        <ul>
          <li><a href="#">Buyer protection</a></li>
          <li><a href="#">Track a parcel</a></li>
          <li><a href="#">Shipping rates</a></li>
          <li><a href="#">Report an item</a></li>
        </ul>
      </div>
      <div className="footer-col">
        <h4>Company</h4>
        <ul>
          <li><a href="#">About ReLoop</a></li>
          <li><a href="#">Our charity partners</a></li>
          <li><a href="#">Careers</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </div>
    </div>

    <div className="charity-block">
      <h4>Donations are delivered through our charity partners</h4>
      <div className="charity-logos">
        <img className="plain-logo" src="/images/logos/imbuto-foundation.png" alt="Imbuto Foundation" />
        <img className="plain-logo" src="/images/logos/rwanda-womens-network.png" alt="Rwanda Women's Network" />
        <img className="plain-logo" src="/images/logos/caritas-rwanda.png" alt="Caritas Rwanda" />
      </div>
    </div>

    <div className="footer-bottom">
      <div>© 2026 ReLoop. Made in Kigali.</div>
      <div className="legal-links">
        <a href="#">Terms</a>
        <a href="#">Privacy</a>
        <a href="#">Trust &amp; Safety</a>
      </div>
    </div>
  </div>
</footer>

    </>
  );
}