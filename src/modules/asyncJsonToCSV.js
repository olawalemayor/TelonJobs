const fs = require("fs/promises");
const { Parser } = require("json2csv");

const asyncJsonToCSV = async (ayncJSONFile, resultPath) => {
  const parser = new Parser();

  const doc = await ayncJSONFile;

  if (!doc) return;

  const csv = parser.parse(doc);

  fs.writeFile(resultPath, csv);
};

module.exports = asyncJsonToCSV;
