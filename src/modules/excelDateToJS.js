const excelDateToJS = (serial) => {
  return new Date(Date.UTC(0, 0, serial - 1));
};

module.exports = excelDateToJS;
