

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