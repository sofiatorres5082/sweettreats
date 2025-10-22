export const validateCardNumberLuhn = (cardNumber) => {
  const digits = cardNumber.replace(/\D/g, '');
  
  if (digits.length < 13 || digits.length > 19) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

export const detectCardType = (cardNumber) => {
  const digits = cardNumber.replace(/\D/g, '');
  
  // Visa
  if (/^4/.test(digits)) {
    return 'Visa';
  }
  // Mastercard
  if (/^(5[1-5]|2[2-7])/.test(digits)) {
    return 'Mastercard';
  }
  // American Express
  if (/^3[47]/.test(digits)) {
    return 'American Express';
  }
  // Discover
  if (/^6(?:011|5)/.test(digits)) {
    return 'Discover';
  }
  
  return 'Desconocida';
};

export const validateExpiryDate = (month, year) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const expMonth = parseInt(month, 10);
  let expYear = parseInt(year, 10);

  // Si el año tiene 2 dígitos, convertir a 4 dígitos
  // Asumimos que años 00-99 son 2000-2099
  if (expYear < 100) {
    expYear += 2000;
  }

  // Validar que el mes esté en rango válido
  if (expMonth < 1 || expMonth > 12) {
    return false;
  }

  // Validar que el año no sea muy antiguo
  if (expYear < currentYear) {
    return false;
  }

  // Si es el año actual, verificar que el mes no haya pasado
  if (expYear === currentYear && expMonth < currentMonth) {
    return false;
  }

  // Validar que el año no sea muy lejano (ej: no más de 20 años en el futuro)
  if (expYear > currentYear + 20) {
    return false;
  }

  return true;
};

// Validar CVV
export const validateCVV = (cvv, cardType) => {
  const cvvDigits = cvv.replace(/\D/g, '');
  
  // American Express usa 4 dígitos, los demás 3
  if (cardType === 'American Express') {
    return cvvDigits.length === 4;
  }
  
  return cvvDigits.length === 3;
};

// Validación completa local
export const validateCardLocally = (cardData) => {
  const errors = [];

  // Validar número de tarjeta
  if (!cardData.number || cardData.number.replace(/\D/g, '').length === 0) {
    errors.push('El número de tarjeta es requerido');
  } else if (!validateCardNumberLuhn(cardData.number)) {
    errors.push('El número de tarjeta no es válido');
  }

  // Validar fecha de expiración
  if (!cardData.expMonth || !cardData.expYear) {
    errors.push('La fecha de expiración es requerida');
  } else if (!validateExpiryDate(cardData.expMonth, cardData.expYear)) {
    errors.push('La fecha de expiración no es válida o la tarjeta está vencida');
  }

  // Validar CVV
  const cardType = detectCardType(cardData.number || '');
  if (!cardData.cvv) {
    errors.push('El código de seguridad (CVV) es requerido');
  } else if (!validateCVV(cardData.cvv, cardType)) {
    errors.push(`El CVV debe tener ${cardType === 'American Express' ? '4' : '3'} dígitos`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    cardType
  };
};