const main = function() {
  const gifImage = document.querySelector('#gifImage');
  const seconds = 1000;
  gifImage.onclick = () => {
    gifImage.style.visibility = 'hidden';
    setTimeout(() => {
      gifImage.style.visibility = 'visible';
    }, seconds);
  };
};

module.exports = { main };
