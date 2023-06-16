import * as user from "./adminlte.js"

var userRole;
var userNo = 0;

var projectNo = "";
var currentIssue = "";
var totalIssues = "";
var issueLists;
var issueSnList = [];
var isSave = false;

var mysideStrengthP = "Develop Strategic Actions or write Argumentations to emphasize and magnify My positive strengths making TOS perceive My strengths as my crucial powers that TOS cannot deal with, so that TOS should accommodate Mt demand and/or proposal.";
var mysideStrengthN = "Develop Strategic Actions or write Argumentations to dilute My negative weaknesses and, even, to transform My negative weaknesses into My situational strengths or powers so that TOS abandon to pressure or threaten me with my weakness.";
var mysideWeaknessP = "Develop Strategic Actions or write Argumentations to emphasize and magnify MY positive weaknesses, transforming the weaknesses into the fatal and lethal weaknesses and/or threat of TOS so that TOS should accommodate My demand and/or proposal.";
var mysideWeaknessN = "Develop Strategic Actions or write Argumentations to dilute and mitigate My negative weakness. Or, transform My negative weakness into TOS's situational and fatal weaknesses so that TOS should accommodate My demand and/or proposal.";
var mysideOpportunityP = "Develop Strategic Actions or write Argumentations to emphasize and magnify My positive opportunity (Alternative or BATNA), and, even transform My BATNA into TOS's fatal threat and fear so that TOS should accommodate My proposal and demand to avoid the likely disastrous situations if I take My BATNA.";
var mysideOpportunityN = "Develop Strategic Actions or write Argumentations to dilute and mitigate My negative opportunity. Or, transform My negative opportunity into TOS's situational and fatal weaknesses or threat so that TOS should accommodate My demand and/or proposal.";
var mysideThreatP = "Develop Strategic Actions or write Argumentations to emphasize and magnify MY positive threats to pressure TOS to accommodate My demand and/or proposal to avoid the likely disaster caused by My positive threat if realized.";
var mysideThreatN = "Develop Strategic Actions or write Argumentations to dilute My negative threats for assuring TOS to collaborate as best choice.";

var othersideStrengthP = "Develop Strategic Actions or write Argumentations to emphasize and magnify TOS's positive strengths for synergic collaborating.";
var othersideStrengthN = "Develop Strategic Actions or write Argumentations to dilute TOS's negative strengths and, even, to transform TOS's negative strengths into TOS's situational and fatal weaknesses so that TOS should accommodate My demand and/or proposal.";
var othersideWeaknessP = "Develop Strategic Actions or write Argumentations to emphasize and magnify TOS's positive weaknesses, transforming the weaknesses into the fatal and lethal weaknesses of TOS so that TOS should accommodate My demand and/or proposal.";
var othersideWeaknessN = "Develop Strategic Actions or write Argumentations to transform TOS's negative weakness into TOS's situational and fatal weaknesses so that TOS should accommodate My demand and/or proposal.";
var othersideOpportunityP = "Develop Strategic Actions or write Argumentations to emphasize and magnify TOS's positive opportunities for synergic collaborating.";
var othersideOpportunityN = "Develop Strategic Actions or write Argumentations to transform TOS's negative opportunity (Alternative or BATNA) into WATNA to make TOS abandon the negative BATNA that is harmful and/or fatal to me.";
var othersideThreatP = "Develop Strategic Actions or write Argumentations to emphasize and magnify TOS's positive threats transforming TOS's threat into fatal and lethal disaster so that TOS should accommodate My demand and/or proposal to avoid the likely disaster.";
var othersideThreatN = "Develop Strategic Actions or write Argumentations to dilute TOS's negative threats for assuring TOS to synergically collaborate.";

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

            initialCardSize();

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
            $(id.concat("logic")).val(itemData.logic);
            console.log($(id.concat("logic")).val());
            $(id.concat("logic")).removeClass("hiddenField");
            if (itemData.np == "P") {
                $(id.concat("logic")).attr("placeholder", mysideStrengthP);
            } else {
                $(id.concat("logic")).attr("placeholder", mysideStrengthN);
            }
        }
    });

    $.each(w, function (index, itemData) {
        var i = parseInt(index) + 1;
        var id = "#meSwotW".concat(i);
        if (itemData.info != "") {
            $(id).html(itemData.info);
            $(id.concat("np")).html(itemData.np);
            $(id.concat("prior")).html(itemData.priority);
            $(id.concat("logic")).val(itemData.logic);
            $(id.concat("logic")).removeClass("hiddenField");
            if (itemData.np == "P") {
                $(id.concat("logic")).attr("placeholder", mysideWeaknessP);
            } else {
                $(id.concat("logic")).attr("placeholder", mysideWeaknessN);
            }
        }

    });

    $.each(o, function (index, itemData) {
        var i = parseInt(index) + 1;
        var id = "#meSwotO".concat(i);
        if (itemData.info != "") {
            $(id).html(itemData.info);
            $(id.concat("np")).html(itemData.np);
            $(id.concat("prior")).html(itemData.priority);
            $(id.concat("logic")).val(itemData.logic);
            $(id.concat("logic")).removeClass("hiddenField");
            if (itemData.np == "P") {
                $(id.concat("logic")).attr("placeholder", mysideOpportunityP);
            } else {
                $(id.concat("logic")).attr("placeholder", mysideOpportunityN);
            }
        }

    });

    $.each(t, function (index, itemData) {
        var i = parseInt(index) + 1;
        var id = "#meSwotT".concat(i);
        if (itemData.info != "") {
            $(id).html(itemData.info);
            $(id.concat("np")).html(itemData.np);
            $(id.concat("prior")).html(itemData.priority);
            $(id.concat("logic")).val(itemData.logic);
            $(id.concat("logic")).removeClass("hiddenField");
            if (itemData.np == "P") {
                $(id.concat("logic")).attr("placeholder", mysideThreatP);
            } else {
                $(id.concat("logic")).attr("placeholder", mysideThreatN);
            }
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
        $(id.concat("logic")).val(itemData.logic);
        $(id.concat("logic")).removeClass("hiddenField");
        if (itemData.np == "P") {
            $(id.concat("logic")).attr("placeholder", othersideStrengthP);
        } else {
            $(id.concat("logic")).attr("placeholder", othersideStrengthN);
        }
    });

    $.each(w, function (index, itemData) {
        var i = parseInt(index) + 1;
        var id = "#otherSwotW".concat(i);
        $(id).html(itemData.info);
        $(id.concat("np")).html(itemData.np);
        $(id.concat("prior")).html(itemData.priority);
        $(id.concat("logic")).val(itemData.logic);
        $(id.concat("logic")).removeClass("hiddenField");
        if (itemData.np == "P") {
            $(id.concat("logic")).attr("placeholder", othersideWeaknessP);
        } else {
            $(id.concat("logic")).attr("placeholder", othersideWeaknessN);
        }
    });

    $.each(o, function (index, itemData) {
        var i = parseInt(index) + 1;
        var id = "#otherSwotO".concat(i);
        $(id).html(itemData.info);
        $(id.concat("np")).html(itemData.np);
        $(id.concat("prior")).html(itemData.priority);
        $(id.concat("logic")).val(itemData.logic);
        $(id.concat("logic")).removeClass("hiddenField");
        if (itemData.np == "P") {
            $(id.concat("logic")).attr("placeholder", othersideOpportunityP);
        } else {
            $(id.concat("logic")).attr("placeholder", othersideOpportunityN);
        }
    });

    $.each(t, function (index, itemData) {
        var i = parseInt(index) + 1;
        var id = "#otherSwotT".concat(i);
        $(id).html(itemData.info);
        $(id.concat("np")).html(itemData.np);
        $(id.concat("prior")).html(itemData.priority);
        $(id.concat("logic")).val(itemData.logic);
        $(id.concat("logic")).removeClass("hiddenField");
        if (itemData.np == "P") {
            $(id.concat("logic")).attr("placeholder", othersideThreatP);
        } else {
            $(id.concat("logic")).attr("placeholder", othersideThreatN);
        }
    });

}

async function loadNextResult() {
    var btnP = document.getElementById("btnPrevIssue");
    var btnN = document.getElementById("btnNextIssue");

    btnN.classList.add("disabled");
    btnN.classList.add("iconDisableThemeColor");

    //save data before load another issue
    $("#loadingView").show();
    await saveSWOT();

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
    console.log(issueId);

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
    initialCardSize();
    $("#loadingView").hide();
}

async function loadPrevResult() {
    var btnP = document.getElementById("btnPrevIssue");
    var btnN = document.getElementById("btnNextIssue");

    btnP.classList.add("disabled");
    btnP.classList.add("iconDisableThemeColor");

    //save data before load another issue
    $("#loadingView").show();
    await saveSWOT();

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
        btnP.classList.remove("iconDisableThemeColor");
        btnN.classList.remove("disabled");
        btnN.classList.remove("iconDisableThemeColor");
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
    console.log(issueId);

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
    initialCardSize();
    $("#loadingView").hide();

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
    isSave = false;

    removeEmptyClass();
    if (checkEmpty()) return;

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
        console.log($(sid).html());
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

            refreshSWOTList();

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
            var returnStatus = error.status;
            if (returnStatus == "401") {
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
            } else {
                Swal.fire({
                    icon: 'error',
                    text: 'Failed to update issue SWOT data.'
                });
            }
            $("#loadingView").hide();
            return false;
        }
    });

}

function refreshSWOTList() {
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
            $("#loadingView").show();

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

function checkEmpty() {
    var isEmpty = false;

    for (let i = 1; i <= 3; i++) {

        //me
        var sid = "#meSwotS".concat(i);
        var wid = "#meSwotW".concat(i);
        var oid = "#meSwotO".concat(i);
        var tid = "#meSwotT".concat(i);


        if ($(sid).html().length > 0) {
            if ($(sid.concat("logic")).val().length == 0) {
                $(sid.concat("logic")).addClass("warningField");
                isEmpty = true;
            }
        }

        if ($(wid).html().length > 0) {
            if ($(wid.concat("logic")).val().length == 0) {
                $(wid.concat("logic")).addClass("warningField");
                isEmpty = true;
            }
        }

        if ($(oid).html().length > 0) {
            if ($(oid.concat("logic")).val().length == 0) {
                $(oid.concat("logic")).addClass("warningField");
                isEmpty = true;
            }
        }

        if ($(tid).html().length > 0) {
            if ($(tid.concat("logic")).val().length == 0) {
                $(tid.concat("logic")).addClass("warningField");
                isEmpty = true;
            }
        }


        //other
        sid = "#otherSwotS".concat(i);
        wid = "#otherSwotW".concat(i);
        oid = "#otherSwotO".concat(i);
        tid = "#otherSwotT".concat(i);

        if ($(sid).html().length > 0) {
            if ($(sid.concat("logic")).val().length == 0) {
                $(sid.concat("logic")).addClass("warningField");
                isEmpty = true;
            }
        }

        if ($(wid).html().length > 0) {
            if ($(wid.concat("logic")).val().length == 0) {
                $(wid.concat("logic")).addClass("warningField");
                isEmpty = true;
            }
        }

        if ($(oid).html().length > 0) {
            if ($(oid.concat("logic")).val().length == 0) {
                $(oid.concat("logic")).addClass("warningField");
                isEmpty = true;
            }
        }

        if ($(tid).html().length > 0) {
            if ($(tid.concat("logic")).val().length == 0) {
                $(tid.concat("logic")).addClass("warningField");
                isEmpty = true;
            }
        }

    }

    if (isEmpty) {
        Swal.fire({
            icon: 'warning',
            text: 'Not allow empty.'
        });
        return true;
    }
    return false;
}

function removeEmptyClass() {
    for (let i = 1; i <= 3; i++) {

        //me
        var sid = "#meSwotS".concat(i);
        var wid = "#meSwotW".concat(i);
        var oid = "#meSwotO".concat(i);
        var tid = "#meSwotT".concat(i);

        $(sid.concat("logic")).removeClass("warningField");
        $(wid.concat("logic")).removeClass("warningField");
        $(oid.concat("logic")).removeClass("warningField");
        $(tid.concat("logic")).removeClass("warningField");


        //other
        sid = "#otherSwotS".concat(i);
        wid = "#otherSwotW".concat(i);
        oid = "#otherSwotO".concat(i);
        tid = "#otherSwotT".concat(i);

        $(sid.concat("logic")).removeClass("warningField");
        $(wid.concat("logic")).removeClass("warningField");
        $(oid.concat("logic")).removeClass("warningField");
        $(tid.concat("logic")).removeClass("warningField");
    }
}

function initialCardSize() {
    var meid = ".card-meS";
    var otherid = ".card-otherS";

    var meHeight = $(meid).height();
    var otherHeight = $(otherid).height();

    if (meHeight > otherHeight) {
        $(otherid).height(meHeight);
    } else if (otherHeight > meHeight) {
        $(meid).height(otherHeight);
    }

    meid = ".card-meW";
    otherid = ".card-otherW";

    meHeight = $(meid).height();
    otherHeight = $(otherid).height();

    if (meHeight > otherHeight) {
        $(otherid).height(meHeight);
    } else if (otherHeight > meHeight) {
        $(meid).height(otherHeight);
    }

    meid = ".card-meO";
    otherid = ".card-otherO";

    meHeight = $(meid).height();
    otherHeight = $(otherid).height();

    if (meHeight > otherHeight) {
        $(otherid).height(meHeight);
    } else if (otherHeight > meHeight) {
        $(meid).height(otherHeight);
    }

    meid = ".card-meT";
    otherid = ".card-otherT";

    meHeight = $(meid).height();
    otherHeight = $(otherid).height();

    if (meHeight > otherHeight) {
        $(otherid).height(meHeight);
    } else if (otherHeight > meHeight) {
        $(meid).height(otherHeight);
    }
}