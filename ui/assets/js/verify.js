class Users {
  async getUsers() {
    // document.querySelector('#username').innerHTML = window.localStorage.getItem('firstname');
    const url = 'http://localhost:5502/api/v1/users';
    const token = window.localStorage.getItem('token');

    return await fetch(url, {
      method: 'GET',
      headers: {
        auth_token: `${token}`,
        'Content-type': 'application/json',
      }
    })
  }
  renderUser(selector, data) {
    console.log(data);
    const selectorId = document.getElementById(`${selector}`);
    const tableRow = document.createElement ('tr');
    const {id, email, firstname, lastname, address, status} = data;
  
    tableRow.innerHTML = `
    <tr>
      <td>${id}</td>
      <td>${firstname} ${lastname}</td>
      <td>${email}</td>
      <td>${address}</td>
      <td>${status}</td>
      <td>
        <div class="row col col__Center padding-s">
          <button data-id=${id} class="tdBtn ml-1 verifyBtn">Verify</button>
        </div>
      </td>
    </tr>
    `;
    tableRow.style.cursor = `pointer`;
  
  
    return selectorId.appendChild (tableRow);
  }
  getButtons() {
    const buttons = [...document.querySelectorAll('.verifyBtn')];
    buttons.forEach(button => {
      if (button.parentElement.parentElement.previousElementSibling.textContent === 'verified') {
        button.disabled = true;
        button.textContent = 'verified'
      } 
      else {
        button.addEventListener('click', async (e) => {
          button.disabled = true;
          button.textContent = 'verified';
          button.parentElement.parentElement.previousElementSibling.textContent = 'verified'
          const email = button.parentElement.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
          const url = `http://localhost:5502/api/v1/users/${email}/verify`;
          const token = window.localStorage.getItem('token');
          const data = {
            status: window.localStorage.getItem('status')
          };

          try {
            const response = await fetch(url, {
              method: 'PATCH',
              headers: {
                auth_token: `${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
            });
            const resData = await response.json();
            console.log(resData);
          } catch (error) {
            console.log(error);
          }
          e.preventDefault();
        });
      }
    })
  }
}
document.addEventListener('DOMContentLoaded', () => {
  const users = new Users();
  users.getUsers()
  .then(response => response.json())
  .then(responseData => {
    responseData.data.map(data => users.renderUser('user-list', data));
  })
  .then(() => {
    users.getButtons()
  })
  .catch((error) => console.log(error));
})