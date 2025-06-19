import { generate } from "otp-generator";

export const generetOTP = () => {
  return generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
};
