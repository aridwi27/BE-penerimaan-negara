const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const moment = require('moment');

const { modelReg,
    modelCheck,
    modelUpdate,
    modelDetail} = require('../models/users');

const { failed,
    success,
    notFound } = require('../helpers/response');
module.exports = {
    //user login
    login: (req, res) => {
        const body = req.body;
        modelCheck(body.nik).then(async (response) => {
            if (response.recordset.length === 1) {
                console.log(body.password,'dan', response.recordset[0].password)
                const checkPassword = await bcrypt.compare(body.password, response.recordset[0].password);
                console.log(checkPassword, 'data ber')
                if (checkPassword) {
                    const userData = {
                        nik: response.recordset[0].nik,
                        name: response.recordset[0].name
                    };
                    const token = jwt.sign(userData, process.env.JWT_SECRET);
                    success(res, {token, nik: response.recordset[0], name: response.recordset[0].name }, {}, 'login succesful')
                } else {
                    failed(res, "Wrong Password", {})
                }
            } else {
                failed(res, "Email hasn't been registered", {})
            }
        }).catch((err) => {
            failed(res, "Server Error", {})
            console.log(err)
        })
    },

    userReg: (req, res) => {
        const body = req.body;
        const data = {
            nik: body.nik,
            password: body.password,
            access: body.access,
            name: body.name,
        }
        modelCheck(body.nik).then(async (response) => {
            if (response.recordset.length >= 1) {
                failed(res, "Email has been registered", {})
            } else {
                if (!body.nik || !body.password || !body.name) {
                    failed(res, 'Empty Field, All Field Required', {})
                } else {
                    const salt = await bcrypt.genSalt();
                    const password = await bcrypt.hash(body.password, salt);

                    const user = {...data, password };
                    console.log(user, 'data user')
                    modelReg(user).then(async() => {

                        // register >>> halaman login
                        success(res, user, {}, 'Register Success')
                    }).catch((err) => {
                        failed(res, "Server Error", err.message)
                    });
                }
            }
        }).catch((err) => {
            failed(res, "Server Error, Check email", err.message)
        })
    },
    // //update User
    updateUser: async (req, res) => {
        try {
            const body = req.body
            const id = req.params.id
            const detail = await modelDetail(id)
                const data = body;
                    modelUpdate(data, id)
                    .then((response) => {
                        success(res, response, {}, 'Update User success')
                    }).catch((err) => {
                        failed(res, 'Server error', err.message)
                        console.log(err)
                    })
        } catch (error) {
            failed(res, 'Error server', error.message)
            console.log(err)
        }
    },
    // //get Detail Users
    getDetailUser: (req, res) => {
        try {
            const id = req.params.id
            modelDetail(id).then((response) => {
                if (response.length > 0) {
                    success(res, response, {}, 'Get detail user success')
                } else {
                    notFound(res, "Data unavailable", response)
                }
            }).catch((err) => {
                failed(res, 'Internal server error', err.message)
            })
        } catch (error) {
            failed(res, 'Internal server error', error.message)
        }
    },
}