
document
    .getElementById("btnRegister")
    .addEventListener("click", registerPost);

function registerPost() {
    var fullName = document.getElementById('fullname').value;
    var userEmail = document.getElementById('emailAdd').value;
    var compName = document.getElementById('companyName').value;
    var hpNo = document.getElementById('hpNo').value;
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirmPassword').value;


    if (fullName == '') {
        Swal.fire({
            icon: 'warning',
            text: 'Please enter your Full Name'
        });
        return;
    } else if (userEmail == '') {
        Swal.fire({
            icon: 'warning',
            text: 'Please enter your Email Address'
        });
        return;
    } else if (compName == '') {
        Swal.fire({
            icon: 'warning',
            text: 'Please enter your Company Name'
        });
        return;
    } else if (hpNo == '') {
        Swal.fire({
            icon: 'warning',
            text: 'Please enter your Phone Number'
        });
        return;
    } else if (password == '') {
        Swal.fire({
            icon: 'warning',
            text: 'Please enter your Password'
        });
        return;
    } else if (confirmPassword == '') {
        Swal.fire({
            icon: 'warning',
            text: 'Please enter your Confirm Password'
        });
        return;
    }

    if (password != confirmPassword) {
        Swal.fire({
            icon: 'warning',
            text: 'Password and Confirm Password not match!'
        });
        return;
    }

    $.ajax({
        url:
            'https://api.negosys.co.kr/register',
        type: "POST",
        data: { userEmail: userEmail, userNm: fullName, userPw: password, userPhone: hpNo, userCompany: compName },
        success: function (data) {
            var x = JSON.stringify(data);
            console.log(x);
            location.href = "login.html";
        },
        error: function (error) {
            var x = JSON.stringify(error);
            console.log(x);
            Swal.fire({
                icon: 'error',
                title: 'Register Failed',
                text: ''
            });
        }
    });
}