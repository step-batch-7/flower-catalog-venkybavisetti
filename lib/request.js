const collectHeadersAndContent = (result, line) => {
  if (line === "") {
    result.body = "";
    return result;
  }
  if ("body" in result) {
    result.body += line;
    return result;
  }
  const [key, value] = line.split(": ");
  result.headers[key] = value;
  return result;
};
const pickDetails = (query, keyValue) => {
  const [key, value] = keyValue.split("=");
  query[key] = value;
  return query;
};

const readParams = function(keyValueTextPairs) {
  return keyValueTextPairs.split("&").reduce(pickDetails, {});
};

const parseQueryDetails = entireUrl => {
  const [url, queryText] = entireUrl.split("?");
  const query = queryText && readParams(queryText);
  return { url, query };
};
class Request {
  constructor(method, url, query, headers, body) {
    this.method = method;
    this.url = url;
    this.query = query;
    this.headers = headers;
    this.body = body;
  }
  static parse(requestText) {
    const [requestLine, ...headersAndBody] = requestText.split("\r\n");
    const [method, entireUrl, protocol] = requestLine.split(" ");
    const { url, query } = parseQueryDetails(entireUrl);
    let { headers, body } = headersAndBody.reduce(collectHeadersAndContent, {
      headers: {}
    });
    if (headers["Content-Type"] === "application/x-www-form-urlencoded") {
      body = readParams(body);
    }
    const req = new Request(method, url, query, headers, body);
    console.warn(req);
    return req;
  }
}
module.exports = Request;
