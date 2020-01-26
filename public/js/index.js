const main = function() {
  const gifImage = document.querySelector("#gifImage");
  gifImage.onclick = () => {
    gifImage.style.display = "none";
    setTimeout(() => {
      gifImage.style.display = "block";
    }, 1000);
  };
};
