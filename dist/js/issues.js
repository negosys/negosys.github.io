import * as user from "./adminlte.js"

var userRole;
var userNo = 0;

var projectNo = "";
var curIssuesNo = "";

$(document).ready(async function () {
    var ck = await user.getCookies("userRole");
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

    loadIssueKind();

    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    projectNo = urlParams.get('projectSn');
    userNo = urlParams.get('userSn');

    if (projectNo == null || projectNo == "") {
        Swal.fire({
            icon: 'error',
            text: 'Invalid Url.'
        });
        return;
    }

    loadProjectIssueList();
    getIssueCount();
});

document
    .getElementById("btnAddIssue")
    .addEventListener("click", addIssue);

document
    .getElementById("btnBack")
    .addEventListener("click", prevPage);

document
    .getElementById("btnNext")
    .addEventListener("click", nextPage);

$("#tblData").on("click", '.deleteBtn', function (event) {
    event.preventDefault();
    var issueId = event.target.getAttribute("data-id");
    var issueText = event.target.getAttribute("data-text");
    console.log(issueId);
    console.log(issueText); 
    deleteIssue(issueId, issueText);
});

function prevPage() {
    if (userRole == "ADMIN") {
        location.href = "admin-projects.html";
    } else {
        location.href = "projects.html";
    }
}

function nextPage() {
    if (getIssueCount() < 3) {
        Swal.fire({
            icon: 'warning',
            text: 'Minimum 3 Issues.'
        });
        return;
    }
    if (userRole == "ADMIN") {
        location.href = "prior-issues.html?projectSn=" + projectNo + "&userSn=" + userNo;
    } else {
        location.href = "prior-issues.html?projectSn=" + projectNo;
    }
}

function loadIssueKind() {
    $("#loadingView").show();
    $.ajax({
        url:
            'https://api.negosys.co.kr/nego/issueKind',
        type: "GET",
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (data) {
            var issueKind = $("#ddlIssueKind");
            issueKind.empty();
            issueKind.append($('<option/>', {
                value: 0,
                text: "-Select an issue kind"
            }));
            $.each(data, function (index, itemData) {
                issueKind.append($('<option/>', {
                    value: itemData.issueKind,
                    text: itemData.issueKind
                }));
            });
            $("#loadingView").hide();
        },
        error: function (error) {
            console.log(JSON.stringify(error));
            Swal.fire({
                icon: 'error',
                text: 'Failed to load issue kind.'
            });
            $("#loadingView").hide();
        }
    });
}

async function loadProjectIssueList() {
    $("#loadingView").show();

    var ajaxUrl;
    var ajaxData;

    if (userRole == "ADMIN") {
        ajaxUrl = "https://api.negosys.co.kr/a/issues";
        ajaxData = { projectSn: projectNo, userSn: userNo };
    } else {
        ajaxUrl = "https://api.negosys.co.kr/nego/issuesByProjectSn"
        ajaxData = { projectSn: projectNo };
    }

    var dataTable = $('#tblData').DataTable({
        paging: false,
        destroy: true,
        //pageLength: 10,
        scrollX: true,
        scrollY: true,
        //order: [[10, 'asc']],
        "ajax": {
            //url: 'https://api.negosys.co.kr/nego/issuesByProjectSn',
            url: ajaxUrl,
            type: "GET",
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            //data: { projectSn: projectNo },
            data: ajaxData,
            dataSrc: "",
        },
        "columns": [
            { "data": "issueKind", "width": "30%" },
            { "data": "issue", "width": "40%" },
            {
                "data": null,
                "render": function (data) {
                    var iText = $.trim(data.issue);
                    //console.log(iText);
                    return `
                            <div class="text-center">
                                <a data-id=${data.issueSn} data-text=${iText} class="deleteBtn btn themeColor" >
                                    <i data-id=${data.issueSn} data-text=${iText} class="fa fa-trash-alt"></i> 
                                </a>
                            </div>
                           `;
                }, "width": "30%"
            }
        ]
    });
    $("#loadingView").hide();
    //console.log(dataTable.data().count());
}

function getIssueCount() {
    var table = $("#tblData").DataTable();
    return table.data().count();
}

$('#ddlIssueKind').on('select2:select', function (e) {
    var selectedIssueKind = e.params.data.id;
    $("#loadingView").show();
    $.ajax({
        url: 'https://api.negosys.co.kr/nego/issueKind',
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (data) {
            var issue = $("#ddlIssue");
            issue.empty();
            issue.append($('<option/>', {
                value: 0,
                text: "-Select an issue"
            }));
            $.each(data, function (index, itemData) {
                if (itemData.issueKind == selectedIssueKind) {
                    $.each(itemData.issueList, function (i, issueData) {
                        //console.log(issueData);
                        issue.append($('<option/>', {
                            value: issueData,
                            text: issueData
                        }));
                    });
                }
            });
            $("#loadingView").hide();
        },
        error: function (e) {
            console.log(e);
            Swal.fire({
                icon: 'error',
                text: 'Failed to retrieve Issues List!'
            });
            $("#loadingView").hide();
        }
    });
});

function addIssue() {
    if (getIssueCount() == 10) {
        Swal.fire({
            icon: 'warning',
            text: 'Issues cannot more than 10.'
        });
        return;
    }

    //var issueKind = document.getElementById("ddlIssueKind").options[document.getElementById("ddlIssueKind").selectedIndex].value;
    //var issue = document.getElementById("ddlIssue").options[document.getElementById("ddlIssue").selectedIndex].value;

    var issueKind = $("#ddlIssueKind").val();
    var issue = $("#ddlIssue").val();

    //console.log($("#ddlIssue option:selected").index());

    if (issueKind == "" || issueKind == "0") {
        Swal.fire({
            icon: 'warning',
            text: 'No Issue Kind is selected'
        });
        return;
    } else if (issue == "" || issue == "0") {
        Swal.fire({
            icon: 'warning',
            text: 'No Issue is selected'
        });
        return;
    }

    //check duplicate issue
    var table = $('#tblData').DataTable();
    var filteredIssueKind = table
        .column(0)
        .data()
        .filter(function (value, index) {
            return value == issueKind ? true : false;
        });
    var filteredIssue = table
        .column(1)
        .data()
        .filter(function (value, index) {
            return value == issue ? true : false;
        });
    //console.log(filteredIssueKind.length);

    if (filteredIssueKind.length > 0) {
        if (filteredIssue.length > 0) {
            Swal.fire({
                icon: 'warning',
                text: 'Issue duplicated.'
            });
            return;
        }
    }

    //return;

    let reqObj = { projectSn: projectNo, issueKind: issueKind, issue: issue }

    $("#loadingView").show();

    var ajaxUrl;

    if (userRole == "ADMIN") {
        ajaxUrl = "https://api.negosys.co.kr/a/issue?userSn=" + userNo;
    } else {
        ajaxUrl = "https://api.negosys.co.kr/nego/issue"
    }

    $.ajax({
        url: ajaxUrl,
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
            loadProjectIssueList();
            $("#loadingView").hide();
        },
        error: function (error) {
            console.log(JSON.stringify(error));
            Swal.fire({
                icon: 'error',
                text: 'Failed to add issue'
            });
            $("#loadingView").hide();
        }
    });
}

function deleteIssue(issueSn, issueText) {
    //console.log(issueSn);

    if (issueSn == '') {
        Swal.fire({
            icon: 'warning',
            text: 'Cannot get Issue Number.'
        });
        return;
    }

    var ajaxUrl;
    var ajaxData;

    if (userRole == "ADMIN") {
        ajaxUrl = "https://api.negosys.co.kr/a/issue?userSn=" + userNo;
        ajaxData = { issueSn: issueSn, userSn: userNo };
    } else {
        ajaxUrl = "https://api.negosys.co.kr/nego/issue";
        ajaxData = { issueSn: issueSn };
    }

    Swal.fire({
        title: 'Are you sure to delete?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5D66DF',
        //cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then((result) => {
        if (result.value) {
            $.ajax({
                url: ajaxUrl,
                type: "DELETE",
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                data: ajaxData,
                success: function (data) {
                    var x = JSON.stringify(data);
                    console.log(x);
                    loadProjectIssueList();
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
    });

}
