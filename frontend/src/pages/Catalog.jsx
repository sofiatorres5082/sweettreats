import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import MobileHeader from "../components/MobileHeader";
import { getProductsRequest } from "../api/products";
import { getCategoriesRequest } from "../api/categories";
import CartMenu from "../components/CartMenu";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";
import { ImageWithSkeleton } from "@/components/ImageWithSkeleton";
import { Loader2 } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "";

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("nombre");
  const [categoryId, setCategoryId] = useState("all");
  const [addingToCart, setAddingToCart] = useState(null); // ID del producto que se está agregando
  
  const { addItem } = useCart();

  useEffect(() => {
    (async () => {
      try {
        const resProducts = await getProductsRequest();
        const dataProducts = resProducts?.data || [];
        setProducts(Array.isArray(dataProducts) ? dataProducts : dataProducts?.content || []);

        const resCategories = await getCategoriesRequest();
        const dataCategories = resCategories?.data || [];
        setCategories(Array.isArray(dataCategories) ? dataCategories : dataCategories?.content || []);
      } catch (error) {
        console.error(error);
        toast.error("No se pudieron cargar los productos o categorías");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredProducts = products.filter(p =>
    categoryId === "all" ? true : p.categoria?.id === Number(categoryId)
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "nombre": return a.nombre.localeCompare(b.nombre);
      case "precio": return a.precio - b.precio;
      case "stock": return b.stock - a.stock;
      default: return 0;
    }
  });

  const handleAddToCart = async (product) => {
    setAddingToCart(product.id);
    try {
      await addItem({
        id: product.id,
        nombre: product.nombre,
        precio: product.precio,
        imagen: product.imagen, // Solo la ruta relativa, CartContext agregará la URL
        stock: product.stock
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Error al agregar al carrito");
    } finally {
      setAddingToCart(null);
    }
  };

  return (
    <>
      <MobileHeader />
      <div className="min-h-screen bg-[#F9E4CF] px-4 pt-16 pb-8">
        <div className="flex mb-5 max-w-6xl mx-auto justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <label htmlFor="category" className="font-[Comic_Neue] text-[#67463B]">Categoría:</label>
            <select
              id="category"
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
              className="font-[Comic_Neue] text-[#67463B] cursor-pointer bg-white px-3 py-2 border border-gray-200 rounded-2xl"
            >
              <option value="all">Todas</option>
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <label htmlFor="sort" className="font-[Comic_Neue] text-[#67463B]">Ordenar por:</label>
            <select
              id="sort"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="font-[Comic_Neue] text-[#67463B] cursor-pointer bg-white px-3 py-2 border border-gray-200 rounded-2xl"
            >
              <option value="nombre">Nombre (A → Z)</option>
              <option value="precio">Precio (menor → mayor)</option>
              <option value="stock">Stock (mayor → menor)</option>
            </select>
          </div>

          <CartMenu />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 text-[#67463B] animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {sortedProducts.map(product => {
              const inStock = product.stock > 0;
              const imageUrl = product.imagen ? `${API_URL}${product.imagen}` : "/placeholder.png";
              const isAddingThisProduct = addingToCart === product.id;

              return (
                <Card key={product.id} className="bg-white rounded-3xl border-none">
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
                      <h3 className="font-[Comic_Neue] font-semibold text-[#67463B] mb-1">{product.nombre}</h3>
                      <span className="font-[Comic_Neue] font-semibold text-[#67463B] mb-2 block">${product.precio.toFixed(2)}</span>
                      <p className="font-[Comic_Neue] text-[#67463B] leading-snug line-clamp-3 mb-2">{product.descripcion}</p>
                      <span className={`inline-block text-sm font-medium px-2 py-1 rounded ${inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {inStock ? `En stock: ${product.stock}` : "Sin stock"}
                      </span>
                    </div>
                    <div className="mt-4 ml-5 mr-5">
                      <Button
                        onClick={() => handleAddToCart(product)}
                        className="font-[Comic_Neue] font-semibold bg-[#E96D87] hover:bg-[#bb6678] text-white rounded-3xl w-full cursor-pointer"
                        disabled={!inStock || isAddingThisProduct}
                      >
                        {isAddingThisProduct ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Agregando...
                          </>
                        ) : (
                          inStock ? "Agregar al carrito" : "No disponible"
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}