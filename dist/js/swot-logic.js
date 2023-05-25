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

    var userDetails = await user.getUserDetails();
    userRole = userDetails.userLevel;


    loadSWOTList();
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
        saveSWOT('save');
    });

document
    .getElementById("btnBack")
    .addEventListener("click", prevPage);

document
    .getElementById("btnNext")
    .addEventListener("click", nextPage);

async function nextPage() {
    var saveSuccess = await saveSWOT();

    if (isSave == true) {
        if (userRole == "ADMIN") {
            location.href = "admin-result-making.html?projectSn=" + projectNo + "&userSn=" + userNo;
        } else {
            location.href = "result-making.html?projectSn=" + projectNo;
        }
    }
}

function prevPage() {
    if (userRole == "ADMIN") {
        location.href = "swot-analysis.html?projectSn=" + projectNo + "&userSn=" + userNo;
    } else {
        location.href = "swot-analysis.html?projectSn=" + projectNo;
    }
}

function loadSWOTList() {
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

    $.ajax({
        url: ajaxUrl,
        type: "GET",
        data: ajaxData,
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (data) {

            var issueTitle = "";
            var totalIssueContent = "";

            totalIssues = data.length;

            //sort by issueSn
            data.sort(function (a, b) {
                return a.issueSn - b.issueSn;
            });

            issueLists = data;
            console.log(data);
            $.each(data, function (index, itemData) {
                if (index == 0) {
                    issueTitle += `
                        <h4>${itemData.issueKind} > ${itemData.issue}</h4>
                       `;

                    totalIssueContent += `
                        <h5 class="mt-2 mr-3 ml-3 issueId">1 / ${totalIssues}  Issues</h5>
                       `;

                    loadMeSide(itemData);
                    loadOtherSide(itemData);
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

function loadMeSide(item) {
    var s = item.meSwotS;
    var w = item.meSwotW;
    var o = item.meSwotO;
    var t = item.meSwotT;

    $.each(s, function (index, itemData) {
        var i = parseInt(index) + 1;
        var id = "#meSwotS".concat(i);

        if (itemData.info != "") {
            console.log(itemData);
            $(id).html(itemData.info);
            $(id.concat("np")).html(itemData.np);
            $(id.concat("prior")).html(itemData.priority);
            $(id.concat("logic")).text(itemData.logic);
            console.log($(id.concat("logic")).val());
            $(id.concat("logic")).removeClass("hiddenField");
        }
    });

    $.each(w, function (index, itemData) {
        var i = parseInt(index) + 1;
        var id = "#meSwotW".concat(i);
        if (itemData.info != "") {
            $(id).html(itemData.info);
            $(id.concat("np")).html(itemData.np);
            $(id.concat("prior")).html(itemData.priority);
            $(id.concat("logic")).text(itemData.logic);
            $(id.concat("logic")).removeClass("hiddenField");
        }

    });

    $.each(o, function (index, itemData) {
        var i = parseInt(index) + 1;
        var id = "#meSwotO".concat(i);
        if (itemData.info != "") {
            $(id).html(itemData.info);
            $(id.concat("np")).html(itemData.np);
            $(id.concat("prior")).html(itemData.priority);
            $(id.concat("logic")).text(itemData.logic);
            $(id.concat("logic")).removeClass("hiddenField");
        }

    });

    $.each(t, function (index, itemData) {
        var i = parseInt(index) + 1;
        var id = "#meSwotT".concat(i);
        if (itemData.info != "") {
            $(id).html(itemData.info);
            $(id.concat("np")).html(itemData.np);
            $(id.concat("prior")).html(itemData.priority);
            $(id.concat("logic")).text(itemData.logic);
            $(id.concat("logic")).removeClass("hiddenField");
        }

    });

}

function loadOtherSide(item) {
    var s = item.otherSwotS;
    var w = item.otherSwotW;
    var o = item.otherSwotO;
    var t = item.otherSwotT;

    $.each(s, function (index, itemData) {
        var i = parseInt(index) + 1;
        var id = "#otherSwotS".concat(i);
        $(id).html(itemData.info);
        $(id.concat("np")).html(itemData.np);
        $(id.concat("prior")).html(itemData.priority);
        $(id.concat("logic")).text(itemData.logic);
        $(id.concat("logic")).removeClass("hiddenField");
    });

    $.each(w, function (index, itemData) {
        var i = parseInt(index) + 1;
        var id = "#otherSwotW".concat(i);
        $(id).html(itemData.info);
        $(id.concat("np")).html(itemData.np);
        $(id.concat("prior")).html(itemData.priority);
        $(id.concat("logic")).text(itemData.logic);
        $(id.concat("logic")).removeClass("hiddenField");
    });

    $.each(o, function (index, itemData) {
        var i = parseInt(index) + 1;
        var id = "#otherSwotO".concat(i);
        $(id).html(itemData.info);
        $(id.concat("np")).html(itemData.np);
        $(id.concat("prior")).html(itemData.priority);
        $(id.concat("logic")).text(itemData.logic);
        $(id.concat("logic")).removeClass("hiddenField");
    });

    $.each(t, function (index, itemData) {
        var i = parseInt(index) + 1;
        var id = "#otherSwotT".concat(i);
        $(id).html(itemData.info);
        $(id.concat("np")).html(itemData.np);
        $(id.concat("prior")).html(itemData.priority);
        $(id.concat("logic")).text(itemData.logic);
        $(id.concat("logic")).removeClass("hiddenField");
    });

}

async function loadNextResult() {
    //save data before load another issue
    await saveSWOT();

    var getCurrentId = $('.issueId').html();
    let curId = getCurrentId.charAt(0);
    var nextId = parseInt(curId) + 1;
    var issueId;

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

    clearMeSide();
    clearOtherSide();

    $.each(issueLists, function (index, itemData) {

        var issueTitle = "";
        var totalIssueContent = "";

        if (itemData.issueSn == issueId) {
            issueTitle += `
            <h4>${itemData.issueKind} > ${itemData.issue}</h4>
           `;

            totalIssueContent += `
           <h5 class="mt-2 mr-3 ml-3 issueId">${nextId} / ${totalIssues}  Issues</h5>
          `;

            $(".issueTitle").html(issueTitle);
            $(".totalIssue").html(totalIssueContent);

            loadMeSide(itemData);
            loadOtherSide(itemData);
        }
    });
}

async function loadPrevResult() {
    //save data before load another issue
    await saveSWOT();

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

    clearMeSide();
    clearOtherSide();

    $.each(issueLists, function (index, itemData) {

        var issueTitle = "";
        var totalIssueContent = "";

        if (itemData.issueSn == issueId) {
            issueTitle += `
            <h4>${itemData.issueKind} > ${itemData.issue}</h4>
           `;

            totalIssueContent += `
           <h5 class="mt-2 mr-3 ml-3 issueId">${prevId} / ${totalIssues}  Issues</h5>
          `;

            $(".issueTitle").html(issueTitle);
            $(".totalIssue").html(totalIssueContent);

            loadMeSide(itemData);
            loadOtherSide(itemData);
        }
    });
}

function clearMeSide() {
    for (let i = 1; i <= 3; i++) {
        var sid = "#meSwotS".concat(i);
        var wid = "#meSwotW".concat(i);
        var oid = "#meSwotO".concat(i);
        var tid = "#meSwotT".concat(i);

        $(sid).html('');
        $(sid.concat("np")).html('');
        $(sid.concat("prior")).html('');
        $(sid.concat("logic")).val('');
        $(sid.concat("logic")).addClass("hiddenField");

        $(wid).html('');
        $(wid.concat("np")).html('');
        $(wid.concat("prior")).html('');
        $(wid.concat("logic")).val('');
        $(wid.concat("logic")).addClass("hiddenField");

        $(oid).html('');
        $(oid.concat("np")).html('');
        $(oid.concat("prior")).html('');
        $(oid.concat("logic")).val('');
        $(oid.concat("logic")).addClass("hiddenField");

        $(tid).html('');
        $(tid.concat("np")).html('');
        $(tid.concat("prior")).html('');
        $(tid.concat("logic")).val('');
        $(tid.concat("logic")).addClass("hiddenField");
    }
}

function clearOtherSide() {
    for (let i = 1; i <= 3; i++) {
        var sid = "#otherSwotS".concat(i);
        var wid = "#otherSwotW".concat(i);
        var oid = "#otherSwotO".concat(i);
        var tid = "#otherSwotT".concat(i);

        $(sid).html('');
        $(sid.concat("np")).html('');
        $(sid.concat("prior")).html('');
        $(sid.concat("logic")).val('');
        $(sid.concat("logic")).addClass("hiddenField");

        $(wid).html('');
        $(wid.concat("np")).html('');
        $(wid.concat("prior")).html('');
        $(wid.concat("logic")).val('');
        $(wid.concat("logic")).addClass("hiddenField");

        $(oid).html('');
        $(oid.concat("np")).html('');
        $(oid.concat("prior")).html('');
        $(oid.concat("logic")).val('');
        $(oid.concat("logic")).addClass("hiddenField");

        $(tid).html('');
        $(tid.concat("np")).html('');
        $(tid.concat("prior")).html('');
        $(tid.concat("logic")).val('');
        $(tid.concat("logic")).addClass("hiddenField");
    }
}

async function saveSWOT(btnId) {
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
            text: 'Failed to save swot data.'
        });
        return;
    }

    $("#loadingView").show();

    var meSwotSList = [];
    var meSwotWList = [];
    var meSwotOList = [];
    var meSwotTList = [];

    for (let i = 1; i <= 3; i++) {
        var sid = "#meSwotS".concat(i);
        var wid = "#meSwotW".concat(i);
        var oid = "#meSwotO".concat(i);
        var tid = "#meSwotT".concat(i);
        //console.log($(sid).html());
        if ($(sid).html().length > 0) {
            var newS = {
                np: $(sid.concat("np")).html(),
                priority: $(sid.concat("prior")).html(),
                info: $(sid).html(),
                logic: $(sid.concat("logic")).val()
            }
            meSwotSList.push(newS);
        }

        if ($(wid).html().length > 0) {
            var newW = {
                np: $(wid.concat("np")).html(),
                priority: $(wid.concat("prior")).html(),
                info: $(wid).html(),
                logic: $(wid.concat("logic")).val()
            }
            meSwotWList.push(newW);
        }

        if ($(oid).html().length > 0) {
            var newO = {
                np: $(oid.concat("np")).html(),
                priority: $(oid.concat("prior")).html(),
                info: $(oid).html(),
                logic: $(oid.concat("logic")).val()
            }
            meSwotOList.push(newO);
        }

        if ($(tid).html().length > 0) {
            var newT = {
                np: $(tid.concat("np")).html(),
                priority: $(tid.concat("prior")).html(),
                info: $(tid).html(),
                logic: $(tid.concat("logic")).val()
            }
            meSwotTList.push(newT);
        }
    }

    var otherSwotSList = [];
    var otherSwotWList = [];
    var otherSwotOList = [];
    var otherSwotTList = [];

    for (let i = 1; i <= 3; i++) {
        var sid = "#otherSwotS".concat(i);
        var wid = "#otherSwotW".concat(i);
        var oid = "#otherSwotO".concat(i);
        var tid = "#otherSwotT".concat(i);

        if ($(sid).html().length > 0) {
            var newS = {
                np: $(sid.concat("np")).html(),
                priority: $(sid.concat("prior")).html(),
                info: $(sid).html(),
                logic: $(sid.concat("logic")).val()
            }
            otherSwotSList.push(newS);
        }

        if ($(wid).html().length > 0) {
            var newW = {
                np: $(wid.concat("np")).html(),
                priority: $(wid.concat("prior")).html(),
                info: $(wid).html(),
                logic: $(wid.concat("logic")).val()
            }
            otherSwotWList.push(newW);
        }

        if ($(oid).html().length > 0) {
            var newO = {
                np: $(oid.concat("np")).html(),
                priority: $(oid.concat("prior")).html(),
                info: $(oid).html(),
                logic: $(oid.concat("logic")).val()
            }
            otherSwotOList.push(newO);
        }

        if ($(tid).html().length > 0) {
            var newT = {
                np: $(tid.concat("np")).html(),
                priority: $(tid.concat("prior")).html(),
                info: $(tid).html(),
                logic: $(tid.concat("logic")).val()
            }
            otherSwotTList.push(newT);
        }
    }

    let reqObj = {
        issueSn: issueId,
        meSwotS: meSwotSList,
        meSwotW: meSwotWList,
        meSwotO: meSwotOList,
        meSwotT: meSwotTList,
        otherSwotS: otherSwotSList,
        otherSwotW: otherSwotWList,
        otherSwotO: otherSwotOList,
        otherSwotT: otherSwotTList
    }
    console.log(reqObj);
    //return;
    var ajaxUrl;

    if (userRole == "ADMIN") {
        ajaxUrl = "https://api.negosys.co.kr/a/issueSwot?userSn=" + userNo;
    } else {
        ajaxUrl = "https://api.negosys.co.kr/nego/issueSwot"
    }

    isSave == false;

    await $.ajax({
        url: ajaxUrl,
        type: "PUT",
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        data: JSON.stringify(reqObj),
        contentType: "application/json",
        success: function (data) {
            var x = JSON.stringify(data);
            //console.log(x);

            //refreshSWOTList();

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
                text: 'Failed to update issue SWOT data.'
            });
            $("#loadingView").hide();
            return false;
        }
    });

}