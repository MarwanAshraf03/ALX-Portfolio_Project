import fs from "fs";

function csvParser(data) {
  const datat = {};
  const strList = data;
  const colsList = data[0].split(",");
  for (let i = 1; i < strList.length; i += 1) {
    datat[i] = {};
    for (let j = 0; j < colsList.length; j += 1) {
      datat[i][colsList[j]] = data[i].split(",")[j];
    }
  }
  return datat;
}

export default function readDatabase(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", (error, data) => {
      if (error) reject(Error("Cannot load the database"));
      else {
        const data1 = data.split("\n").filter((n) => n);
        const datat = csvParser(data1);
        const dataByField = {};
        Object.values(datat).forEach((e) => {
          if (!Object.keys(dataByField).includes(e.field))
            dataByField[e.field] = [];
          dataByField[e.field].push(e.firstname);
        });
        // return dataByField;
        resolve(dataByField);
      }
    });
  });
}
