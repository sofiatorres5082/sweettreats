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

// esquema de validación del perfil
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
    reset({ name: user.name, email: user.email });
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
      <div className="min-h-screen bg-[#F9E4CF] px-4 pt-16 pb-8 space-y-8">
        {/* Información del Perfil */}
        <section className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow space-y-4">
          <h2 className="text-2xl font-semibold text-[#67463B]">
            Información del Perfil
          </h2>

          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {["name", "email"].map((field) => (
                <div key={field} className="space-y-1">
                  <label
                    htmlFor={field}
                    className="block capitalize text-[#67463B]"
                  >
                    {field}:
                  </label>
                  <Controller
                    name={field}
                    control={control}
                    render={({ field }) => <Input {...field} id={field} />}
                  />
                  {errors[field] && (
                    <p className="text-red-600 text-sm">
                      {errors[field].message}
                    </p>
                  )}
                </div>
              ))}

              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={!isValid}
                  className="bg-[#E96D87] text-white"
                >
                  Guardar Cambios
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <p>
                <span className="font-semibold text-[#67463B]">Nombre:</span>{" "}
                {user.name}
              </p>
              <p>
                <span className="font-semibold text-[#67463B]">Email:</span>{" "}
                {user.email}
              </p>
              <div className="flex justify-end">
                <Button
                  className="bg-[#E96D87] text-white"
                  onClick={() => setEditing(true)}
                >
                  Editar Perfil
                </Button>
              </div>
            </div>
          )}
        </section>

        {/* Historial de pedidos recientes */}
        <section className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow space-y-4">
          <h3 className="text-xl font-semibold text-[#67463B]">
            Mis Pedidos Recientes
          </h3>

          {orders.length > 0 ? (
            <ul className="space-y-3">
              {orders.map((o) => (
                <li
                  key={o.id}
                  className="flex justify-between items-center p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      Pedido #{o.id} –{" "}
                      {new Date(o.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-[#67463B]">
                      Estado: {o.estado} – Total: ${o.total}
                    </p>
                  </div>
                  <Button size="sm" onClick={() => navigate(`/order/${o.id}`)}>
                    Ver detalles
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-[#67463B]">No tienes pedidos aún.</p>
          )}

          <Link
            to="/mis-pedidos"
            className="inline-block mt-2 text-[#E96D87] font-semibold"
          >
            Ver todos mis pedidos →
          </Link>
        </section>

        {/* Opciones adicionales */}
        <section className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow space-y-4">
          <h3 className="text-xl font-semibold text-[#67463B]">Opciones</h3>
          <div className="flex flex-col gap-3">
            <Button
              variant="outline"
              onClick={() => navigate("/cambiar-contraseña")}
            >
              Cambiar Contraseña
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}
