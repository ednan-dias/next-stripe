import Link from "next/link";
import { useRouter } from "next/router";

const Success = () => {
  const {
    query: { itemName },
  } = useRouter();

  return (
    <div>
      <h1> Obrigado por comprar {itemName}!</h1>
      <Link href="/">Página Inicial</Link>
    </div>
  );
};

export default Success;
