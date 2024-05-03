import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors'
import dotenv from "dotenv";
import userRoutes from './routes/userRoutes.mjs'
import authRoutes from './routes/authRoutes.mjs';
import orderRoutes from './routes/orderRoutes.mjs';
import employeeRoutes from './routes/employeeRoutes.mjs';
import RegisterModel from './models/userModels.mjs';
import timeEntryRoutes from './routes/timeEntryRoutes.mjs';
import inventoryRoutes from './routes/inventoryRoutes.mjs';
import invTrackingRoutes from './routes/invTrackingRoutes.mjs'
import transporter from './mailer/mailer.mjs';
import stripe from './routes/stripe.mjs'
import crypto from 'crypto';
import bcrypt from 'bcrypt';

// dotenv to keep Mongo connection save
dotenv.config();

// express app
const app = express()
app.use(cors())
app.use(bodyParser.json());

//Middleware to show requests, looks for the json content in incoming request bodies
app.use(express.json())
app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

// routes
app.use('/user', userRoutes)
app.use('/order', orderRoutes)
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/employees', employeeRoutes);
app.use('/time-entries', timeEntryRoutes);
app.use('/inventory', inventoryRoutes);
app.use('/tracking', invTrackingRoutes);
app.use('/stripe', stripe)




// URL to connect to DB
mongoose.connect(process.env.REACT_APP_PIZZA_CONNECTION)
  .then(() => {
    // listen for service running
    app.listen(process.env.PORT, () =>{
    console.log("Connected to db  and listening on ", process.env.PORT)
  })
}).catch((error) => {
  console.log(error)
})



app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  // Generate a reset token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Find the user by email and update the reset token
  await RegisterModel.findOneAndUpdate(
    { email },
    { resetToken, resetTokenExpiry: Date.now() + 3600000 } // Token expires in 1 hour
  );

  // Construct the reset link
  const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

  // Send the reset link via email
  const mailOptions = {
    from: 'kan614760@gmail.com',
    to: email,
    subject: 'Password Reset Request',
    html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Password Reset Request</h2>
            <p>
                You have requested to reset your password. Click the link below to reset your password.
            </p>
            <p style="margin-top: 20px;">
                <a href="${resetLink}" style="padding: 10px 20px; background-color: #007BFF; color: #fff; text-decoration: none; border-radius: 5px;">
                    Reset Password
                </a>
            </p>
            <p style="margin-top: 20px;">
                If you did not request a password reset, please ignore this email.
            </p>
        </div>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).send('An error occurred while sending the email.');
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).send('Password reset link sent to your email.');
    }
  });
});

const User = RegisterModel;

app.post('/check-email', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    res.json({ emailExists: !!user });
  } catch (error) {
    console.error('Error checking email:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.post('/reset-password', async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.findOneAndUpdate({ email }, { password: hashedPassword }, { new: true });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('Password reset successful for email:', email);
    res.sendStatus(200);
  } catch (error) {
    console.error('Password reset failed:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});