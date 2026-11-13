# Product Catalog

A static React and TypeScript product catalog built with reusable components.

![Product catalog screenshot](./product%20catalog.png)

## Features

- Reusable `ProductCard` component
- Typed product data and props
- Function props for the **Add to cart** action
- CSS Modules for product-card styling
- Responsive CSS Grid layout
- Product category badges and reusable buttons

## Project structure

```text
src/
├── App.tsx
├── App.css
├── main.tsx
└── Components/
    ├── Badge.tsx
    ├── Badge.module.css
    ├── Button.tsx
    ├── Button.module.css
    ├── ProductCard.tsx
    └── ProductCard.module.css
```

## How it works

`App.tsx` stores the product data in an array and uses `map()` to render one
`ProductCard` for each product. The product data is passed to the card through
props.

`App` also passes the `handleAddToCart` function to each card. When the card's
button is clicked, the child component calls that function and displays an
alert containing the selected product name.

The product card uses `ProductCard.module.css`, so its styles remain scoped to
that component. The product grid in `App.css` uses `auto-fit` and `minmax()` to
adapt the number of columns to the available screen width.

## Run the project

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```
