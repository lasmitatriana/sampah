async function submitRegistration() {
  event.preventDefault();
  const api_url = 'https://api.wastemanagement.org/user/registration';
  const name = document.getElementById('name').value;
  const address = document.getElementById('address').value;
  const handphone = document.getElementById('handphone').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const response = await fetch(api_url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },  
    body: {
      name: name,
      address: address,
      handphone: handphone,
      email: email,
      password: password,
    },
  });
  return false;
}
