import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

const userSchema =  mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },

}, {
    timestamps: true
});


userSchema.methods.matchPassword = async function (enteredPassword) {
  const pass = await bcrypt.compare(enteredPassword, this.password)
  return pass
}


userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt); // Add await here
  next();
});



const User = mongoose.model("User", userSchema)

export default User 