class ApplyLoan{
  constructor(tenor, amount){
    this.tenor = tenor;
    this.amount = amount;
  }
}

class UI{
  ApplyForLoan(loanDetails) {
    const url = `http://localhost:5502/api/v1/loans`;
    const token = window.localStorage.getItem('token');
    return fetch(url, {
      method: 'POST',
      headers: {
        auth_token: `${token}`,
        'Content-type': 'application/json',
      },
      body: JSON.stringify(loanDetails),
    })
  .then(((response) => response.json()))
  .then(responseData => {
    console.log(responseData);
    document.querySelector ('#tenor').value = ''
    document.querySelector ('#amount').value = '';
    if(responseData.statusCode !== 201) {
      document.querySelector('#show').innerHTML = responseData.msg || responseData.error.amount || responseData.error.tenor || responseData.error;
      setTimeout (() => {
        document.querySelector ('#show').remove ();
      }, 3000);
    }
  })
  .catch(error => console.log(error))
  }
}

document.querySelector('#form').addEventListener('submit', (e) => {
  const tenor = document.querySelector ('#tenor').value;
  const amount = document.querySelector ('#amount').value;

  // instantiate apply loan and ui
  const applyloan = new ApplyLoan(tenor, amount);
  const ui = new UI()

  ui.ApplyForLoan(applyloan)

  e.preventDefault()
})