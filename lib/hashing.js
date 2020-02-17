const bcrypt = require('bcryptjs');
const salt = 10;

const hashPassword = string => (string !== '' ? bcrypt.hashSync(string, salt) : '');
const checkHash = bcrypt.compareSync;

module.exports = { hashPassword, checkHash };
