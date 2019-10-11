const mariadb = require('mariadb/callback');
const dbConnection = mariadb.createConnection({
    host: '18.139.229.175',
    port:'3306',
    user: 'veryfind',
    password: 'Veryfind_026',
    database:'veryfine'
});

module.exports = {dbConnection}