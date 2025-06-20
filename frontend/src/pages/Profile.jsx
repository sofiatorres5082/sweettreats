import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "../context/AuthContext";
import { updateProfileRequest } from "../api/auth";
import { getUserOrdersRequest } from "../api/orders";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import MobileHeader from "../components/MobileHeader";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Spinner from "../components/Spinner";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../components/ui/alert-dialog";
import { LogOut } from "lucide-react";

const profileSchema = yup.object({
  name: yup
    .string()
    .required("El nombre es obligatorio")
    .matches(/^[A-Za-zÀ-ÿ ]+$/, "Solo letras y espacios"),
  email: yup
    .string()
    .email("Email inválido")
    .required("El email es obligatorio"),
});

export default function Profile() {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setEditing] = useState(false);
  const [orders, setOrders] = useState([]);

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(profileSchema),
    mode: "onBlur",
    defaultValues: { name: "", email: "" },
  });

  useEffect(() => {
    if (isEditing && user) reset({ name: user.name, email: user.email });
  }, [isEditing, user, reset]);

  useEffect(() => {
    if (user) {
      getUserOrdersRequest()
        .then((res) => {
          const all = Array.isArray(res.data)
            ? res.data
            : res.data.content || [];
          setOrders(all.slice(0, 5));
        })
        .catch(() => toast.error("No se pudieron cargar tus pedidos"));
    }
  }, [user]);

  const onSubmit = async (data) => {
    try {
      const res = await updateProfileRequest(data);
      toast.success("Perfil actualizado");
      setUser(res.data);
      setEditing(false);
    } catch (err) {
      if (err.response?.status === 409) {
        setError("email", { type: "server", message: "El correo ya está en uso" });
      } else {
        toast.error("Error al actualizar perfil");
      }
    }
  };

  const handleConfirmLogout = () => {
    logout();
    toast.success("Sesión cerrada");
    navigate("/");
  };

  if (!user) return <Spinner />;

  return (
    <>
      <MobileHeader />
      <div className="bg-[#F9E4CF] min-h-screen py-8 px-4 font-[Comic_Neue]">
        <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-2">
          <section className="bg-white rounded-xl p-6 shadow">
            <h2 className="text-xl font-semibold text-[#67463B] mb-6 text-center">
              Mi perfil
            </h2>
            {isEditing ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {['name', 'email'].map((field) => (
                  <div key={field} className="space-y-1">
                    <label htmlFor={field} className="block text-[#67463B] capitalize">
                      {field === 'name' ? 'Nombre:' : 'Email:'}
                    </label>
                    <Controller
                      name={field}
                      control={control}
                      render={({ field: f }) => (
                        <Input {...f} id={field} className="w-full" />
                      )}
                    />
                    {errors[field] && (
                      <p className="text-red-600 text-sm">{errors[field].message}</p>
                    )}
                  </div>
                ))}
                <div className="flex justify-center gap-4 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setEditing(false)}
                    className="bg-gray-200 text-gray-700 hover:bg-gray-300 px-6 py-2 rounded-full cursor-pointer"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={!isValid}
                    className="bg-[#E96D87] text-white hover:bg-[#ff6680] px-6 py-2 rounded-full cursor-pointer"
                  >
                    Guardar
                  </Button>
                </div>
              </form>
            ) : (
              <>
                <div className="space-y-4 mb-8">
                  <div className="flex">
                    <span className="w-24 font-semibold text-[#67463B]">Nombre:</span>
                    <span>{user.name}</span>
                  </div>
                  <div className="flex">
                    <span className="w-24 font-semibold text-[#67463B]">Email:</span>
                    <span>{user.email}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <Button
                      className="bg-[#E96D87] text-white hover:bg-[#ff6680] px-8 py-2 rounded-full cursor-pointer w-full max-w-xs"
                      onClick={() => setEditing(true)}
                    >
                      Editar Perfil
                    </Button>
                  </div>
                  
                  <div className="flex justify-center">
                    <Button
                      onClick={() => navigate("/cambiar-contraseña")}
                      className="bg-[#E96D87] text-white hover:bg-[#ff6680] px-8 py-2 rounded-full cursor-pointer w-full max-w-xs"
                    >
                      Cambiar Contraseña
                    </Button>
                  </div>
                  
                  <div className="flex justify-center pt-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          className="bg-[#E96D87] text-white hover:bg-[#ff6680] px-8 py-2 rounded-full flex items-center justify-center gap-2 cursor-pointer w-full max-w-xs"
                          variant=""
                        >
                          Cerrar Sesión
                          <LogOut className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-[#F9E4CF] text-[#67463B] border-none">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-lg text-center">
                            ¿Cerrar sesión?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-center">
                            Esta acción cerrará tu sesión y te devolverá al inicio.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <div className="flex justify-center gap-4 w-full mt-4">
                            <AlertDialogCancel className="rounded-full px-5 py-2 bg-white hover:bg-[#FDE0E7] cursor-pointer">
                              Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction
                              className="rounded-full px-5 py-2 bg-[#E96D87] text-white hover:bg-[#D86E7A] cursor-pointer"
                              onClick={handleConfirmLogout}
                            >
                              Confirmar
                            </AlertDialogAction>
                          </div>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </>
            )}
          </section>

          <section className="bg-white rounded-xl p-6 shadow">
            <h2 className="text-xl font-semibold text-[#67463B] mb-4 text-center">
              Últimos pedidos
            </h2>
            {orders.length > 0 ? (
              <div className="space-y-3">
                {orders.map((o, i) => (
                  <div key={o.id} className="bg-[#E96D87] text-white p-4 rounded-lg">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-bold">Pedido #{i + 1}</p>
                        <p>
                          Fecha: 
                          {o.createdAt
                            ? new Date(o.createdAt).toLocaleDateString()
                            : ""}
                        </p>
                      </div>
                      <p className="font-semibold">${o.total?.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-[#67463B]">No tienes pedidos aún.</p>
            )}
            <div className="text-center pt-4">
              <Link to="/mis-pedidos" className="text-[#67463B] underline">
                Ver todos →
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}