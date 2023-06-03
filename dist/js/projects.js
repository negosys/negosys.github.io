import * as user from "./adminlte.js"

var userRole;

$(document).ready(async function () {
    var ck = getCookies("userRole");
    var sessionExp = false;

    if (ck == undefined) sessionExp = true;
    if (ck == 'null') sessionExp = true;

    if (sessionExp == true) {
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
        return;
    }

    var userDetails = await user.getUserDetails();
    userRole = userDetails.userLevel;

    loadProjectList();

    function getCookies(cookieName) {
        let cookie = {};
        document.cookie.split(';').forEach(function (el) {
            let [key, value] = el.split('=');
            cookie[key.trim()] = value;
        })
        return cookie[cookieName];
    }
});

document
    .getElementById("btnCreateProj")
    .addEventListener("click", createProject);

function loadProjectList() {
    var dataTable = $('#tblData').DataTable({
        paging: true,
        destroy: true,
        pageLength: 10,
        scrollX: true,
        scrollY: true,
        //order: [[10, 'asc']],
        "ajax": {
            url: 'https://api.negosys.co.kr/nego/projectsByUser',
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            dataSrc: "",
        },
        "columns": [
            {
                "data": 'createDt',
                "type": 'date',
                render: function (data, type, row) {
                    return data ? moment(data).format('DD/MM/YYYY') : '';
                },
                "width": "10%"
            },
            { "data": "projectNm", "width": "20%" },
            { "data": "projectDesc", "width": "20%" },
            {
                "data": "projectSn",
                "render": function (data) {
                    return `
                            <div class="text-center">
                                <a href="issues.html?projectSn=${data}" class="btn btn-default" style="cursor:pointer">
                                    Update 
                                </a>
                                <a href="issue-tracking.html?projectSn=${data}" class="btn btn-default" style="cursor:pointer">
                                    Issue Tracking 
                                </a>
                                <a onclick=Delete("/Delete/${data}") class="btn btn-danger text-white" style="cursor:pointer">
                                    <i class="fa fa-trash-alt"></i> 
                                </a>
                            </div>
                           `;
                }, "width": "50%"
            }
        ]
    });

}

function createProject() {
    var pjName = document.getElementById('project-name').value;
    var pjDesc = document.getElementById('project-desc').value;

    if (pjName == '') {
        Swal.fire({
            icon: 'warning',
            text: 'Please enter Project Name'
        });
        return;
    } else if (pjDesc == '') {
        Swal.fire({
            icon: 'warning',
            text: 'Please enter Project Description'
        });
        return;
    }

    let reqObj = { projectNm: pjName, projectDesc: pjDesc }

    $.ajax({
        url:
            'https://api.negosys.co.kr/nego/project',
        type: "POST",
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        data: JSON.stringify(reqObj),
        contentType: "application/json",
        success: function (data) {
            var x = JSON.stringify(data);
            console.log(x);
            loadProjectList();
            $('#createModal').modal('hide');
            document.getElementById('project-name').value = "";
            document.getElementById('project-desc').value = "";
        },
        error: function (error) {
            console.log(JSON.stringify(error));
            Swal.fire({
                icon: 'error',
                text: 'Failed to create project'
            });
        }
    });
}

function deleteIssue() {
    var issueSn = document.getElementById('project-name').value;

    if (issueSn == '') {
        Swal.fire({
            icon: 'warning',
            text: 'Cannot get Issue Number.'
        });
        return;
    }

    $.ajax({
        url:
            'https://api.negosys.co.kr/nego/issue',
        type: "DELETE",
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        data: { issueSn: issueSn },
        success: function (data) {
            var x = JSON.stringify(data);
            console.log(x);
            loadProjectList();
        },
        error: function (error) {
            console.log(JSON.stringify(error));
            Swal.fire({
                icon: 'error',
                text: 'Failed to delete issue'
            });
        }
    });
}
