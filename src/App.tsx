import { useEffect, useMemo, useState } from "react";
import "./app.css";

type Category = "All" | "Burger" | "Fries" | "Drinks";

type Product = {
  id: number;
  name: string;
  category: Exclude<Category, "All">;
  price: number;
  oldPrice?: number;
  discount?: string;
  image: string;
  rating: number;
};

const products: Product[] = [
  { id: 1, name: "Classic Burger", category: "Burger", price: 129, oldPrice: 159, discount: "-19%", image: "/assets/images/burger.jpg", rating: 5 },
  { id: 2, name: "Beef Burger", category: "Burger", price: 149, oldPrice: 179, discount: "-17%", image: "/assets/images/beef-burger.jpg", rating: 5 },
  { id: 3, name: "Bacon Burger", category: "Burger", price: 169, oldPrice: 199, discount: "-15%", image: "/assets/images/bacon-burger.jpg", rating: 5 },
  { id: 4, name: "Veggie Burger", category: "Burger", price: 139, oldPrice: 159, discount: "-13%", image: "/assets/images/vegie-burger.jpg", rating: 5 },
  { id: 5, name: "Classic Fries", category: "Fries", price: 79, oldPrice: 99, discount: "-20%", image: "/assets/images/classic-fries.jpg", rating: 5 },
  { id: 6, name: "Smiley Fries", category: "Fries", price: 89, oldPrice: 109, discount: "-18%", image: "/assets/images/smiley-fries.jpg", rating: 5 },
  { id: 7, name: "Salted Fries", category: "Fries", price: 69, oldPrice: 89, discount: "-22%", image: "/assets/images/salt-fries.jpg", rating: 5 },
  { id: 8, name: "Crispy Fries", category: "Fries", price: 79, oldPrice: 99, discount: "-20%", image: "/assets/images/fries.jpg", rating: 5 },
  { id: 9, name: "Cherry Drink", category: "Drinks", price: 69, oldPrice: 89, discount: "-22%", image: "/assets/images/cherry-drinks.jpg", rating: 5 },
  { id: 10, name: "Orange Drink", category: "Drinks", price: 69, oldPrice: 89, discount: "-22%", image: "/assets/images/orange-drinks.jpg", rating: 5 },
  { id: 11, name: "Pink Drink", category: "Drinks", price: 79, oldPrice: 99, discount: "-20%", image: "/assets/images/pink-drinks.jpg", rating: 5 },
  { id: 12, name: "Fresh Drink", category: "Drinks", price: 75, oldPrice: 95, discount: "-21%", image: "/assets/images/drinks.jpg", rating: 5 },
];

const categories: Category[] = ["All", "Burger", "Fries", "Drinks"];

function Icon({ name, ...props }: { name: string; [key: string]: string }) {
  return <ion-icon name={name} {...props} />;
}

export default function App() {
  const [category, setCategory] = useState<Category>("All");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [cart, setCart] = useState<Record<number, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = category === "All" || product.category === category;
      const matchesSearch = product.name.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [category, query]);

  const favoriteProducts = products.filter((product) => favorites.includes(product.id));
  const cartItems = products.filter((product) => cart[product.id]);
  const cartCount = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  const cartTotal = cartItems.reduce((sum, product) => sum + product.price * (cart[product.id] || 0), 0);

  useEffect(() => {
    const onScroll = () => {
      const header = document.querySelector("[data-header]");
      const backTop = document.querySelector("[data-back-top-btn]");
      header?.classList.toggle("active", window.scrollY >= 100);
      backTop?.classList.toggle("active", window.scrollY >= 100);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleFavorite = (id: number) => {
    setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const addToCart = (id: number) => {
    setCart((current) => ({ ...current, [id]: (current[id] || 0) + 1 }));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((current) => {
      const next = (current[id] || 0) + delta;
      if (next <= 0) {
        const copy = { ...current };
        delete copy[id];
        return copy;
      }
      return { ...current, [id]: next };
    });
  };

  const submitSearch = () => {
    setQuery(search.trim());
    setSearchOpen(false);
    setTimeout(() => document.getElementById("food-menu")?.scrollIntoView({ behavior: "smooth" }), 0);
  };

  return (
    <div>
      <header className="header" data-header>
        <div className="container">
          <h1><a href="#home" className="logo">Tasty Burger<span className="span">.</span></a></h1>

          <nav className={`navbar ${menuOpen ? "active" : ""}`}>
            <ul className="navbar-list">
              <li className="nav-item"><a href="#home" className="navbar-link" onClick={() => setMenuOpen(false)}>Home</a></li>
              <li className="nav-item"><a href="#about" className="navbar-link" onClick={() => setMenuOpen(false)}>About Us</a></li>
              <li className="nav-item"><a href="#food-menu" className="navbar-link" onClick={() => setMenuOpen(false)}>Shop</a></li>
              <li className="nav-item"><a href="#favorites" className="navbar-link" onClick={() => setMenuOpen(false)}>Favorites</a></li>
              <li className="nav-item"><a href="#footer" className="navbar-link" onClick={() => setMenuOpen(false)}>Contact Us</a></li>
            </ul>
          </nav>

          <div className="header-btn-group">
            <button className="search-btn" aria-label="Search" onClick={() => setSearchOpen(true)}>
              <Icon name="search-outline" />
            </button>
            <button className="header-action-btn" aria-label="Favorites" onClick={() => document.getElementById("favorites")?.scrollIntoView({ behavior: "smooth" })}>
              <Icon name={favorites.length ? "heart" : "heart-outline"} />
              {favorites.length > 0 && <span className="header-badge">{favorites.length}</span>}
            </button>
            <button className="header-action-btn" aria-label="Shopping cart" onClick={() => setCartOpen(true)}>
              <Icon name="cart-outline" />
              {cartCount > 0 && <span className="header-badge">{cartCount}</span>}
            </button>
            <button className={`nav-toggle-btn ${menuOpen ? "active" : ""}`} aria-label="Toggle Menu" onClick={() => setMenuOpen((open) => !open)}>
              <span className="line top"></span><span className="line middle"></span><span className="line bottom"></span>
            </button>
          </div>
        </div>
      </header>

      {searchOpen && (
        <div className="search-container active">
          <div className="search-box">
            <input autoFocus type="search" value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => event.key === "Enter" && submitSearch()} aria-label="Search here" placeholder="Type keywords here..." className="search-input" />
            <button className="search-submit" aria-label="Submit search" onClick={submitSearch}><Icon name="search-outline" /></button>
          </div>
          <button className="search-close-btn" aria-label="Cancel search" onClick={() => setSearchOpen(false)}></button>
        </div>
      )}

      <main>
        <article>
          <section className="hero" id="home" style={{ backgroundImage: "url('/assets/images/hero-bg.jpg')" }}>
            <div className="container">
              <div className="hero-content">
                <p className="hero-subtitle">Eat Sleep And</p>
                <h2 className="h1 hero-title">Supper delicious Burger in town!</h2>
                <p className="hero-text">Food is any substance consumed to provide nutritional support for an organism.</p>
                <button type="button" className="btn" onClick={() => document.getElementById("food-menu")?.scrollIntoView({ behavior: "smooth" })}>Order Now</button>
              </div>
              <figure className="hero-banner">
                <img src="/assets/images/hero-banner-bg.png" width="820" height="716" alt="" aria-hidden="true" className="w-100 hero-img-bg" />
                <img src="/assets/images/hero-banner.png" width="700" height="637" loading="lazy" alt="Burger" className="w-100 hero-img" />
              </figure>
            </div>
          </section>

          <section className="section section-divider white promo">
            <div className="container">
              <ul className="promo-list has-scrollbar">
                {[
                  ["Burger", "/assets/images/beef-burger.jpg", "Juicy burgers made fresh."],
                  ["Fries", "/assets/images/classic-fries.jpg", "Crispy fries for every bite."],
                  ["Drinks", "/assets/images/cherry-drinks.jpg", "Fresh drinks to complete your meal."],
                ].map(([title, image, text]) => (
                  <li className="promo-item" key={title}>
                    <button className="promo-card promo-card-button" onClick={() => { setCategory(title as Category); document.getElementById("food-menu")?.scrollIntoView({ behavior: "smooth" }); }}>
                      <div className="card-icon"><Icon name={title === "Burger" ? "fast-food-outline" : title === "Fries" ? "restaurant-outline" : "wine-outline"} /></div>
                      <h3 className="h3 card-title">{title}</h3>
                      <p className="card-text">{text}</p>
                      <img src={image} width="300" height="300" loading="lazy" alt={title} className="w-100 card-banner" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="section about" id="about">
            <div className="container">
              <figure className="about-banner">
                <img src="/assets/images/about-banner.png" width="509" height="459" loading="lazy" alt="About Tasty Burger" className="w-100 about-img" />
                <img src="/assets/images/sale-shape-red.png" width="216" height="226" loading="lazy" alt="Get up to 50% off now" className="abs-img scale-up-anim" />
              </figure>
              <div className="about-content">
                <p className="section-subtitle">About Us</p>
                <h2 className="h2 section-title">The Best Burgers <span className="span">In Your City</span></h2>
                <p className="section-text">We serve fresh burgers, crispy fries, and refreshing drinks made for a simple and delicious meal.</p>
                <ul className="about-list">
                  <li className="about-item"><Icon name="checkmark-outline" /><span className="span">Fresh ingredients every day</span></li>
                  <li className="about-item"><Icon name="checkmark-outline" /><span className="span">Fast and friendly service</span></li>
                  <li className="about-item"><Icon name="checkmark-outline" /><span className="span">Burgers, fries and drinks only</span></li>
                </ul>
                <button type="button" className="btn" onClick={() => document.getElementById("food-menu")?.scrollIntoView({ behavior: "smooth" })}>Explore Menu</button>
              </div>
            </div>
          </section>

          <section className="section food-menu" id="food-menu">
            <div className="container">
              <p className="section-subtitle">Popular Dishes</p>
              <h2 className="h2 section-title">Our Delicious <span className="span">Foods</span></h2>
              <p className="section-text">Choose from our burgers, crispy fries, and refreshing drinks.</p>

              <ul className="fiter-list">
                {categories.map((item) => (
                  <li key={item}><button className={`filter-btn ${category === item ? "active" : ""}`} onClick={() => setCategory(item)}>{item}</button></li>
                ))}
              </ul>

              <ul className="food-menu-list">
                {filteredProducts.map((product) => (
                  <li key={product.id}>
                    <div className="food-menu-card">
                      <div className="card-banner">
                        <img src={product.image} width="300" height="300" loading="lazy" alt={product.name} className="w-100 menu-product-image" />
                        {product.discount && <div className="badge">{product.discount}</div>}
                        <div className="product-actions">
                          <button className="btn food-icon-btn" aria-label={`Add ${product.name} to cart`} onClick={() => addToCart(product.id)}><Icon name="cart-outline" /></button>
                          <button className={`btn food-icon-btn favorite-btn ${favorites.includes(product.id) ? "active" : ""}`} aria-label={`Favorite ${product.name}`} onClick={() => toggleFavorite(product.id)}><Icon name={favorites.includes(product.id) ? "heart" : "heart-outline"} /></button>
                        </div>
                      </div>
                      <div className="wrapper">
                        <p className="category">{product.category}</p>
                        <div className="rating-wrapper">{Array.from({ length: product.rating }).map((_, index) => <Icon key={index} name="star" />)}</div>
                      </div>
                      <h3 className="h3 card-title">{product.name}</h3>
                      <div className="price-wrapper">
                        <p className="price-text">Price:</p>
                        <data className="price" value={product.price}>₱{product.price.toFixed(2)}</data>
                        {product.oldPrice && <del className="del">₱{product.oldPrice.toFixed(2)}</del>}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              {filteredProducts.length === 0 && <p className="empty-state">No menu item found.</p>}
            </div>
          </section>

          <section className="section section-divider white cta" style={{ backgroundImage: "url('/assets/images/hero-bg.jpg')" }}>
            <div className="container">
              <div className="cta-content">
                <h2 className="h2 section-title">
                  Tasty Burger Has Excellent <span className="span">Quality Burgers!</span>
                </h2>
                <p className="section-text">
                  The restaurants in Hangzhou also catered to many northern Chinese who had fled south from Kaifeng during
                  the Jurchen invasion of the 1120s, while it is also known that many restaurants were run by families.
                </p>
                <button type="button" className="btn btn-hover" onClick={() => document.getElementById("food-menu")?.scrollIntoView({ behavior: "smooth" })}>Order Now</button>
              </div>
              <figure className="cta-banner">
                <img src="/assets/images/cta-banner.png" width="700" height="637" loading="lazy" alt="Burger" className="w-100 cta-img" />
                <img src="/assets/images/sale-shape.png" width="216" height="226" loading="lazy" alt="Get up to 50% off now" className="abs-img scale-up-anim" />
              </figure>
            </div>
          </section>

          <section className="section section-divider gray delivery">
            <div className="container">
              <div className="delivery-content">
                <h2 className="h2 section-title">A Moments Of Delivered On <span className="span">Right Time</span> &amp; Place</h2>
                <p className="section-text">Your favorite burgers, fries and drinks delivered fresh and ready to enjoy.</p>
                <button type="button" className="btn btn-hover" onClick={() => document.getElementById("food-menu")?.scrollIntoView({ behavior: "smooth" })}>Order Now</button>
              </div>
              <figure className="delivery-banner">
                <img src="/assets/images/delivery-banner-bg.png" width="700" height="602" loading="lazy" alt="clouds" className="w-100" />
                <img src="/assets/images/delivery-boy.svg" width="1000" height="880" loading="lazy" alt="delivery boy" className="w-100 delivery-img" />
              </figure>
            </div>
          </section>

          <section className="section section-divider white testi">
            <div className="container">
              <p className="section-subtitle">Testimonials</p>
              <h2 className="h2 section-title">Our Customers <span className="span">Reviews</span></h2>
              <p className="section-text">Food is any substance consumed to provide nutritional support for an organism.</p>
              <ul className="testi-list has-scrollbar">
                {[
                  ["Robert William", "CEO Kingfisher", "I would be lost without restaurant. I would like to personally thank you for your outstanding product.", "/assets/images/avatar-1.jpg"],
                  ["Thomas Josef", "CEO Getforce", "I would be lost without restaurant. I would like to personally thank you for your outstanding product.", "/assets/images/avatar-2.jpg"],
                  ["Charles Richard", "CEO Angela", "I would be lost without restaurant. I would like to personally thank you for your outstanding product.", "/assets/images/avatar-3.jpg"],
                ].map(([name, title, text, avatar]) => (
                  <li className="testi-item" key={name}>
                    <div className="testi-card">
                      <div className="profile-wrapper">
                        <figure className="avatar"><img src={avatar} width="80" height="80" loading="lazy" alt={name} /></figure>
                        <div><h3 className="h4 testi-name">{name}</h3><p className="testi-title">{title}</p></div>
                      </div>
                      <blockquote className="testi-text">&quot;{text}&quot;</blockquote>
                      <div className="rating-wrapper"><Icon name="star" /><Icon name="star" /><Icon name="star" /><Icon name="star" /><Icon name="star" /></div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="section section-divider white favorites-section" id="favorites">
            <div className="container">
              <p className="section-subtitle">Your Favorites</p>
              <h2 className="h2 section-title">Favorite <span className="span">Foods</span></h2>
              <p className="section-text">Items you heart will appear here.</p>
              {favoriteProducts.length > 0 ? (
                <ul className="blog-list favorites-list">
                  {favoriteProducts.map((product) => (
                    <li key={product.id}>
                      <div className="blog-card favorite-card">
                        <div className="card-banner"><img src={product.image} width="600" height="390" loading="lazy" alt={product.name} className="w-100" /><div className="badge">{product.category}</div></div>
                        <div className="card-content">
                          <div className="favorite-card-head"><div><p className="category">{product.category}</p><h3 className="h3 card-title">{product.name}</h3></div><button className="favorite-remove" aria-label={`Remove ${product.name} from favorites`} onClick={() => toggleFavorite(product.id)}><Icon name="heart" /></button></div>
                          <div className="price-wrapper"><data className="price" value={product.price}>₱{product.price.toFixed(2)}</data><button className="btn favorite-cart-btn" onClick={() => addToCart(product.id)}><Icon name="cart-outline" /> Add to Cart</button></div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="favorites-empty"><Icon name="heart-outline" /><p>No favorites yet. Tap the heart on a menu item to save it here.</p><button type="button" className="btn" onClick={() => document.getElementById("food-menu")?.scrollIntoView({ behavior: "smooth" })}>Browse Menu</button></div>
              )}
            </div>
          </section>
        </article>
      </main>

      <footer className="footer" id="footer">
        <div className="footer-top" style={{ backgroundImage: "url('/assets/images/footer-illustration.png')" }}>
          <div className="container">
            <div className="footer-brand">
              <a href="#home" className="logo">Tasty Burger<span className="span">.</span></a>
              <p className="footer-text">Fresh burgers, crispy fries, and refreshing drinks served with care.</p>
              <ul className="social-list">
                <li><a href="#" className="social-link" aria-label="Facebook"><Icon name="logo-facebook" /></a></li>
                <li><a href="#" className="social-link" aria-label="Twitter"><Icon name="logo-twitter" /></a></li>
                <li><a href="#" className="social-link" aria-label="Instagram"><Icon name="logo-instagram" /></a></li>
                <li><a href="#" className="social-link" aria-label="Pinterest"><Icon name="logo-pinterest" /></a></li>
              </ul>
            </div>
            <ul className="footer-list">
              <li><p className="footer-list-title">Contact Info</p></li>
              <li><p className="footer-list-item">+63 912 345 6789</p></li>
              <li><p className="footer-list-item">info@tastyburger.com</p></li>
              <li><address className="footer-list-item">Sorsogon City, Philippines</address></li>
            </ul>
            <ul className="footer-list">
              <li><p className="footer-list-title">Opening Hours</p></li>
              <li><p className="footer-list-item">Monday-Friday: 08:00-22:00</p></li>
              <li><p className="footer-list-item">Saturday: 10:00-22:00</p></li>
              <li><p className="footer-list-item">Sunday: 10:00-20:00</p></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom"><div className="container"><p className="copyright-text">&copy; 2026 <a href="#home" className="copyright-link">Tasty Burger</a> All Rights Reserved.</p></div></div>
      </footer>

      <button className="back-top-btn" aria-label="Back to top" data-back-top-btn onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><Icon name="chevron-up" /></button>

      {cartOpen && (
        <div className="cart-overlay" onClick={() => setCartOpen(false)}>
          <aside className="cart-drawer" onClick={(event) => event.stopPropagation()}>
            <div className="cart-header"><div><p className="section-subtitle">Your Order</p><h2 className="h3">Shopping Cart</h2></div><button className="cart-close" aria-label="Close cart" onClick={() => setCartOpen(false)}><Icon name="close-outline" /></button></div>
            <div className="cart-items">
              {cartItems.length === 0 ? <div className="cart-empty"><Icon name="cart-outline" /><p>Your cart is empty.</p></div> : cartItems.map((product) => (
                <div className="cart-item" key={product.id}>
                  <img src={product.image} alt={product.name} />
                  <div className="cart-item-info"><h3>{product.name}</h3><p>₱{product.price.toFixed(2)}</p><div className="quantity-controls"><button onClick={() => updateQuantity(product.id, -1)}><Icon name="remove-outline" /></button><span>{cart[product.id]}</span><button onClick={() => updateQuantity(product.id, 1)}><Icon name="add-outline" /></button></div></div>
                  <button className="cart-remove" aria-label={`Remove ${product.name}`} onClick={() => updateQuantity(product.id, -(cart[product.id] || 0))}><Icon name="trash-outline" /></button>
                </div>
              ))}
            </div>
            <div className="cart-footer"><div><span>Total</span><strong>₱{cartTotal.toFixed(2)}</strong></div><button className="btn" disabled={!cartItems.length}>Checkout</button></div>
          </aside>
        </div>
      )}
    </div>
  );
}
