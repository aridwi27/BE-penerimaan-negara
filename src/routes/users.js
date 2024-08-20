const express = require('express');

const { userReg,
        login,
        updateUser,
        getDetailUser,
     } = require('../controllers/users');

const { authentication } = require('../helpers/middleware/auth')

const Router = express.Router()

Router
  .post('/api/register', userReg)
  .post('/api/login', login)
  .patch('/api/user/:id', authentication, updateUser) 
  .get('/api/user/:id', authentication, getDetailUser)

module.exports = Router