/**
 * Render User Details
 */
const isUserDashboard = window.location.href.includes('user-dashboard') || false;
if (isUserDashboard) {
  const firstname = localStorage.getItem('firstname');
  const lastname = localStorage.getItem('lastname');
  const address = localStorage.getItem('address');
  const email = localStorage.getItem('email');


  document.getElementById('fullname').textContent = `${firstname} ${lastname}`;
  document.getElementById('address').textContent = address;
  document.getElementById('email').textContent = email;
}

/**
 * Return Local Date/Time
 */
function convertUTCToLocalTime(timeString) {
  const dateObj = new Date(timeString);
  const formatDate = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(dateObj);

  return formatDate;
}

/**
 * Render User Loan Records
 */
class UserLoan {
  async getLoan() {
    const url = 'http://localhost:5502/api/v1/user/loan';
    const token = window.localStorage.getItem('token')

    return fetch(url, {
      method: 'GET',
      headers: {
        auth_token: `${token}`
      }
    })
  }
}

class UI {
  renderData(selector, resData) {
    const selectorId = document.querySelector(`#${selector}`);
    const tableRow = document.createElement('tr');
    const { id, createdAt, amount, tenor, status, repaid } = resData;
    tableRow.innerHTML = `
      <tr>
        <td style="padding: 10px; margin: 10px;">${id}</td>
        <td style="padding: 10px; margin: 10px;">${convertUTCToLocalTime(createdAt)}</td>
        <td style="padding: 10px; margin: 10px;">${amount}</td>
        <td style="padding: 10px; margin: 10px;">${tenor}</td>
        <td style="padding: 10px; margin: 10px;">${status}</td>
        <td style="padding: 10px; margin: 10px;">${repaid}</td>
        <td><div class="wrapper">
          <button id="" data-id=${id} class="btn-action btn-info open-btn">
          <i class="fas fa-eye"></i> <span>Loan History</span>
          </button>
      </div></td>
      </tr>
    `
    tableRow.style.cursor = `pointer`;
    return selectorId.appendChild(tableRow);
  }

  getButtons() {
    const buttons = document.querySelectorAll('.open-btn');
    buttons.forEach(button => {
      const id = button.dataset.id;
      button.addEventListener('click', () => this.viewLoanHistory(id))
    })
  }

  async viewLoanHistory(id) {
    const url = `http://localhost:5502/api/v1/loans/${id}/repayments`
    const token = window.localStorage.getItem('token');
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          auth_token: `${token}`,
          'Content-Type': 'application/json'
        }
      });
      const responseData = await response.json();
      return responseData.data?.map(loanData =>{
        this.displayLoanHistory('modal-loans', loanData)
      });
    } catch (error) {
      console.log(error);
    }
  }

  displayLoanHistory(selector, loanData) {
    const selectorId = document.querySelector(`#${selector}`)
      const tableRow = document.createElement('tr');
      const { createdAt, amount, amountpaid, balance } = loanData;
      const firstname = window.localStorage.getItem('firstname')
      const lastname = window.localStorage.getItem('lastname')
      tableRow.innerHTML = `
        <tr>
          <td style="padding: 10px; margin: 10px;">${firstname} ${lastname}</td>
          <td style="padding: 10px; margin: 10px;">${convertUTCToLocalTime(createdAt)}</td>
          <td style="padding: 10px; margin: 10px;">${amount}</td>
          <td style="padding: 10px; margin: 10px;">${balance}</td>
          <td style="padding: 10px; margin: 10px;">${amountpaid}</td>
        </tr>
      `
      return selectorId.appendChild(tableRow);
  }
}


document.addEventListener('DOMContentLoaded', () => {
  const userloan = new UserLoan()
  const ui = new UI()

  // document.querySelector('#dashname').innerText = window.localStorage.getItem('firstname')

  userloan.getLoan()
  .then(response => response.json())
  .then(responseData => {
    responseData.data.map(resData => ui.renderData('record-list', resData))
  })
  .then(() => ui.getButtons())
  .catch(error => console.log(error))
})