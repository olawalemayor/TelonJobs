const xlsx = require("xlsx");

const convertToJSON = (filePath) => {
  const wb = xlsx.readFile(filePath);

  let result = [];

  const sheetNames = wb.SheetNames;

  sheetNames.forEach((sheet) => {
    const workSheet = wb.Sheets[sheet];

    let [headers, data] = [[], []];

    for (z in workSheet) {
      if (z[0] === "!") continue;

      let tt = 0;

      for (let i = 0; i < z.length; i++) {
        if (!isNaN(z[i])) {
          tt = i;
          break;
        }
      }

      const col = z.substring(0, tt);
      const row = parseInt(z.substring(tt));

      const value = workSheet[z].v;

      if (row === 1 && value) {
        headers[col] = value;
        continue;
      }

      if (!data[row]) data[row] = {};

      data[row][headers[col]] = value;
    }

    data.shift();
    data.shift();

    result = data;
  });

  return result;
};

module.exports = convertToJSON;
