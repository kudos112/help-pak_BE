const httpStatus = require('http-status');
const mongoose = require('mongoose');
const { statusTypes } = require('../config/model-status');
const Doctors = require('../models/medical-camp/doctors.model');
const MedicalCamp = require('../models/medical-camp/medicalcamp.model');
const ApiError = require('../utils/ApiError');
const { sendEmail } = require('./email.service');

/**
 * Create a medical camp services
 * @param {Object} medicalCampBody
 * @returns {Promise<MedicalCamp>}
 */
const createMedicalCamp = async (user, medicalCampBody) => {
  if (await MedicalCamp.isNameTaken(medicalCampBody.name)) throw new ApiError(httpStatus.BAD_REQUEST, 'name already taken');

  const campId = new mongoose.Types.ObjectId();
  const doctors = await Doctors.create({
    data: medicalCampBody.doctors,
    campId,
  });

  let newCampBody = { ...medicalCampBody };

  delete newCampBody['doctors'];

  const medicalCamp = await MedicalCamp.create({
    _id: campId,
    doctors: doctors._id,
    noOfDoctors: medicalCampBody.doctors.length,
    organizerId: user.id,
    organizerName: user.name,
    organizerEmail: user.email,
    ...newCampBody,
  });
  // if (medicalCamp)
  //   sendEmail(
  //     medicalCampBody.email,
  //     'Medical Camp Service successfully created',
  //     'Medical Camp Service Successfully Created'
  //   );
  return medicalCamp;
};

/**
 * Query for medical camp services
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryMedicalCamps = async (filter, options) => {
  if (filter.name) {
    filter = {
      ...filter,
      name: new RegExp(`${filter.name}`, 'i'),
    };
  }
  const medicalCamps = await MedicalCamp.paginate(filter, options);
  return medicalCamps;
};

/**
 * Get medical camp by id
 * @param {ObjectId} id
 * @returns {Promise<MedicalCamp>}
 */
const getMedicalCampById = async (id) => {
  const medicalCamp = await MedicalCamp.findById(id).deepPopulate(`doctors`).exec();
  if (!medicalCamp || medicalCamp?.deleted === true) return null;
  return medicalCamp;
};

/**
 * Get Provider Medical Camp by id
 * @param {ObjectId} id
 * @returns {Promise<MedicalCamp>}
 */
const getProviderMedicalCampById = async (organizerId) => {
  const camp = await MedicalCamp.findById(organizerId).deepPopulate(`doctors`).exec();
  if (!camp) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Medical Camp not found');
  }
  return camp;
};

/**
 * Update medical Camp Service by id
 * @param {ObjectId} campId
 * @param {Object} updateBody
 * @returns {Promise<MedicalCamp>}
 */
const updateMedicalCampById = async (campId, updateBody, userId) => {
  const medicalCamp = await getMedicalCampById(campId);

  if (
    !medicalCamp ||
    !medicalCamp.enabled ||
    medicalCamp.deleted ||
    (medicalCamp && medicalCamp.organizerId.toString() != userId.toString())
  ) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No Medical Camp found against this id');
  }

  if (updateBody.name && (await MedicalCamp.isNameTaken(updateBody.name, campId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'name already taken');
  }

  let newCampBody = { ...updateBody };
  const doctors = await Doctors.findOne({
    campId,
  }).exec();
  if (updateBody.doctors) {
    doctors.data = updateBody.doctors;
    await doctors.save();

    newCampBody = { ...newCampBody, noOfDoctors: doctors.data.length };
  }

  delete newCampBody['doctors'];

  const newMedicalCamp = {
    doctors: doctors._id,
    ...newCampBody,
  };

  Object.assign(medicalCamp, newMedicalCamp);
  await medicalCamp.save();
  const updated = await getMedicalCampById(campId);
  return updated;
};

/**
 * verify medical camp by id
 * @param {ObjectId} campId
 * @returns {Promise<MedicalCamp>}
 */
const verifyMedicalCampById = async (campId) => {
  const medicalCamp = await getMedicalCampById(campId);
  if (!medicalCamp) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Medical Camp not found');
  }
  medicalCamp.enabled = true;
  medicalCamp.new = false;
  medicalCamp.status = statusTypes.LIVE;
  await medicalCamp.save();
  return medicalCamp;
};

/**
 * disable medical camp by id
 * @param {ObjectId} campId
 * @returns {Promise<MedicalCamp>}
 */
const disableMedicalCampById = async (campId) => {
  const medicalCamp = await getMedicalCampById(campId);
  if (!medicalCamp) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Medical Camp not found');
  }
  medicalCamp.enabled = false;
  medicalCamp.new = false;
  medicalCamp.status = statusTypes.DISABLED;
  await medicalCamp.save();
  return medicalCamp;
};

/**
 * softDelete medicalCamp by id
 * @param {ObjectId} campId
 * @returns {Promise<MedicalCamp>}
 */
const softDeleteMedicalCampById = async (campId) => {
  const medicalCamp = await getMedicalCampById(campId);
  if (!medicalCamp) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Medical Camp not found');
  }
  medicalCamp.deleted = true;
  medicalCamp.new = false;
  medicalCamp.enabled = false;
  medicalCamp.status = statusTypes.DELETED;
  await medicalCamp.save();
};

/**
 * hardDelete medical camp by id
 * @param {ObjectId} campId
 * @returns {Promise<MedicalCamp>}
 */
const hardDeleteMedicalCampById = async (campId) => {
  const medicalCamp = await MedicalCamp.findById(campId);
  if (!medicalCamp) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Medicals Camp not found');
  }
  await medicalCamp.remove();
  return medicalCamp;
};

module.exports = {
  createMedicalCamp,
  queryMedicalCamps,
  getMedicalCampById,
  getProviderMedicalCampById,
  updateMedicalCampById,
  verifyMedicalCampById,
  softDeleteMedicalCampById,
  hardDeleteMedicalCampById,
  disableMedicalCampById,
};
