import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup
    .string()
    .email("Email inválido")
    .required("El email es obligatorio"),
  password: yup.string().required("La contraseña es obligatoria"),
});

export const registerSchema = yup.object({
  name: yup.string().required("El nombre es obligatorio"),
  email: yup
    .string()
    .email("Email inválido")
    .required("El email es obligatorio"),
  password: yup
    .string()
    .required("La contraseña es obligatoria")
    .min(8, "Mínimo 8 caracteres")
    .matches(/[A-Z]/, "Debes incluir al menos una mayúscula")
    .matches(/[0-9]/, "Debes incluir al menos un número")
    .matches(/[^a-zA-Z0-9]/, "Debes incluir un carácter especial"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Las contraseñas no coinciden")
    .required("Confirma tu contraseña"),
});
