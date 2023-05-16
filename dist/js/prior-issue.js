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
    .addEventListener("click", saveIssue);

    document
    .getElementById("btnBack")
    .addEventListener("click", prevPage);

document
    .getElementById("btnNext")
    .addEventListener("click", nextPage);

function nextPage() {
    if (saveIssue == true) {
        location.href = "swot-analysis.html?projectSn=" + projectNo;
    }
    location.href = "swot-analysis.html?projectSn=" + projectNo;
}

function prevPage() {
    location.href = "issues.html?projectSn=" + projectNo;
}

function saveIssue() {
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

    return;

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

            //console.log(data);

            $.each(data, function (index, itemData) {
                var meOrder = itemData.meOrder;
                var otherOrder = itemData.otherOrder;

                if (meOrder == null) {
                    meOrder = index + 1;
                }

                if (otherOrder == null) {
                    otherOrder = index + 1;
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
                <input type="number" min="1" class="form-control mePrior-${itemData.issueSn}" value="${meOrder}"></div></div>
                <textarea class="form-control meReason-${itemData.issueSn}" placeholder="Enter reason" maxlength="256"></textarea></div></div></div></div>`;

                otherhtml +=
                    '<div class="row"><div class="col-md-12"><div class="small-box"><div class="inner"><div class="row"><div class="col-10">';
                    otherhtml += `<p class="ml-2 otherIssue-${itemData.issueSn}">${itemData.issueKind} > ${itemData.issue}</p>
                </div><div class="col-2">
                <input type="number" min="1" class="form-control otherPrior-${itemData.issueSn}" value="${otherOrder}"></div></div>
                <textarea class="form-control otherReason-${itemData.issueSn}" placeholder="Enter reason" maxlength="256"></textarea></div></div></div></div>`;

               
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


