
$(document).ready(function () {
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
            <a href="projects.html" class="nav-link">
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
              <span class="pl-3 text-white">Username</span>
      </a>
      <a href="../login.html" class="nav-link">
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