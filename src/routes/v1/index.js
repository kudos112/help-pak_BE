const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const ngoRoute = require('./ngo.route');
const medicalAssistanceRoute = require('./medicalassistance.route');
const medicalCampRoute = require('./medicalcamp.route');
const fundraisingRoute = require('./fundraising.route');
const donationItemRoute = require('./donationItem.route');
const chatRoute = require('./chat.route');
const docsRoute = require('./docs.route');
const emailRoute = require('./email.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/ngos',
    route: ngoRoute,
  },
  {
    path: '/medicalassistance',
    route: medicalAssistanceRoute,
  },
  {
    path: '/medical-camp',
    route: medicalCampRoute,
  },
  {
    path: '/fundraising',
    route: fundraisingRoute,
  },
  {
    path: '/donation-item',
    route: donationItemRoute,
  },
  {
    path: '/chat',
    route: chatRoute,
  },
  {
    path: '/email',
    route: emailRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
