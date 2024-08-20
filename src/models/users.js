const connection = require('../config/mssql');
const sql = require('mssql');

module.exports = {
    //User Register

    modelReg: async(data) => {

        await sql.connect(connection);
        return new Promise( async(resolve, reject) => { 
            const query = `INSERT INTO users (nik, password, access, name) VALUES (@nik, @password, @access, @name)`;
            const request = new sql.Request();
            request.input('nik', sql.Int, data.nik);
            request.input('password', sql.VarChar, data.password);
            request.input('access', sql.Int, data.access);
            request.input('name', sql.VarChar, data.name);
            
             await request.query(query, (err, result) => {
                if (err) {
                    console.log('daata error', err)
                    reject(new Error(err));
                } else {
                    resolve(result);
                }
            })
        })
    },

    // Check NIK
    modelCheck: async(nik) => {
        await sql.connect(connection);
        return new Promise((resolve, reject) => {
            sql.query(`SELECT * FROM users WHERE nik=${nik}`, (err, result) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    console.log(result, 'data result')
                    resolve(result)
                }
            })
        })
    },
    //updateUser
    modelUpdate: (data, id) => {
        
        return new Promise(async(resolve, reject) => {
            await sql.connect(connection);
            const setClause = Object.keys(data)
            .map(key => `${key} = @${key}`)
            .join(', ');

        // Create the query
        const query = `UPDATE users SET ${setClause} WHERE id = @id`;

        // Create a request object and add inputs
        const request = new sql.Request();
        request.input('id', sql.Int, id);
        
        // Add all data fields as inputs
        Object.keys(data).forEach(key => {
            request.input(key, data[key]);
        });

        // Execute the query
        const result = await request.query(query);
        })
    },
    // //detail User
    modelDetail: async(nik) => {
        await sql.connect(connection);
        return new Promise((resolve, reject) => {
            sql.query(`SELECT * FROM users WHERE nik='${nik}'`, (err, result) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    },

}

