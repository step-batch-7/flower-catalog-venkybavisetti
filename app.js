const fs = require("fs");
const { loadTemplate } = require("./lib/viewTemplate");
const CONTENT_TYPES = require("./lib/mimeTypes");

const getPath = function(url, extension) {
  const STATIC_FOLDER = `${__dirname}/public`;
  const htmlFile = extension === "html" ? "/html" : "";
  return `${STATIC_FOLDER}${htmlFile}${url}`;
};

const notFound = function(res) {
  res.writeHead(404);
  res.end("Not Found");
};

const serveStaticFile = (req, res) => {
  const url = req.url === "/" ? "/index.html" : req.url;
  const [, extension] = url.match(/.*\.(.*)$/) || [];
  const path = getPath(url, extension);
  const isFileExits = fs.existsSync(path) && fs.statSync(path).isFile();
  if (!isFileExits) return notFound(res);
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
  let data = "";
  req.on("data", chunk => (data += chunk));
  req.on("end", () => {
    let comments = loadComments();
    const newComment = getNewComment(data);
    comments.unshift(newComment);
    storeComments(comments);
    const html = loadTemplate("guestBook.html", getTableRows(comments));
    res.setHeader("Content-Type", CONTENT_TYPES.html);
    res.end(html);
  });
};

const getHandlers = {
  "/guestBook.html": guestBookPage,
  forAll: serveStaticFile
};

const postHandlers = {
  "/submitComment": onComment
};

const methods = {
  GET: getHandlers,
  POST: postHandlers
};

module.exports = { methods };
