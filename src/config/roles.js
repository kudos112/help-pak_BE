const allRoles = {
  user: [],
  ngo: [],
  admin: ['getUsers', 'manageUsers', 'manageNgos', 'getNgos'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
