export const LOGIN_MAIL = {
	subject: 'Your Code for Link Messenger Login',
	html: (otp: string) => `
    <html>
   <body>
      <p>Dear Link Messenger User,</p>
      <p>You have requested to log in to your Link Messenger account. To complete your login, please use the following One-Time Password (OTP):</p>
      <p><strong style="font-size:28px;">Code: ${otp}</strong></p>
      <p>Please enter this Code on the login page to verify your identity and access your account. This Code is valid only for the next <strong style="font-size:20px;">10 minutes</strong>.</p>
      <p>If you did not initiate this login request, please disregard this email and ensure that your Link Messenger account is secure.</p>
      <p>Thank you for choosing Link Messenger as your preferred messaging platform. If you have any further questions or concerns, feel free to reach out to our customer support team for assistance.</p>
      <br>
      <p>Best regards,</p>
      <p>Link Dev Team</p>
   </body>
</html>
  `,
};

export const FORGET_PASSWORD_MAIL = {
	subject: 'Your Code for Link Messenger Password Reset',
	html: (otp: string) => `
    html>
   <body>
      <p>Dear Link Messenger User,</p>
      <p>You have requested a password reset for your Link Messenger account. To complete your password reset, please use the following One-Time Password (OTP):</p>
      <p><strong>Code: ${otp}</strong></p>
      <p>Please enter this Code on the password reset page to verify your identity and create a new password. This Code is valid only for the next <strong>10 minutes</strong>.</p>
      <p>If you did not initiate this password reset request, please disregard this email and ensure that your Link Messenger account is secure.</p>
      <p>Thank you for choosing Link Messenger as your preferred messaging platform. If you have any further questions or concerns, feel free to reach out to our customer support team for assistance.</p>
      <br />
      <small>this One Time Password feature is to ensure your accounts safety not to bother you :)</small>
      <br />
      <p>Best regards,</p>
      <p>Link Dev Team</p>
   </body>
</html>
  `,
};
