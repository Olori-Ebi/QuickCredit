class CreateRepayment{
  constructor(id, amountpaid) {
    this.id = id;
    this.amountpaid = amountpaid
  }
}

class UI{
  createRepayment(repaymentDetails) {
    const {id } = repaymentDetails;
    const url = `http://localhost:5502/api/v1/loans/${id}/repayments`;
    const token = window.localStorage.getItem('token');
    return fetch(url, {
      method: 'POST',
      headers: {
        auth_token: `${token}`,
        'Content-type': 'application/json',
      },
      body: JSON.stringify(repaymentDetails),
    })
    .then(((response) => response.json()))
    .then(responseData => {
      console.log(responseData);
      if (responseData.statusCode !== 201) {
        // cleanup the input fields
        document.querySelector ('#loanId').value = '';
        document.querySelector ('#amount').value = '';
        //create a div element
        const div = document.createElement ('div');
        //Add a class
        div.className = 'show';
        //Append a textnode
        div.appendChild (document.createTextNode (responseData.error || responseData.message));

        const section = document.querySelector ('.section1');
        const form = document.querySelector ('#form1');
        section.insertBefore (div, form);

        setTimeout (() => {
          document.querySelector ('.show').remove();
        }, 3000);
      }
    })
    .catch((error) => console.log(error));
  }
}

document.querySelector('#submitBtn').addEventListener('click', (e) => {
    const id = +(document.getElementById('loanId').value)
    const amountpaid = +(document.getElementById('amount').value);

    const repaymentDetails = new CreateRepayment(id, amountpaid);

    const ui = new UI()

    ui.createRepayment(repaymentDetails)

  e.preventDefault()
})
