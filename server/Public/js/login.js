'use strict';

let login = true;
const homeUrl = '/app';

function handleLogin(evt) {
  evt.preventDefault();

  let submit = true;
  // Validate input fields
  const username = document.querySelector('#username');
  const password = document.querySelector('#password');
  const userError = document.querySelector('#username-error');
  const passError = document.querySelector('#password-error');
  const saveSession = document.querySelector('#save-session');

  // console.log('Username: ', username.id);
  // console.log('Password: ', password.value);
  console.log('Save session: ', saveSession.checked);

  if (!username.value) {
    username.classList.add('invalid');
    userError.classList.add('show-error');
    submit = false;
  } else {
    username.classList.remove('invalid');
    userError.classList.remove('show-error');
  }

  if (!password.value) {
    password.classList.add('invalid');
    passError.classList.add('show-error');
    submit = false;
  } else {
    password.classList.remove('invalid');
    passError.classList.remove('show-error');
  }

  if (submit) {
    //   Submit form
    const loginData = {
      data: {
        username: { value: username.value, fieldId: username.id },
        password: { value: password.value, fieldId: password.id },
        saveSession: { value: saveSession.checked },
      },
    };

    fetch(`/${login ? 'login' : 'signup'}`, {
      method: 'POST',
      body: JSON.stringify(getSubmitData(loginData)),
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      cache: 'default',
    })
      .then(response => {
        if (response.status !== 201) {
          return response.json();
        } else if (response.status === 201) {
          window.location.href = homeUrl;
          // return null;
        }
      })
      .then(data => {
        if (data) {
          // console.log('Data received: ', data);
          resetErrorFields();
          handleDataReceived(data);
        } 
      })
      .catch(err => {
        alert('An error occured: ', err);
        // console.log('Error received: ', err);
      });
  }
}

function getSubmitData(loginData) {
  if (!login) {
    // Add the rest of the data for signup
    const firstName = document.querySelector('#firstName');
    const lastName = document.querySelector('#lastName');
    const email = document.querySelector('#email');

    loginData.data.firstName = {
      value: firstName.value,
      fieldId: firstName.id,
    };

    loginData.data.lastName = { value: lastName.value, fieldId: lastName.id };
    loginData.data.email = { value: email.value, fieldId: email.id };
  }

  // console.log('Login data to send: ', loginData);
  return loginData;
}

function handleDataReceived(data) {
  const { app } = data;
  // console.log('App Result: ', app);
  if (app.error) {
    const errorFields = app.error.errorFields || {};

    errorFields.forEach(err => {
      document.querySelector(`#${err.field}`).classList.add('invalid');
      const errorLabel = document.querySelector(`#${err.field}-error`);
      errorLabel.classList.add('show-error');
      errorLabel.innerHTML = err.message;
    });
  } else {
    // redirect to app page
    // console.log('Going to home page');
    window.location.href = homeUrl;
  }
}

function toggleSignUp() {
  login = !login;
  const signUpLabel = document.querySelector('#signup-label');
  const loginBtn = document.querySelector('button[type="submit"]');

  if (signUpLabel.innerHTML.indexOf('Sign') !== -1) {
    // Toggles to signup
    signUpLabel.innerHTML = 'Login Instead?';
    showSignupFields(true);
    loginBtn.innerHTML = 'Sign Up';
  } else {
    // Toggles to login
    signUpLabel.innerHTML = 'Sign Up Instead?';
    showSignupFields(false);
    loginBtn.innerHTML = 'Login';
  }
}

function showSignupFields(show) {
  const elems = document.querySelectorAll('.sign-up');
  const inputs = document.querySelectorAll('.sign-up .form-input');
  resetAllFields();

  if (show) {
    // Show the fields
    elems.forEach(elem => {
      elem.classList.add('display-element');
    });

    inputs.forEach(input => {
      input.setAttribute('required', true);
    });
  } else {
    // hide the fields
    elems.forEach(elem => {
      elem.classList.remove('display-element');
    });

    inputs.forEach(input => {
      input.removeAttribute('required');
    });
  }
}

function resetAllFields() {
  const allLabels = document.querySelectorAll('.error');

  allLabels.forEach(label => {
    label.classList.remove('show-error');
  });

  const allElem = document.querySelectorAll('.form-input');
  allElem.forEach(elem => {
    elem.classList.remove('invalid');
    elem.value = '';
  });
}

function resetErrorFields() {
  const allLabels = document.querySelectorAll('.error.show-error');
  allLabels.forEach(label => {
    label.classList.remove('show-error');
  });

  const allElem = document.querySelectorAll('.form-input.invalid');
  allElem.forEach(elem => {
    elem.classList.remove('invalid');
  });
}
