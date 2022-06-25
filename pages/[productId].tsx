import Stripe from "stripe";
import { GetStaticPaths, GetStaticProps } from "next";

import { useRouter } from "next/router";

import stripeConfig from "../config/stripe";

interface ProductProps {
  product: Stripe.Product;
  price: number;
}

const Product = ({ product, price }: ProductProps) => {
  const router = useRouter();

  return (
    <div>
      <button onClick={() => router.back()}>Voltar</button>

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
        {(price / 100).toLocaleString("pt-br", {
          style: "currency",
          currency: "BRL",
        })}
      </h2>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const stripe = new Stripe(stripeConfig.secretKey, {
    apiVersion: "2020-08-27",
  });

  const products = await stripe.products
    .list({ active: true })
    .then((response) => response.data);

  const paths = products.map((product) => ({
    params: {
      productId: product.id,
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const stripe = new Stripe(stripeConfig.secretKey, {
    apiVersion: "2020-08-27",
  });

  const product = await stripe.products.retrieve(params.productId as string);
  const price = await stripe.prices
    .list({
      product: params.productId as string,
    })
    .then((response) => response.data);

  return {
    props: {
      product,
      price: price[0].unit_amount,
    },
  };
};

export default Product;
