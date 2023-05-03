document
    .getElementById("btnLogin")
    .addEventListener("click", loginPost);


function loginPost() {
    var username = document.getElementById('emailAdd').text;
    var password = document.getElementById('password').text;

    $.ajax({
        url:
            'https://api.negosys.co.kr/login',
        type: "POST",
        data: { username: username, password: password },
        success: function (data) {
            var x = JSON.stringify(data);
            console.log(x);
        },
        error: function (error) {
            var x = JSON.stringify(error);
            console.log(x);
        }
    });
}
