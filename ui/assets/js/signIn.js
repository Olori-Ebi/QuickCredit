class SignIn{
  constructor(email, password) {
    this.email = email;
    this.password = password;
  }
}

class UI{
  signIn(loginDetails) {
    const url = 'http://localhost:5502/api/v1/auth/signin';
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginDetails),
    })
    .then(((response) => response.json()))
    .then(responseData => {
      if (responseData.statusCode === 200) {
        window.localStorage.setItem('token', responseData.data.token)
        window.localStorage.setItem('isadmin', responseData.data.isadmin)
        window.localStorage.setItem('email', responseData.data.email)
        window.localStorage.setItem('firstname', responseData.data.firstname);
        window.localStorage.setItem('lastname', responseData.data.lastname);
        window.localStorage.setItem('status', 'verified')
        if (responseData.data.isadmin) {
          window.location = 'admin-loans.html';
        }

        if (!responseData.data.isadmin) {
          window.location = 'user-dashboard.html';
        }
      }
      if (responseData.statusCode !== 200) {
        console.log(responseData);
        // cleanup the input fields
        document.querySelector ('#email').value = '';
        document.querySelector ('#password').value = '';

        // create a div element
        const div = document.createElement ('div');

        // add a class
        div.className = 'show';
        
        // append a textnode
        div.appendChild (document.createTextNode (responseData.message || responseData.error[0].password));
        const section = document.querySelector ('.section');
        const form = document.querySelector ('#form');
        section.insertBefore (div, form);
        setTimeout (() => {
          document.querySelector ('.show').remove ();
        }, 3000);
      }
    })
    .catch((error) => console.log(error));
  }
}

document.querySelector('form').addEventListener('submit', (e) => {
  const email = document.querySelector ('#email').value;
  const password = document.querySelector ('#password').value;

  // instantiate SignIn and UI
  const loginDetails = new SignIn(email, password);
  const ui = new UI();

  ui.signIn(loginDetails)

  e.preventDefault();
})