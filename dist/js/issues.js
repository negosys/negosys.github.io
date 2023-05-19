
var projectNo = "";
var curIssuesNo = "";

$(document).ready(function () {
    loadIssueKind();

    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    projectNo = urlParams.get('projectSn');

    loadProjectIssueList();
    getIssueCount();
});

document
    .getElementById("btnAddIssue")
    .addEventListener("click", addIssue);

document
    .getElementById("btnNext")
    .addEventListener("click", nextPage);


function nextPage() {
    if (getIssueCount() < 5) {
        Swal.fire({
            icon: 'warning',
            text: 'Minimum 5 Issues.'
        });
        return;
    }

    location.href = "prior-issues.html?projectSn=" + projectNo;
}

function loadIssueKind() {
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
        },
        error: function (error) {
            console.log(JSON.stringify(error));
            Swal.fire({
                icon: 'error',
                text: 'Failed to load issue kind.'
            });
        }
    });
}

function loadProjectIssueList() {
    dataTable = $('#tblData').DataTable({
        paging: false,
        destroy: true,
        //pageLength: 10,
        scrollX: true,
        scrollY: true,
        //order: [[10, 'asc']],
        "ajax": {
            url: 'https://api.negosys.co.kr/nego/issuesByProjectSn',
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            data: { projectSn: projectNo },
            dataSrc: "",
        },
        "columns": [
            { "data": "issueKind", "width": "30%" },
            { "data": "issue", "width": "40%" },
            {
                "data": "issueSn",
                "render": function (data) {
                    return `
                            <div class="text-center">
                                <a onclick=deleteIssue(${data}) class="btn btn-info text-white" style="cursor:pointer">
                                    <i class="fa fa-trash-alt"></i> 
                                </a>
                            </div>
                           `;
                }, "width": "30%"
            }
        ]
    });
    //console.log(dataTable.data().count());
}

function getIssueCount() {
    var table = $("#tblData").DataTable();
    return table.data().count();
}

$('#ddlIssueKind').on('select2:select', function (e) {
    var selectedIssueKind = e.params.data.id;
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
        },
        error: function (e) {
            console.log(e);
            Swal.fire({
                icon: 'error',
                text: 'Failed to retrieve Issues List!'
            });
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

    console.log($("#ddlIssue option:selected").index());

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

    let reqObj = { projectSn: projectNo, issueKind: issueKind, issue: issue }

    $("#loadingView").show();

    $.ajax({
        url:
            'https://api.negosys.co.kr/nego/issue',
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

function deleteIssue(issueSn) {

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
