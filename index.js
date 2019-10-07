var Auth = require('./authAPI');
var Core = require('./coreAPI');
var Content = require('./contentAPI');

const Lumi = { ...Auth, ...Core, ...Content };

module.exports = Lumi;
module.exports.default = Lumi;