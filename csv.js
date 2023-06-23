const fs = require("fs");

const exportToCsv = (data) => {
  let csvColumn = "id,name,email,gender,status,Created_at,Updated_at\n";

  data.forEach((el) => {
    const { id, name, email, gender, status, Created_at, Updated_at } = el;
    let csvRow = `${id},${name},${email},${gender},${status},${Created_at},${Updated_at}\n`;
    csvColumn = csvColumn + csvRow;
  });

  return csvColumn;
};

module.exports = { exportToCsv };
