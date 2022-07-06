const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../config/logger');
const catchAsync = require('../utils/catchAsync');
const { User } = require('../models');

let url = 'http://localhost:3000/account/reset-password';

if (process.env.NODE_ENV === 'production') url = 'https://help-pak.vercel.app/account/reset-password';

// const transport = nodemailer.createTransport(config.email.smtp);
const transport = nodemailer.createTransport({
  host: config.email.smtp.host,
  port: config.email.smtp.port,
  auth: {
    user: config.email.smtp.auth.user,
    pass: config.email.smtp.auth.pass,
  },
});
/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = catchAsync(async (to, subject, text) => {
  const msg = { from: config.email.from, to, subject, text };
  await transport.sendMail(msg);
});

/**
 * Send account registeration email
 * @param {string} to
 * @returns {Promise}
 */
const sendAccountRegisterEmail = async (to) => {
  const subject = 'HelpPak Account Registered';
  // replace this url with the link to the reset password page of your front-end app
  const text = `Dear user,
You has been registered with HelpPak. Admin is going to verify your credentials until unless you can
explore the website or can give us a short review.\n
You'll get an verification Email when you'll be verified\n\n Thanks.\nHelpPak`;
  await sendEmail(to, subject, text);
};

/**
 * Send medical service creation email
 * @param {string} to
 * @returns {Promise}
 */
const sendCreateMedicalService = async (to) => {
  const subject = 'Medical Service Created';
  // replace this url with the link to the reset password page of your front-end app
  const text = `Dear user,
First of all kudos to you because you've done great by providing free medical servcies.
Admin is going to verify your credentials until unless you can
explore the website or can give us a short review.\n
You'll get an verification Email when your given details will be verified and on the table.\n\n Thanks.\n Admin HelpPak`;
  await sendEmail(to, subject, text);
};

/**
 * Send medical service creation email
 * @param {string} to
 * @returns {Promise}
 */
const sendCreateMedicalCamp = async (to) => {
  const subject = 'Medical Camp Created';
  // replace this url with the link to the reset password page of your front-end app
  const text = `Dear user,
                First of all kudos to you because you've done great by providing free medical camp services.
                Admin is going to verify your credentials until unless you can
                explore the website or can give us a short review.\n
                You'll get an verification Email when your given details will be verified and on the table.\n\n Thanks.\n Admin HelpPak`;
  await sendEmail(to, subject, text);
};

/**
 * Send fundraising service creation email
 * @param {string} to
 * @returns {Promise}
 */
 const sendCreateFundraising = async (to) => {
  const subject = 'Fundraising Created';
  // replace this url with the link to the reset password page of your front-end app
  const text = `Dear user,
                First of all kudos to you because you've done great by providing free medical camp services.
                Admin is going to verify your credentials until unless you can
                explore the website or can give us a short review.\n
                You'll get an verification Email when your given details will be verified and on the table.\n\n Thanks.\n Admin HelpPak`;
  await sendEmail(to, subject, text);
};

/**
 * Send medical service creation email
 * @param {string} to
 * @returns {Promise}
 */
const sendCreateDonationItem = async (donationItem) => {
  const subject = `Donation Item ${donationItem.name} Created`;
  // replace this url with the link to the reset password page of your front-end app
  const text = `Dear user,
                First of all kudos to you because you've done great by providing Your item for donation.
                Admin is going to verify your credentials until unless you can
                explore the website or can give us a short review.\n
                You'll get an verification Email when your given details will be verified and on the table.\n\n Thanks.\n Admin HelpPak`;
  await sendEmail(donationItem.email, subject, text);
};

/**
 * Send unverified account email
 * @param {string} to
 * @returns {Promise}
 */
const sendUnverifiedAccountEmail = async (to) => {
  const subject = 'HelpPak Account not Verified';
  // replace this url with the link to the reset password page of your front-end app
  const text = `Dear user,
                You has tried to register with HelpPak.But Unfortunately, your given information is incorrect or has ambiguities. 
                So You have your last chance come up with correct details.\n\n
                Thanks.\nAdmin\nHelpPak`;
  await sendEmail(to, subject, text);
};

/**
 * Send account verification email
 * @param {string} to
 * @returns {Promise}
 */

const sendAccountVerficationEmail = async (to) => {
  const subject = 'HelpPak Account Verified';
  // replace this url with the link to the reset password page of your front-end app
  const text = `Dear user,
                You has been Verfied and allowed to create posts or donate items you want to be.\n 
                Admin and team will always be there for you for any inconvenience you have.\n
                Plus Admin is going to verify you each post you'll create.\n\n Thanks.\nHelpPak`;
  await sendEmail(to, subject, text);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, token) => {
  const subject = 'Reset password';
  // replace this url with the link to the reset password page of your front-end app

  const resetPasswordUrl = `${url}?token=${token}`;
  const text = `Dear user,
                To reset your password, click on this link: ${resetPasswordUrl}
                If you did not request any password resets, then ignore this email.`;
  await sendEmail(to, subject, text);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationEmail = async (to, token) => {
  const subject = 'Email Verification';
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `${url}?token=${token}`;
  const text = `Dear user,
                To verify your email, click on this link: ${verificationEmailUrl}
                If you did not create an account, then ignore this email.`;
  await sendEmail(to, subject, text);
};

/**
 * Send medical Assistance verification email
 * @param {string} to
 * @returns {Promise}
 */

const sendMedicalAssistanceVerficationEmail = async (to, medicalAssistance) => {
  const subject = 'Medical Service Verified';
  // replace this url with the link to the reset password page of your front-end app
  const text = `Dear user,
                Your medical Assistance with title "${medicalAssistance.name}" has been Verfied.\n\n
                Now every needy user is able to see and contact to you.
                You're appealed to help all of them who might contact you or reach you by our context thanks in advance.
                Admin and team will always be there for you for any inconvenience you have.\n\n
                Plus Admin is going to verify everything you'll create here.\n\n Thanks.\nHelpPak`;
  await sendEmail(to, subject, text);
};

/**
 * Send medical Assistance verification email
 * @param {string} to
 * @returns {Promise}
 */

const sendItemDonationVerficationEmail = async (to, donationItem) => {
  const subject = 'Donation Item Verified';
  // replace this url with the link to the reset password page of your front-end app
  const text = `Dear user,
                Your Donation Item with title "${donationItem.name}" has been Verfied.\n\n
                Now every needy user is able to see and contact to you.
                You're appealed to help needy person who might contact you or reach you by our context thanks in advance.
                Admin and team will always be there for you for any inconvenience you have.\n\n
                Plus Admin is going to verify everything you'll create here.\n\n Thanks.\nHelpPak`;
  await sendEmail(to, subject, text);
};

const sendFundraisingVerficationEmail = async (fundraising) => {
  const subject = 'Fundraising Request Verified';
  // replace this url with the link to the reset password page of your front-end app
  const text = `Dear user,
                Your Fundraising Request with title "${fundraising.name}" has been Verfied.\n\n
                Now any donor can contact you.
                You're appealed to abstain from the junk and irrelevant Fundraising otherwise your account will be banned.\n\n
                Plus Admin is going to verify everything you'll create here.\n\n Thanks.\nHelpPak`;
  await sendEmail(fundraising.email, subject, text);
};

const sendFundraisingDisabledEmail = async (fundraising) => {
  const subject = 'Fundraising Disabled';
  // replace this url with the link to the reset password page of your front-end app
  const text = `Dear user,
                Your Fundraising Request with title "${fundraising.name}" has been Disabled.\n
                You're appealed to abstain from the junk and irrelevant Fundraising otherwise your account will be banned.\n
                Plus Admin is going to verify everything you'll create here.\n Thanks.\nHelpPak`;
  await sendEmail(fundraising.email, subject, text);
};

const sendFundraisingDeleteEmail = async (fundraising) => {
  const subject = 'Fundraising Deleted';
  // replace this url with the link to the reset password page of your front-end app
  const text = `Dear user,
                Your Fundraising Request with title "${fundraising.name}" has been deleted.\n
                
                You're appealed to abstain from the junk and irrelevant Fundraising otherwise your account will be banned.\n
                Plus Admin is going to verify everything you'll create here.\n Thanks.\nHelpPak`;
  await sendEmail(fundraising.email, subject, text);
};

const sendMedicalCampVerficationEmail = async (medicalCamp) => {
  const subject = 'Medical Camp Verified';
  // replace this url with the link to the reset password page of your front-end app
  const text = `Dear user,
                Your medical Camp with title "${medicalCamp.name}" has been Verfied.\n\n
                Now every needy user is able to see and contact to you.
                You're appealed to help all of them who might contact you or reach you by our context thanks in advance.
                Admin and team will always be there for you for any inconvenience you have.\n\n
                Plus Admin is going to verify everything you'll create here.\n\n Thanks.\nHelpPak`;
  await sendEmail(medicalCamp.email, subject, text);
};

const sendUnreadMessagesEmail = async (userId) => {
  const user = await User.findById(userId);
  if (user?.deleted === true) return;
  const subject = 'New Messages in HelpPak Messenger';
  const text = `Dear user,
                You have recieved 5 messages in your HelpPak Messenger. Go Checkout these reply the users asap.\n\n Thanks.\nHelpPak`;
  // console.log('EMail is going to send', user.email);
  await sendEmail(user.email, subject, text);
};

const sendContactUsEmail = async (email, name, message) => {
  const subject = `${name} comments HelpPak`;
  const text = `Name: ${name}\nEmail: ${email}\nMessage: ${message}`;
  // console.log('EMail is going to send', user.email);
  await sendEmail('quddoux112@gmail.com', subject, text);
};

const sendDonationItemDeletedEmail = async (donationItem) => {
  const subject = `HelpPak Support`;
  const text = `Assalam o Alaikum!\n\nHoped to your wellness, But the details you have provided for the ${donationItem.name} seems to be ambigous. So
   Admin has decided to delete your item instead of listing with ambigous data. I hope you'll come next time with real details.
   \n\nHope to see you again. Stay Safe.\n\nHelp Pakistan\nAdmin`;
  // console.log('EMail is going to send', user.email);
  await sendEmail(donationItem.email, subject, text);
};

const sendMedicalCampDeletedEmail = async (medicalCamp) => {
  const subject = `HelpPak Support`;
  const text = `Assalam o Alaikum!\n\nHoped to your wellness, But the details you have provided for the ${medicalCamp.name} seems to be ambigous. So
   Admin has decided to delete your item instead of listing with ambigous data. I hope you'll come next time with real details.
   \n\nHope to see you again. Stay Safe.\n\nHelp Pakistan\nAdmin`;
  // console.log('EMail is going to send', user.email);
  await sendEmail(medicalCamp.email, subject, text);
};

const sendDisabledDonationItemEmail = async (donationItem) => {
  const subject = `HelpPak Support`;
  const text = `Assalam o Alaikum!\n\nHoped to your wellness, But the details you have provided for the ${donationItem.name} seems to be ambigous. So
   Admin has decided to disable your item instead of listing with ambigous data. I hope you'll come next time with real details.
   \n\nHope to see you again. Stay Safe.\n\nHelp Pakistan\nAdmin`;
  // console.log('EMail is going to send', user.email);
  await sendEmail(donationItem.email, subject, text);
};

const sendDisabledMedicalAssistanceEmail = async (medicalAssistance) => {
  const subject = `HelpPak Support`;
  const text = `Assalam o Alaikum!\n\nHoped to your wellness, But the details you have provided for the ${medicalAssistance.name} seems to be ambigous. So
   Admin has decided to disable your item instead of listing with ambigous data. I hope you'll come next time with real details.
   \n\nHope to see you again. Stay Safe.\n\nHelp Pakistan\nAdmin`;
  // console.log('EMail is going to send', user.email);
  await sendEmail(medicalAssistance.email, subject, text);
};

const sendMedicalCampDisableEmail = async (medicalCamp) => {
  const subject = `HelpPak Support`;
  const text = `Assalam o Alaikum!\n\nHoped to your wellness, But the details you have provided for the ${medicalCamp.name} seems to be ambigous. So
   Admin has decided to disable your item instead of listing with ambigous data. I hope you'll come next time with real details.
   \n\nHope to see you again. Stay Safe.\n\nHelp Pakistan\nAdmin`;
  // console.log('EMail is going to send', user.email);
  await sendEmail(medicalCamp.email, subject, text);
};

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendUnverifiedAccountEmail,
  sendContactUsEmail,
  sendAccountRegisterEmail,
  sendAccountVerficationEmail,
  sendCreateDonationItem,
  sendCreateMedicalService,
  sendCreateFundraising,
  sendItemDonationVerficationEmail,
  sendCreateMedicalCamp,
  sendMedicalAssistanceVerficationEmail,
  sendMedicalCampVerficationEmail,
  sendMedicalCampDisableEmail,
  sendUnreadMessagesEmail,
  sendMedicalCampDeletedEmail,
  sendDonationItemDeletedEmail,
  sendDisabledDonationItemEmail,
  sendDisabledMedicalAssistanceEmail,
  sendFundraisingVerficationEmail,
  sendFundraisingDisabledEmail,
  sendFundraisingDeleteEmail,
};
