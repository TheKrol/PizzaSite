// Importing the nodemailer library
import nodemailer from 'nodemailer';

// Function to send an email
const sendEmail = async (to, subject, html) => {
    // Creating a nodemailer transport using Gmail SMTP
    const transport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        service: "Gmail",
        port: 587, // 587 is the default TLS port
        secure: false,
        auth: {
            user: "pizzaapp62@gmail.com",
            pass: "uimk qosg xtea ghuj"
        }
    });

    // Configuring email options
    const mailOptions = {
        from: 'your-email@gmail.com', // Specify the sender's email address
        to,                           // Recipient's email address
        subject,                      // Email subject
        html,                         // HTML content of the email
    };

    try {
        // Sending the email using nodemailer
        await transport.sendMail(mailOptions);
        console.log('Email sent successfully.');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

// Exporting the sendEmail function
export default sendEmail;
