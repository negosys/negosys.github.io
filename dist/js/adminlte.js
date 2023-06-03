

export async function getUserDetails() {
  let result;

  try {
    result = await $.ajax({
      url:
        'https://api.negosys.co.kr/user/whoami',
      type: "GET",
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true
    });

    return result;
  } catch (error) {
    console.log(error);
    var returnStatus = error.status;

    if (returnStatus == "401") {
      Swal.fire({
        text: "Sessioin expired. Please proceed to login.",
        icon: "warning",
        confirmButtonColor: '#5D66DF',
        confirmButtonText: 'Ok',
      }).then((result) => {
        if (result.value) {
          location.href = "../login.html"
        }
      });
      //location.href = "../login.html"
    }
    console.error(error);
  }
}

export function getCookies(cookieName) {
  let cookie = {};
  document.cookie.split(';').forEach(function (el) {
    let [key, value] = el.split('=');
    cookie[key.trim()] = value;
  })
  return cookie[cookieName];
}