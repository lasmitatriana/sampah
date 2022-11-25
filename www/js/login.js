async function submitLogin(){
    var email = document.getElementById('email');
    var password = document.getElementById('password');
    var data = JSON.stringify({
        'email' : email.value,
        'password' : password.value,
    });
    var url = "Http.//localhost/coba1/data_tampil";
    fetch(url, {
        method: 'POST',
        headers:{
            'Accept' : 'application/json',
            'Content-type' : 'application/json',
        },
        body:data
    }).then(function(response){
        return response.json();
    }).then(function(responseJson){
        if(responseJson.status == 201){
            alert('Data Berhasil Disimpan');
        }else{
            alert('Error, terjadi kesalahan');
        }
    });       
}
