import RegisterModel from "../models/userModels.mjs";
import jwt from 'jsonwebtoken'

const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d' })
}

// login user
const loginUser = async (req, res) => {
  const {email, password} = req.body

  try {
    const user = await RegisterModel.login(email, password)
    // create a token
    const token = createToken(user._id)

    res.status(200).json({email, token})
  } catch (error) {
    res.status(400).json({error: error.message})
    console.log(error.message)
  }
}

// signup user
const signupUser = async (req, res) => {
  const {email, password, role} = req.body

  try { 
    const user = await RegisterModel.signup(email, password, role)

    // Create a token
    const token = createToken(user._id)

    res.status(200).json({email, token})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

// update user
const updateUser = async (req, res) => {
  const {email, token, firstName, lastName, phone, address, dob} = req.body

  try{
    await RegisterModel.profile(email, firstName, lastName, phone, address, dob)

    res.status(200).json({email, token})
  }catch (error) {
    res.status(400).json({error: error.message})
  }
}

const getUser = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await RegisterModel.getUser(email)

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the user profile data as JSON
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export default {
  loginUser,
  signupUser,
  updateUser,
  getUser
}