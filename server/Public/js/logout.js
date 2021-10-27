'use strict';

const homeUrl = '/app';

function goBack() {
  window.location.href = homeUrl;
}

function logout() {
  fetch('/logout', {
    method: 'POST',
    mode: 'cors',
    cache: 'default',
  })
    .then(response => response.json())
    .then(data => {
      if (data.app.redirectToLogin) {
        window.location.href = '/login';
      }
    });
}
