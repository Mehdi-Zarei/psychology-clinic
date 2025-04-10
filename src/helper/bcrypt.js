const bcrypt = require("bcryptjs");

const hashData = async (data) => {
  try {
    return bcrypt.hashSync(data, 12);
  } catch (error) {
    throw error;
  }
};

const comparHashedData = async (data, encryptedData) => {
  try {
    return bcrypt.compareSync(data, encryptedData);
  } catch (error) {
    throw error;
  }
};

module.exports = { hashData, comparHashedData };
