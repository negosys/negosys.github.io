import * as user from "./adminlte.js"

var userRole;

var projectNo = "";
var currentIssue = "";
var totalIssues = "";
var issueLists;
var issueSnList = [];

$(document).ready(async function () {
    var userDetails = await user.getUserDetails();
    userRole = userDetails.userLevel;

    var ck = getCookies("userRole");
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

    if (projectNo == null || projectNo == "") {
        Swal.fire({
            icon: 'error',
            text: 'Invalid Url.'
        });
        return;
    }

    loadResultMakingList();

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
    .getElementById("btnPrevIssue")
    .addEventListener("click", loadPrevResult);

document
    .getElementById("btnNextIssue")
    .addEventListener("click", loadNextResult);

document
    .getElementById("btnBack")
    .addEventListener("click", prevPage);

function prevPage() {
    location.href = "swot-logic.html?projectSn=" + projectNo;
}

function loadResultMakingList() {
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

                        hookerContent += `<p>${hookerList[i]}</p>`;
                    }

                    var watnaList = itemData.watna;

                    for (var i = 0; i < watnaList.length; i++) {
                        // Trim the excess whitespace.
                        watnaList[i] = watnaList[i].replace(/^\s*/, "").replace(/\s*$/, "");

                        watnaContent += `<p>${watnaList[i]}</p>`;
                    }

                    //hookerContent += `
                    //<p>${itemData.hooker}</p>
                    //`;

                    //watnaContent += `
                    //<p>${itemData.watna}</p>
                    //`;
                }

                var issueSnMatch = {
                    id: index + 1,
                    snId: itemData.issueSn
                }

                issueSnList.push(issueSnMatch);
            });

            console.log(issueSnList);
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

function loadNextResult() {
    var getCurrentId = $('.issueId').html();
    let curId = getCurrentId.charAt(0);
    var nextId = parseInt(curId) + 1;
    var issueId;

    console.log(totalIssues);

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

            //hookerContent += `
            //<p>${itemData.hooker}</p>
            //`;

            //watnaContent += `
            //<p>${itemData.watna}</p>
            //`;

            $(".issueTitle").html(issueTitle);
            $(".totalIssue").html(totalIssueContent);
            $(".hookerContainer").html(hookerContent);
            $(".watnaContainer").html(watnaContent);
        }
    });
    $("#loadingView").hide();
}

function loadPrevResult() {
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

            //hookerContent += `
            //<p>${itemData.hooker}</p>
            //`;

            //watnaContent += `
            //<p>${itemData.watna}</p>
            //`;

            $(".issueTitle").html(issueTitle);
            $(".totalIssue").html(totalIssueContent);
            $(".hookerContainer").html(hookerContent);
            $(".watnaContainer").html(watnaContent);
        }
    });
    $("#loadingView").hide();
}
