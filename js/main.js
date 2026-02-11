const form = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const alertBox = document.getElementById('form-alert');


const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzwvKKR6TOkOARb1SPmFBOc9ymzIHgLoKPxmASzAkonEYuoCMzGfnmvpgu24lWJW6LV/exec';

form.addEventListener('submit', e => {
  e.preventDefault();
  
  
  submitBtn.disabled = true;
  submitBtn.innerText = 'Отправка...';

  let requestBody = new FormData(form);

  fetch(SCRIPT_URL, { method: 'POST', body: requestBody})
    .then(response => {
      alertBox.classList.remove('hidden');
      form.reset();
      
      setTimeout(() => {
        alertBox.classList.add('hidden');
        submitBtn.disabled = false;
        submitBtn.innerText = 'Отправить заявку';
      }, 5000);
    })
    .catch(error => {
      alert('Ошибка при отправке! Проверьте интернет или попробуйте позже.');
      console.error('Error!', error.message);
      submitBtn.disabled = false;
      submitBtn.innerText = 'Отправить заявку';
    });
});