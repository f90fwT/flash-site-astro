// This is the JS file for the FAQ section

document.addEventListener("DOMContentLoaded", function() {
    fetch('faq.html')
      .then(response => response.text())
      .then(data => {
        document.getElementById('faq').innerHTML = data;
        initializeAccordion();
      })
      .catch(error => {
        console.error("Error:", error);
      });
  });
  