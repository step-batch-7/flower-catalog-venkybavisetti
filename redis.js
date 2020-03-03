const redis = require('redis');
const client = redis.createClient(
  process.env.REDIS_URL || 'http://localhost:6379'
);

let comments;

client.on('error', err => console.log('Error', err));

client.get('flower-catalog-comments', (err, data) => {
  if (err) {
    console.log(err);
    return;
  }
  comments = JSON.parse(data || '[]');
});

const loadComments = () => comments;
const storeComments = commentsData => {
  client.set('flower-catalog-comments', JSON.stringify(commentsData));
};

module.exports = { loadComments, storeComments };
