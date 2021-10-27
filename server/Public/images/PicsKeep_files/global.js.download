'use strict';

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    const cookieNotice = localStorage.getItem('cookieNotice');

    if (!cookieNotice) {
      const noticeElem = document.querySelector('.cookie-banner');
      noticeElem.classList.add('show-cookie');
      localStorage.setItem('cookieNotice', true);
    }
  }
};

function closeCookieNotice() {
  const noticeElem = document.querySelector('.cookie-banner');

  if (noticeElem.classList.contains('show-cookie')) {
    noticeElem.classList.remove('show-cookie');
  }
}
