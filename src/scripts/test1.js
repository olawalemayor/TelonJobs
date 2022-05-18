const appRoot = require("app-root-path");
const fs = require("fs/promises");
const asyncJsonToCSV = require("../modules/asyncJsonToCSV");

//This is the entry File
// const filePath = "/assets/2021_11_30.txt"; //First test
// const filePath = "/assets/2021_12_04.txt"; //Second test
const filePath = "src/assets/2021_12_05.txt"; //Third test

const file = appRoot.resolve(filePath);

//This will generate a random result file name
const resultPath = appRoot.resolve(
  `results/test1_result${Math.random() * 10}.csv`
);

//To read and convert the doc to JSON format
const readDoc = async () => {
  try {
    const data = await fs.readFile(file, { encoding: "utf8" });
    if (!data) return;
    const transactions = data.split("----------NEW TRANSACTON-----------\r\n"); //split document by the NEW TRANSACTION line

    let result = []; //Final resulting table in JSON format

    transactions.splice(0, 1); //removes the first row (it is an empty row because of the first NEW TRANSACTION line)

    transactions.forEach((transaction) => {
      const newString = transaction.trim().split("\r\n"); //Remove trailing spaces in file and split each items to a new line

      let transactionObj = {}; //empty transaction

      newString.forEach((field) => {
        const [key, value] = field.split(":"); //split fields into key and value
        transactionObj[key] = value; //fills the empty transaction with data
      });

      result.push(transactionObj); //adds transation to resulting table
    });

    return result;
  } catch (error) {
    console.log(error);
  }
};

//To transform the JSON Doc to CSV Table
asyncJsonToCSV(readDoc(), resultPath);
