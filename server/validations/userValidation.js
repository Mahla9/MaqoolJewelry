import * as yup from 'yup';

export const registerValidation = yup.object({
  username: yup.string().required("نام الزامی است"),
  email: yup.string().email().required("ایمیل الزامی است").test(
    "is-valid-domain",
    "دامنه ایمیل معتبر نیست",
    (value) => value && value.endsWith("@gmail.com")
  ),
  password: yup.string()
  .required("رمز عبور الزامی است")
  .min(6, "رمز عبور باید حداقل 6 کاراکتر باشد")
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    "رمز عبور باید شامل حداقل یک حرف بزرگ، یک حرف کوچک، یک عدد و یک کاراکتر خاص باشد"
  ),
  confirmPassword: yup.string().oneOf([yup.ref("password")], "تأیید رمز عبور باید با رمز عبور مطابقت داشته باشد").required("تأیید رمز عبور الزامی است"),
});

export const verifyValidation = yup.object({
  email: yup.string().email().required().test(
    "is-valid-domain",
    "دامنه ایمیل معتبر نیست",
    (value) => value && value.endsWith("@gmail.com")
  ),
  code: yup.string().required(),
});

export const loginValidation = yup.object({
  username: yup.string().required("نام کاربری الزامی است"),
  password: yup.string().min(6).required("رمز الزامی است"),
});

export const forgotPasswordValidation = yup.object({
  email: yup.string().email().required("ایمیل الزامی است").test(
    "is-valid-domain",
    "دامنه ایمیل معتبر نیست",
    (value) => value && value.endsWith("@gmail.com")
  ),
});

export const resetPasswordValidation = yup.object({
  email: yup.string().email().required().test(
    "is-valid-domain",
    "دامنه ایمیل معتبر نیست",
    (value) => value && value.endsWith("@gmail.com")
  ),
  code: yup.string().required(),
  newPassword: yup.string()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, "رمز جدید ضعیف است")
    .required(),
});
