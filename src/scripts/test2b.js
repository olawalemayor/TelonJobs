const appRoot = require("app-root-path");
const convertToJSON = require("../modules/convertToJSON");
const excelDateToJS = require("../modules/excelDateToJS");
const asyncJsonToCSV = require("../modules/asyncJsonToCSV");

//specify entry file path (*.xlsx*)
// const filePath = path.join(process.cwd(), "src/assets/Purchases.xlsx");
const filePath = appRoot.resolve("results/test2a_result9.281420713808682.csv");

//Specify save path (ends with *.csv*)
const resultPath = appRoot.resolve(
  `results/test2b_result${Math.random() * 10}.csv`
);

const data = convertToJSON(filePath); //get JSON from Excel file
let result = []; //define the final result

const years = new Set(data.map((transaction) => transaction.Year));

data.forEach((transaction) => {
  const lYT = data.find(
    (transctn) =>
      transctn.Year === transaction.Year - 1 &&
      transctn.Quater === transaction.Quater
  );

  const lYQ4T = data.find(
    (transctn) =>
      transctn.Year === transaction.Year - 1 && transctn.Quater === 4
  );

  const lastYearTransaction = lYT ? lYT : { "Average Price": "Not Applicable" };
  const lastYearQ4Transaction = lYQ4T
    ? lYQ4T
    : { "Average Price": "Not Applicable" };

  result.push({
    ...transaction,
    "Last Year Average Price": lastYearTransaction["Average Price"],
    "Last Year Q4 Average Price": lastYearQ4Transaction["Average Price"],
  });
});

const asyncResult = Promise.resolve(result); //convert the final result to an asynchronous result to be able to use the asyncJsonToCSV module

asyncJsonToCSV(asyncResult, resultPath); //Create the resulting file in the specified path
