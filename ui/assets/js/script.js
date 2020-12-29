/**
 * Handles toggle menu for mobile devices on the index page
 */
const hamburgerBtn = document.querySelector('.hamburger-menu');
hamburgerBtn.addEventListener('click', function toggleMenu() {
  const menu = document.querySelector('.navbar-menu');
  this.classList.toggle('menu-open');
  menu.classList.toggle('menu-open');
});

/**
  * Handle modals
 */
const modal = document.querySelector('#modal');
const modalToggle = document.querySelector('#modal-toggle');
const closeBtn = document.querySelector('#modal-close');
const openBtn = document.querySelector('.open-btn');

closeBtn?.addEventListener('click', () => {
  modal.classList.toggle('closed');
  modalToggle?.classList.toggle('closed');
  document.querySelector('#modal-loans').innerHTML = ''
});


const records = document.querySelectorAll('#records-all')

records.forEach(record => record.addEventListener('click', (e) => {
  e.preventDefault();
  if (e.target.classList.contains('open-btn') || e.target.classList.contains('wrapper') || e.target.classList.contains('fa-eye')) {
    modal.classList.toggle('closed');
    modalToggle.classList.toggle('closed');
  }
}))

const repayment = document.querySelectorAll('#record-list');
repayment.forEach(loan => loan.addEventListener('click', (e) => {
  e.preventDefault();

  if(e.target.classList.contains('open-btn')) {
    modal.classList.toggle('closed');
    // modalToggle.classList.toggle('closed');
  }
}))