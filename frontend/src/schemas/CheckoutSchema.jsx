import * as yup from "yup";

export const checkoutSchema = yup.object({
  nombre: yup.string().required("El nombre es obligatorio"),
  direccion: yup.string().required("La dirección es obligatoria"),
  telefono: yup
    .string()
    .matches(/^\d{7,15}$/, "Teléfono inválido (7 a 15 dígitos)")
    .required("El teléfono es obligatorio"),
  tipoTarjeta: yup
    .number()
    .typeError("Debes seleccionar un método de pago")
    .required("Debes seleccionar un método de pago"),

  nombreTitular: yup.string().required("El nombre del titular es obligatorio"),
});
