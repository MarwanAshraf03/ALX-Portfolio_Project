export default class AppController {
  static count = 0;

  static getHomepage(request, response) {
    AppController.count += 1; // Directly use the class name
    console.log("hello from admin.js");
    response.send(`This is the ${AppController.count}th request`);
  }
}
