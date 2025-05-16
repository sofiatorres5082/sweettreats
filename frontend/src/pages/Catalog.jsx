import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import MobileHeader from "../components/MobileHeader";
import { getProductsRequest } from "../api/products";
import SearchBar from "../components/SearchBar";
import CartMenu from "../components/CartMenu";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";

import blueberry from "../assets/images/blueberry.jpg";
import cheesecake from "../assets/images/cheesecake.jpg";
import chocolatedrip from "../assets/images/chocolatedrip.jpg";
import confetti from "../assets/images/confetti.jpg";
import frutosrojos from "../assets/images/frutosrojos.jpg";
import redvelvet from "../assets/images/redvelvet.jpg";
import tiramisu from "../assets/images/tiramisu.jpg";
import triplechocolate from "../assets/images/triplechocolate.jpg";

const imageMap = {
  blueberry,
  cheesecake,
  chocolatedrip,
  confetti,
  frutosrojos,
  redvelvet,
  tiramisu,
  triplechocolate,
};

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { dispatch } = useCart();

  useEffect(() => {
    (async () => {
      try {
        const res = await getProductsRequest();
        const data = res.data;
        setProducts(Array.isArray(data) ? data : data.content);
      } catch (error) {
        console.error("Error al cargar productos", error);
        toast.error("No se pudieron cargar los productos");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <MobileHeader />
      <div className="min-h-screen bg-[#F9E4CF] px-4 pt-16 pb-8">
        <div className="flex mb-4 max-w-6xl mx-auto">
          <SearchBar />
          <CartMenu />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {products.map(product => {
            const inStock = product.stock > 0;
            return (
              <Card
                key={product.id}
                className="bg-white rounded-3xl border-none transition"
              >
                <CardContent className="p-4 flex flex-col ml-5 mr-5">
                  <img
                    src={imageMap[product.imagen]}
                    alt={product.nombre}
                    className="w-full h-48 object-cover rounded-2xl mb-4"
                  />
                  <h3 className="font-[Comic_Neue] font-semibold text-[#67463B]">
                    {product.nombre}
                  </h3>
                  <span className="font-[Comic_Neue] font-semibold text-[#67463B]">
                    ${product.precio}
                  </span>
                  <p className="font-[Comic_Neue] text-[#67463B]">
                    {product.descripcion}
                  </p>
                  {inStock ? (
                    <p className="font-[Comic_Neue] text-[#67463B] mt-2">
                      En stock: {product.stock}
                    </p>
                  ) : (
                    <p className="font-[Comic_Neue] text-red-600 font-bold mt-2">
                      Sin stock
                    </p>
                  )}
                  <Button
                    onClick={() => {
                      dispatch({
                        type: "ADD_ITEM",
                        payload: {
                          id: product.id,
                          nombre: product.nombre,
                          precio: product.precio,
                          imagen: imageMap[product.imagen],
                          stock: product.stock,
                          cantidad: 1,
                        },
                      });
                      toast.success("🍰 ¡Agregado al carrito!", {
                        description: `${product.nombre} está esperando por ti ❤️`,
                      });
                    }}
                    className="font-[Comic_Neue] font-semibold mt-4 bg-[#E96D87] hover:bg-[#bb6678] text-white rounded-3xl w-full"
                    disabled={!inStock}
                  >
                    {inStock ? "Agregar al carrito" : "No disponible"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}
