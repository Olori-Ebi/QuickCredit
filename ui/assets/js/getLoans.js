/**
 * Handle tab switch for loan records display
 */
const toggleTab = (tabName, getBtn) => {
  document.querySelectorAll('.responsive-table').forEach((element) => {
    const target = element;
    target.style.display = 'none';
  });

  document.querySelector('.btn-toggled').classList.remove('btn-toggled');
  getBtn.classList.add('btn-toggled');
  document.querySelector(`#${tabName}`).style.display = 'block';
};

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

class Loans{
  async getLoans() {
    const url = 'http://localhost:5502/api/v1/loans';
    const token = window.localStorage.getItem('token');

    return await fetch(url, {
      method: 'GET',
      headers: {
        auth_token: `${token}`,
        'Content-type': 'application/json',
      }
    })
  }
}

class UI{
  displayLoans(responseData) {
    if (responseData.statusCode === 200) {
      localStorage.setItem('loan_status','approved')
      localStorage.setItem('loanStatus','rejected')

      const allLoans = responseData.data;
      allLoans.map(loans => this.renderLoans('records-all', loans))
    }
  }
  renderLoans(selector, loans) {
    const selectorId = document.getElementById (`${selector}`);
    const tableRow = document.createElement ('tr');
    const {id, createdAt, status, amount, repaid} = loans;

    tableRow.innerHTML = `
    <tr>
      <td>${id}</td>
      <td>${convertUTCToLocalTime(createdAt)}</td>
      <td>${amount}</td>
      <td>${status}</td>
      <td>${repaid}</td>
      <td>
        <div class="wrapper">
          <button id="" data-id=${id} class="btn-action btn-info open-btn">
            <i class="fas fa-eye"></i> <span>view</span>
          </button>
        </div>
      </td>
      <td><button data-id=${id} id="approve" class="approveBtn col col__Center">Approve</button></td>
      <td><button id="reject" data-id=${id} class="rejectBtn col col__Center">Reject</button></td>
    </tr>
    `;
    tableRow.style.cursor = `pointer`;

    return selectorId.appendChild (tableRow);
  }
  getButtons() {
    const buttons = [...document.querySelectorAll('.open-btn')];
    buttons.forEach(button => {
      const id = button.dataset.id;
      button.addEventListener('click', () => this.getSingleLoan(id)) 
    })
  }
  async getSingleLoan(id) {
    const url = `http://localhost:5502/api/v1/loans/${id}`
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
      this.displaySingleLoan('modal-loans', responseData);
    } catch (error) {
      return console.log(error);
    }
  }

  displaySingleLoan(selector,responseData) {
    console.log(responseData);
    const selectorId = document.getElementById(`${selector}`)
    const tableRow = document.createElement('tr');
    const { id, email, tenor, createdAt, amount, balance, status, interest } = responseData.data[0];
    tableRow.innerHTML = `
      <tr>
        <td style="padding: 10px; margin: 10px;">${id}</td>
        <td style="padding: 10px; margin: 10px;">${email}</td>
        <td style="padding: 10px; margin: 10px;">${convertUTCToLocalTime(createdAt)}</td>
        <td style="padding: 10px; margin: 10px;">${tenor}</td>
        <td style="padding: 10px; margin: 10px;">${amount}</td>
        <td style="padding: 10px; margin: 10px;">${balance}</td>
        <td style="padding: 10px; margin: 10px;">${interest}</td>
        <td style="padding: 10px; margin: 10px;">${status}</td>
      </tr>
    `

    return selectorId.appendChild(tableRow);
  }

  repaidLoans(responseData) {
    const repaidLoans = responseData.data.filter(loan => loan.repaid === true);
    repaidLoans.map(loan => this.displayRepaidLoans('records-repaid', loan))
  }
  displayRepaidLoans(selector, repaidLoans) {
    const selectorId = document.getElementById (`${selector}`);
    const tableRow = document.createElement ('tr');
    const {id, email, createdAt, status, amount, repaid} = repaidLoans;

    // console.log(id, email, createdon, status, repaid)
    tableRow.innerHTML = `
    <tr>
      <td>${id}</td>
      <td>${email}</td>
      <td>${convertUTCToLocalTime(createdAt)}</td>
      <td>${amount}</td>
      <td>${status}</td>
      <td>${repaid}</td> 
    </tr>
    `;
    tableRow.style.cursor = `pointer`;

    return selectorId.appendChild (tableRow);
  }
  runningLoans(responseData) {
    const runningLoans = responseData.data.filter(loan => loan.repaid === false);

    runningLoans.map(loan =>this.displayRunningLoans('records-unpaid', loan) )
    
  }

  displayRunningLoans(selector, loan) {
    const selectorId = document.getElementById (`${selector}`);
    const tableRow = document.createElement ('tr');
    const {id, email, createdAt, status, amount, repaid} = loan

    // console.log(id, email, createdon, status, repaid)
    tableRow.innerHTML = `
    <tr>
      <td>${id}</td>
      <td>${email}</td>
      <td>${convertUTCToLocalTime(createdAt)}</td>
      <td>${amount}</td>
      <td>${status}</td>
      <td>${repaid}</td> 
    </tr>
    `;
    tableRow.style.cursor = `pointer`;

    return selectorId.appendChild (tableRow);
  }

  updateLoanButtons() {
    const approveBtns = document.querySelectorAll('.approveBtn')
    const rejectBtns = document.querySelectorAll('.rejectBtn')

    const Buttons = [...approveBtns, ...rejectBtns];
    Buttons.forEach(button => {
      if(button.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent === 'approved' || button.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent === 'rejected') {
        button.disabled = true;
        button.textContent = 'updated';
      } else {
        button.addEventListener('click', (e) => {
          if (button.textContent === 'Approve') {
            button.textContent = 'updated'
            const id = button.dataset.id;
            button.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent = 'approved'
            const filtered = Buttons.filter(button => button.dataset.id === id)
            filtered.forEach(filter => {
              console.log(filter);
              filter.disabled = true;
            });
            this.approveLoan(id)
          } else if (button.textContent === 'Reject') {
            button.textContent = 'updated'
            button.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent = 'rejected'
            const id = button.dataset.id;
            const filtered = Buttons.filter(button => button.dataset.id === id)
            filtered.forEach(filter => {
              filter.disabled = true;
            })
            this.rejectLoan(id)
          }
        })
      }
    })
  }

  async approveLoan(id) {
    const url = `http://localhost:5502/api/v1/loans/${id}`;
    const token = window.localStorage.getItem('token')
    const data = {
      status: window.localStorage.getItem('loan_status')
    }
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
      return console.log(error);
    }
  }

  async rejectLoan(id) {
    const url = `http://localhost:5502/api/v1/loans/${id}`;
    const token = window.localStorage.getItem('token')
    const data = {
      status: window.localStorage.getItem('loanStatus')
    }
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
      return console.log(error);
    }
  }
}


document.addEventListener('DOMContentLoaded', () => {
  const loans = new Loans()
  const ui = new UI();

  loans.getLoans()
    .then(response => response.json())
    .then(responseData => {
      ui.displayLoans(responseData)
      ui.repaidLoans(responseData)
      ui.runningLoans(responseData)
    })
    .then(() => {
      ui.getButtons()
      ui.updateLoanButtons()
    })
    .catch((error) => console.log(error));
})