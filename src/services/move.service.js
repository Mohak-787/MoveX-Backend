const Move = require('../models/move.model');
const mapService = require('../services/maps.service');
const { sendMessageToSocketId } = require('../socket');
const crypto = require('crypto');

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


function getOTP(num) {
  // wrapper around crypto.randomInt to generate a fixed‑length numeric string
  const OTP = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
  return OTP;
}

async function createMove({
  user, pickup, destination, vehicleType
}) {
  if (!user || !pickup || !destination || !vehicleType) {
    throw new Error('All fields are required');
  }

  const fare = await getFare(pickup, destination);

  const move = await Move.create({
    user,
    pickup,
    destination,
    otp: getOTP(6),
    fare: fare[vehicleType]
  });

  return move;
}

// export functions as named properties for consistency
module.exports = {
  getFare,
  createMove,
  confirmMove,
  startMove,
  endMove
};

async function confirmMove({ moveId, mover }) {
  if (!moveId) {
    throw new Error('Move id is required');
  }

  const move = await Move.findOne({ _id: moveId }).populate('user').select('+OTP');

  if (!move) {
    throw new Error('Move not found');
  }

  move.status = 'accepted';
  move.mover = mover._id;

  return move.save();
}

async function startMove({ moveId, OTP, mover }) {
  if (!moveId || !OTP) {
    throw new Error('Move id and OTP are required');
  }

  const move = await Move.findOne({ _id: moveId }).populate('user').select('+OTP');

  if (!move) {
    throw new Error('Move not found');
  }

  if (move.otp !== OTP) {
    throw new Error('Invalid OTP');
  }

  move.status = 'ongoing';

  return move.save();
}

async function endMove({ moveId, mover }) {
  if (!moveId) {
    throw new Error('Move id is required');
  }

  const move = await Move.findOne({
    _id: moveId,
    mover: mover._id
  }).populate('user').populate('mover').select('+OTP');

  if (!move) {
    throw new Error('Move not found');
  }

  if (move.status !== 'ongoing') {
    throw new Error('Move not ongoing');
  }

  await Move.findOneAndUpdate({
    _id: moveId
  }, {
    status: 'completed'
  })

  return move;
}