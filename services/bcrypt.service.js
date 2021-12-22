const bcrypt = require("bcrypt");

const bcryptService = () => {
    const password = pass => {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(pass, salt);
        return hash;
    };

    const comparePassword = (pw, hash) => {
        const pass = bcrypt.compareSync(pw, hash);
        return pass;
    };

    //  bcrypt.compareSync(pw, hash);
    const updatePassword = pass => {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(pass, salt);
        return hash;
    };

    return {
        password,
        comparePassword,
        updatePassword
    };
};

const createPassword = pass => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(pass, salt);
    return hash;
};
let password = createPassword("12345678");
console.log("12345678==>", password)

module.exports = bcryptService();
