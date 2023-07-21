const http = require("http");
const fs = require("fs");
const path = require("path");
const requests = require("requests");

const server = http.createServer((req, res) => {
  if (req.url === "/" || req.url === "/home.html") {
    const homeFilePath = path.join(__dirname, "public", "home.html");
    fs.readFile(homeFilePath, "utf-8", (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end("File not Found");
      } else {
        requests(
          "https://api.openweathermap.org/data/2.5/weather?q=pune&appid=17a61aa6b042146e04af0d89d205048a"
        )
          .on("data", (chunk) => {
            const objData = JSON.parse(chunk);
            const arrData = [objData];

            const realTimeData = arrData
              .map((val) => replaceVal(data, val))
              .join("");
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(realTimeData);
          })
          .on("end", (err) => {
            if (err) return console.log("Connection closed due to errors", err);
          });
      }
    });
  } else if (req.url === "/home1.css") {
    const cssFilePath = path.join(__dirname, "public", "home1.css");
    fs.readFile(cssFilePath, "utf-8", (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end("File not Found");
      } else {
        res.writeHead(200, { "Content-Type": "text/css" });
        res.end(data);
      }
    });
  } else {
    res.writeHead(404);
    res.end("File not Found");
  }
});

const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
  temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
  temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
  return temperature;
};

server.listen(5500, "127.0.0.1", () => {
  console.log("Server is running at http://127.0.0.1:5500/");
});