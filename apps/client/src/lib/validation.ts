export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
  if (password.length < 8) {
    return { isValid: false, error: "パスワードは8文字以上で入力してください" };
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  if (!hasUpperCase) {
    return { isValid: false, error: "パスワードには英大文字を1文字以上含めてください" };
  }

  if (!hasLowerCase) {
    return { isValid: false, error: "パスワードには英小文字を1文字以上含めてください" };
  }

  if (!hasNumber) {
    return { isValid: false, error: "パスワードには数字を1文字以上含めてください" };
  }

  if (!hasSymbol) {
    return { isValid: false, error: "パスワードには記号を1文字以上含めてください" };
  }

  return { isValid: true };
};
