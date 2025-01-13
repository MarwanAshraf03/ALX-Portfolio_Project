import readDatabase from "../utils/utils.js";

export default class StudentsController {
  static getAllStudents(request, response) {
    readDatabase(process.argv[2])
      .then((data) => {
        response.statusCode = 200;
        let res = "This is the list of our students";
        // response.send();
        // console.log(data);
        // response.send(dataByField);
        Object.keys(data).forEach((e) => {
          //   response.send(
          // );
          res += `\nNumber of students in ${e}: ${data[e].length}. List: ${data[
            e
          ].join(", ")}`;
        });
        response.send(res);
      })
      .catch(() => {
        response.statusCode = 500;
        response.send("Cannot load the database");
      });
  }

  static getAllStudentsByMajor(request, response) {
    readDatabase(process.argv[2])
      .then((data) => {
        if (!["CS", "SWE"].includes(request.params.major)) {
          response.statusCode = 500;
          response.send("Major parameter must be CS or SWE");
          return response.end();
        }
        response.statusCode = 200;
        return response.send(`List: ${data[request.params.major].join(", ")}`);
      })
      .catch(() => {
        response.statusCode = 500;
        return response.send("Cannot load the database");
      });
  }
}
