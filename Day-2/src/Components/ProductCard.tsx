import Badge from "./Badge";
import Button from "./Button";
import styles from "./ProductCard.module.css";

export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
};

type ProductCardProps = {
  product: Product;
  onAddToCart: (product: Product) => void;
};

function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <article className={styles.card}>
      <img className={styles.image} src={product.image} alt={product.name} />
      <div className={styles.content}>
        <Badge>{product.category}</Badge>
        <h2 className={styles.title}>{product.name}</h2>
        <p className={styles.description}>{product.description}</p>
        <div className={styles.footer}>
          <strong className={styles.price}>${product.price.toFixed(2)}</strong>
          <Button onClick={() => onAddToCart(product)}>Add to cart</Button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
