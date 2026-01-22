const fs = require("fs");
const path = require('path');

exports.deleteFile = (filePath) => {
  filePath = path.join(path.dirname(require.main.filename), filePath);
  fs.unlink(filePath, (err) => {
    if (err) throw err;
  });
};
