import * as yup from 'yup';

export function isValidCardNumber(value) {
  const digits = (value || '').replace(/\D/g, '');
  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

export function isValidExpirationDate(input) {
  const expRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
  if (!expRegex.test(input || '')) return false;
  const [monthStr, yearStr] = (input || '').split('/');
  const month = parseInt(monthStr, 10);
  const year = parseInt('20' + yearStr, 10);
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;
  return true;
}

export const checkoutSchema = yup.object({
  nombre: yup.string()
    .required('El nombre es obligatorio'),

  direccion: yup.string()
    .required('La dirección es obligatoria'),

  telefono: yup.string()
    .matches(/^\d{7,15}$/, 'Teléfono inválido (7 a 15 dígitos)')
    .required('El teléfono es obligatorio'),

  email: yup.string()
    .email('Email inválido')
    .required('El email es obligatorio'),

  tipoTarjeta: yup.string()
    .oneOf(['visa','mastercard'], 'Selecciona Visa o Mastercard')
    .required('El tipo de tarjeta es obligatorio'),

  nombreTitular: yup.string()
    .required('El nombre del titular es obligatorio'),

  numero: yup.string()
    .test('luhn', 'Número de tarjeta inválido', value => isValidCardNumber(value))
    .required('El número de tarjeta es obligatorio'),

  vencimiento: yup.string()
    .test('exp-format', 'Formato de vencimiento inválido o expirado', value => isValidExpirationDate(value))
    .required('La fecha de vencimiento es obligatoria'),

  cvv: yup.string()
    .matches(/^\d{3,4}$/, 'CVV inválido')
    .required('El CVV es obligatorio'),
});
