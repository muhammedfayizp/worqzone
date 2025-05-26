import type { formError, userSignIn, userSignUp } from '../interface/Interface';



export const validateField = (
  name: string,
  value: string,
  isLogin: boolean = false
): string | undefined => {
  const trimmedValue = value?.trim() || '';

  switch (name) {
    case "name":
      if (!isLogin && !trimmedValue) return "Full name is required";
      break;

    case "email":
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!trimmedValue) return "Email address is required";
      if (!emailRegex.test(trimmedValue)) return "Invalid email format";
      break;

    case "phone":
      if (!isLogin) {
        const phoneRegex = /^\d{10}$/;
        if (!trimmedValue) return "Phone number is required";
        if (!phoneRegex.test(trimmedValue)) return "Phone number must be exactly 10 digits";
      }
      break;

    case "role":
      if (!trimmedValue) return "Role is required";
      break;

    case "password":
      if (!trimmedValue) return "Password is required";
      if (trimmedValue.length < 8) return "Password must be at least 8 characters";
      if (!/\d/.test(trimmedValue)) return "Password must contain at least one number";
      break;

    case "confirmPassword":
      if (!isLogin && !trimmedValue) return "Confirm password is required";
      break;
  }

  return undefined;
};



export const validateForm = (formData: userSignUp | userSignIn, role: string) => {
  const isLogin = role === 'login';

  const errors: formError = {}

  const fieldValidation = isLogin
    ? ["email", "password", "role"]
    : ["name", "email", "phone", "role", "password", "confirmPassword"];

  fieldValidation.forEach(field => {

    const key = field as keyof (userSignUp | userSignIn);
    const error = validateField(field, formData[key] || '', isLogin)
    if (error) errors[field as keyof formError] = error

  })

  if (!isLogin && (formData as userSignUp).password !== (formData as userSignUp).confirmPassword) {
    errors.confirmPassword = 'password do not match'
  }

  return {
    isValidate: Object.keys(errors).length === 0,
    errors
  }

}