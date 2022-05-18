const appRoot = require("app-root-path");
const convertToJSON = require("../modules/convertToJSON");
const excelDateToJS = require("../modules/excelDateToJS");
const asyncJsonToCSV = require("../modules/asyncJsonToCSV");

//specify entry file path (*.xlsx*)
const filePath = appRoot.resolve("src/assets/Purchases.xlsx");

//Specify save path (ends with *.csv*)
const resultPath = appRoot.resolve(
  `results/test2a_result${Math.random() * 10}.csv`
);

//get quater of year - helper function
const getQuaterOfYear = (date) => {
  const month = date.getMonth() + 1;
  return Math.ceil(month / 3);
};

const data = convertToJSON(filePath); //get JSON from Excel file
let result = []; //define the final result

const products = new Set(data.map((transaction) => transaction.Product));
const years = new Set(
  data.map((transaction) => excelDateToJS(transaction.Date).getFullYear())
);
const quaters = new Set(
  data.map((transaction) => getQuaterOfYear(excelDateToJS(transaction.Date)))
);

products.forEach((product) => {
  const transactions = data.filter(
    (transaction) => transaction.Product === product
  );

  years.forEach((year) => {
    quaters.forEach((quater) => {
      let totalAmount = 0,
        quantity = 0;
      transactions.forEach((transaction) => {
        if (
          product === transaction.Product &&
          year == excelDateToJS(transaction.Date).getFullYear() &&
          quater === getQuaterOfYear(excelDateToJS(transaction.Date))
        ) {
          totalAmount += transaction["Total Amount"];
          quantity += transaction.Qty;
        }
      });

      const averagePrice = quantity > 0 ? totalAmount / quantity : 0;

      result.push({
        Product: product,
        "Average Price": averagePrice,
        Year: year,
        Quater: quater,
      });
      result.sort((a, b) => a.year - b.year);
    });
  });
});

//filter result to remove null values
const finalResult = result.filter(
  (transaction) => transaction["Average Price"] > 0
);

const asyncResult = Promise.resolve(finalResult); //convert the final result to an asynchronous result to be able to usr the asyncJsonToCSV module

asyncJsonToCSV(asyncResult, resultPath); //Create the resulting file in the specified path
