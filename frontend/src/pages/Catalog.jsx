import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import MobileHeader from "../components/MobileHeader";
import { getProductsRequest } from "../api/products";
import CartMenu from "../components/CartMenu";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";
import { ImageWithSkeleton } from "@/components/ImageWithSkeleton";

const API_URL = import.meta.env.VITE_API_URL || "";

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("nombre");
  const { dispatch } = useCart();

  useEffect(() => {
    (async () => {
      try {
        const res = await getProductsRequest();
        const data = res.data;
        setProducts(Array.isArray(data) ? data : data.content);
      } catch {
        toast.error("No se pudieron cargar los productos");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case "nombre":
        return a.nombre.localeCompare(b.nombre);
      case "precio":
        return a.precio - b.precio;
      case "stock":
        return b.stock - a.stock;
      default:
        return 0;
    }
  });

  return (
    <>
      <MobileHeader />

      <div className="min-h-screen bg-[#F9E4CF] px-4 pt-16 pb-8">
        <div className="flex mb-5 max-w-6xl mx-auto justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <label
                htmlFor="sort"
                className="font-[Comic_Neue] text-[#67463B]"
              >
                Ordenar por:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="
      font-[Comic_Neue] text-[#67463B] 
      bg-white px-3 py-2 mr-2 pr-2
      border border-gray-200 
      rounded-2xl 
      focus:outline-none focus:ring-2 focus:ring-[#E96D87] focus:border-transparent
      transition 
      ease-in-out duration-200
    "
              >
                <option value="nombre">Nombre (A → Z)</option>
                <option value="precio">Precio (menor → mayor)</option>
                <option value="stock">Stock (mayor → menor)</option>
              </select>
            </div>
          </div>
          <CartMenu />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {sortedProducts.map((product) => {
            const inStock = product.stock > 0;
            const imageUrl = product.imagen
              ? `${API_URL}${product.imagen}`
              : "/placeholder.png";

            return (
              <Card
                key={product.id}
                className="bg-white rounded-3xl border-none"
              >
                <CardContent className="p-4 flex flex-col">
                  <div className="flex justify-center flex-shrink-0 mb-5">
                    <ImageWithSkeleton
                      src={imageUrl}
                      alt={product.nombre}
                      loading="lazy"
                      className="w-24 h-24 sm:w-32 sm:h-32 md:w-72 md:h-72"
                    />
                  </div>
                  <div className="flex-1 ml-5 mr-5">
                    <h3 className="font-[Comic_Neue] font-semibold text-[#67463B] mb-1">
                      {product.nombre}
                    </h3>
                    <span className="font-[Comic_Neue] font-semibold text-[#67463B] mb-2 block">
                      ${product.precio.toFixed(2)}
                    </span>
                    <p className="font-[Comic_Neue] text-[#67463B] leading-snug line-clamp-3 mb-2">
                      {product.descripcion}
                    </p>
                    <span
                      className={`inline-block text-sm font-medium px-2 py-1 rounded ${
                        inStock
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {inStock ? `En stock: ${product.stock}` : "Sin stock"}
                    </span>
                  </div>
                  <div className="mt-4 ml-5 mr-5">
                    <Button
                      onClick={() =>
                        dispatch({
                          type: "ADD_ITEM",
                          payload: {
                            id: product.id,
                            nombre: product.nombre,
                            precio: product.precio,
                            imagen: imageUrl,
                            stock: product.stock,
                            cantidad: 1,
                          },
                        }) &
                        toast.success("🍰 ¡Agregado al carrito!", {
                          description: `${product.nombre} está esperando por ti ❤️`,
                        })
                      }
                      className="font-[Comic_Neue] font-semibold bg-[#E96D87] hover:bg-[#bb6678] text-white rounded-3xl w-full"
                      disabled={!inStock}
                    >
                      {inStock ? "Agregar al carrito" : "No disponible"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}
