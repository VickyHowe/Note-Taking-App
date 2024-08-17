const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
      },
      message: 'Invalid email address',
    },
  },
  password: {
    type: String,
  },
  username: {
    type: String,
  },
});

userSchema.pre("save", async function (next) {
  try {
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    console.log(`Saving user with email: ${this.email}`);
    next();
  } catch (err) {
    console.error(`Error saving user: ${err}`);
    next(err);
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;