const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const moverSchema = new mongoose.Schema({
  fullName: {
    firstName: {
      type: String,
      required: true,
      minlength: [3, 'First name must be at least 3 characters long']
    },
    lastName: {
      type: String,
      minlength: [3, 'Last name must be at least 3 characters long']
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    minlength: [5, "Email must be at least 5 characters long"],
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    minlength: [6, "Password must be at least 6 characters long"],
    required: true,
    select: false
  },
  socketId: {
    type: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'inactive'
  },
  vehicle: {
    color: {
      type: String,
      required: true,
      minlength: [3, 'Color must be at least 3 characters long']
    },
    plate: {
      type: String,
      required: true,
      minlength: [3, 'Plate must be at least 3 characters long']
    },
    capacity: {
      type: Number,
      required: true,
      min: [1, 'Capacity must be at least be 1']
    },
    vehicleType: {
      type: String,
      required: true,
      enum: ['car', 'bike', 'scooter']
    }
  },
  location: {
    ltd: {
      type: Number,
    },
    lng: {
      type: Number
    }
  }
}, { timestamps: true });

moverSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: "24h" });
  return token;
}

moverSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
}

moverSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
}

const Mover = mongoose.model("Mover", moverSchema);
module.exports = Mover;