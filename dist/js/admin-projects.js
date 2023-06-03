import * as user from "./adminlte.js"

var userRole;
var userNo = 0;
var filterCust = "";

$(document).ready(async function () {
    var ck = getCookies("userRole");
    var sessionExp = false;

    if (ck == undefined) sessionExp = true;
    if (ck == 'null') sessionExp = true;
    //console.log(ck);
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

    function getCookies(cookieName) {
        let cookie = {};
        document.cookie.split(';').forEach(function (el) {
            let [key, value] = el.split('=');
            cookie[key.trim()] = value;
        })
        return cookie[cookieName];
    }

});

//document
//.getElementById("btnSearchCustomer")
//.addEventListener("click", loadCustomerList);


$(document).on('input', '.select2-search__field', async function () {
    await $(window).delay(500).promise();
    //console.log("start");

    //console.log(filterCust);
    if (filterCust != $(".select2-search__field").val()) {
        filterCust = $(".select2-search__field").val();
        if (filterCust.length > 2) {
            //console.log("load");
            loadCustomerList(filterCust);
        }
    }
});

/*$('#ddlCustomerList').select2({
    ajax: {
        url: 'https://api.negosys.co.kr/a/users',
        type: "GET",
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        delay: 250,
        data: function (data) {
            console.log(data.term);
            if (data.term != undefined) {
                if (data.term.length > 2) {
                    return {
                        name: data.term // search term
                    };
                }
            }
        },
        processResults: function (response) {
            console.log(response);
            return {
                results: response.userNm
            };
        },
        cache: true
    }
});*/

$('#ddlCustomerList').on('select2:select', function (e) {
    var selectedCustomer = $("#ddlCustomerList").val();

    console.log(selectedCustomer);
    if (selectedCustomer != 0) {
        loadProjectList(selectedCustomer);
        $("#loadingView").hide();
    }
});

function loadProjectList(userSn) {
    userSn = $("#ddlCustomerList").val();

    if (userSn == "") {
        Swal.fire({
            icon: 'warning',
            text: 'No Customer is selected'
        });
        return;
    }

    $("#loadingView").show();
    var dataTable = $('#tblData').DataTable({
        paging: true,
        destroy: true,
        pageLength: 10,
        scrollX: true,
        scrollY: true,
        //order: [[10, 'asc']],
        "ajax": {
            url: 'https://api.negosys.co.kr/a/projects',
            data: { userSn: userSn },
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
                                <a href="issues.html?projectSn=${data}&userSn=${userSn}" class="btn btn-default" style="cursor:pointer">
                                    Update 
                                </a>
                                <a href="issue-tracking.html?projectSn=${data}&userSn=${userSn}" class="btn btn-default" style="cursor:pointer">
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

function loadCustomerList(fc) {
    $.ajax({
        url:
            'https://api.negosys.co.kr/a/users',
        type: "GET",
        data: { name: fc },
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (data) {
            //console.log(data);
            var ddl = $("#ddlCustomerList");
            ddl.empty();
            ddl.append($('<option/>', {
                value: 0,
                text: "-Select Customer"
            }));
            $.each(data, function (index, itemData) {
                ddl.append($('<option/>', {
                    value: itemData.userSn,
                    text: itemData.userNm
                }));
            });
            $("#ddlCustomerList").select2('close');
            $("#ddlCustomerList").select2('open');
        },
        error: function (error) {
            console.log(JSON.stringify(error));
            Swal.fire({
                icon: 'error',
                text: 'Failed to load customer list.',
                confirmButtonColor: '#5D66DF',
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
