import * as user from "./adminlte.js"

var userRole;
var userNo = 0;

var projectNo = "";
var currentIssue = "";
var totalIssues = "";
var issueLists;
var issueSnList = [];
var isSave = false;

$(document).ready(async function () {
    var userDetails = await user.getUserDetails();
    userRole = userDetails.userLevel;

    var ck = await user.getCookies("userRole");
    if (ck == 'undefined' || ck == 'null') {
        Swal.fire({
            text: "Sessioin expired. Please proceed to login.",
            type: "warning",
            //confirmButtonColor: '#DD6B55',
            confirmButtonText: 'Ok',
        }).then((result) => {
            if (result.value) {
                location.href = "../login.html"
            }
        });
        return;
    }

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

    loadResultMakingList();
});

document
    .getElementById("btnPrevIssue")
    .addEventListener("click", loadPrevResult);

document
    .getElementById("btnNextIssue")
    .addEventListener("click", loadNextResult);

document
    .getElementById("btnSave")
    .addEventListener("click", function () {
        saveList('save');
    });

document
    .getElementById("btnBack")
    .addEventListener("click", prevPage);

function prevPage() {
    location.href = "swot-logic.html?projectSn=" + projectNo + "&userSn=" + userNo;
}

$(".hookerContainer").on("click", '.btn-danger', function (event) {
    event.preventDefault();
    var removeDiv = event.currentTarget.offsetParent;
    removeDiv.remove();
});

$(".watnaContainer").on("click", '.btn-danger', function (event) {
    event.preventDefault();
    var removeDiv = event.currentTarget.offsetParent;
    removeDiv.remove();
});

function loadResultMakingList() {
    $("#loadingView").show();

    $.ajax({
        url:
            'https://api.negosys.co.kr/a/issues',
        type: "GET",
        data: { projectSn: projectNo, userSn: userNo },
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (data) {

            //console.log(JSON.stringify(data));

            $("#loadingView").show();
            var issueTitle = "";
            var totalIssueContent = "";
            var hookerContent = "";
            var watnaContent = "";

            totalIssues = data.length;

            //sort by issueSn
            data.sort(function (a, b) {
                return a.issueSn - b.issueSn;
            });

            issueLists = data;

            $.each(data, function (index, itemData) {
                if (index == 0) {
                    issueTitle += `
                    <h4>${itemData.issueKind} > ${itemData.issue}</h4>
                   `;

                    totalIssueContent += `
                    <h5 class="mt-2 mr-3 ml-3 issueId">1 / ${totalIssues}  Issues</h5>
                   `;

                    var hookerList = itemData.hooker;

                    for (var i = 0; i < hookerList.length; i++) {
                        // Trim the excess whitespace.
                        hookerList[i] = hookerList[i].replace(/^\s*/, "").replace(/\s*$/, "");

                        //hookerContent += `<p>${hookerList[i]}</p>`;
                        hookerContent += `
                        <div class="input-group mb-3">
                            <input type="text" class="form-control" value="${hookerList[i]}">
                            <span class="input-group-append">
                                <button type="button" class="btn btn-danger"><i class="fa fa-trash-alt"></i></button>
                            </span>
                        </div>
                        `;
                    }

                    var watnaList = itemData.watna;

                    for (var i = 0; i < watnaList.length; i++) {
                        // Trim the excess whitespace.
                        watnaList[i] = watnaList[i].replace(/^\s*/, "").replace(/\s*$/, "");

                        //watnaContent += `<p>${watnaList[i]}</p>`;
                        watnaContent += `
                        <div class="input-group mb-3">
                            <input type="text" class="form-control" value="${watnaList[i]}">
                            <span class="input-group-append">
                                <button type="button" class="btn btn-danger"><i class="fa fa-trash-alt"></i></button>
                            </span>
                        </div>
                        `;
                    }

                    loadModal(itemData.issueSn);
                }

                var issueSnMatch = {
                    id: index + 1,
                    snId: itemData.issueSn
                }

                issueSnList.push(issueSnMatch);
            });

            //console.log(issueSnList);
            $(".issueTitle").html(issueTitle);
            $(".totalIssue").html(totalIssueContent);
            $(".hookerContainer").html(hookerContent);
            $(".watnaContainer").html(watnaContent);
            $("#loadingView").hide();
        },
        error: function (error) {
            $("#loadingView").hide();
            console.log(JSON.stringify(error));
            Swal.fire({
                icon: 'error',
                text: 'Failed to load issue data.'
            });
        }
    });
}

async function loadNextResult() {
    await saveList();

    if (isSave == false) return;

    var getCurrentId = $('.issueId').html();
    let curId = getCurrentId.charAt(0);
    var nextId = parseInt(curId) + 1;
    var issueId;

    //console.log(totalIssues);

    var btnP = document.getElementById("btnPrevIssue");
    var btnN = document.getElementById("btnNextIssue");
    if (nextId >= totalIssues) {
        btnN.classList.add("disabled");
        btnN.classList.add("iconDisableThemeColor");
    } else {
        btnN.classList.remove("disabled");
        btnP.classList.remove("disabled");
        btnN.classList.remove("iconDisableThemeColor");
        btnP.classList.remove("iconDisableThemeColor");
    }

    $.each(issueSnList, function (i, itemData) {
        if (itemData.id == nextId) {
            issueId = itemData.snId
        }
    });

    if (issueId == null || nextId > totalIssues) {
        Swal.fire({
            icon: 'error',
            text: 'Failed to load issue data.'
        });
        return;
    }

    $("#loadingView").show();

    $.each(issueLists, function (index, itemData) {

        var issueTitle = "";
        var totalIssueContent = "";
        var hookerContent = "";
        var watnaContent = "";

        if (itemData.issueSn == issueId) {
            issueTitle += `
            <h4>${itemData.issueKind} > ${itemData.issue}</h4>
           `;

            totalIssueContent += `
           <h5 class="mt-2 mr-3 ml-3 issueId">${nextId} / ${totalIssues}  Issues</h5>
          `;

            var hookerList = itemData.hooker;

            for (var i = 0; i < hookerList.length; i++) {
                // Trim the excess whitespace.
                hookerList[i] = hookerList[i].replace(/^\s*/, "").replace(/\s*$/, "");

                hookerContent += `<p>${hookerList[i]}</p>`;
            }

            var watnaList = itemData.watna;

            for (var i = 0; i < watnaList.length; i++) {
                // Trim the excess whitespace.
                watnaList[i] = watnaList[i].replace(/^\s*/, "").replace(/\s*$/, "");

                watnaContent += `<p>${watnaList[i]}</p>`;
            }

            $(".issueTitle").html(issueTitle);
            $(".totalIssue").html(totalIssueContent);
            $(".hookerContainer").html(hookerContent);
            $(".watnaContainer").html(watnaContent);

            loadModal(itemData.issueSn);
        }
    });
    $("#loadingView").hide();
}

async function loadPrevResult() {
    await saveList();

    if (isSave == false) return;

    var getCurrentId = $('.issueId').html();
    let curId = getCurrentId.charAt(0);
    var prevId = parseInt(curId) - 1;
    var issueId;

    var btnP = document.getElementById("btnPrevIssue");
    var btnN = document.getElementById("btnNextIssue");
    if (prevId <= 1) {
        btnP.classList.add("disabled");
        btnP.classList.add("iconDisableThemeColor");
    } else {
        btnP.classList.remove("disabled");
        btnN.classList.remove("disabled");
        btnN.classList.remove("iconDisableThemeColor");
        btnP.classList.remove("iconDisableThemeColor");
    }

    $.each(issueSnList, function (i, itemData) {
        if (itemData.id == prevId) {
            issueId = itemData.snId
        }
    });

    if (issueId == null || prevId < 1) {
        Swal.fire({
            icon: 'error',
            text: 'Failed to load issue data.'
        });
        return;
    }

    $("#loadingView").show();
    console.log(issueLists);
    $.each(issueLists, function (index, itemData) {

        var issueTitle = "";
        var totalIssueContent = "";
        var hookerContent = "";
        var watnaContent = "";

        if (itemData.issueSn == issueId) {
            issueTitle += `
            <h4>${itemData.issueKind} > ${itemData.issue}</h4>
           `;

            totalIssueContent += `
           <h5 class="mt-2 mr-3 ml-3 issueId">${prevId} / ${totalIssues}  Issues</h5>
          `;

            var hookerList = itemData.hooker;

            for (var i = 0; i < hookerList.length; i++) {
                // Trim the excess whitespace.
                hookerList[i] = hookerList[i].replace(/^\s*/, "").replace(/\s*$/, "");

                hookerContent += `<p>${hookerList[i]}</p>`;
            }

            var watnaList = itemData.watna;

            for (var i = 0; i < watnaList.length; i++) {
                // Trim the excess whitespace.
                watnaList[i] = watnaList[i].replace(/^\s*/, "").replace(/\s*$/, "");

                watnaContent += `<p>${watnaList[i]}</p>`;
            }


            $(".issueTitle").html(issueTitle);
            $(".totalIssue").html(totalIssueContent);
            $(".hookerContainer").html(hookerContent);
            $(".watnaContainer").html(watnaContent);

            loadModal(itemData.issueSn);
        }
    });
    $("#loadingView").hide();
}

function loadModal(issueNo) {
    $("#loadingView").show();

    $.ajax({
        url:
            'https://api.negosys.co.kr/a/swotLogicsByProjectSn',
        type: "GET",
        data: { issueSn: issueNo, userSn: userNo },
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (data) {

            //console.log(JSON.stringify(data));

            var hooker = $("#ddlHooker");
            hooker.empty();

            var watna = $("#ddlWatna");
            watna.empty();

            //me side
            var sArr = [];
            var wArr = [];
            var oArr = [];
            var tArr = [];

            $.each(data.meSwotS, function (index, itemData) {
                sArr.push(itemData.info);
            });

            $.each(data.meSwotW, function (index, itemData) {
                wArr.push(itemData.info);
            });

            $.each(data.meSwotO, function (index, itemData) {
                oArr.push(itemData.info);
            });

            $.each(data.meSwotT, function (index, itemData) {
                tArr.push(itemData.info);
            });

            hooker.append($('<optgroup class="selectTitle" label="My Side">'));
            watna.append($('<optgroup class="selectTitle" label="My Side">'));

            hooker.append($('<optgroup class="ml-2" label="Strength">'));
            watna.append($('<optgroup class="ml-2" label="Strength">'));

            for (var i = 0; i < sArr.length; i++) {
                hooker.append($('<option/>', {
                    value: sArr[i],
                    text: sArr[i]
                }));

                watna.append($('<option/>', {
                    value: sArr[i],
                    text: sArr[i]
                }));
            }

            hooker.append($('<optgroup class="ml-2" label="Weakness">'));
            watna.append($('<optgroup class="ml-2" label="Weakness">'));

            for (var i = 0; i < wArr.length; i++) {
                hooker.append($('<option/>', {
                    value: wArr[i],
                    text: wArr[i]
                }));

                watna.append($('<option/>', {
                    value: wArr[i],
                    text: wArr[i]
                }));
            }

            hooker.append($('<optgroup class="ml-2" label="Opportunity">'));
            watna.append($('<optgroup class="ml-2" label="Opportunity">'));

            for (var i = 0; i < oArr.length; i++) {
                hooker.append($('<option/>', {
                    value: oArr[i],
                    text: oArr[i]
                }));

                watna.append($('<option/>', {
                    value: oArr[i],
                    text: oArr[i]
                }));
            }

            hooker.append($('<optgroup class="ml-2" label="Thread">'));
            watna.append($('<optgroup class="ml-2" label="Thread">'));

            for (var i = 0; i < tArr.length; i++) {
                hooker.append($('<option/>', {
                    value: tArr[i],
                    text: tArr[i]
                }));

                watna.append($('<option/>', {
                    value: tArr[i],
                    text: tArr[i]
                }));
            }

            //other side
            var osArr = [];
            var owArr = [];
            var ooArr = [];
            var otArr = [];

            $.each(data.otherSwotS, function (index, itemData) {
                osArr.push(itemData.info);
            });

            $.each(data.otherSwotW, function (index, itemData) {
                owArr.push(itemData.info);
            });

            $.each(data.otherSwotO, function (index, itemData) {
                ooArr.push(itemData.info);
            });

            $.each(data.otherSwotT, function (index, itemData) {
                otArr.push(itemData.info);
            });

            hooker.append($('<optgroup class="selectTitle" label="Other Side">'));
            watna.append($('<optgroup class="selectTitle" label="Other Side">'));

            hooker.append($('<optgroup class="ml-2" label="Strength">'));
            watna.append($('<optgroup class="ml-2" label="Strength">'));

            for (var i = 0; i < osArr.length; i++) {
                hooker.append($('<option/>', {
                    value: osArr[i],
                    text: osArr[i]
                }));

                watna.append($('<option/>', {
                    value: osArr[i],
                    text: osArr[i]
                }));
            }

            hooker.append($('<optgroup class="ml-2" label="Weakness">'));
            watna.append($('<optgroup class="ml-2" label="Weakness">'));

            for (var i = 0; i < owArr.length; i++) {
                hooker.append($('<option/>', {
                    value: owArr[i],
                    text: owArr[i]
                }));

                watna.append($('<option/>', {
                    value: owArr[i],
                    text: owArr[i]
                }));
            }

            hooker.append($('<optgroup class="ml-2" label="Opportunity">'));
            watna.append($('<optgroup class="ml-2" label="Opportunity">'));

            for (var i = 0; i < ooArr.length; i++) {
                hooker.append($('<option/>', {
                    value: ooArr[i],
                    text: ooArr[i]
                }));

                watna.append($('<option/>', {
                    value: ooArr[i],
                    text: ooArr[i]
                }));
            }

            hooker.append($('<optgroup class="ml-2" label="Thread">'));
            watna.append($('<optgroup class="ml-2" label="Thread">'));

            for (var i = 0; i < otArr.length; i++) {
                hooker.append($('<option/>', {
                    value: otArr[i],
                    text: otArr[i]
                }));

                watna.append($('<option/>', {
                    value: otArr[i],
                    text: otArr[i]
                }));
            }

            $("#loadingView").hide();
        },
        error: function (error) {
            $("#loadingView").hide();
            console.log(JSON.stringify(error));
            Swal.fire({
                icon: 'error',
                text: 'Failed to load hooker data.'
            });
        }
    });
}

$("#btnAddWatna").click(function () {
    var itemList = $('#ddlWatna').val();

    if (itemList.length == 0) {
        Swal.fire({
            icon: 'warning',
            text: 'No item is selected.'
        });
        return;
    }

    var html = "";

    for (var i = 0; i < itemList.length; i++) {
        //html += `<p>${itemList[i]}</p>`;
        html += `
        <div class="input-group mb-3">
        <input type="text" class="form-control" value="${itemList[i]}">
        <span class="input-group-append">
            <button type="button" class="btn btn-danger"><i class="fa fa-trash-alt"></i></button>
        </span>
    </div>
        `;
    }

    $(".watnaContainer").append(html);
    $('#addWatnaModal').modal('hide');
});

$("#btnAddHooker").click(function () {
    var itemList = $('#ddlHooker').val();

    if (itemList.length == 0) {
        Swal.fire({
            icon: 'warning',
            text: 'No item is selected.'
        });
        return;
    }

    var html = "";

    for (var i = 0; i < itemList.length; i++) {
        //html += `<p>${itemList[i]}</p>`;
        html += `
        <div class="input-group mb-3">
        <input type="text" class="form-control" value="${itemList[i]}">
        <span class="input-group-append">
            <button type="button" class="btn btn-danger"><i class="fa fa-trash-alt"></i></button>
        </span>
    </div>
        `;
    }

    $(".hookerContainer").append(html);
    $('#addHookerModal').modal('hide');
});

async function saveList(btnId) {
    isSave = false;

    var getCurrentId = $('.issueId').html();
    let curId = getCurrentId.charAt(0);
    var issueId;

    $.each(issueSnList, function (i, itemData) {
        if (itemData.id == curId) {
            issueId = itemData.snId
        }
    });

    if (issueId == null) {
        Swal.fire({
            icon: 'error',
            text: 'Failed to save result making data.'
        });
        return;
    }

    $("#loadingView").show();

    var hookerList = [];
    var watnaList = [];

    //var hookerContent = $(".hookerContainer p");
    var hookerContent = $(".hookerContainer input");
    console.log(hookerContent);

    for (var i = 0; i < hookerContent.length; i++) {
        hookerList.push($(hookerContent[i]).val());
    }

    var watnaContent = $(".watnaContainer input");

    for (var i = 0; i < watnaContent.length; i++) {
        watnaList.push($(watnaContent[i]).val());
    }

    let reqObj = {
        issueSn: issueId,
        hooker: hookerList,
        watna: watnaList
    }
    console.log(reqObj);

    isSave == false;

    await $.ajax({
        url: "https://api.negosys.co.kr/a/issueResult?userSn=" + userNo,
        type: "PUT",
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        data: JSON.stringify(reqObj),
        contentType: "application/json",
        success: function (data) {

            refreshResult();

            if (btnId == "save") {
                Swal.fire({
                    icon: 'info',
                    text: 'Data has been saved successfully.'
                });
            }
            $("#loadingView").hide();
            isSave = true;
            return true;
        },
        error: function (error) {
            console.log(JSON.stringify(error));
            Swal.fire({
                icon: 'error',
                text: 'Failed to update result making data.'
            });
            $("#loadingView").hide();
            return false;
        }
    });

}

function refreshResult() {
    $("#loadingView").show();

    $.ajax({
        url:
            'https://api.negosys.co.kr/a/issues',
        type: "GET",
        data: { projectSn: projectNo, userSn: userNo },
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (data) {

            //console.log(JSON.stringify(data));

            //sort by issueSn
            data.sort(function (a, b) {
                return a.issueSn - b.issueSn;
            });

            issueLists = data;

            $("#loadingView").hide();
        },
        error: function (error) {
            $("#loadingView").hide();
            console.log(JSON.stringify(error));
            Swal.fire({
                icon: 'error',
                text: 'Failed to load issue data.'
            });
        }
    });
}