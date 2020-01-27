const fs = require("fs");
const Response = require("./lib/response");
const { loadTemplate } = require("./lib/viewTemplate");
const CONTENT_TYPES = require("./lib/mimeTypes");

const getPath = function(url, extension) {
  const STATIC_FOLDER = `${__dirname}/public`;
  const htmlFile = extension === "html" ? "/html" : "";
  return `${STATIC_FOLDER}${htmlFile}${url}`;
};

const serveStaticFile = req => {
  const url = req.url === "/" ? "/index.html" : req.url;
  const [, extension] = url.match(/.*\.(.*)$/) || [];
  const path = getPath(url, extension);
  const isFileExits = fs.existsSync(path) && fs.statSync(path).isFile();
  if (!isFileExits) return new Response();
  const content = fs.readFileSync(path);
  const res = new Response();
  res.setHeaders(content, CONTENT_TYPES[extension]);
  res.statusCode = 200;
  res.body = content;
  return res;
};

const guestBookPage = function(req) {
  const comments = loadComments();
  const html = loadTemplate("guestBook.html", getTableRows(comments));
  const res = new Response();
  res.setHeader("Content-Type", CONTENT_TYPES.html);
  res.setHeader("Content-Length", html.length);
  res.statusCode = 200;
  res.body = html;
  return res;
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
      const html = `<tr>
    <td>${comment.date}</td>
    <td>${comment.name}</td>
    <td>${comment.comment}</td>
    </tr> \n`;
      return html;
    })
    .join("\n");
  return { comments: commentsTable };
};

const putWhiteSpaces = function(content) {
  const space = new RegExp("\\+", "g");
  const newLine = new RegExp("%0D%0A", "g");
  newContent = content.replace(space, " ");
  return newContent.replace(newLine, "</br>");
};

const getNewComment = function(feedback) {
  const { name, comment } = feedback;
  let newComment = {};
  newComment.name = putWhiteSpaces(name);
  newComment.comment = putWhiteSpaces(comment);
  newComment.date = new Date().toGMTString();
  return newComment;
};

const onComment = function(req) {
  let comments = loadComments();
  const newComment = getNewComment(req.body);
  comments.unshift(newComment);
  storeComments(comments);
  const html = loadTemplate("guestBook.html", getTableRows(comments));
  const res = new Response();
  res.setHeader("Content-Type", CONTENT_TYPES.html);
  res.setHeader("Content-Length", html.length);
  res.statusCode = 200;
  res.body = html;
  return res;
};

const getHandlers = {
  "/guestBook.html": guestBookPage,
  forAll: serveStaticFile
};

const postHandlers = {
  "/submitComment": onComment
};

const handlers = {
  GET: getHandlers,
  POST: postHandlers
};

const processRequest = function(req) {
  const handlerType = handlers[req.method];
  const handler = handlerType[req.url] || handlerType.forAll;
  return handler(req);
};

module.exports = processRequest;
