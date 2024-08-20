
require('dotenv').config();

connection = { user: process.env.USER,
    password: process.env.PASSWORD, 
    database: process.env.DATABASE,
    server: process.env.SERVER,
    options: {
        encrypt: false 
        },
}
module.exports = connection