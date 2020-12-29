class SignUp{
  constructor(firstname, lastname, address, email, password) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.address = address;
    this.email = email;
    this.password = password;
  }
}

class UI{
  signIn(signupDetails) {
    const url = 'http://localhost:5502/api/v1/auth/signup';
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signupDetails),
    })
    .then(((response) => response.json()))
    .then(responseData => {
      console.log(responseData);
      if (responseData.statusCode === 201) {
        console.log(responseData);
        window.localStorage.setItem('token', responseData.data.token)
        window.localStorage.setItem('email', responseData.data.email)
        window.localStorage.setItem('firstname', responseData.data.firstname);
        window.localStorage.setItem('lastname', responseData.data.lastname);

        window.location = 'user-apply.html';
      }

      if(responseData.statusCode !== 201) {
        // create a div element
        const div = document.createElement ('div');

        // add a class
        div.className = 'show';
        
        // append a textnode
        div.appendChild (document.createTextNode (responseData.message || responseData.error.password || responseData.error.firstname || responseData.error.lastname || responseData.error.address || responseData.error.email));
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
  const firstname = document.querySelector ('#firstName').value;
  const lastname = document.querySelector ('#lastName').value;
  const address = document.querySelector ('#address').value;
  const email = document.querySelector ('#email').value;
  const password = document.querySelector ('#password').value;

  // instantiate SignIn and UI
  const signupDetails = new SignUp(firstname, lastname, address, email, password);
  const ui = new UI();

  ui.signIn(signupDetails)

  e.preventDefault();
})