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
      setError("currentPassword", { type: "server", message: msg });
    }
  };

  return (
    <>
      <MobileHeader />
      <div className="min-h-screen flex flex-col items-center bg-[#F9E4CF] px-4 pt-16 pb-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-sm p-8">
            <h2 className="font-[Comic_Neue] text-2xl font-bold text-[#67463B] text-center mb-6">
              Cambiar Contraseña
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {[
                {
                  name: "currentPassword",
                  label: "Contraseña actual",
                  show: showCurrent,
                  toggle: () => setShowCurrent((v) => !v),
                },
                {
                  name: "newPassword",
                  label: "Nueva contraseña",
                  show: showNew,
                  toggle: () => setShowNew((v) => !v),
                },
                {
                  name: "confirmPassword",
                  label: "Confirmar contraseña",
                  show: showConfirm,
                  toggle: () => setShowConfirm((v) => !v),
                },
              ].map(({ name, label, show, toggle }) => (
                <div key={name} className="space-y-1">
                  <label className="block font-[Comic_Neue] text-sm font-semibold text-[#67463B]">
                    {label}
                  </label>
                  <div className="relative">
                    <Controller
                      name={name}
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type={show ? "text" : "password"}
                          placeholder="••••••••"
                          className="font-[Comic_Neue] w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#E96D87] focus:border-transparent bg-gray-50 pr-10"
                        />
                      )}
                    />
                    <button
                      type="button"
                      onClick={toggle}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#E96D87] transition-colors"
                    >
                      {show ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors[name] && (
                    <p className="font-[Comic_Neue] text-red-500 text-sm mt-1">
                      {errors[name]?.message}
                    </p>
                  )}
                </div>
              ))}

              <div className="flex justify-center gap-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => navigate("/perfil")}
                  className="font-[Comic_Neue] rounded-3xl bg-gray-200 text-gray-700 hover:bg-gray-300 px-6 py-2"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={!isValid}
                  className="font-[Comic_Neue] bg-[#E96D87] hover:bg-[#d6627a] text-white rounded-3xl px-6 py-2"
                >
                  Cambiar
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
