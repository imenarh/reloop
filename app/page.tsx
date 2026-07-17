import Link from 'next/link';

export default function Home() {
  return (
    <>


<header>
  <nav>
    <div className="logo"><span className="dot"></span>ReLoop</div>
    <div className="navlinks">
      <a href="#shop">Shop</a>
      <a href="#how">How it works</a>
      <a href="#impact">Impact</a>
    </div>
    <div className="navcta">
      <Link href="/login" className="btn btn-outline btn-sm">Log in</Link>
      <a href="#" className="btn btn-ochre btn-sm">List an item</a>
    </div>
  </nav>
</header>

<div className="trim"></div>

{/* HERO */}
<section className="hero">
  <div className="wrap">
    <div>
      <div className="eyebrow">Kigali · Rwanda</div>
      <h1>Your closet still has<br /><em>somewhere to go.</em></h1>
      <p className="lede">Sell what you don't wear anymore, or give it to someone who needs it more. ReLoop keeps good things moving around Kigali instead of piling up in landfills.</p>
      <div className="hero-ctas">
        <a href="#" className="btn btn-ochre">Sell an item →</a>
        <a href="#" className="btn btn-teal">Donate an item →</a>
      </div>
      <div className="hero-stats">
        <div><strong>12,400+</strong><span>items re-looped</span></div>
        <div><strong>3</strong><span>charity partners</span></div>
        <div><strong>1,850</strong><span>items donated to families</span></div>
      </div>
    </div>
    <div className="hero-visual">
      <div className="stack-card card-a">
        {/* Your photo goes here: e.g. images/denim-jacket.jpg */}
        <img className="stack-img" src="/images/denim-jacket.jpg" alt="Denim jacket" />
        <div className="swatch-label"><span>Denim jacket</span><span className="price-pill">8,000 RWF</span></div>
      </div>
      <div className="stack-card card-b">
        {/* Your photo goes here: e.g. images/kids-shoes.jpg */}
        <img className="stack-img" src="/images/kids-shoes.jpg" alt="Kids shoes" />
        <div className="swatch-label"><span>Kids shoes</span><span className="give-pill">Donated</span></div>
      </div>
      <div className="stack-card card-c">
        {/* Your photo goes here: e.g. images/wooden-stool.jpg */}
        <img className="stack-img" src="/images/wooden-stool.jpg" alt="Wooden stool" />
        <div className="swatch-label"><span>Wooden stool</span><span className="price-pill">5,000 RWF</span></div>
      </div>
    </div>
  </div>
</section>

<div className="partner-strip">
  <div className="wrap">
    <span>Donations delivered with</span>
    <span className="tag">Imbuto Foundation</span>
    <span>·</span>
    <span className="tag">Rwanda Women's Network</span>
    <span>·</span>
    <span className="tag">Caritas Rwanda</span>
  </div>
</div>

{/* HOW IT WORKS / TWO PATHS */}
<section id="how">
  <div className="wrap">
    <div className="section-head">
      <div className="eyebrow">Two ways to re-loop</div>
      <h2>Same closet clean-out. Two different endings.</h2>
      <p>Every listing starts the same way — snap a photo, tell us what it is. From there, you choose where it goes.</p>
    </div>

    <div className="paths">
      <div className="path-card path-sell">
        <div className="path-icon">💰</div>
        <h3>Sell it</h3>
        <p className="desc">Set your own price. The buyer covers shipping and can track the parcel the whole way. You keep 100% of your asking price once the buyer confirms.</p>
        <ul className="step-list">
          <li><span className="step-num">1</span>Upload photos and set a price</li>
          <li><span className="step-num">2</span>A buyer orders and pays for shipping</li>
          <li><span className="step-num">3</span>Ship it, buyer confirms, you get paid in full</li>
        </ul>
        <div className="loop-note">Payment is only released once the buyer confirms the item matches the listing — that's how we keep trust in the loop.</div>
      </div>

      <div className="path-card path-donate">
        <div className="path-icon">🤝</div>
        <h3>Donate it</h3>
        <p className="desc">Mark it "give" instead of setting a price. We check that it's in good condition, then route it to one of our charity partners for free.</p>
        <ul className="step-list">
          <li><span className="step-num">1</span>Upload photos and select "Donate"</li>
          <li><span className="step-num">2</span>ReLoop reviews the item's condition</li>
          <li><span className="step-num">3</span>We ship it to a partner charity near you</li>
        </ul>
        <div className="loop-note">No fees, no price tag — just a closet clean-out that reaches someone who needs it.</div>
      </div>
    </div>
  </div>
</section>

{/* LISTINGS */}
<section id="shop" style={{background: 'var(--paper-dim)'}}>
  <div className="wrap">
    <div className="grid-head">
      <div className="section-head" style={{marginBottom: '0'}}>
        <div className="eyebrow">Fresh on ReLoop</div>
        <h2>Recently listed</h2>
      </div>
      <div className="filter-row">
        <div className="chip active">All</div>
        <div className="chip">Clothing</div>
        <div className="chip">Shoes</div>
        <div className="chip">Furniture</div>
        <div className="chip">Accessories</div>
        <div className="chip">Donations only</div>
      </div>
    </div>

    <div className="listings">
      <div className="item-card">
        <div className="item-photo" style={{background: 'linear-gradient(150deg,#C9762E,#8C4A1F)'}}>
          {/* Your photo goes here: e.g. images/ankara-print-blouse.jpg */}
          <img className="item-img" src="/images/ankara-print-blouse.jpg" alt="Ankara print blouse" />
          <span className="item-badge badge-sale">For sale</span>
          <span className="item-tag">Ankara print blouse</span>
        </div>
        <div className="item-info">
          <div className="title">Ankara print blouse</div>
          <div className="meta">Size M · Like new</div>
          <div className="row"><span className="price">6,500 RWF</span><span className="heart">♡</span></div>
        </div>
      </div>

      <div className="item-card">
        <div className="item-photo" style={{background: 'linear-gradient(150deg,#3C7466,#1F4238)'}}>
          {/* Your photo goes here: e.g. images/children-s-rain-boots.jpg */}
          <img className="item-img" src="/images/children-s-rain-boots.jpg" alt="Children's rain boots" />
          <span className="item-badge badge-give">Donation</span>
          <span className="item-tag">Children's rain boots</span>
        </div>
        <div className="item-info">
          <div className="title">Children's rain boots</div>
          <div className="meta">Size 28 · Good condition</div>
          <div className="row"><span className="price give">Given to Imbuto Foundation</span><span className="heart">♡</span></div>
        </div>
      </div>

      <div className="item-card">
        <div className="item-photo" style={{background: 'linear-gradient(150deg,#2E4470,#182A4A)'}}>
          {/* Your photo goes here: e.g. images/leather-sandals.jpg */}
          <img className="item-img" src="/images/leather-sandals.jpg" alt="Leather sandals" />
          <span className="item-badge badge-sale">For sale</span>
          <span className="item-tag">Leather sandals</span>
        </div>
        <div className="item-info">
          <div className="title">Leather sandals</div>
          <div className="meta">Size 41 · Worn twice</div>
          <div className="row"><span className="price">4,200 RWF</span><span className="heart">♡</span></div>
        </div>
      </div>

      <div className="item-card">
        <div className="item-photo" style={{background: 'linear-gradient(150deg,#B23A2E,#7A2721)'}}>
          {/* Your photo goes here: e.g. images/wooden-dining-chair.jpg */}
          <img className="item-img" src="/images/wooden-dining-chair.jpg" alt="Wooden dining chair" />
          <span className="item-badge badge-sale">For sale</span>
          <span className="item-tag">Wooden dining chair</span>
        </div>
        <div className="item-info">
          <div className="title">Wooden dining chair</div>
          <div className="meta">Solid wood · Minor scuffs</div>
          <div className="row"><span className="price">9,000 RWF</span><span className="heart">♡</span></div>
        </div>
      </div>

      <div className="item-card">
        <div className="item-photo" style={{background: 'linear-gradient(150deg,#D9A441,#A9791F)'}}>
          {/* Your photo goes here: e.g. images/wool-blankets-x3.jpg */}
          <img className="item-img" src="/images/wool-blankets-x3.jpg" alt="Wool blankets (x3)" />
          <span className="item-badge badge-give">Donation</span>
          <span className="item-tag">Wool blankets (x3)</span>
        </div>
        <div className="item-info">
          <div className="title">Wool blankets (x3)</div>
          <div className="meta">Warm · Washed</div>
          <div className="row"><span className="price give">Given to Caritas Rwanda</span><span className="heart">♡</span></div>
        </div>
      </div>

      <div className="item-card">
        <div className="item-photo" style={{background: 'linear-gradient(150deg,#5B4A8C,#332552)'}}>
          {/* Your photo goes here: e.g. images/beaded-necklace-set.jpg */}
          <img className="item-img" src="/images/beaded-necklace-set.jpg" alt="Beaded necklace set" />
          <span className="item-badge badge-sale">For sale</span>
          <span className="item-tag">Beaded necklace set</span>
        </div>
        <div className="item-info">
          <div className="title">Beaded necklace set</div>
          <div className="meta">Handmade · New</div>
          <div className="row"><span className="price">3,000 RWF</span><span className="heart">♡</span></div>
        </div>
      </div>

      <div className="item-card">
        <div className="item-photo" style={{background: 'linear-gradient(150deg,#4A7C4E,#2A4A2C)'}}>
          {/* Your photo goes here: e.g. images/men-s-linen-shirt.jpg */}
          <img className="item-img" src="/images/men-s-linen-shirt.jpg" alt="Men's linen shirt" />
          <span className="item-badge badge-sale">For sale</span>
          <span className="item-tag">Men's linen shirt</span>
        </div>
        <div className="item-info">
          <div className="title">Men's linen shirt</div>
          <div className="meta">Size L · Like new</div>
          <div className="row"><span className="price">5,500 RWF</span><span className="heart">♡</span></div>
        </div>
      </div>

      <div className="item-card">
        <div className="item-photo" style={{background: 'linear-gradient(150deg,#8C5E2E,#5C3D1D)'}}>
          {/* Your photo goes here: e.g. images/school-bag.jpg */}
          <img className="item-img" src="/images/school-bag.jpg" alt="School bag" />
          <span className="item-badge badge-give">Donation</span>
          <span className="item-tag">School bag</span>
        </div>
        <div className="item-info">
          <div className="title">School bag</div>
          <div className="meta">Sturdy · Small wear</div>
          <div className="row"><span className="price give">Given to Rwanda Women's Network</span><span className="heart">♡</span></div>
        </div>
      </div>
    </div>
  </div>
</section>

<div className="trim"></div>

{/* IMPACT */}
<section id="impact" className="impact">
  <div className="wrap">
    <div className="section-head">
      <div className="eyebrow" style={{color: 'var(--ochre)'}}>The loop in numbers</div>
      <h2>Every item is one less thing thrown away.</h2>
      <p>Since launching in Kigali, here's what the ReLoop community has moved between closets, buyers, and families who needed it.</p>
    </div>
    <div className="impact-grid">
      <div className="impact-card"><strong>12,400+</strong><span>items re-looped</span></div>
      <div className="impact-card"><strong>1,850</strong><span>items donated to families</span></div>
      <div className="impact-card"><strong>41M RWF</strong><span>paid out to sellers</span></div>
      <div className="impact-card"><strong>3</strong><span>charity partners in Kigali</span></div>
    </div>
  </div>
</section>

{/* TESTIMONIAL */}
<section className="testimonial">
  <div className="wrap">
    <blockquote>"I cleaned out my kids' old clothes in one afternoon. Half I sold, half I gave away. Both felt good."</blockquote>
    <cite>— A ReLoop seller, Kicukiro</cite>
  </div>
</section>

{/* FINAL CTA */}
<section className="final-cta">
  <div className="wrap">
    <h2>What's sitting in your closet right now?</h2>
    <p>It takes two minutes to list. Someone in Kigali might need exactly that.</p>
    <div className="hero-ctas">
      <a href="#" className="btn btn-ochre">Sell an item →</a>
      <a href="#" className="btn btn-teal">Donate an item →</a>
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
          <li><a href="#">Browse listings</a></li>
          <li><a href="#">Sell an item</a></li>
          <li><a href="#">Donate an item</a></li>
          <li><a href="#">How pricing works</a></li>
        </ul>
      </div>
      <div className="footer-col">
        <h4>Trust & shipping</h4>
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