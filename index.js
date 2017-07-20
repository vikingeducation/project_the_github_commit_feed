const http = require("http");
const url = require("url");
const app = require("./lib/routeInit.js");
const apiWrapper = require("./lib/apiWrapper");

const PORT = process.env.port || process.argv[2] || 3000;
const HOST = "127.0.0.1";

app.get("/", (req, res) => {
  res.statusCode = 200;
  res.end("Hello World!");
});

app.get("/:username/:repository", (req, res) => {
  // Authenticate with github using our token
  apiWrapper.authenticate();

  apiWrapper.getCommits().then(apiWrapper.parseData).then(
    results => {
      console.log(results);
      res.statusCode = 200;

      // read in the file we need to display (index.html)
      res.end();

      // res.render('index', {
      //   title: 'Github Commit Feed',
      //   commits: apiWrapper.parseData(results.data)
      // });
    },
    error => {
      console.log(error);
    }
  );
});

app.listen(PORT, HOST, () => {
  console.log(`Listening on ${HOST}:${PORT}`);
});
