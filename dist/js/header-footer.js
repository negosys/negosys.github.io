
var uName = "";
var uLevel = "";

$(document).ready(async function () {

  var userD = await getUserDetails();
  uName = userD.userNm;
  uLevel = userD.userLevel;

  loadSidebar();
  loadFooter();


});

function loadSidebar() {
  var html = "";

  html += `
  <aside class="main-sidebar main-sidebar-custom sidebar-dark-primary elevation-4">
    <!-- Brand Logo -->
    <a href="../index.html" class="brand-link">
      <img src="../dist/img/logo.png" alt="Logo" class="brand-image img-circle elevation-3">
      <span class="brand-text font-weight-light">NEGOSYS</span>
    </a>

    <!-- Sidebar -->
    <div class="sidebar">

      <!-- Sidebar Menu -->
      <nav class="mt-2">
        <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">

          <li class="nav-item">
            <a href="#" onclick="loadProjectPage()" class="nav-link">
              <!--i class="fas fa-lg fa-plus-square mr-2"></i-->
              <img src="../dist/img/plus.png" alt="icon" class="iconImg brand-image img-square elevation-3">
              <p class="text text-white">
                Create Project
              </p>
            </a>
          </li>

          <li class="nav-item">
            <a href="#" class="nav-link">
              <!--i class="fas fa-lg fa-sync mr-2"></i-->
              <img src="../dist/img/refresh.png" alt="icon" class="iconImg brand-image">
              <p class="text text-white">On-going</p>
            </a>
          </li>
        </ul>

      </nav>
      <!-- /.sidebar-menu -->
    </div>
    <!-- /.sidebar -->

    <div class="sidebar-custom">
      <a href="#" class="nav-link">
        <img src="../dist/img/user.png" alt="icon" class="iconImg brand-image">
              <span id="txtUsername" class="pl-3 text-white">${uName}</span>
      </a>
      <a href="#" onclick="logout()" class="nav-link">
        <img src="../dist/img/power.png" alt="icon" class="iconImg brand-image">
        <span class="pl-3 text-white">Logout</span>
      </a>    
    </div>

  </aside>
              `;

  $(".mainsidebar").html(html);
}

function loadFooter() {
  var html = "";

  html += `
  <footer class="main-footer" style="margin-left: 76px;">
  <strong>&copy; 2023 BNE CONSULTING Co.</strong>
  
  </footer>
              `;

  $(".footerContainer").html(html);
}

function deleteCookies() {
  var Cookies = document.cookie.split(';');

  // set 1 Jan, 1970 expiry for every cookies
  for (var i = 0; i < Cookies.length; i++)
    document.cookie = Cookies[i] + "=;expires=" + new Date(0).toUTCString();
}

function clearHOnlySessionCookie(name) {
  //var domain = domain || document.domain;
  var path = "/";
  document.cookie = name + "=null; path=" + path + ";";

};

function logout() {
  //alert("sure logout?");
  deleteCookies();
  clearHOnlySessionCookie("st");
  clearHOnlySessionCookie("userRole");
  clearHOnlySessionCookie("userSn");
  console.log(document.cookie);
  location.href = "../login.html";
}

function loadProjectPage() {
  if (uLevel == "ADMIN") {
    location.href = "admin-projects.html";
  } else {
    location.href = "projects.html";
  }
}

async function getUserDetails() {
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