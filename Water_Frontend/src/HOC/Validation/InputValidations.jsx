

export const inputHandlers = {
  
  originalPurchaseValue: (e, setFieldValue, fieldName) => {
  const value = e.target.value;

  // Allow only digits and restrict to max 4 digits
  if (/^\d{0,4}$/.test(value)) {
    setFieldValue(fieldName, value);
  }
},

};
