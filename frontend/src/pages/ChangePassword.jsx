// src/pages/ChangePassword.jsx
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { changePasswordRequest } from "../api/auth";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import MobileHeader from "../components/MobileHeader";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const schema = yup.object({
  currentPassword: yup.string().required("La contraseña actual es obligatoria"),
  newPassword: yup
    .string()
    .required("La nueva contraseña es obligatoria")
    .min(8, "Debe tener al menos 8 caracteres")
    .matches(/[A-Z]/, "Debe contener una mayúscula")
    .matches(/\d/, "Debe contener un número")
    .matches(/[^A-Za-z0-9]/, "Debe contener un carácter especial"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Las contraseñas no coinciden")
    .required("Confirma tu nueva contraseña"),
});

export default function ChangePassword() {
  const navigate = useNavigate();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setError,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

const onSubmit = async (data) => {
  try {
    await changePasswordRequest({
      oldPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
    toast.success("Contraseña cambiada correctamente");
    navigate("/perfil");
  } catch (err) {
    const msg =
      typeof err?.response?.data === "string"
        ? err.response.data
        : err?.response?.data?.message || "Error al cambiar la contraseña";

    toast.error(msg);

    setError("currentPassword", {
      type: "server",
      message: msg, 
    });
  }
};


  return (
    <>
      <MobileHeader />
      <div className="min-h-screen bg-[#F9E4CF] px-4 pt-16 pb-8">
        <div className="max-w-md mx-auto bg-white p-6 rounded-xl space-y-4">
          <h2 className="font-[Comic_Neue] text-2xl font-bold text-[#67463B] text-center">
            Cambiar Contraseña
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <label className="block font-[Comic_Neue] text-[#67463B]">
                Contraseña actual
              </label>
              <div className="relative">
                <Controller
                  name="currentPassword"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      type={showCurrent ? "text" : "password"}
                      placeholder="••••••••"
                      className="pr-10"
                    />
                  )}
                />

                <button
                  type="button"
                  onClick={() => setShowCurrent((v) => !v)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-red-600 text-sm">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block font-[Comic_Neue] text-[#67463B]">
                Nueva contraseña
              </label>
              <div className="relative">
                <Controller
                  name="newPassword"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type={showNew ? "text" : "password"}
                      placeholder="••••••••"
                      className="pr-10"
                    />
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-red-600 text-sm">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block font-[Comic_Neue] text-[#67463B]">
                Confirmar contraseña
              </label>
              <div className="relative">
                <Controller
                  name="confirmPassword"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type={showConfirm ? "text" : "password"}
                      placeholder="••••••••"
                      className="pr-10"
                    />
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-600 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="flex justify-center gap-4 mt-4">
              <Button
                variant="outline"
                onClick={() => navigate("/perfil")}
                className="bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-full px-6 py-2"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={!isValid}
                className="bg-[#FF6B85] hover:bg-[#E96D87] text-white rounded-full px-6 py-2"
              >
                Cambiar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
