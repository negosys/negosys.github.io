var projectNo = "";
var currentIssue = "";
var totalIssues = "";
var issueLists;
var issueSnList = [];

$(document).ready(function () {
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    projectNo = urlParams.get('projectSn');

    if (projectNo == null || projectNo == "") {
        Swal.fire({
            icon: 'error',
            text: 'Invalid Url.'
        });
        return;
    }

    initialDropdownBox();
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

function nextPage() {
    if (saveSWOT() == true) {
        location.href = "swot-logic.html?projectSn=" + projectNo;
    }
}

function prevPage() {
    location.href = "prior-issues.html?projectSn=" + projectNo;
}

function loadSWOTList() {
    $("#loadingView").show();

    $.ajax({
        url:
            'https://api.negosys.co.kr/nego/issuesByProjectSn',
        type: "GET",
        data: { projectSn: projectNo },
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (data) {
            $("#loadingView").show();
            var issueTitle = "";
            var totalIssueContent = "";

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
                }

                var issueSnMatch = {
                    id: index + 1,
                    snId: itemData.issueSn
                }

                issueSnList.push(issueSnMatch);

                loadMeSide(itemData);
                loadOtherSide(itemData);
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
        $(id).val(itemData.info);
        $(id.concat("np")).val(itemData.np);
        $(id.concat("prior")).val(itemData.priority);
    });

    $.each(w, function (index, itemData) {
        var i = parseInt(index) + 1;
        var id = "#meSwotW".concat(i);
        $(id).val(itemData.info);
        $(id.concat("np")).val(itemData.np);
        $(id.concat("prior")).val(itemData.priority);
    });

    $.each(o, function (index, itemData) {
        var i = parseInt(index) + 1;
        var id = "#meSwotO".concat(i);
        $(id).val(itemData.info);
        $(id.concat("np")).val(itemData.np);
        $(id.concat("prior")).val(itemData.priority);
    });

    $.each(t, function (index, itemData) {
        var i = parseInt(index) + 1;
        var id = "#meSwotT".concat(i);
        $(id).val(itemData.info);
        $(id.concat("np")).val(itemData.np);
        $(id.concat("prior")).val(itemData.priority);
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
        $(id).val(itemData.info);
        $(id.concat("np")).val(itemData.np);
        $(id.concat("prior")).val(itemData.priority);
    });

    $.each(w, function (index, itemData) {
        var i = parseInt(index) + 1;
        var id = "#otherSwotW".concat(i);
        $(id).val(itemData.info);
        $(id.concat("np")).val(itemData.np);
        $(id.concat("prior")).val(itemData.priority);
    });

    $.each(o, function (index, itemData) {
        var i = parseInt(index) + 1;
        var id = "#otherSwotO".concat(i);
        $(id).val(itemData.info);
        $(id.concat("np")).val(itemData.np);
        $(id.concat("prior")).val(itemData.priority);
    });

    $.each(t, function (index, itemData) {
        var i = parseInt(index) + 1;
        var id = "#otherSwotT".concat(i);
        $(id).val(itemData.info);
        $(id.concat("np")).val(itemData.np);
        $(id.concat("prior")).val(itemData.priority);
    });

}

function loadNextResult() {
    //save data before load another issue
    saveSWOT();

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

function loadPrevResult() {
    //save data before load another issue
    saveSWOT();

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

        $(sid).val('');
        $(sid.concat("np")).prop("selectedIndex", -1);
        $(sid.concat("prior")).prop("selectedIndex", -1);
        //$(sid.concat("np")).val($(sid.concat("np")).data("P"));
        //$(sid.concat("prior")).val($(sid.concat("prior")).data("1"));

        $(wid).val('');
        $(wid.concat("np")).prop("selectedIndex", -1);
        $(wid.concat("prior")).prop("selectedIndex", -1);
        //$(wid.concat("np")).val($(wid.concat("np")).data("P"));
        //$(wid.concat("prior")).val($(wid.concat("prior")).data("1"));

        $(oid).val('');
        $(oid.concat("np")).prop("selectedIndex", -1);
        $(oid.concat("prior")).prop("selectedIndex", -1);
        //$(oid.concat("np")).val($(oid.concat("np")).data("P"));
        //$(oid.concat("prior")).val($(oid.concat("prior")).data("1"));

        $(tid).val('');
        $(tid.concat("np")).prop("selectedIndex", -1);
        $(tid.concat("prior")).prop("selectedIndex", -1);
        //$(tid.concat("np")).val($(tid.concat("np")).data("P"));
        //$(tid.concat("prior")).val($(tid.concat("prior")).data("1"));
    }
}

function clearOtherSide() {
    for (let i = 1; i <= 3; i++) {
        var sid = "#otherSwotS".concat(i);
        var wid = "#otherSwotW".concat(i);
        var oid = "#otherSwotO".concat(i);
        var tid = "#otherSwotT".concat(i);

        $(sid).val('');
        $(sid.concat("np")).prop("selectedIndex", -1);
        $(sid.concat("prior")).prop("selectedIndex", -1);

        $(wid).val('');
        $(wid.concat("np")).prop("selectedIndex", -1);
        $(wid.concat("prior")).prop("selectedIndex", -1);

        $(oid).val('');
        $(oid.concat("np")).prop("selectedIndex", -1);
        $(oid.concat("prior")).prop("selectedIndex", -1);

        $(tid).val('');
        $(tid.concat("np")).prop("selectedIndex", -1);
        $(tid.concat("prior")).prop("selectedIndex", -1);
    }
}

function initialDropdownBox() {
    //ME SIDE
    for (let i = 1; i <= 3; i++) {
        var sid = "#meSwotS".concat(i);
        var wid = "#meSwotW".concat(i);
        var oid = "#meSwotO".concat(i);
        var tid = "#meSwotT".concat(i);

        $(sid.concat("np")).prop("selectedIndex", -1);
        $(sid.concat("prior")).prop("selectedIndex", -1);

        $(wid.concat("np")).prop("selectedIndex", -1);
        $(wid.concat("prior")).prop("selectedIndex", -1);

        $(oid.concat("np")).prop("selectedIndex", -1);
        $(oid.concat("prior")).prop("selectedIndex", -1);

        $(tid.concat("np")).prop("selectedIndex", -1);
        $(tid.concat("prior")).prop("selectedIndex", -1);
    }

    //OTHER SIDE
    for (let i = 1; i <= 3; i++) {
        var sid = "#otherSwotS".concat(i);
        var wid = "#otherSwotW".concat(i);
        var oid = "#otherSwotO".concat(i);
        var tid = "#otherSwotT".concat(i);

        $(sid.concat("np")).prop("selectedIndex", -1);
        $(sid.concat("prior")).prop("selectedIndex", -1);

        $(wid.concat("np")).prop("selectedIndex", -1);
        $(wid.concat("prior")).prop("selectedIndex", -1);

        $(oid.concat("np")).prop("selectedIndex", -1);
        $(oid.concat("prior")).prop("selectedIndex", -1);

        $(tid.concat("np")).prop("selectedIndex", -1);
        $(tid.concat("prior")).prop("selectedIndex", -1);
    }
}

function saveSWOT(btnId) {
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

    var meSwotSList = [];
    var meSwotWList = [];
    var meSwotOList = [];
    var meSwotTList = [];

    for (let i = 1; i <= 3; i++) {
        var sid = "#meSwotS".concat(i);
        var wid = "#meSwotW".concat(i);
        var oid = "#meSwotO".concat(i);
        var tid = "#meSwotT".concat(i);

        if ($(sid).val().length > 0) {
            var newS = {
                np: $(sid.concat("np")).val(),
                priority: $(sid.concat("prior")).val(),
                info: $(sid).val()
            }
            meSwotSList.push(newS);
        }

        if ($(wid).val().length > 0) {
            var newW = {
                np: $(wid.concat("np")).val(),
                priority: $(wid.concat("prior")).val(),
                info: $(wid).val()
            }
            meSwotWList.push(newW);
        }

        if ($(oid).val().length > 0) {
            var newO = {
                np: $(oid.concat("np")).val(),
                priority: $(oid.concat("prior")).val(),
                info: $(oid).val()
            }
            meSwotOList.push(newO);
        }

        if ($(tid).val().length > 0) {
            var newT = {
                np: $(tid.concat("np")).val(),
                priority: $(tid.concat("prior")).val(),
                info: $(tid).val()
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

        if ($(sid).val().length > 0) {
            var newS = {
                np: $(sid.concat("np")).val(),
                priority: $(sid.concat("prior")).val(),
                info: $(sid).val()
            }
            otherSwotSList.push(newS);
        }

        if ($(wid).val().length > 0) {
            var newW = {
                np: $(wid.concat("np")).val(),
                priority: $(wid.concat("prior")).val(),
                info: $(wid).val()
            }
            otherSwotWList.push(newW);
        }

        if ($(oid).val().length > 0) {
            var newO = {
                np: $(oid.concat("np")).val(),
                priority: $(oid.concat("prior")).val(),
                info: $(oid).val()
            }
            otherSwotOList.push(newO);
        }

        if ($(tid).val().length > 0) {
            var newT = {
                np: $(tid.concat("np")).val(),
                priority: $(tid.concat("prior")).val(),
                info: $(tid).val()
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
    //console.log(reqObj);

    $.ajax({
        url:
            'https://api.negosys.co.kr/nego/issueSwot',
        type: "PUT",
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        data: JSON.stringify(reqObj),
        contentType: "application/json",
        success: function (data) {
            var x = JSON.stringify(data);
            console.log(x);

            refreshSWOTList();

            if (btnId == "save") {
                Swal.fire({
                    icon: 'info',
                    text: 'Data has been saved successfully.'
                });
            }
            return true;
        },
        error: function (error) {
            console.log(JSON.stringify(error));
            Swal.fire({
                icon: 'error',
                text: 'Failed to update issue SWOT data.'
            });
            return false;
        }
    });

}

function refreshSWOTList() {
    $("#loadingView").show();

    $.ajax({
        url:
            'https://api.negosys.co.kr/nego/issuesByProjectSn',
        type: "GET",
        data: { projectSn: projectNo },
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