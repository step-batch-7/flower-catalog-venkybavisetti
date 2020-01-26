const fs = require("fs");
const Response = require("./lib/response");
const { loadTemplate } = require("./lib/viewTemplate");
const CONTENT_TYPES = require("./lib/mimeTypes");
const STATIC_FOLDER = `${__dirname}/public`;

const serveStaticFile = req => {
  const path = `${STATIC_FOLDER}${req.url}`;
  const stat = fs.existsSync(path) && fs.statSync(path);
  if (!stat || !stat.isFile()) return new Response();
  const [, extension] = path.match(/.*\.(.*)$/) || [];
  const contentType = CONTENT_TYPES[extension];
  const content = fs.readFileSync(path);
  const res = new Response();
  res.setHeader("Content-Type", contentType);
  res.setHeader("Content-Length", content.length);
  res.statusCode = 200;
  res.body = content;
  return res;
};

const serveHomePage = req => {
  const html = loadTemplate("index.html", {});
  const res = new Response();
  res.setHeader("Content-Type", CONTENT_TYPES.html);
  res.setHeader("Content-Length", html.length);
  res.statusCode = 200;
  res.body = html;
  return res;
};
const abeliophyllumPage = function(req) {
  const html = loadTemplate("Abeliophyllum.html", {});
  const res = new Response();
  res.setHeader("Content-Type", CONTENT_TYPES.html);
  res.setHeader("Content-Length", html.length);
  res.statusCode = 200;
  res.body = html;
  return res;
};

const ageratumPage = function(req) {
  const html = loadTemplate("Ageratum.html", {});
  const res = new Response();
  res.setHeader("Content-Type", CONTENT_TYPES.html);
  res.setHeader("Content-Length", html.length);
  res.statusCode = 200;
  res.body = html;
  return res;
};

const guestBookPage = function(req) {
  const html = loadTemplate("guestBook.html", {});
  const res = new Response();
  res.setHeader("Content-Type", CONTENT_TYPES.html);
  res.setHeader("Content-Length", html.length);
  res.statusCode = 200;
  res.body = html;
  return res;
};

const loadComments = function() {
  const content = fs.readFileSync("./data/comments.json", "utf8");
  if (content) return JSON.parse(content);
  return [];
};

const storeComments = function(comments) {
  const string = JSON.stringify(comments);
  fs.writeFileSync("./data/comments.json", string, "utf8");
};

const loadHtmlOnComments = function(comments) {
  console.log(comments);
  const commentsTable = comments
    .map(comment => {
      const html = `<tr>
    <td>${comment.date}</td>
    <td>${comment.name}</td>
    <td>${comment.comment}</td>
    </tr> `;
      return html;
    })
    .join("\n");
  return { comments: commentsTable };
};

const onComment = function(req) {
  let comments = loadComments();
  let newComment = req.body;
  newComment.date = new Date().toGMTString();
  comments.push(newComment);
  storeComments(comments);
  const html = loadTemplate("guestBook.html", loadHtmlOnComments(comments));
  const res = new Response();
  res.setHeader("Content-Type", CONTENT_TYPES.html);
  res.setHeader("Content-Length", html.length);
  res.statusCode = 200;
  res.body = html;
  return res;
};

const findHandler = req => {
  if (req.method === "GET" && (req.url === "/" || req.url === "/index.html"))
    return serveHomePage;
  if (req.method === "GET" && req.url === "/Abeliophyllum.html")
    return abeliophyllumPage;
  if (req.method === "GET" && req.url === "/Ageratum.html") return ageratumPage;
  if (req.method === "GET" && req.url === "/guestBook.html")
    return guestBookPage;
  if (req.method === "POST" && req.url === "/submitComment") return onComment;
  if (req.method === "GET") return serveStaticFile;
  return () => new Response();
};

const processRequest = function(req) {
  const handler = findHandler(req);
  return handler(req);
};

module.exports = processRequest;
