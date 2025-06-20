import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { ShoppingCart, Minus, Plus, Trash } from "lucide-react";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function CartMenu() {
  const { cart, dispatch } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce((sum, i) => sum + i.precio * i.cantidad, 0);
  const totalItems = cart.reduce((sum, i) => sum + i.cantidad, 0);

  const handleGoToCheckout = async () => {
    if (cart.some((i) => i.cantidad > i.stock)) {
      toast.error("Revisa las cantidades, superas el stock disponible");
      return;
    }
    try {
      const res = await fetch("/auth/verify-session", {
        credentials: "include",
      });
      if (res.ok) navigate("/checkout");
      else throw new Error();
    } catch {
      toast.error("Debes iniciar sesión para continuar");
      navigate("/log-in", { state: { from: "/checkout" } });
    }
  };

  return (
    <Sheet>
      <SheetTrigger className="relative">
        <ShoppingCart className="w-6 h-6 text-[#67463B] hover:text-[#E96D87] cursor-pointer transition-colors" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-[#E96D87] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px] font-[Comic_Neue]">
            {totalItems > 99 ? '99+' : totalItems}
          </span>
        )}
      </SheetTrigger>
      <SheetContent
        side="right"
        className="bg-[#FFF6ED] border-none shadow-none flex flex-col h-full max-w-full w-[90vw] sm:w-96 px-5 py-6"
      >
        <SheetHeader>
          <SheetTitle className="text-[#67463B] font-[Comic_Neue]">
            Tu carrito {totalItems > 0 && `(${totalItems})`}
          </SheetTitle>
        </SheetHeader>

        {cart.length === 0 ? (
          <p className="mt-4 font-[Comic_Neue] text-[#67463B] text-center">
            No hay productos en el carrito.
          </p>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto mt-3 space-y-4">
              {cart.map((item) => {
                const isMax = item.cantidad >= item.stock;
                return (
                  <div
                    key={item.id}
                    className="flex items-start justify-between border-b pb-2"
                  >
                    <div className="flex gap-5">
                      <img
                        src={item.imagen}
                        alt={item.nombre}
                        className="w-20 h-20 rounded-xl object-cover"
                      />
                      <div>
                        <p className="font-[Comic_Neue] text-[#67463B]">
                          {item.nombre}
                        </p>
                        <p className="text-sm font-[Comic_Neue] text-[#67463B]">
                          ${item.precio * item.cantidad}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Button
                            className="h-8 w-8 rounded-full border-[#E96D87] text-[#E96D87] hover:bg-[#FEE9ED] cursor-pointer"
                            size="icon"
                            variant="outline"
                            onClick={() =>
                              dispatch({
                                type: "DECREMENT_QUANTITY",
                                payload: item.id,
                              })
                            }
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="text-[#67463B] font-[Comic_Neue]">
                            {item.cantidad}
                          </span>
                          <Button
                            className="h-8 w-8 rounded-full border-[#E96D87] text-[#E96D87] hover:bg-[#FEE9ED] cursor-pointer"
                            size="icon"
                            variant="outline"
                            onClick={() => {
                              if (isMax) {
                                toast.error("No hay más stock disponible");
                              } else {
                                dispatch({
                                  type: "INCREMENT_QUANTITY",
                                  payload: item.id,
                                });
                              }
                            }}
                            disabled={isMax}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <Button
                      className="text-[#E96D87] hover:text-red-600 cursor-pointer"
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        dispatch({ type: "REMOVE_ITEM", payload: item.id })
                      }
                    >
                      <Trash className="w-6 h-6" />
                    </Button>
                  </div>
                );
              })}
            </div>

            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center text-[#67463B] font-[Comic_Neue] text-lg">
                <span>Total:</span>
                <span>${total}</span>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  variant="destructive"
                  className="flex-1 rounded-2xl bg-[#D64561] hover:bg-[#c13e56] font-[Comic_Neue] cursor-pointer"
                  onClick={() => dispatch({ type: "CLEAR_CART" })}
                >
                  Vaciar carrito
                </Button>
                <Button
                  className="flex-1 rounded-2xl bg-[#E96D87] hover:bg-[#d95c74] text-white font-[Comic_Neue] cursor-pointer"
                  onClick={handleGoToCheckout}
                >
                  Pagar
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}