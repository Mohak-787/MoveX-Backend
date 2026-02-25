const Mover = require("../models/mover.model");

module.exports.createMover = async ({
  firstName, lastName, email, password,
  color, plate, capacity, vehicleType
}) => {
  if (!firstName || !email || !password || !color || !plate || !capacity || !vehicleType) {
    throw new Error("All fields are required");
  }

  const mover = Mover.create({
    fullName: { firstName, lastName },
    email,
    password,
    vehicle: { color, plate, capacity, vehicleType }
  });

  return mover;
}