import * as user from "./adminlte.js"

var userRole;
var userNo = 0;

var projectNo = "";
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

  await loadTrackingList();
});

document
  .getElementById("btnSave")
  .addEventListener("click", saveIssueTracking);

async function loadTrackingList() {
  $("#loadingView").show();

  await loadIssueDetails().then(result => {
    if (result) {
      var ajaxUrl;
      var ajaxData;

      if (userRole == "ADMIN") {
        ajaxUrl = "https://api.negosys.co.kr/a/issueTrackingsByProjectSn";
        ajaxData = { projectSn: projectNo, userSn: userNo };
      } else {
        ajaxUrl = "https://api.negosys.co.kr/nego/issueTrackingsByProjectSn"
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
          var html = "";
          console.log(data);
          //sort by issueSn
          data.sort(function (a, b) {
            return a.issueSn - b.issueSn;
          });

          $.each(data, function (index, itemData) {
            var issueFilter = issueLists.filter(f => f.issueSn == itemData.issueSn);
            var issueDetail = issueFilter[0];

            issueSnList.push(itemData.issueSn);


            //console.log(itemData.trackingHistory.length);
            var meTop1 = "";
            var otherTop1 = "";
            var meMiddle1 = "";
            var otherMiddle1 = "";
            var meBottom1 = "";
            var otherBottom1 = "";
            var meResult1 = "";
            var otherResult1 = "";

            var meTop2 = "";
            var otherTop2 = "";
            var meMiddle2 = "";
            var otherMiddle2 = "";
            var meBottom2 = "";
            var otherBottom2 = "";
            var meResult2 = "";
            var otherResult2 = "";

            var meTop3 = "";
            var otherTop3 = "";
            var meMiddle3 = "";
            var otherMiddle3 = "";
            var meBottom3 = "";
            var otherBottom3 = "";
            var meResult3 = "";
            var otherResult3 = "";

            $.each(itemData.trackingHistory, function (index, item) {
              if (index == 0) {
                meTop1 = item.meTop;
                otherTop1 = item.otherTop;
                meMiddle1 = item.meMiddle;
                otherMiddle1 = item.otherMiddle;
                meBottom1 = item.meBottom;
                otherBottom1 = item.otherBottom;
                if (item.meResult != null) meResult1 = item.meResult;
                if (item.otherResult != null) otherResult1 = item.otherResult;
              } else if (index == 1) {
                meTop2 = item.meTop;
                otherTop2 = item.otherTop;
                meMiddle2 = item.meMiddle;
                otherMiddle2 = item.otherMiddle;
                meBottom2 = item.meBottom;
                otherBottom2 = item.otherBottom;
                if (item.meResult != null) meResult2 = item.meResult;
                if (item.otherResult != null) otherResult2 = item.otherResult;
              } else if (index == 2) {
                meTop3 = item.meTop;
                otherTop3 = item.otherTop;
                meMiddle3 = item.meMiddle;
                otherMiddle3 = item.otherMiddle;
                meBottom3 = item.meBottom;
                otherBottom3 = item.otherBottom;
                if (item.meResult != null) meResult3 = item.meResult;
                if (item.otherResult != null) otherResult3 = item.otherResult;
              }
            });

            html += `
                        <div class="card ml-1 mt-4 mb-4">
                    <div class="card-header themeColor">
                      <p class="card-title issueTitle">${issueDetail.issueKind} > ${issueDetail.issue}</p>
        
                      <div class="card-tools">
                        <button type="button" class="btn btn-tool" data-toggle="collapse" href="#collapseIssue${itemData.issueSn}" role="button"
                          aria-expanded="true" aria-controls="collapseMySide" title="Collapse">
                          <i class="fas fa-minus"></i>
                        </button>
                      </div>
                    </div>
        
                    <div class="collapse show" id="collapseIssue${itemData.issueSn}">
                      <div class="card-body">
                        <table id="tblData${itemData.issueSn}" class="tg table table-bordered" style="width:100%">
                          <thead>
                            <tr>
                              <th class="tg-baqh" colspan="2">Priority</th>
                              <th class="tg-nrix" colspan="4" rowspan="2">1st Stage</th>
                              <th class="tg-nrix" colspan="4" rowspan="2">2nd Stage</th>
                              <th class="tg-nrix" colspan="4" rowspan="2">3rd Stage</th>
                              <th class="tg-nrix" rowspan="3">Results</th>
                              <th class="tg-nrix" rowspan="3">Options</th>
                            </tr>
                            <tr>
                              <th class="tg-baqh">Me</th>
                              <th class="tg-baqh">Other</th>
                            </tr>
                            <tr>
                              <th class="tg-baqh" id="mePrior">${issueDetail.meOrder}</th>
                              <th class="tg-baqh" id="otherPrior">${issueDetail.otherOrder}</th>
                              <th class="tg-baqh">Me</th>
                              <th class="tg-baqh">Other</th>
                              <th class="tg-baqh">My Result</th>
                              <th class="tg-baqh">Other Result</th>
                              <th class="tg-baqh">Me</th>
                              <th class="tg-baqh">Other</th>
                              <th class="tg-baqh">My Result</th>
                              <th class="tg-baqh">Other Result</th>
                              <th class="tg-baqh">Me</th>
                              <th class="tg-baqh">Other</th>
                              <th class="tg-baqh">My Result</th>
                              <th class="tg-baqh">Other Result</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td class="tg-0lax" rowspan="3">
                                Weight
                                <input id="issueWeight" type="number" step="0.1" min="0" max="1" class="form-control allow_numeric table-input" placeholder="eg. 0.8" value="${itemData.issueWeight}">
                              </td>
                              <td class="tg-0lax" rowspan="2">Min.</td>
        
                              <td class="tg-0lax" rowspan="2">
                                <input id="meMin1" type="number" class="form-control allow_numeric table-input" value="${meBottom1}">
                              </td>
                              <td class="tg-0lax" rowspan="2">
                                <input id="otherMin1" type="number" class="form-control allow_numeric table-input" value="${otherBottom1}">
                              </td>
                              <td class="tg-0lax" rowspan="6">
                                <input id="meResult1" type="number" class="form-control allow_numeric td-col6 table-input" value="${meResult1}">
                              </td>
                              <td class="tg-0lax" rowspan="6">
                                <input id="otherResult1" type="number" class="form-control allow_numeric td-col6 table-input" value="${otherResult1}">
                              </td>
        
                              <td class="tg-0lax" rowspan="2">
                                <input id="meMin2" type="number" class="form-control allow_numeric table-input" value="${meBottom2}">
                              </td>
                              <td class="tg-0lax" rowspan="2">
                                <input id="otherMin2" type="number" class="form-control allow_numeric table-input" value="${otherBottom2}">
                              </td>
                              <td class="tg-0lax" rowspan="6">
                                <input id="meResult2" type="number" class="form-control allow_numeric td-col6 table-input" value="${meResult2}">
                              </td>
                              <td class="tg-0lax" rowspan="6">
                                <input id="otherResult2" type="number" class="form-control allow_numeric td-col6 table-input" value="${otherResult2}">
                              </td>
        
                              <td class="tg-0lax" rowspan="2">
                                <input id="meMin3" type="number" class="form-control allow_numeric table-input" value="${meBottom3}">
                              </td>
                              <td class="tg-0lax" rowspan="2">
                                <input id="otherMin3" type="number" class="form-control allow_numeric table-input" value="${otherBottom3}">
                              </td>
                              <td class="tg-0lax" rowspan="6">
                                <input id="meResult3" type="number" class="form-control allow_numeric td-col6 table-input" value="${meResult3}">
                              </td>
                              <td class="tg-0lax" rowspan="6">
                                <input id="otherResult3" type="number" class="form-control allow_numeric td-col6 table-input" value="${otherResult3}">
                              </td>
        
                              <td class="tg-0lax" rowspan="6">
                                <textarea id="result" type="text" class="form-control table-input" rows="6">${itemData.resultStr}</textarea>
                              </td>
                              <td class="tg-0lax" rowspan="6">
                                <textarea id="option" type="text" class="form-control table-input" rows="6">${itemData.optionStr}</textarea>
                              </td>
                            </tr>
                            <tr>
                            </tr>
                            <tr>
                              <td class="tg-0lax" rowspan="2">Avg.</td>
                              <td class="tg-0lax" rowspan="2">
                                <input id="meAvg1" type="number" class="form-control allow_numeric table-input" value="${meMiddle1}">
                              </td>
                              <td class="tg-0lax" rowspan="2">
                                <input id="otherAvg1" type="number" class="form-control allow_numeric table-input" value="${otherMiddle1}">
                              </td>
                              <td class="tg-0lax" rowspan="2">
                                <input id="meAvg2" type="number" class="form-control allow_numeric table-input" value="${meMiddle2}">
                              </td>
                              <td class="tg-0lax" rowspan="2">
                                <input id="otherAvg2" type="number" class="form-control allow_numeric table-input" value="${otherMiddle2}">
                              </td>
                              <td class="tg-0lax" rowspan="2">
                                <input id="meAvg3" type="number" class="form-control allow_numeric table-input" value="${meMiddle3}">
                              </td>
                              <td class="tg-0lax" rowspan="2">
                                <input id="otherAvg3" type="number" class="form-control allow_numeric table-input" value="${otherMiddle3}">
                              </td>
                            </tr>
                            <tr>
                              <td class="tg-0lax" rowspan="3">
                                Unit
                                <input id="issueUnit" type="text" class="form-control table-input" placeholder="eg. kg" value="${itemData.issueUnit}">
                              </td>
                            </tr>
                            <tr>
                              <td class="tg-0lax" rowspan="2">Max.</td>
                              <td class="tg-0lax" rowspan="2">
                                <input id="meMax1" type="number" class="form-control allow_numeric table-input" value="${meTop1}">
                              </td>
                              <td class="tg-0lax" rowspan="2">
                                <input id="otherMax1" type="number" class="form-control allow_numeric table-input" value="${otherTop1}">
                              </td>
                              <td class="tg-0lax" rowspan="2">
                                <input id="meMax2" type="number" class="form-control allow_numeric table-input" value="${meTop2}">
                              </td>
                              <td class="tg-0lax" rowspan="2">
                                <input id="otherMax2" type="number" class="form-control allow_numeric table-input" value="${otherTop2}">
                              </td>
                              <td class="tg-0lax" rowspan="2">
                                <input id="meMax3" type="number" class="form-control allow_numeric table-input" value="${meTop3}">
                              </td>
                              <td class="tg-0lax" rowspan="2">
                                <input id="otherMax3" type="number" class="form-control allow_numeric table-input" value="${otherTop3}">
                              </td>
                            </tr>
                            <tr>
                            </tr>
                          </tbody>
                        </table>
                        <!-- row-->
        
                      </div>
                    </div>
        
                  </div>
                        `;
          });

          $(".issueContent").html(html);
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
  })
}

$(".allow_numeric").on("input", function (evt) {
  var self = $(this);
  console.log(self.val());
  self.val(self.val().replace(/\D/g, ""));
  if ((evt.which < 48 || evt.which > 57)) {
    evt.preventDefault();
  }
});

function saveIssueTracking() {
  var issueId;

  if (checkWeightTotal() == false) {
    return;
  }

  for (let i = 0; i < issueSnList.length; i++) {

    var trackingHistoryList = [];

    var tableId = "#tblData".concat(issueSnList[i]);
    var inputs = $(tableId).find("input");
    var inputsTextarea = $(tableId).find("textarea");
    //console.log(inputs);

    var issueUnit;
    var issueWeight;
    var resultString;
    var optionString;

    $.each(inputs, function (index, item) {
      if (this.id == "issueUnit") {
        issueUnit = this.value;
      }
      if (this.id == "issueWeight") {
        issueWeight = this.value;
      }
    });

    $.each(inputsTextarea, function (index, item) {
      console.log(this.id);
      if (this.id == "result") {
        resultString = this.value;
      }
      if (this.id == "option") {
        optionString = this.value;
      }
    });

    //const filterArray = (array, fields, value) => {
    //fields = Array.isArray(fields) ? fields : [fields];
    //return array.filter((item) => fields.some((field) => item[field] === value));
    //};

    //console.log(filterArray(inputs, 'id', 'meMin1'));


    for (let i = 1; i <= 3; i++) {
      var meMin;
      var otherMin;
      var meResult;
      var otherResult;
      var meAvg;
      var otherAvg;
      var meMax;
      var otherMax;

      $.each(inputs, function (index, item) {
        switch (this.id) {
          case "meMin".concat(i):
            meMin = this.value;
          case "otherMin".concat(i):
            otherMin = this.value;
          case "meResult".concat(i):
            meResult = this.value;
          case "otherResult".concat(i):
            otherResult = this.value;
          case "meAvg".concat(i):
            meAvg = this.value;
          case "otherAvg".concat(i):
            otherAvg = this.value;
          case "meMax".concat(i):
            meMax = this.value;
          case "otherMax".concat(i):
            otherMax = this.value;
        }
      });

      var trackingItem = {
        meTop: meMax,
        meMiddle: meAvg,
        meBottom: meMin,
        meResult: meResult,
        otherTop: otherMax,
        otherMiddle: otherAvg,
        otherBottom: otherMin,
        otherResult: otherResult
      };

      trackingHistoryList.push(trackingItem);
    }

    let reqObj = {
      issueSn: issueSnList[i],
      issueUnit: issueUnit,
      issueWeight: issueWeight,
      trackingHistory: trackingHistoryList,
      resultStr: resultString,
      optionStr: optionString,
      evaluationScore: 0
    }

    console.log(reqObj);

    //return;

    $("#loadingView").show();

    var ajaxUrl;

    if (userRole == "ADMIN") {
      ajaxUrl = "https://api.negosys.co.kr/a/issueTracking?userSn=" + userNo;
    } else {
      ajaxUrl = "https://api.negosys.co.kr/nego/issueTracking"
    }

    $.ajax({
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
        console.log(x);

        Swal.fire({
          icon: 'info',
          text: 'Data has been saved successfully.'
        });
        $("#loadingView").hide();
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
}

async function loadIssueDetails() {
  return new Promise((resolve, reject) => {
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
        //console.log(issueLists);
        $("#loadingView").hide();

        resolve(true);
      },
      error: function (error) {
        $("#loadingView").hide();
        console.log(JSON.stringify(error));
        Swal.fire({
          icon: 'error',
          text: 'Failed to load issue data.'
        });
        reject(false);
      }
    });
  });


}

function checkWeightTotal() {
  var totalWeight = 0;

  for (let i = 0; i < issueSnList.length; i++) {
    var tableId = "#tblData".concat(issueSnList[i]);
    var inputs = $(tableId).find("input");

    $.each(inputs, function (index, item) {
      if (this.id == "issueWeight") {
        totalWeight = parseFloat(totalWeight) + parseFloat(this.value);
      }
    });
  }

  if (totalWeight != 1.0) {
    Swal.fire({
      icon: 'warning',
      text: 'Total weight issues must be equal to 1.0.'
    });
    return false;
  }

  return true;
}