window.onload = async () => {
  const api_url = 'Http://localhost/coba1/data_tampil';
  const response = await fetch(api_url);
  const data = await response.json();
  const tbodyRef = document.getElementById('list_table').getElementsByTagName('tbody')[0];
  
  for (const user of data) {
    const row = `<tr>\
      <td>${user.name}</td>\
      <td>${user.address.street}</td>\
      <td>${user.phone}</td>\
      <td>${user.email}</td>\
    </tr>`;
    const newRow = tbodyRef.insertRow(tbodyRef.rows.length);
    newRow.innerHTML = row;
  }
};
