import mongoose from "mongoose"
import bcrypt from 'bcrypt'
import validator from 'validator'

// Create a schema to register people
const RegisterSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    phone: String,
    address: String,
    dob: Date,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    role: {
        type: String,
        default: "Customer"
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
}, {timestamps: true})

// Static signup method
RegisterSchema.statics.signup = async function(email, password, role) {
    // Validate email and password
    if (!email || !password || !role) {
        throw Error("All fields must be filled!")
    }
    if (!validator.isEmail(email)){
        throw Error("Not a valid email")
    }
    if (!validator.isStrongPassword(password)){
        throw Error("Password does not meet requirements")
    }

    const exists = await this.findOne({email})
    
    // Check if email is already in use
    if (exists) {
        throw Error("Email already in use")
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = await this.create({ email, password: hash, role})

    return user
}

// static login method
RegisterSchema.statics.login = async function(email, password) {
    
    if (!email || !password) {
      throw Error('All fields must be filled')
    }
  
    const user = await this.findOne({ email })
    if (!user) {
      throw Error('Incorrect email')
    }
  
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      throw Error('Incorrect password')
    }
  
    return user
  }

  RegisterSchema.statics.profile = async function (email, firstName, lastName, phone, address, dob) {
    const updateFields = {};
  
    if (typeof firstName !== 'undefined') {
      updateFields.firstName = firstName !== '' ? firstName : null;
    }
  
    if (typeof lastName !== 'undefined') {
      updateFields.lastName = lastName !== '' ? lastName : null;
    }
  
    if (typeof phone !== 'undefined') {
      updateFields.phone = phone !== '' ? phone : null;
    }
  
    if (typeof address !== 'undefined') {
      updateFields.address = address !== '' ? address : null;
    }
  
    if (typeof dob !== 'undefined') {
      updateFields.dob = dob !== '' ? dob : null;
    }
  
    const user = await this.findOneAndUpdate({ email }, { $set: updateFields }, { new: true });
  
    return user;
  };

  RegisterSchema.statics.getUser = async function(email) {
    const user = await this.findOne({email})

    return user
  }

export default mongoose.model("user", RegisterSchema);