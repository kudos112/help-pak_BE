const httpStatus = require('http-status');
const mongoose = require('mongoose');
const { statusTypes } = require('../config/model-status');
const Ngo = require('../models/NGO/ngos.model');
const FollowUs = require('../models/NGO/followus.model');
const OurPartners = require('../models/NGO/ourpartners.model');
const PersonsPost = require('../models/NGO/personpost.model');
const ProjectsCompleted = require('../models/NGO/projectscompleted.model');
const QuickLinks = require('../models/NGO/quicklinks.model');
const ApiError = require('../utils/ApiError');
const { sendEmail } = require('./email.service');

/**
 * Create a ngo
 * @param {Object} ngoBody
 * @returns {Promise<Ngo>}
 */
const createNgo = async (user, ngoBody) => {
  if (await Ngo.isEmailTaken(ngoBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  const ngoId = new mongoose.Types.ObjectId();
  const ourPartners = await OurPartners.create({
    data: ngoBody.ourPartners,
    ngoId,
  });

  const followUs = await FollowUs.create({
    data: ngoBody.followUs,
    ngoId,
  });

  const projectsCompleted = await ProjectsCompleted.create({
    data: ngoBody.projectsCompleted,
    ngoId,
  });

  const personsPost = await PersonsPost.create({
    data: ngoBody.personsPost,
    ngoId,
  });

  const quickLinks = await QuickLinks.create({
    data: ngoBody.quickLinks,
    ngoId,
  });


  let newNgoBody = { ...ngoBody };

  delete newNgoBody['ourPartners','followUs','personsPost','projectsCompleted','quickLinks'];

  const ngo = await Ngo.create({
    _id: ngoId,
    ourPartners: ourPartners._id,
    followUs: followUs._id,
    quickLinks: quickLinks._id,
    personsPost: personsPost._id,
    projectsCompleted: projectsCompleted._id,
    ownerId: user.id,
    ownerName: user.name,
    ownerEmail: user.email,
    ...newNgoBody,
  });
  return ngo;
};

/**
 * Query for ngo
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryNgos = async (filter, options) => {
  if (filter.name) {
    filter = {
      ...filter,
      name: new RegExp(`${filter.name}`, 'i'),
    };
  }
  const ngos = await Ngo.paginate(filter, options);
  return ngos;
};

/**
 * Get ngo by id
 * @param {ObjectId} id
 * @returns {Promise<Ngo>}
 */
const getNgoById = async (id) => {
  const ngo = await Ngo.findById(id).deepPopulate(`followUs`,'quickLinks','ourPartners','personsPost','projectsCompleted').exec();;
  if (!ngo || ngo?.deleted === true) return null;
  return ngo;
};

/**
 * Get Provider Ngo by id
 * @param {ObjectId} id
 * @returns {Promise<Ngo>}
 */
 const getProviderNgoById = async (ownerId) => {
  const ngo = await Ngo.findById(ownerId).deepPopulate(`followUs`,'quickLinks','ourPartners','personsPost','projectsCompleted').exec();
  if (!ngo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Ngo not found');
  }
  return ngo;
};


//check if required or not these 2 below commented services
 
// /**
//  * Get ngo by email
//  * @param {string} email
//  * @returns {Promise<Ngo>}
//  */
// const getNgoByEmail = async (email) => {
//   return Ngo.findOne({ email });
// };

// const getNgoWithEmailAndPassword = async (email, password) => {
//   const ngo = await Ngo.findOne({ email });
//   if (ngo) if (await ngo.isPasswordMatch(password)) return ngo;
//   return null;
// };

/**
 * Update ngo by id
 * @param {ObjectId} ngoId
 * @param {Object} updateBody
 * @returns {Promise<Ngo>}
 */
const updateNgoById = async (ngoId, updateBody, userId) => {
  const ngo = await getNgoById(ngoId);
  if  (
    !ngo ||
    !ngo.enabled ||
    ngo.deleted ||
    (ngo && ngo.ownerId.toString() != userId.toString())
    )
    {
    throw new ApiError(httpStatus.NOT_FOUND, 'Ngo not found');
  }
  if (updateBody.email && (await Ngo.isEmailTaken(updateBody.email, ngoId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  let newNgoBody = { ...updateBody };
  //
  //       code lines 113 to 128 -> part of medicalCamp helps here
  //
  Object.assign(ngo, updateBody);
  await ngo.save();
  return ngo;
};

/**
 * disable ngo by id
 * @param {ObjectId} ngoId
 * @returns {Promise<Ngo>}
 */
 const disableNgoById = async (ngoId) => {
  const ngo = await getNgoById(ngoId);
  if (!ngo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Ngo not found');
  }
  ngo.enabled = false;
  ngo.new = false;
  ngo.status = statusTypes.DISABLED;
  await ngo.save();
  return ngo;
};

/**
 * softDelete ngo by id
 * @param {ObjectId} ngoId
 * @returns {Promise<Ngo>}
 */
const softDeleteNgoById = async (ngoId) => {
  const ngo = await getNgoById(ngoId);
  if (!ngo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Ngo not found');
  }
  ngo.deleted = true;
  ngo.new = false;
  ngo.enabled = false;
  ngo.status = statusTypes.DELETED;
  await ngo.save();
};
/**
 * hardDelete ngo by id
 * @param {ObjectId} ngoId
 * @returns {Promise<Ngo>}
 */
const hardDeleteNgoById = async (ngoId) => {
  const ngo = await Ngo.findById(ngoId);
  if (!ngo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Ngo not found');
  }
  await ngo.remove();
  return ngo;
};

/**
 * verify ngo by id
 * @param {ObjectId} ngoId
 * @returns {Promise<User>}
 */
const verifyNgoById = async (ngoId) => {
  const ngo = await getNgoById(ngoId);
  if (!ngo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Ngo not found');
  }
  ngo.enabled = true;
  ngo.new = false;
  ngo.status = statusTypes.LIVE;
  await ngo.save();
  return ngo;
};

module.exports = {
  createNgo,
  queryNgos,
  getNgoById,
  getProviderNgoById,
  updateNgoById,
  disableNgoById,
  softDeleteNgoById,
  hardDeleteNgoById,
  verifyNgoById,
};
