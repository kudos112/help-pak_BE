const allRoles = {
  user: [],
  ngo: [],
  provider: [],
  admin: ['getUsers', 'manageUsers', 'manageNgos', 'getNgos', 'manageMedicalCamps'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
