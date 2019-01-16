$.fn.csv2arr = function(callback) {
  var files = $(this)[0].files;
  if (files.length != 0) {
    if (typeof FileReader !== "undefined") {
      var reader = new FileReader();
      reader.readAsText(files[0]);
      reader.onload = function(evt) {
        var data = evt.target.result;
        var arr = data.trim().split("\n");
        var newArr = [];
        for (var i in arr) {
          newArr[i] = arr[i].split(",");
        }
        callback && callback(newArr);
      };
    } else {
      showTip("Please Use Chrome or Firefox", "warning", "500");
    }
  } else {
    showTip("Please load all files", "warning", "500");
    $("#tip").fadeOut(100);
  }
};

function getUrlParam(paraName) {
  var url = decodeURI(document.location.toString());
  var arrObj = url.split("?");
  if (arrObj.length > 1) {
    var arrPara = arrObj[1].split("&");
    var arr;
    for (var i = 0; i < arrPara.length; i++) {
      arr = arrPara[i].split("=");
      if (arr != null && arr[0] == paraName) {
        return arr[1];
      }
    }
    return "";
  } else {
    return "";
  }
}
Date.prototype.format = function(fmt) {
  var o = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    S: this.getMilliseconds()
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
    }
  }
  return fmt;
};
function showTip(tip, type, delay) {
  var $tip = $("#tip");
  $tip
    .stop(true)
    .prop("class", "alert alert-" + type)
    .text(tip)
    .css("margin-left", -$tip.outerWidth() / 2)
    .fadeIn(200)
    .delay(delay ? delay : "300")
    .fadeOut(200);
}
function addUrlArr(arr) {
  var obj = {
    urlId: arr[0],
    url: arr[1],
    tagInfo: addTagInfo([], arr),
    times: arr[6] || 0,
    state: parseInt(arr[7]) || 0
  };
  return obj;
}
function unique(arr) {
  var urlsArr = [];
  urlsArr.push(addUrlArr(arr[0]));
  for (var i = 1; i < arr.length; i++) {
    var repeat = false;
    for (var j = 0; j < urlsArr.length; j++) {
      if (arr[i][0] == urlsArr[j].urlId) {
        repeat = true;
        urlsArr[j].tagInfo = addTagInfo(urlsArr[j].tagInfo, arr[i]);
        break;
      }
    }
    if (!repeat) {
      urlsArr.push(addUrlArr(arr[i]));
    }
  }
  return urlsArr;
}

function handleCancel(e) {
  var frameData = {
    url: "",
    urlId: "",
    image: [],
    tagInfo: []
  };
  var tr = $(e)[0].parentNode.parentNode;
  var urlId = $(tr).find("td")[0].innerText;
  var url = $(tr).find("td")[1].innerText;
  for (var i = 0; i < result.length; i++) {
    if (result[i].urlId == urlId) {
      $("#checkedTotal").html(parseInt($("#checkedTotal")[0].innerText) - 1);
      $("#tagedTotal").html(parseInt($("#tagedTotal")[0].innerText) + 1);
      result[i].times++;
      result[i].checked = false;
      localStorage.setItem(
        "checkedTotal",
        parseInt(localStorage.getItem("checkedTotal")) - 1
      );
      localStorage.setItem(
        "tagedTotal",
        parseInt(localStorage.getItem("tagedTotal")) + 1
      );
      localStorage.setItem("result", JSON.stringify(result));

      $(tr).remove();
      var tr = initTr(result[i]);
      if ($("#taged:has(tbody)").length == 0) {
        $("#taged table").append("<tbody>" + tr + "</tbody>");
      } else {
        $("#taged tbody").prepend(tr);
      }
      return;
    }
  }
}

function goTag(e) {
  var frameData = {
    url: "",
    urlId: "",
    image: [],
    tagInfo: []
  };
  var tr = $(e)[0].parentNode.parentNode;
  var urlId = $(tr).find("td")[0].innerText;
  var url = $(tr).find("td")[1].innerText;
  var tagInfo = $(tr).find("td")[2].innerText;
  var openUrl = "./lib/imageTag.html?urlId=" + urlId;
  window.location.href = openUrl;
}
function addTagInfo(old, newArr) {
  if (newArr[2] && newArr[3] && newArr[4] && newArr[5]) {
    var obj = {
      tagId: newArr[2],
      tag: newArr[3],
      start: newArr[4],
      end: newArr[5]
    };
    old.push(obj);
  }
  return old;
}
function tagInfoToBe(tagInfo) {
  var table = "";
  if (tagInfo.length > 0) {
    table +=
      "<table class='table'><thead><th>TagID</th><th>Tag</th><th>Start</th><th>End</th>";
    for (var i in tagInfo) {
      table += "<tr>";
      for (var key in tagInfo[i]) {
        table += "<td>" + tagInfo[i][key] + "</td>";
      }
      table += "</tr>";
    }
    table += "<table>";
  }
  return table;
}
function initTr(item) {
  var content = "";
  content += "<tr>";
  content += "<td>" + item.urlId + "</td>";
  content += "<td>" + item.url + "</td>";
  content +=
    "<td style='width:50%;text-align:left;display:none'>" +
    JSON.stringify(item.tagInfo) +
    "</td>";
  // content += "<td>" + tagInfoToBe(item.tagInfo) + "</td>"
  content += "<td>" + item.times + "</td>";
  if (item.checked) {
    content +=
      "<td><button onclick='handleCancel(this)' class='btn btn-danger' type='button'>Cancel</button></td>";
  } else if (item.state == 2) {
    content +=
      "<td><button onclick='handleReturn(this)' class='btn btn-danger' type='button'>Restore</button></td>";
  } else if (item.state == 1) {
    content +=
      "<td><button onclick='goTag(this)' class='btn btn-info'>Checkout</button><button onclick='handleDelete(this)' class='btn btn-danger' type='button'>Delete</button></td>";
  } else {
    content +=
      "<td><button onclick='goTag(this)' class='btn btn-info'>Label</button><button onclick='handleDelete(this)' class='btn btn-danger' type='button'>Delete</button></td>";
  }
  content += "</tr>";
  return content;
}
function createTable(urlsArr) {
  var result = [];
  $("#myTab").show();
  $("#myTabContent").show();
  $("#export").show();
  var tempTh = "<table class='table'>";
  tempTh += "<thead><tr>";
  tempTh += "<th>URLID</th>";
  tempTh += "<th>URL</th>";
  tempTh += "<th style='display:none'>TagInfo</th>";
  tempTh += "<th>Time</th>";
  tempTh += "<th>Operation</th>";
  tempTh += "</tr></thead>";
  var unTag = tempTh;
  var unTagTotal = 0;
  var taged = tempTh;
  var tagedTotal = 0;
  var checked = tempTh;
  var checkedTotal = 0;
  var delTag = tempTh;
  var delTagTotal = 0;
  for (var i = 0; i < urlsArr.length; i++) {
    result.push(urlsArr[i]);
    var tr = initTr(urlsArr[i]);
    if (urlsArr[i].checked) {
      checked += tr;
      checkedTotal++;
    } else if (urlsArr[i].state == 0) {
      unTag += tr;
      unTagTotal++;
    } else if (urlsArr[i].state == 1) {
      taged += tr;
      tagedTotal++;
    } else if (urlsArr[i].state == 2) {
      delTag += tr;
      delTagTotal++;
    }
  }
  unTag += "</table>";
  taged += "</table>";
  checked += "</table>";
  delTag += "</table>";
  $("#unTag").html(unTag);
  $("#taged").html(taged);
  $("#checked").html(checked);
  $("#delTag").html(delTag);
  localStorage.setItem("unTagTotal", unTagTotal);
  localStorage.setItem("tagedTotal", tagedTotal);
  localStorage.setItem("checkedTotal", checkedTotal);
  localStorage.setItem("delTagTotal", delTagTotal);
  $("#unTagTotal").html(unTagTotal);
  $("#tagedTotal").html(tagedTotal);
  $("#checkedTotal").html(checkedTotal);
  $("#delTagTotal").html(delTagTotal);
  showTip("Data load successful", "success");
  setTimeout(function() {
    $("#tip").fadeOut(100);
  }, 500);
  return result;
}
