import "./App.css";
import ProductCard, { type Product } from "./Components/ProductCard";

const products: Product[] = [
  {
    id: 1,
    name: "Minimal Desk Lamp",
    category: "Home office",
    price: 39.99,
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
    description: "A warm, adjustable lamp for focused work and reading.",
  },
  {
    id: 2,
    name: "Everyday Backpack",
    category: "Accessories",
    price: 64.99,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    description: "A durable backpack with room for your daily essentials.",
  },
  {
    id: 3,
    name: "Ceramic Coffee Set",
    category: "Kitchen",
    price: 28.5,
    image:
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=800&q=80",
    description: "A simple three-piece set for your morning coffee ritual.",
  },
  {
    id: 4,
    name: "Wireless Headphones",
    category: "Technology",
    price: 89,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    description: "Comfortable over-ear headphones with rich, clear sound.",
  },
];

function App() {
  function handleAddToCart(product: Product) {
    alert(`${product.name} was added to your cart.`);
  }

  return (
    <main className="catalog">
      <header className="catalog-header">
        <p className="eyebrow">Curated essentials</p>
        <h1>Shop useful things.</h1>
        <p className="intro">
          Explore practical products chosen to make everyday life a little
          better.
        </p>
      </header>

      <section className="product-grid" aria-label="Product catalog">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </section>
    </main>
  );
}

export default App;
