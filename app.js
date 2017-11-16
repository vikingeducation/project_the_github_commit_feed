var github = require("./lib/github");
fs = require("fs");
var http = require("http");
let url = require("url");

var commits = github.githubCommits(
  "GeneTinderholm",
  "project_github_commit_feed"
);

var server = http.createServer((req, res) => {
  path = url.parse(req.url).pathname;
  if (path === "/") {
    displayRoot(req, res);
  } else if (path === "/commits") {
    displayCommits(req, res);
  }
});
server.listen(3000, "localhost");

let displayCommits = (req, res) => {
  fs.readFile("./public/index.html", "utf8", (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.end("404");
    } else {
      let body = "";
      req.on("data", data => {
        body += data;
      });
      req.on("end", () => {
        req.body = body;
        let path = url.parse(req.url).pathname;
        let query = url.parse(req.url).query;
        let fields = query.split("&");
        fields = fields.map(field => {
          return field.split("=");
        });
        let params = {};
        params[fields[0][0]] = fields[0][1];
        params[fields[1][0]] = fields[1][1];
        console.log(params);
        github
          .githubCommits(params.owner, params.repo)
          .then((err, data) => {
            if (err) {
              throw err;
            } else {
              console.log(data);
              return data;
            }
          })
          .then(data => {
            res.statusCode = 200;
            let jData = JSON.stringify(data);
            let body2 = body.replace("{{commitData}}", jData);
            res.end(body2);
          })
          .catch(err => {
            if (err) {
              console.log(err);
            }
          });
      });
    }
  });
};

var displayRoot = (req, res) => {
  fs.readFile("./public/index.html", "utf8", (err, data) => {
    if (err) {
      res.end("404");
    } else {
      res.end(data);
    }
  });
};

var appObj;
module.exports = appObj;
