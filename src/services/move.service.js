const Move = require('../models/move.model');
const mapService = require('../services/maps.service');

async function getFare(pickup, destination) {
  if (!pickup || !destination) {
    throw new Error('Pickup and destination are requried');
  }

  const distanceTime = await mapService.getDistanceTime(pickup, destination);

  const baseFare = {
    car: 50,
    bike: 20
  };

  const perKmRate = {
    car: 15,
    bike: 8
  };

  const perMinuteRate = {
    car: 3,
    bike: 1.5
  };

  const fare = {
    car: Math.round(baseFare.car + ((distanceTime.distance.value / 1000) * perKmRate.car) + ((distanceTime.duration.value / 60) * perMinuteRate.car)),
    bike: Math.round(baseFare.bike + ((distanceTime.distance.value / 1000) * perKmRate.bike) + ((distanceTime.duration.value / 60) * perMinuteRate.bike)),
    scooter: Math.round(baseFare.bike + ((distanceTime.distance.value / 1000) * perKmRate.bike) + ((distanceTime.duration.value / 60) * perMinuteRate.bike))
  };

  return fare;
}

module.exports = getFare;

function getOTP(num) {
  function generateOTP(num) {
    const OTP = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
    return OTP;
  }
  return generateOTP(num);
}

module.exports.createMove = async ({
  user, pickup, destination, vehicleType
}) => {
  if (!user || !pickup || !destination || !vehicleType) {
    throw new Error('All fields are required');
  }

  const fare = await getFare(pickup, destination);

  const move = Move.create({
    user,
    pickup,
    destination,
    otp: getOTP(6),
    fare: fare[vehicleType]
  });

  return move;
}