import nodemailer from 'nodemailer';

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

export default transport;
