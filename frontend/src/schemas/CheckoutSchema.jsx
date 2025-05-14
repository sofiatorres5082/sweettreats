import * as yup from "yup";

export const checkoutSchema = yup.object({
  nombre: yup.string().required("El nombre es obligatorio"),

  direccion: yup.string().required("La dirección es obligatoria"),

  telefono: yup
    .string()
    .matches(/^\d{7,15}$/, "Teléfono inválido (7 a 15 dígitos)")
    .required("El teléfono es obligatorio"),

  email: yup
    .string()
    .email("Email inválido")
    .required("El email es obligatorio"),

  tipoTarjeta: yup
    .string()
    .oneOf(["visa", "mastercard"], "Selecciona Visa o Mastercard")
    .required("El tipo de tarjeta es obligatorio"),

  nombreTitular: yup.string().required("El nombre del titular es obligatorio"),
});
