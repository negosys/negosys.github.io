//=========login=========//
document
    .getElementById("btnLogin")
    .addEventListener("click", loginPost);


function loginPost() {
    var username = document.getElementById('emailAdd').value;
    var password = document.getElementById('password').value;

    //console.log(username);

    if (username == '') {
        Swal.fire({
            icon: 'warning',
            text: 'Please enter your Username'
        });
        return;
    } else if (password == '') {
        Swal.fire({
            icon: 'warning',
            text: 'Please enter your Password'
        });
        return;
    }

    $.ajax({
        url:
            'https://api.negosys.co.kr/login',
        type: "POST",
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        data: { username: username, password: password },
        success: function (data) {
            var x = JSON.stringify(data);
            console.log(x);
            let y = document.cookie;
            console.log(y);
            //location.href = "pages/projects.html";
        },
        error: function (error) {
            console.log(JSON.stringify(error));
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: 'Either username or password is incorrect!'
            });
            document.getElementById('emailAdd').value = "";
            document.getElementById("password").value = "";
        }
    });
}
