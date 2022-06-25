import { GetStaticProps } from "next";
import Stripe from "stripe";
import stripeConfig from "../config/stripe";

import Link from "next/link";
import CheckoutButton from "../components/CheckoutButton";

type Product = Stripe.Product & {
  priceId: string;
  price: number;
};

interface HomeProps {
  products: Product[];
}

const Home = ({ products }: HomeProps) => {
  return (
    <div>
      <h1>Simple Stripe Store</h1>

      {products.map((product) => (
        <div key={product.id}>
          <hr />

          <h1>{product.name}</h1>

          {product.images.length > 0 && (
            <img
              src={product.images[0]}
              alt={product.name}
              width={100}
              height={100}
            />
          )}

          <h2>
            {product.price.toLocaleString("pt-br", {
              style: "currency",
              currency: "BRL",
            })}
          </h2>

          <CheckoutButton priceId={product.priceId} itemName={product.name} />

          <br />
          <br />

          <Link href={`/${product.id}`}>Acessar</Link>
        </div>
      ))}
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const stripe = new Stripe(stripeConfig.secretKey, {
    apiVersion: "2020-08-27",
  });

  const productsList = await stripe.products.list({ active: true });

  const prices = await stripe.prices
    .list({ active: true })
    .then((response) => response.data);

  const products = productsList.data.map((product) => {
    const price = prices.find((price) => price.product === product.id);

    return {
      ...product,
      price: price.unit_amount / 100,
      priceId: price.id,
    };
  });

  return {
    props: {
      products,
    },
  };
};

export default Home;
