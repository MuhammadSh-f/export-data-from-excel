const XLSX = require("xlsx");
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/excel-data")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Something went wrong!", err));

const dataSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  entryDate: Date,
  days: Number,
  months: Number,
  years: Number,
  salary: Number,
});
const parse = (filename) => {
  const excelData = XLSX.readFile(filename);

  return Object.keys(excelData.Sheets).map((name) => ({
    name,
    data: XLSX.utils.sheet_to_json(excelData.Sheets[name]),
  }));
};
parse("./excel-test.xlsx").forEach(async (element) => {
  const Data = mongoose.model(element.name, dataSchema);

  for (let i = 0; i < element.data.length; i++) {
    const saveData = new Data({
      name: element.data[i].Employees,
      entryDate: element.data[i].Entry,
      days: element.data[i].Days,
      months: element.data[i].Months,
      years: element.data[i].Years,
      salary: element.data[i].Salary,
    });
    await saveData.save();
  }
});
