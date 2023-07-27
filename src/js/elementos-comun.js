document.addEventListener('DOMContentLoaded', () => {
    const navbarContentDiv = document.getElementById('navBarContent');
    fetch('navbar.html')
      .then(response => response.text())
      .then(data => {
        navbarContentDiv.innerHTML = data;
      })
      .catch(error => {
        console.error('Error al cargar el navBar:', error);
      });
  });