'use strict';

// USe intersection observer to add fadeIn animation
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.target.id === 'about') {
        // console.log('About page is intersecting');
        const overlay = document.querySelector('#about .overlay');
        overlay.classList.add('fadeAnimation');
      } else {
        if (!entry.isIntersecting) {
          const overlay = document.querySelector('#about .overlay');
          overlay.classList.remove('fadeAnimation');
          //   console.log('About page is not intersecting');
        }
      }
    });
  },
  {
    rootMargin: '-150px',
  }
);

window.onload = () => {
  observer.observe(document.querySelector('#about'));
};

// Handle the slideshow tour
function handleTour() {
  const pages = ['home', 'about', 'contact'];
  let current = 0;

  function changePage() {
    console.log('Current: ', current);
    if (current >= pages.length - 1) {
      console.log('Clearing interval');
      clearInterval(interval);
    } else {
      const nextBtn = document.querySelector(`#${pages[current]} .next-btn`);
      console.log('Next btn: ', nextBtn);
      nextBtn.click();
      current++;
    }
  }

  let interval = setInterval(changePage, 4000);
}

function handleContact(evt) {
  evt.preventDefault();

  const email = document.querySelector('#email');
  const message = document.querySelector('#message');

  const form = {
    data: {
      email: email.value,
      message: message.value,
    },
  };

  console.log('Form to send: ', form);

  fetch('/contact', {
    method: 'POST',
    body: JSON.stringify(form),
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
    cache: 'default',
  })
    .then(res => {
    //   console.log('Response statuc: ', res.status);
      if (res.status === 200) {
        resetAllFields();
        alert('Email has been sent successfully!');
        return null;
      } else {
        return res.json();
      }
    })
    .then(data => {
      if (data) {
        alert(`Error in sending message: ${data}`);
      }
    })
    .catch(err => {
      alert(`Error in sending message: ${err.message}`);
    });
}

function resetAllFields() {
  const email = document.querySelector('#email');
  const message = document.querySelector('#message');

  email.value = '';
  message.value = '';
}
