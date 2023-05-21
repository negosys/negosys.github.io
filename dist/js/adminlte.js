

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