import * as user from "./adminlte.js"

var userRole;

document
    .getElementById("btnLogin")
    .addEventListener("click", loginPost);


function loginPost() {
    var username = document.getElementById('emailAdd').value;
    var password = document.getElementById('password').value;

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

    $("#loadingView").show();
    $.ajax({
        url:
            'https://api.negosys.co.kr/login',
        type: "POST",
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        data: { username: username, password: password },
        success: async function (data) {
            var x = JSON.stringify(data);

            var userDetails = await user.getUserDetails();
            userRole = userDetails.userLevel;

            document.cookie = "userSn=" + userDetails.userSn;
            document.cookie = "userRole=" + userRole;
            
            //console.log(document.cookie);
            //alert("here");
            if (userRole == "ADMIN") {
                location.href = "pages/admin-projects.html";
            } else {
                location.href = "pages/projects.html";
            }

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
            $("#loadingView").hide();
        }
    });
}
