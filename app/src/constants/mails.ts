export const LOGIN_MAIL = {
	subject: 'Your Code for Link Login',
	html: (otp: string) => `
    <html>
   <body>
      <p>Dear Link User,</p>
      <p>You have requested to login to your Link account. To complete your login, please use the following Code:</p>
      <p><strong style="font-size:28px;">Code: ${otp}</strong></p>
      <p>Please enter this Code on the verification page to verify your identity and access your account. This Code is valid only for the next <strong style="font-size:20px;">10 minutes</strong>.</p>
      <p>If you did not initiate this login request, please disregard this email and ensure that your Link Messenger account is secure.</p>
      <p>Thank you for choosing Link as your preferred messaging platform. If you have any further questions or concerns, feel free to reach out to our customer support team for assistance.</p>
      <br />
      <p>Best regards,</p>
      <p>Link Dev Team</p>
   </body>
</html>
  `,
};

export const REGISTER_MAIL = {
	subject: 'Welcome To Link!',
	html: (otp: string) => `
    <html>
   <body>
      <p>Welcome to Link! We Hope for best experince during your stay!</p>
      <p>To complete your registration and verification, please use the following Code:</p>
      <p><strong style="font-size:28px;">Code: ${otp}</strong></p>
      <p>Please enter this Code on the verification page to verify your identity and access your account. This Code is valid only for the next <strong style="font-size:20px;">10 minutes</strong>.</p>
      <p>If you did not initiate this registration request, please disregard this email.</p>
      <p>Thank you for choosing Link as your preferred messaging platform. If you have any further questions or concerns, feel free to reach out to our customer support team for assistance.</p>
      <br />
      <p>Best regards,</p>
      <p>Link Dev Team</p>
   </body>
</html>
   `,
};


export const FORGET_PASSWORD_MAIL = {
	subject: 'Your Code for Link Password Reset',
	html: (otp: string) => `
    html>
   <body>
      <p>Dear Link User,</p>
      <p>You have requested a password reset for your Link account. To complete your password reset, please use the following Code:</p>
      <p><strong>Code: ${otp}</strong></p>
      <p>Please enter this Code on the password reset page to verify your identity and create a new password. This Code is valid only for the next <strong>10 minutes</strong>.</p>
      <p>If you did not initiate this password reset request, please disregard this email and ensure that your Link Messenger account is secure.</p>
      <p>Thank you for choosing Link as your preferred messaging platform. If you have any further questions or concerns, feel free to reach out to our customer support team for assistance.</p>
      <br />
      <p>Best regards,</p>
      <p>Link Dev Team</p>
   </body>
</html>
  `,
};
