const { loadTemplate } = require('./lib/viewTemplate');
const { loadComments, storeComments } = require('./redis');

const getTableRows = function(comments) {
  const commentsTable = comments
    .map(comment => {
      const html = `<div class= "comment">
      <div class="name"><span>&#129333</span>${comment.name}
      <div class="date">
        <span style='font-size:13px;'>&#8986;</span>
        ${comment.date}</div></div>
     <p><span >&#129488</span>${comment.comment}</p>
    </div>`;
      return html;
    })
    .join('\n');
  return { comments: commentsTable };
};

const guestBookPage = function(req, res) {
  const comments = loadComments();
  const html = loadTemplate('guestBook.html', getTableRows(comments));
  res.send(html);
};

const onComment = function(req, res) {
  const { name, comment } = req.body;
  const date = new Date().toLocaleString();
  const comments = loadComments();
  comments.unshift({ name, comment, date });
  storeComments(comments);
  res.redirect('/guestBook.html');
};

module.exports = {
  guestBookPage,
  onComment
};
