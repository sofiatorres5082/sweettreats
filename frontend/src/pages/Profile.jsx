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

const profileSchema = yup.object({
  name: yup.string().required("El nombre es obligatorio"),
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
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(profileSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
    },
  });

  useEffect(() => {
    if (isEditing && user) {
      reset({ name: user.name, email: user.email });
    }
  }, [isEditing, user, reset]);

  useEffect(() => {
    if (user) {
      getUserOrdersRequest()
        .then((res) => setOrders(res.data.slice(0, 5))) // los 5 más recientes
        .catch(() => toast.error("No se pudieron cargar tus pedidos"));
    }
  }, [user]);

  const onSubmit = async (data) => {
    try {
      const res = await updateProfileRequest(data);
      toast.success("Perfil actualizado");
      setUser(res.data);
      setEditing(false);
    } catch {
      toast.error("Error al actualizar perfil");
    }
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const handleLogout = () => {
    logout();
    toast.success("Sesión cerrada");
    navigate("/");
  };

  if (!user) return <Spinner fullScreen />;

  return (
    <>
      <MobileHeader />
      <div className="min-h-screen bg-[#F9E4CF] px-4 pt-16 pb-8 space-y-6">
        <h2 className="font-[Comic_Neue] text-2xl font-bold text-[#67463B] text-center pt-4">
          Mi perfil
        </h2>

        {/* Información Personal */}
        <section className="max-w-md mx-auto bg-white p-6 rounded-xl">
          <h3 className="font-[Comic_Neue] text-lg font-semibold text-[#67463B] mb-4">
            Información personal
          </h3>

          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {["name", "email"].map((field) => (
                <div key={field} className="space-y-2">
                  <label
                    htmlFor={field}
                    className="block font-[Comic_Neue]  text-[#67463B]"
                  >
                    {field === "name" ? "Nombre:" : "Email:"}
                  </label>
                  <Controller
                    name={field}
                    control={control}
                    render={({ field }) => <Input {...field} id={field} className="w-full" />}
                  />
                  {errors[field] && (
                    <p className="text-red-600 text-sm">
                      {errors[field].message}
                    </p>
                  )}
                </div>
              ))}

              <div className="flex justify-center gap-4 mt-4">
                <Button 
                  variant="outline" 
                  onClick={handleCancel}
                  className="bg-gray-200 text-gray-700 hover:bg-gray-300 font-medium rounded-full px-6 py-2"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={!isValid}
                  className="bg-[#FF6B85] hover:bg-[#E96D87] text-white font-medium rounded-full px-6 py-2"
                >
                  Guardar Cambios
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-baseline">
                <p className="w-24 font-[Comic_Neue] font-semibold text-[#67463B]">Nombre:</p>
                <p className="flex-1">{user.name}</p>
              </div>
              
              <div className="flex items-baseline">
                <p className="w-24 font-[Comic_Neue] font-semibold text-[#67463B]">Email:</p>
                <p className="flex-1">{user.email}</p>
              </div>
              
              <div className="flex justify-center mt-4">
                <Button
                  className="bg-[#FF6B85] hover:bg-[#E96D87] text-white font-semibold font-[Comic_Neue] rounded-full px-6 py-2"
                  onClick={() => setEditing(true)}
                >
                  Editar Perfil
                </Button>
              </div>
            </div>
          )}
        </section>

        {/* Historial de Pedidos */}
        <section className="max-w-md mx-auto bg-white p-6 rounded-xl">
          <h3 className="font-[Comic_Neue] text-lg font-semibold text-[#67463B] mb-4">
            Historial de pedidos
          </h3>

          {orders.length > 0 ? (
            <div className="space-y-3">
              {orders.map((o) => (
                <div
                  key={o.id}
                  className="bg-[#FF6B85] text-white p-4 rounded-lg"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-[Comic_Neue] font-bold">
                        Pedido #{o.id}
                      </p>
                      <p className="font-[Comic_Neue]">
                        Fecha: {new Date(o.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="font-[Comic_Neue] text-lg">${o.total}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="font-[Comic_Neue] text-center text-[#67463B]">No tienes pedidos aún.</p>
          )}

          <div className="text-center mt-4">
            <Link
              to="/mis-pedidos"
              className="inline-block text-[#67463B] font-medium font-[Comic_Neue]"
            >
              Ver todos mis pedidos →
            </Link>
          </div>
        </section>

        {/* Opciones */}
        <section className="max-w-md mx-auto bg-white p-6 rounded-xl">
          <h3 className="font-[Comic_Neue] text-lg font-semibold text-[#67463B] mb-4">
            Opciones
          </h3>
          
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              onClick={() => navigate("/cambiar-contraseña")}
              className="bg-[#FF6B85] hover:bg-[#E96D87] font-[Comic_Neue]  text-white font-medium rounded-full px-6 py-2"
            >
              Cambiar Contraseña
            </Button>
            
            <Button 
              onClick={handleLogout}
              className="bg-[#FF6B85] hover:bg-[#E96D87] font-[Comic_Neue] text-white font-medium rounded-full px-6 py-2"
            >
              Cerrar Sesión
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}