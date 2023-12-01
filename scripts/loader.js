fetch("./navbar.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("navbar-container").innerHTML = data;
  });

  // Laden des Pricings
  fetch("./pricing.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("pricing-container").innerHTML = data;
  });
  

// Laden des Footers
fetch("./footer.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("footer-container").innerHTML = data;
  });

