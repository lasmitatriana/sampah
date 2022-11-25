const formLogin = document.getElementById('login_form');
const formRegister = document.getElementById('register_form');
const type = ['anorganik', 'organik', 'b3', 'residu'];
const btnBack = document.querySelector('.btn-back');
const btnAnorganik = document.getElementById('btn_anorganik');
const btnOrganik = document.getElementById('btn_organik');
const btnB3 = document.getElementById('btn_b3');
const btnResidu = document.getElementById('btn_residu');
const btnPenjemputan = document.getElementById('btn_penjemputan');
const btnFinish = document.getElementById('btn_finish');
const btnLocation = document.getElementById('btn_location');

// if (!localStorage['isLogin'] && !window.location.href.includes('index.html')) {
//   window.location.assign('index.html');
// }

let now = new Date();
let date = now.toLocaleDateString('id-ID', {
  weekday: 'long',
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});
let hours =
  now.getHours().toString().length < 2 ? '0' + now.getHours() : now.getHours();
let minutes =
  now.getMinutes().toString().length < 2
    ? '0' + now.getMinutes()
    : now.getMinutes();
let time = hours + ':' + minutes;
let jalur =
  now.getDate().toString() +
  (now.getMonth() + 1).toString() +
  now.getFullYear().toString();

localStorage['date'] = date;
localStorage['jalur'] = jalur;

if (btnBack) {
  btnBack.addEventListener('click', () => {
    history.back();
  });
}

async function postData(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

async function getData(url = '') {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.json();
}

if (formLogin) {
  if (localStorage['id']) {
    document.querySelector('input[name=email]').value = localStorage['email'];
    document.querySelector('input[name=password]').value =
      localStorage['password'];
  }
  document.getElementById('login_form').addEventListener('submit', (e) => {
    e.preventDefault();
    const body = {
      email: document.getElementById('email').value,
      password: document.getElementById('password').value,
    };

    try {
      postData('https://waste-management.leeseona25.repl.co/login', body).then(
        (data) => {
          if (data.error) {
            alert(data.error);
          } else {
            localStorage['isLogin'] = true;
            localStorage['id'] = data.id;
            localStorage['email'] = data.email;
            localStorage['password'] = body.password;
            return window.location.assign('titikmerah.html');
          }
        }
      );
    } catch (error) {}
  });
}

if (formRegister) {
  document.getElementById('register_form').addEventListener('submit', (e) => {
    e.preventDefault();

    const body = {
      name: document.getElementById('name').value,
      address: document.getElementById('address').value,
      handphone: document.getElementById('handphone').value,
      email: document.getElementById('email').value,
      password: document.getElementById('password').value,
    };

    try {
      postData(
        'https://waste-management.leeseona25.repl.co/register',
        body
      ).then((data) => {
        if (data.error) {
          alert(data.error);
        } else {
          alert('Registration success!');
          return window.location.assign('index.html');
        }
      });
    } catch (error) {
      console.log(error);
      alert(error);
    }
  });
}

// localStorage.clear();
console.log(localStorage);

async function getLocation() {
  const suc = function (p) {
    addLocation(p.coords.latitude, p.coords.longitude).then((data) => {
      if (!data) {
        alert('Anda berada di titik yang sama!');
      }
      return data;
    });
  };

  const locFail = function () {
    alert('Gagal mendapatkan lokasi');
  };

  navigator.geolocation.getCurrentPosition(suc, locFail);
}

async function addLocation(lat, long) {
  if (isNaN(localStorage.total_location)) {
    localStorage.lat_1 = lat;
    localStorage.long_1 = long;
    localStorage.time_1 = time;
    localStorage.total_location = 1;
    return true;
  } else {
    for (let i = 1; i <= localStorage.total_location; i++) {
      if (
        localStorage['lat_' + i].includes(lat) &&
        localStorage['long_' + i].includes(long)
      ) {
        return false;
      }
    }

    let latest = parseInt(localStorage.total_location) + 1;
    localStorage['lat_' + latest] = lat;
    localStorage['long_' + latest] = long;
    localStorage['time_' + latest] = time;
    localStorage.total_location = latest;
    return true;
  }

  // return 'Titik koordinat : ' + lat + ', ' + long;
}

function getLastLocation() {
  const suc = function (p) {
    localStorage.lat_last = p.coords.latitude;
    localStorage.long_last = p.coords.longitude;
    alert(p.coords.latitude + ', ' + p.coords.longitude);
    return true;
  };
  const locFail = function () {
    alert('Gagal mendapatkan lokasi');
  };
  navigator.geolocation.getCurrentPosition(suc, locFail);
  if (suc) {
    return true;
  } else {
    return false;
  }
}

async function getFullLocations() {
  let body = {};
  body['location'] = [];
  for (let i = 1; i <= localStorage.total_location; i++) {
    let address = await getAddress(
      localStorage['lat_' + i],
      localStorage['long_' + i]
    );
    body['location'].push({
      lat: localStorage['lat_' + i],
      long: localStorage['lat_' + i],
      time: localStorage['time_' + i],
      address: address.addresses[0].placeLabel
        ? address.addresses[0].placeLabel
        : address.addresses[0].formattedAddress,
      // ', ' +
      // address.addresses[0].city,
    });
  }

  let distance = await postData(
    'https://waste-management.leeseona25.repl.co/distance',
    body
  );
  distance.map((d, i) => {
    body['location'][i]['distanceA'] = d.distanceA;
    body['location'][i]['distanceB'] = d.distanceB;
  });
  return body['location'];
}

async function showLocation(tableName) {
  if (isNaN(localStorage.total_location)) {
    alert('Anda belum menambahkan lokasi!');
    return window.location.assign('titikmerah.html');
  }

  document.querySelector('.date_today').innerHTML = localStorage['date'];
  document.querySelector('.jalur').innerHTML = localStorage['jalur'];
  let locations = await getFullLocations();

  locations.map((d, i) => {
    let row = document.getElementById(tableName).insertRow();
    let no = row.insertCell(0);
    let time = row.insertCell(1);
    let address = row.insertCell(2);
    let status = row.insertCell(3);
    no.innerHTML = i + 1;
    time.innerHTML = d.time;
    address.innerHTML = d.address;
    status.innerHTML = '<span>&#10003</span>';
  });
}

async function getAddress(lat, long) {
  const res = await fetch(
    'https://api.radar.io/v1/geocode/reverse?coordinates=' + lat + ',' + long,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'prj_test_pk_b48738488e2a6d3fe5e4dd964749fb76ebb5ddcf',
      },
    }
  );
  return res.json();
}

if (btnLocation) {
  btnLocation.addEventListener('click', () => {
    getLocation().then(() => {
      setTimeout(() => {
        window.location.assign('notif2.html');
      }, 1000);
    });
  });
}

function getSampah(img = '', weight_name = '') {
  let imgSrc = document.querySelector('[data-img="' + img + '"]').src;
  let weight = document.querySelector('[name=' + weight_name + ']').value;

  if (imgSrc.includes('image') && weight) {
    localStorage['img_' + img] = imgSrc;
    localStorage['weight_' + img] = weight;
    return true;
  } else {
    return false;
  }
}

async function saveData() {
  loc = await getFullLocations();
  let address = await getAddress(
    localStorage['lat_last'],
    localStorage['long_last']
  );

  const body = {
    user_id: localStorage['id'],
    date: date,
    jalur: jalur,
    location: loc,
    last_location: {
      lat: localStorage['lat_last'],
      long: localStorage['long_last'],
      time: time,
      address:
        (address.addresses[0].placeLabel
          ? address.addresses[0].placeLabel
          : address.addresses[0].formattedAddress) +
        ', ' +
        address.addresses[0].city,
    },
  };
  type.map((t) => {
    body[t] = {};
    body[t]['image'] = localStorage['img_' + t];
    body[t]['weight'] = localStorage['weight_' + t];
  });

  return postData('https://waste-management.leeseona25.repl.co/waste', body);
}

function checkData(type = '', nextPage = '') {
  if (getSampah(type, 'berat_' + type)) {
    window.location.assign(nextPage + '.html');
  } else {
    alert('Foto dan berat tidak boleh kosong!');
  }
}

if (btnAnorganik) {
  btnAnorganik.addEventListener('click', () => {
    checkData('anorganik', 'fotoorganik');
  });
}

if (btnOrganik) {
  btnOrganik.addEventListener('click', () => {
    checkData('organik', 'fotob3');
  });
}

if (btnB3) {
  btnB3.addEventListener('click', () => {
    checkData('b3', 'fotoresidu');
  });
}
if (btnResidu) {
  btnResidu.addEventListener('click', async () => {
    if (getSampah('residu', 'berat_residu')) {
      try {
        await saveData().then((data) => {
          if (data.error) {
            alert(data.error);
          } else {
            localStorage['lokasi_pembuangan'] = data.last_location['address'];
            localStorage['waktu'] = data.last_location['time'];
            window.location.assign('notif3.html');
          }
        });
      } catch (error) {
        alert(error);
        console.log(error);
      }
    } else {
      alert('Foto dan berat tidak boleh kosong!');
    }
  });
}

if (btnPenjemputan) {
  btnPenjemputan.addEventListener('click', () => {
    let lastLocation = getLastLocation();

    if (lastLocation) {
      setTimeout(() => {
        window.location.assign('fotoanorganik.html');
      }, 2000);
    }
  });
}

function description() {
  document.querySelector('.date_today').innerHTML = localStorage['date'];
  document.querySelector('.jalur').innerHTML = localStorage['jalur'];
  document.querySelector('.lokasi_pembuangan').innerHTML =
    localStorage['lokasi_pembuangan'];
  document.querySelector('.waktu_pembuangan').innerHTML = localStorage['waktu'];
}

function showSummary() {
  description();

  for (let i = 0; i < 4; i++) {
    let row = document.getElementById('list_waste_summary').insertRow();
    let no = row.insertCell(0);
    let des = row.insertCell(1);
    let newWeight = row.insertCell(2);
    des.innerHTML = type[i];
    no.innerHTML = i + 1;
    newWeight.innerHTML = localStorage['weight_' + type[i]];
  }
}
function showImages() {
  description();

  let row1 = document.getElementById('image_anorganik_organik').insertRow();
  let anorganik = row1.insertCell(0);
  let organik = row1.insertCell(1);
  anorganik.innerHTML = `<img src=${localStorage['img_anorganik']} width=100>`;
  organik.innerHTML = `<img src=${localStorage['img_organik']} width=100>`;

  let row2 = document.getElementById('image_b3_residu').insertRow();
  let b3 = row2.insertCell(0);
  let residu = row2.insertCell(1);
  b3.innerHTML = `<img src=${localStorage['img_b3']} width=100>`;
  residu.innerHTML = `<img src=${localStorage['img_residu']} width=100>`;
}

if (btnFinish) {
  btnFinish.addEventListener('click', () => {
    const storeData = {
      isLogin: localStorage['isLogin'],
      email: localStorage['email'],
      password: localStorage['password'],
      id: localStorage['id'],
    };
    localStorage.clear();

    localStorage['isLogin'] = storeData.isLogin;
    localStorage['email'] = storeData.email;
    localStorage['password'] = storeData.password;
    localStorage['id'] = storeData.id;
    window.location.assign('index.html');
  });
}
// function showMyWaste() {
//   getData(
//     'https://waste-management.leeseona25.repl.co/waste/my/' + localStorage['id']
//   ).then((data) => {
//     data.map((d, i) => {
//       let row = document.getElementById('list_waste_body').insertRow();
//       let no = row.insertCell(0);
//       let date = row.insertCell(1);
//       no.innerHTML = i + 1;
//       date.innerHTML = d.date;
//     });
//   });
// }
