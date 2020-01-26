const fs = require("fs");
const Response = require("./lib/response");
const { loadTemplate } = require("./lib/viewTemplate");
const CONTENT_TYPES = require("./lib/mimeTypes");
// const commentsData = require("./data/comments.json");

const STATIC_FOLDER = `${__dirname}/public`;

// let visitorCount = 0;

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

// const serveVisitorCount = () => {
//   const text = `${visitorCount}`;
//   const res = new Response();
//   res.setHeader("Content-Type", CONTENT_TYPES.txt);
//   res.setHeader("Content-Length", text.length);
//   res.statusCode = 200;
//   res.body = text;
//   return res;
// };

// const generateStudentResponse = student => {
//   const html = loadTemplate("student.html", student);
//   const res = new Response();
//   res.setHeader("Content-Type", CONTENT_TYPES.html);
//   res.setHeader("Content-Length", html.length);
//   res.statusCode = 200;
//   res.body = html;
//   return res;
// };
// const registerStudent = req => {
//   return generateStudentResponse(req.query);
// };
// const registerStudentPost = req => {
//   return generateStudentResponse(req.body);
// };

const findHandler = req => {
  if (req.method === "GET" && req.url === "/") return serveHomePage;
  // if (req.method === "GET" && req.url === "/studentRegistration")
  // return registerStudent;
  // if (req.method === "POST" && req.url === "/studentRegistration")
  //   return registerStudentPost;
  // if (req.method === "GET" && req.url === "/visitorCount")
  //   return serveVisitorCount;
  if (req.method === "GET") return serveStaticFile;
  return () => new Response();
};

const processRequest = function(req) {
  const handler = findHandler(req);
  return handler(req);
};

module.exports = processRequest;
