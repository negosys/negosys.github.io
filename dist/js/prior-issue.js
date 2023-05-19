const draggables = document.querySelectorAll('.draggable');
const containers = document.querySelectorAll('.othersideContainer');
var projectNo = "";
var totalIssues = "";
var issueLists;

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

    loadProjectIssueList();
});

draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', () => {
        draggable.classList.add('dragging')
    })

    draggable.addEventListener('dragend', () => {
        draggable.classList.remove('dragging')
    })
})

containers.forEach(container => {
    container.addEventListener('dragover', e => {
        e.preventDefault()
        const afterElement = getDragAfterElement(container, e.clientY)
        const draggable = document.querySelector('.dragging')
        if (afterElement == null) {
            container.appendChild(draggable)
        } else {
            container.insertBefore(draggable, afterElement)
        }
    })
})

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')]

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect()
        const offset = y - box.top - box.height / 2
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child }
        } else {
            return closest
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element
}

document
    .getElementById("btnSave")
    .addEventListener("click", function () {
        saveIssue('save');
    });

document
    .getElementById("btnBack")
    .addEventListener("click", prevPage);

document
    .getElementById("btnNext")
    .addEventListener("click", nextPage);

function nextPage() {
    if (saveIssue() == true) {
        location.href = "swot-analysis.html?projectSn=" + projectNo;
    }
}

function prevPage() {
    location.href = "issues.html?projectSn=" + projectNo;
}

function saveIssue(btnId) {

    var isCheck = checkPriority();
    if (isCheck == false) {
        return false;
    }

    var updateIssueList = [];

    $.each(issueLists, function (index, itemData) {
        var iSn = itemData.issueSn;

        //=====me side=====
        var idMePrior = '.mePrior-'.concat(iSn);
        var idReasonMe = '.meReason-'.concat(iSn);
        var txtMePrior = $(idMePrior).val();

        //=====other side=====
        var idOtherPrior = '.otherPrior-'.concat(iSn);
        var idReasonOther = '.otherReason-'.concat(iSn);
        var txtOtherPrior = $(idOtherPrior).val();

        var newIssue = {
            issueSn: itemData.issueSn,
            meReason: $(idReasonMe).val(),
            otherReason: $(idReasonOther).val(),
            meOrder: parseInt(txtMePrior),
            otherOrder: parseInt(txtOtherPrior)
        };

        updateIssueList.push(newIssue);

        //console.log(updateIssueList);
    });


    let reqObj = {
        projectSn: projectNo,
        issues: updateIssueList
    }

    console.log(reqObj);

    //return;

    $.ajax({
        url:
            'https://api.negosys.co.kr/nego/updateIssuesPriorityAndReason',
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
                text: 'Failed to update issue priority and reason'
            });
            return false;
        }
    });
}

function loadProjectIssueList() {
    $("#loadingView").show();
    var html = "";
    var otherhtml = "";
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
            issueLists = data;
            totalIssues = data.length;

            data.sort(function (a, b) {
                return a.meOrder - b.meOrder;
            });

            console.log(data);

            //for me side sort
            $.each(data, function (index, itemData) {
                var meOrder = itemData.meOrder;
                var otherOrder = itemData.otherOrder;

                if (meOrder == null) {
                    //meOrder = index + 1;
                    meOrder = 1;
                }

                //console.log(itemData);
                //html +=
                //'<div class="row"><div class="col-md-2"><div class="small-box prior"><div class="inner text-center">';
                //html += `<p>${index + 1}</p></div></div></div>`;
                //html += `<input type="text" class=" no-border mePrior-${itemData.issueSn}" value="${meOrder}"></div></div></div>`;
                html +=
                    '<div class="row"><div class="col-md-12"><div class="small-box"><div class="inner"><div class="row"><div class="col-10">';
                html += `<p class="ml-2 meIssue-${itemData.issueSn}">${itemData.issueKind} > ${itemData.issue}</p>
                </div><div class="col-2">
                <input id="meId${index + 1}" type="number" min="1" max="${totalIssues}" class="form-control allow_numeric mePrior-${itemData.issueSn}" value="${meOrder}" onchange="checkMaxValue(this)"></div></div>
                <textarea class="form-control meReason-${itemData.issueSn}" placeholder="Enter reason" maxlength="256">${itemData.meReason}</textarea></div></div></div></div>`;

            });


            //for other side sort
            data.sort(function (a, b) {
                return a.otherOrder - b.otherOrder;
            });


            $.each(data, function (index, itemData) {
                var otherOrder = itemData.otherOrder;

                if (otherOrder == null) {
                    //otherOrder = index + 1;
                    otherOrder = 1;
                }

                otherhtml +=
                    '<div class="row"><div class="col-md-12"><div class="small-box"><div class="inner"><div class="row"><div class="col-10">';
                otherhtml += `<p class="ml-2 otherIssue-${itemData.issueSn}">${itemData.issueKind} > ${itemData.issue}</p>
                </div><div class="col-2">
                <input id="otherId${index + 1}" type="number" min="1" max="${totalIssues}" class="form-control allow_numeric otherPrior-${itemData.issueSn}" value="${otherOrder}" onchange="checkMaxValue(this)"></div></div>
                <textarea class="form-control otherReason-${itemData.issueSn}" placeholder="Enter reason" maxlength="256">${itemData.otherReason}</textarea></div></div></div></div>`;

            });

            $(".mysideContainer").html(html);
            $(".othersideContainer").html(otherhtml);
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

function checkMaxValue(x) {
    if (x.value > totalIssues) {
        x.value = totalIssues;
        Swal.fire({
            icon: 'warning',
            text: 'Maximum priority cannot more than ' + totalIssues
        });
    } else if (x.value <= 0) {
        x.value = 1;
        Swal.fire({
            icon: 'warning',
            text: 'Minimum priority cannot less than 0'
        });
    }
}

$(".allow_numeric").on("input", function (evt) {
    var self = $(this);
    console.log(self.val());
    self.val(self.val().replace(/\D/g, ""));
    if ((evt.which < 48 || evt.which > 57)) {
        evt.preventDefault();
    }
});

function checkPriority() {
    var isPass = false;
    var meIdValueList = [];
    var otherIdValueList = [];

    for (let i = 1; i <= totalIssues; i++) {
        var meIdOrder = "#meId".concat(i);
        var otherIdOrder = "#otherId".concat(i);

        meIdValueList.push($(meIdOrder).val());
        otherIdValueList.push($(otherIdOrder).val());
    }

    //console.log(meIdValueList);
    //check zero variable
    var checkMeZero = meIdValueList.filter(f => f == 0 || f == null);
    //console.log(checkMeZero);
    if (checkMeZero.length > 0) {
        Swal.fire({
            icon: 'warning',
            text: 'Priority at Me Side missing.'
        });
        isPass = false;
        return isPass;
    }

    var checkOtherZero = otherIdValueList.filter(f => f == 0 || f == null);
    if (checkOtherZero.length > 0) {
        Swal.fire({
            icon: 'warning',
            text: 'Priority at Other Side missing.'
        });
        isPass = false;
        return isPass;
    }

    var meChk = new Set();
    var meDuplicates = meIdValueList.filter(n => meChk.size === meChk.add(n).size);

    if (meDuplicates.length > 0) {
        Swal.fire({
            icon: 'warning',
            text: 'Duplicate priority at Me Side.'
        });
        isPass = false;
        return isPass;
    }
    else {
        isPass = true;
    }

    var otherChk = new Set();
    var otherDuplicates = otherIdValueList.filter(n => otherChk.size === otherChk.add(n).size);

    if (otherDuplicates.length > 0) {
        Swal.fire({
            icon: 'warning',
            text: 'Duplicate priority at Other Side.'
        });
        isPass = false;
        return isPass;
    }
    else {
        isPass = true;
    }

    return isPass;
}

