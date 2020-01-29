const fs = require("fs");
const { loadTemplate } = require("./lib/viewTemplate");
const CONTENT_TYPES = require("./lib/mimeTypes");
const { App } = require("./app");

const getPath = function(url, extension) {
  const STATIC_FOLDER = `${__dirname}/public`;
  const htmlFile = extension === "html" ? "/html" : "";
  return `${STATIC_FOLDER}${htmlFile}${url}`;
};

const notFound = function(res) {
  res.writeHead(404);
  res.end("Not Found");
};

const serveStaticFile = (req, res, next) => {
  const url = req.url === "/" ? "/index.html" : req.url;
  const [, extension] = url.match(/.*\.(.*)$/) || [];
  const path = getPath(url, extension);
  const isFileExits = fs.existsSync(path) && fs.statSync(path).isFile();
  if (!isFileExits) return next();
  const content = fs.readFileSync(path);
  res.setHeader("Content-Type", CONTENT_TYPES[extension]);
  res.end(content);
};

const guestBookPage = function(req, res) {
  const comments = loadComments();
  const html = loadTemplate("guestBook.html", getTableRows(comments));
  res.setHeader("Content-Type", CONTENT_TYPES.html);
  res.end(html);
};

const loadComments = function() {
  const path = "./data/comments.json";
  const stat = fs.existsSync(path) && fs.statSync(path);
  if (!stat || !stat.isFile()) return [];
  return require("./data/comments.json");
};

const storeComments = function(comments) {
  const string = JSON.stringify(comments);
  fs.writeFileSync("./data/comments.json", string, "utf8");
};

const getTableRows = function(comments) {
  const commentsTable = comments
    .map(comment => {
      const html = `<div class= "comment">
      <div class="name"><span>&#129333</span>${comment.name}
     <div class="date"><span style='font-size:13px;'>&#8986;</span>${comment.date}</div></div>
     <p><span >&#129488</span>${comment.comment}</p>
    </div>`;
      return html;
    })
    .join("\n");
  return { comments: commentsTable };
};

const putWhiteSpaces = function(content) {
  newContent = content.replace(/\+/g, " ");
  return decodeURIComponent(newContent);
};
const pickDetails = (query, keyValue) => {
  const [key, value] = keyValue.split("=");
  query[key] = value;
  return query;
};

const parseFeedback = function(keyValueTextPairs) {
  return keyValueTextPairs.split("&").reduce(pickDetails, {});
};

const getNewComment = function(feedbackData) {
  const { name, comment } = parseFeedback(feedbackData);
  let newComment = {};
  newComment.name = putWhiteSpaces(name);
  newComment.comment = putWhiteSpaces(comment);
  newComment.date = new Date().toLocaleString();
  return newComment;
};

const onComment = function(req, res) {
  let comments = loadComments();
  const newComment = getNewComment(req.body);
  comments.unshift(newComment);
  storeComments(comments);
  res.statusCode = 301;
  res.setHeader("Location", "/guestBook.html");
  res.end();
};

const methodNotAllowed = function(req, res) {
  res.writeHead(400, "Method Not Allowed");
  res.end();
};

const readBody = function(req, res, next) {
  let data = "";
  req.on("data", chunk => (data += chunk));
  req.on("end", () => {
    req.body = data;
    next();
  });
};

const app = new App();

app.use(readBody);

app.get("/guestBook.html", guestBookPage);
app.get("", serveStaticFile);
app.get("", notFound);
app.post("/submitComment", onComment);
app.post("", notFound);
app.use(methodNotAllowed);

module.exports = { app };
