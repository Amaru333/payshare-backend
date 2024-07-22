const currencyList = require("../constants/currencyList");

module.exports = {
  getAllCurrencies: async (req, res) => {
    const sortedCurrencies = currencyList.sort((a, b) => a.name.localeCompare(b.name));
    res.status(200).json(sortedCurrencies);
  },
};
