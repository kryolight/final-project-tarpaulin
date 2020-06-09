const router = require('express').Router();

const { generateAuthToken, requireAuthentication, checkAuthentication } = require('../lib/auth');
