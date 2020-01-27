class Response {
  constructor() {
    this.statusCode = 404;
    this.headers = [{ key: "Content-Length", value: 0 }];
  }
  setHeader(key, value) {
    let header = this.headers.find(h => h.key === key);
    if (header) header.value = value;
    else this.headers.push({ key, value });
  }
  setHeaders(content, contentType) {
    this.setHeader("Content-Type", contentType);
    this.setHeader("Content-Length", content.length);
  }
  generateHeadersText() {
    const lines = this.headers.map(header => `${header.key}: ${header.value}`);
    console.log(lines);
    return lines.join("\r\n");
  }
  writeTo(writable) {
    writable.write(`HTTP/1.1 ${this.statusCode}\r\n`);
    writable.write(this.generateHeadersText());
    writable.write("\r\n\r\n");
    this.body && writable.write(this.body);
  }
}

module.exports = Response;
