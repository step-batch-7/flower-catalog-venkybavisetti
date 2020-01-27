const main = function() {
  const gifImage = document.querySelector("#gifImage");
  gifImage.onclick = () => {
    gifImage.style.visibility = "hidden";
    setTimeout(() => {
      gifImage.style.visibility = "visible";
    }, 1000);
  };
};
