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
    var btnP = document.getElementById("btnPrevIssue");
    var btnN = document.getElementById("btnNextIssue");
    btnN.classList.add("disabled");
    btnN.classList.add("iconDisableThemeColor");

    $("#loadingView").show();
    await saveList();

    if (isSave == false) {
        $("#loadingView").hide();
        btnN.classList.remove("disabled");
        btnN.classList.remove("iconDisableThemeColor");
        return;
    }

    var getCurrentId = $('.issueId').html();
    let curId = getCurrentId.charAt(0);
    var nextId = parseInt(curId) + 1;
    var issueId;

    //console.log(totalIssues);


    if (nextId >= totalIssues) {
        btnN.classList.add("disabled");
        btnN.classList.add("iconDisableThemeColor");
    } else {
        btnN.classList.remove("disabled");
        btnN.classList.remove("iconDisableThemeColor");
        btnP.classList.remove("disabled");
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

                watnaContent += `
                        <div class="input-group mb-3">
                            <input type="text" class="form-control" value="${watnaList[i]}">
                            <span class="input-group-append">
                                <button type="button" class="btn btn-danger"><i class="fa fa-trash-alt"></i></button>
                            </span>
                        </div>
                        `;
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
    var btnP = document.getElementById("btnPrevIssue");
    var btnN = document.getElementById("btnNextIssue");

    btnP.classList.add("disabled");
    btnP.classList.add("iconDisableThemeColor");

    $("#loadingView").show();
    await saveList();

    if (isSave == false) {
        $("#loadingView").hide();
        btnP.classList.remove("disabled");
        btnP.classList.remove("iconDisableThemeColor");
        return;
    }

    var getCurrentId = $('.issueId').html();
    let curId = getCurrentId.charAt(0);
    var prevId = parseInt(curId) - 1;
    var issueId;

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

                watnaContent += `
                        <div class="input-group mb-3">
                            <input type="text" class="form-control" value="${watnaList[i]}">
                            <span class="input-group-append">
                                <button type="button" class="btn btn-danger"><i class="fa fa-trash-alt"></i></button>
                            </span>
                        </div>
                        `;
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

            console.log(data);

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
                var s = {
                    info: itemData.info,
                    logic: itemData.logic
                }
                sArr.push(s);
            });

            $.each(data.meSwotW, function (index, itemData) {
                var s = {
                    info: itemData.info,
                    logic: itemData.logic
                }
                wArr.push(s);
            });

            $.each(data.meSwotO, function (index, itemData) {
                var s = {
                    info: itemData.info,
                    logic: itemData.logic
                }
                oArr.push(s);
            });

            $.each(data.meSwotT, function (index, itemData) {
                var s = {
                    info: itemData.info,
                    logic: itemData.logic
                }
                tArr.push(s);
            });

            hooker.append($('<optgroup class="selectTitle" label="My Side">'));
            watna.append($('<optgroup class="selectTitle" label="My Side">'));

            hooker.append($('<optgroup class="ml-2" label="Strength">'));
            watna.append($('<optgroup class="ml-2" label="Strength">'));

            console.log(sArr);
            for (var i = 0; i < sArr.length; i++) {
                hooker.append($('<option/>', {
                    value: sArr[i].info,
                    text: sArr[i].info
                }));

                watna.append($('<option/>', {
                    value: sArr[i].info,
                    text: sArr[i].info
                }));

                if (sArr[i].logic != "") {
                    hooker.append($('<option>').val(sArr[i].logic).text(sArr[i].logic).addClass("logicDiv"));
                    watna.append($('<option>').val(sArr[i].logic).text(sArr[i].logic).addClass("logicDiv"));
                }
            }

            hooker.append($('<optgroup class="ml-2" label="Weakness">'));
            watna.append($('<optgroup class="ml-2" label="Weakness">'));

            for (var i = 0; i < wArr.length; i++) {
                hooker.append($('<option/>', {
                    value: wArr[i].info,
                    text: wArr[i].info
                }));

                watna.append($('<option/>', {
                    value: wArr[i].info,
                    text: wArr[i].info
                }));

                if (wArr[i].logic != "") {
                    hooker.append($('<option>').val(wArr[i].logic).text(wArr[i].logic).addClass("logicDiv"));
                    watna.append($('<option>').val(wArr[i].logic).text(wArr[i].logic).addClass("logicDiv"));
                }
            }

            hooker.append($('<optgroup class="ml-2" label="Opportunity">'));
            watna.append($('<optgroup class="ml-2" label="Opportunity">'));

            for (var i = 0; i < oArr.length; i++) {
                hooker.append($('<option/>', {
                    value: oArr[i].info,
                    text: oArr[i].info
                }));

                watna.append($('<option/>', {
                    value: oArr[i].info,
                    text: oArr[i].info
                }));

                if (oArr[i].logic != "") {
                    hooker.append($('<option>').val(oArr[i].logic).text(oArr[i].logic).addClass("logicDiv"));
                    watna.append($('<option>').val(oArr[i].logic).text(oArr[i].logic).addClass("logicDiv"));
                }
            }

            hooker.append($('<optgroup class="ml-2" label="Thread">'));
            watna.append($('<optgroup class="ml-2" label="Thread">'));

            for (var i = 0; i < tArr.length; i++) {
                hooker.append($('<option/>', {
                    value: tArr[i].info,
                    text: tArr[i].info
                }));

                watna.append($('<option/>', {
                    value: tArr[i].info,
                    text: tArr[i].info
                }));

                if (tArr[i].logic != "") {
                    hooker.append($('<option>').val(tArr[i].logic).text(tArr[i].logic).addClass("logicDiv"));
                    watna.append($('<option>').val(tArr[i].logic).text(tArr[i].logic).addClass("logicDiv"));
                }
            }

            //other side
            var osArr = [];
            var owArr = [];
            var ooArr = [];
            var otArr = [];

            $.each(data.otherSwotS, function (index, itemData) {
                var s = {
                    info: itemData.info,
                    logic: itemData.logic
                }
                osArr.push(s);
            });

            $.each(data.otherSwotW, function (index, itemData) {
                var s = {
                    info: itemData.info,
                    logic: itemData.logic
                }
                owArr.push(s);
            });

            $.each(data.otherSwotO, function (index, itemData) {
                var s = {
                    info: itemData.info,
                    logic: itemData.logic
                }
                ooArr.push(s);
            });

            $.each(data.otherSwotT, function (index, itemData) {
                var s = {
                    info: itemData.info,
                    logic: itemData.logic
                }
                otArr.push(s);
            });

            hooker.append($('<optgroup class="selectTitle" label="Other Side">'));
            watna.append($('<optgroup class="selectTitle" label="Other Side">'));

            hooker.append($('<optgroup class="ml-2" label="Strength">'));
            watna.append($('<optgroup class="ml-2" label="Strength">'));

            for (var i = 0; i < osArr.length; i++) {
                hooker.append($('<option/>', {
                    value: osArr[i].info,
                    text: osArr[i].info
                }));

                watna.append($('<option/>', {
                    value: osArr[i].info,
                    text: osArr[i].info
                }));

                if (osArr[i].logic != "") {
                    hooker.append($('<option>').val(osArr[i].logic).text(osArr[i].logic).addClass("logicDiv"));
                    watna.append($('<option>').val(osArr[i].logic).text(osArr[i].logic).addClass("logicDiv"));
                }
            }

            hooker.append($('<optgroup class="ml-2" label="Weakness">'));
            watna.append($('<optgroup class="ml-2" label="Weakness">'));

            for (var i = 0; i < owArr.length; i++) {
                hooker.append($('<option/>', {
                    value: owArr[i].info,
                    text: owArr[i].info
                }));

                watna.append($('<option/>', {
                    value: owArr[i].info,
                    text: owArr[i].info
                }));

                if (owArr[i].logic != "") {
                    hooker.append($('<option>').val(owArr[i].logic).text(owArr[i].logic).addClass("logicDiv"));
                    watna.append($('<option>').val(owArr[i].logic).text(owArr[i].logic).addClass("logicDiv"));
                }
            }

            hooker.append($('<optgroup class="ml-2" label="Opportunity">'));
            watna.append($('<optgroup class="ml-2" label="Opportunity">'));

            for (var i = 0; i < ooArr.length; i++) {
                hooker.append($('<option/>', {
                    value: ooArr[i].info,
                    text: ooArr[i].info
                }));

                watna.append($('<option/>', {
                    value: ooArr[i].info,
                    text: ooArr[i].info
                }));

                if (ooArr[i].logic != "") {
                    hooker.append($('<option>').val(ooArr[i].logic).text(ooArr[i].logic).addClass("logicDiv"));
                    watna.append($('<option>').val(ooArr[i].logic).text(ooArr[i].logic).addClass("logicDiv"));
                }
            }

            hooker.append($('<optgroup class="ml-2" label="Thread">'));
            watna.append($('<optgroup class="ml-2" label="Thread">'));

            for (var i = 0; i < otArr.length; i++) {
                hooker.append($('<option/>', {
                    value: otArr[i].info,
                    text: otArr[i].info
                }));

                watna.append($('<option/>', {
                    value: otArr[i].info,
                    text: otArr[i].info
                }));

                if (otArr[i].logic != "") {
                    hooker.append($('<option>').val(otArr[i].logic).text(otArr[i].logic).addClass("logicDiv"));
                    watna.append($('<option>').val(otArr[i].logic).text(otArr[i].logic).addClass("logicDiv"));
                }
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