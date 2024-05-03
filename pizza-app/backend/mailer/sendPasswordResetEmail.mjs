// Importing the sendEmail function from sendEmail.mjs
import sendEmail from './sendEmail.mjs';

// Function to send a password reset email
const sendPasswordResetEmail = (to, resetLink) => {
    // Email subject
    const subject = 'Password Reset Request';

    // Email body in HTML format
    const html = `<p>Click this link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`;

    // Calling the sendEmail function to send the email
    sendEmail(to, subject, html);
};

// Exporting the sendPasswordResetEmail function
export default sendPasswordResetEmail;
