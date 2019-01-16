var result = JSON.parse(localStorage.getItem("result"));
var tagsArr = JSON.parse(localStorage.getItem("tag"));
var framesArr = JSON.parse(localStorage.getItem("frame"));
var frameData = {};
var urlIndex = 0;
var column = 4;
var oldSpace = 0.5;
var newSpace = 0.5;
var colors = [];
var player;
var duration = 0;
var width = 0;
var height = 0;
var done = false;
if (localStorage.getItem("column")) {
  column = localStorage.getItem("column");
} else {
  localStorage.setItem("column", column);
}
if (localStorage.getItem("newSpace")) {
  newSpace = localStorage.getItem("newSpace");
} else {
  localStorage.setItem("newSpace", newSpace);
}
var activeTimeId = "";
var int;
var color = [
  "#E14A63",
  "#F3AA4D",
  "#C4C400",
  "#99CC99",
  "#2891DB",
  "#003366",
  "#996699",
  "#996633",
  "#999999",
  "#FF9999"
];
function randomColor(index) {
  if (index < 10) {
    return color[index];
  }
  var hex = Math.floor(Math.random() * 0xffffff).toString(16);
  while (hex.length < 6) {
    hex = "0" + hex;
  }
  return `#${hex}`;
}

var ratio = 1;
var bigImgUrl = "";
var urlId = getUrlParam("urlId");
if (!urlId) {
  $(".box").hide();
  window.location.href = "../coin_annotation_tool.html";
} else {
  var clientWidth =
    document.documentElement.clientWidth || document.body.clientWidth;
  var clientHeight =
    document.documentElement.clientHeight || document.body.clientHeight;
  var activeImg = [];
  var activeTime = [];
  $(".box").show();
  getFrame();
  for (let i in tagsArr) {
    tagsArr[i].push(randomColor(i));
  }
  var tagInfo = result[urlIndex].tagInfo.sort(compare("start"));
}

$(function() {
  if (urlId) {
    $("[data-toggle='tooltip']").tooltip();
    $("#column").val(column);
    $("#frame").val(newSpace);
    $("#urlId")[0].innerText = frameData.url;

    var table = tagInfoToBe(result[urlIndex].tagInfo);
    $(".result").append(table);
    getData();
    initTagInfo();

    $("#urlId").click(function() {
      $("#modalTitle").attr(
        "href",
        "https://www.youtube.com/embed/" +
          frameData.url.slice(0, frameData.url.length - 4)
      );
      $("#modalTitle")[0].innerText =
        "https://www.youtube.com/embed/" +
        frameData.url.slice(0, frameData.url.length - 4);
      $("#videoModal").modal();
      width = $("#progress").width();
      if (duration) {
        player.playVideo();
      }
      activeImg = [];
      loadProgress();
    });
    $("#videoModal").on("hide.bs.modal", function() {
      window.clearInterval(int);
      initTagInfo();
      if (player) {
        player.pauseVideo();
        player.clearVideo();
      }
    });
    $("#videoModal").on("hidden.bs.modal", function() {
      $(".delTagBtn").hide();
      activeTime = [];
    });
    var left = 0,
      bgleft = 0;
    $("#progress").click(function(e) {
      player.pauseVideo();
      bgleft = $("#progress").offset().left;
      left = e.pageX - bgleft;
      $("#progressbar").width(left);
      var seekTo = (left / width) * duration;
      if (parseInt((left / width) * duration) >= duration) {
        seekTo = duration;
      }
      player.seekTo(seekTo, true);
      $("#current")[0].innerText = parseFloat(seekTo).toFixed(1);
    });
    $("#progress").mousemove(function(e) {
      player.pauseVideo();
      bgleft = $("#progress").offset().left;
      left = e.pageX - bgleft;
      $("[data-toggle='popover']").popover();
      $("#progressbar").width(left);
      var seekTo = (left / width) * duration;
      if (parseInt((left / width) * duration) >= duration) {
        seekTo = duration;
      }
      player.seekTo(seekTo, true);
      $("#current")[0].innerText = parseFloat(seekTo).toFixed(1);
    });
    $("#myProgress").mousemove(function(e) {
      player.pauseVideo();
      bgleft = $("#progress").offset().left;
      left = e.pageX - bgleft;
      $("[data-toggle='popover']").popover();
      $("#progressbar").width(left);
      var seekTo = (left / width) * duration;
      if (parseInt((left / width) * duration) >= duration) {
        seekTo = duration;
      }
      player.seekTo(seekTo, true);
      $("#current")[0].innerText = parseFloat(seekTo).toFixed(1);
    });
    $("#myProgress").click(function(e) {
      player.pauseVideo();
      bgleft = $("#myProgress").offset().left;
      left = e.pageX - bgleft;
      $("#progressbar").width(left);

      var seekTo = parseFloat((left / width) * duration).toFixed(1);
      if (left > width) {
        seekTo = duration;
      }
      player.seekTo(seekTo, true);
      $("#current")[0].innerText = parseFloat(seekTo).toFixed(1);

      var flag = false;
      for (var i = 0; i < tagInfo.length; i++) {
        if (
          seekTo >= parseFloat(tagInfo[i].start) &&
          seekTo <= parseFloat(tagInfo[i].end)
        ) {
          flag = true;
          activeTime = [];
          break;
        }
      }
      if (!flag) {
        changeActiveTime(seekTo);
      }
    });
  }
});
function toActiveTime(flag) {
  if (flag) {
    $(".delTagBtn").show();
    enableRadio();
  } else {
    if (activeTime.length == 0 || activeTime.length == 1) {
      $(".delTagBtn").hide();
      disableRadio();
    } else if (activeTime.length == 2) {
      $(".delTagBtn").show();
      enableRadio();
      var start = parseFloat(activeTime[0]);
      var end = parseFloat(activeTime[1]);
      var item = start;
      if (start > end) {
        start = end;
        end = item;
      }
      var background = "#ccc";
      addProgress(start, end, background);
    }
  }
}
function addProgress(start, end, background) {
  var progress = $("#myProgress");
  var percent = (end - start) / duration;
  var id = $(".my-progress-bar").length + 1;
  var progress_bar =
    '<div id="' +
    id +
    '" class="my-progress-bar"' +
    'style="background:' +
    background +
    ";width:" +
    percent * width +
    "px;left:" +
    (start / duration) * width +
    'px;"' +
    ' role="progressbar" aria-valuemin="0" aria-valuemax="100"' +
    ' data-toggle="popover" rel="popover"' +
    '" data-original-title="' +
    start +
    "s-" +
    end +
    's">' +
    "</div>";
  progress.append(progress_bar);
  $("[data-toggle='popover']").popover({
    trigger: "hover",
    placement: "top",
    container: "body"
  });
}
function changeActiveTime(time) {
  var length = activeTime.length;
  if (length == 0) {
    activeTime.push(time);
  } else if (length == 1) {
    if (parseFloat(time) - parseFloat(activeTime[0]).toFixed(1) == 0) {
      console.log("Repeat");
    } else {
      activeTimeId = "";
      activeTime.push(time);
      var start = 0;
      var end = 0;
      start = parseFloat(activeTime[0]);
      end = parseFloat(activeTime[1]);
      var item = start;
      if (start > end) {
        start = end;
        end = item;
      }
      var flag = false;
      for (var i = 0; i < tagInfo.length; i++) {
        if (
          start <= parseFloat(tagInfo[i].start) &&
          end >= parseFloat(tagInfo[i].end)
        ) {
          flag = true;
          break;
        }
      }
      if (!flag) {
        activeTime = [start, end];
      } else {
        showTip("No coverage", "warning", "500");
        loadProgress();
        activeTime = [];
      }
    }
  } else {
    loadProgress();
    activeTime = [];
    activeTime.push(time);
  }
  toActiveTime();
  if (activeTime.length == 1) {
    var start = activeTime[0];
    var progress = $("#myProgress");
    var id = $(".my-progress-bar").length + 1;
    var progress_bar =
      '<div id="' +
      id +
      '" class="my-progress-bar"' +
      'style="background:black;width:2px;' +
      "left:" +
      (start / duration) * width +
      'px;">' +
      "</div>";
    progress.append(progress_bar);
  }
}
if (urlId) {
  var tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function onYouTubeIframeAPIReady() {
  player = new YT.Player("player", {
    videoId: frameData.url.slice(0, frameData.url.length - 4),
    playerVars: { controls: 1, showinfo: 0 },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange
    }
  });
}

function onPlayerReady(event) {
  duration = player.getDuration();
  $("#duration")[0].innerText = " / " + (duration - 1);
  $("#mp4Loaded").hide();
  $("#myProgress").show();
  loadProgress();
  $("#progress-bar").width((player.getCurrentTime() / duration) * 100 + "%");
}
function onPlayerStateChange(data) {
  if (data.data == 1) {
    int = window.setInterval("load()", 100);
  } else {
    window.clearInterval(int);
    $("#current")[0].innerText = parseInt(player.getCurrentTime());
    $("#progressbar").width((player.getCurrentTime() / duration) * width);
  }
}
function load() {
  $("#current")[0].innerText = parseInt(player.getCurrentTime());
  $("#progressbar").width((player.getCurrentTime() / duration) * width);
  if (player.getCurrentTime() >= duration - 1) {
    window.clearInterval(int);
  }
}
function loadProgress() {
  $("[data-toggle='popover']").popover("hide");
  tagInfo = result[urlIndex].tagInfo.sort(compare("start"));
  var progress = $("#myProgress");
  progress.html("");
  for (let i in tagInfo) {
    var item = parseFloat(tagInfo[i].end) - parseFloat(tagInfo[i].start);
    var background = "";
    for (var j = 0; j < tagsArr.length; j++) {
      if (tagsArr[j][0] == tagInfo[i].tagId) {
        background = tagsArr[j][2];
      }
    }
    var percent = item / duration;
    var type = i % 2 == 0 ? "warning" : "danger";
    var id = $(".my-progress-bar").length + 1;
    var progress_bar =
      '<div id="' +
      id +
      '" onclick="changeSeek(' +
      tagInfo[i].start +
      "," +
      tagInfo[i].end +
      "," +
      id +
      ')"class="my-progress-bar"' +
      'style="background:' +
      background +
      ";width:" +
      percent * width +
      "px;left:" +
      (tagInfo[i].start / duration) * width +
      'px;"' +
      ' role="progressbar" aria-valuemin="0" aria-valuemax="100"' +
      ' data-toggle="popover" rel="popover" data-content="' +
      tagInfo[i].tag +
      '" data-tagid="' +
      tagInfo[i].tagId +
      '" data-original-title="' +
      tagInfo[i].start +
      "s-" +
      tagInfo[i].end +
      's">' +
      "<span>" +
      tagInfo[i].tagId;
    "</span>" + "</div>";
    progress.append(progress_bar);
  }
  $("[data-toggle='popover']").popover({
    trigger: "hover",
    placement: "top",
    container: "body"
  });
}
function changeSeek(start, end, id, flag) {
  window.event.stopPropagation();
  player.seekTo(start, true);
  player.playVideo();
  $("#current")[0].innerText = parseFloat(start).toFixed(1);
  $("#progressbar").width((start / duration) * width);
  activeTimeId = id;
  activeTime = [start, end];
  toActiveTime(true);
}
function getFrame() {
  for (var i in result) {
    if (result[i].urlId == urlId) {
      frameData = cloneObj(result[i]);
      frameData.url = frameData.url.trim();
      urlIndex = i;
      break;
    }
  }
  frameData.image = [];
  var multiple = parseFloat(newSpace / oldSpace);
  var newImg = [];
  for (var j = 0; j < framesArr.length; j++) {
    if (frameData.urlId == framesArr[j][0]) {
      newImg.push({
        urlId: framesArr[j][0],
        url: framesArr[j][1],
        time: framesArr[j][2]
      });
    }
  }
  for (var k = 0; k < newImg.length; k += multiple) {
    frameData.image.push({
      url: newImg[k].url,
      time: newImg[k].time
    });
  }
}
function getData() {
  $("#row").html("");
  $(".radioBox").html("");
  for (var i = 0; i < tagsArr.length; i++) {
    var radio = "<div class='radio'><label>";
    radio +=
      "<input type='radio' disabled name='tag' onchange='changeTag(this)' value='" +
      tagsArr[i][0] +
      "'>" +
      "<span>" +
      tagsArr[i][1];
    radio +=
      "</span><p style='position:absolute;top:0;right:0;width:10px;height:10px;border-radio:10px;background:" +
      tagsArr[i][2] +
      "'></p></label></div>";
    $(".radioBox").append(radio);
  }
  for (var i = 0; i < frameData.image.length; i++) {
    var li =
      "<li class='fileDiv' style='width:" +
      (1 / column) * 100 +
      "%' id='" +
      i +
      "'>";
    li += "<div class='grid-content'>";
    li += " <div class='el-card' onclick='changeActiveImg(this)' >";
    li += "   <div class='card-info' style='overflow:hidden'>";
    li += "    <img class='icon' onclick='bigImg(this)' src='./img/big.svg'>";
    li +=
      "    <div style='margin-right:5px'><span class='time'>" +
      frameData.image[i].time +
      "</span>s</div>";
    li +=
      "    <div><span class='tag label label-info' style='margin:0 0 5px 0;'></span></div>";
    li += "   </div>";
    li += "   <div class='img-box'>";
    li +=
      "     <img id='" +
      i +
      "' class='miniImg' src='" +
      getImgSrc(frameData.image[i].url) +
      "'";
    li += "     />";
    li += "   </div>";
    li += "  </div>";
    li += " </div>";
    li += "</li>";
    $("#row").append(li);
  }
}
function initTagInfo() {
  var lis = $("#row li.fileDiv");
  for (var i = 0; i < lis.length; i++) {
    $(lis[i]).find("span.tag")[0].id = "";
    $(lis[i]).find("span.tag")[0].innerText = "";
    var id = parseFloat($(".time")[i].innerText);
    for (var j in tagInfo) {
      if (
        id <= parseFloat(tagInfo[j].end) &&
        id >= parseFloat(tagInfo[j].start)
      ) {
        $(lis[i]).find("span.tag")[0].id = tagInfo[j].tagId;
        $(lis[i]).find("span.tag")[0].innerText = tagInfo[j].tag;
        for (var k = 0; k < tagsArr.length; k++) {
          if (tagsArr[k][0] == tagInfo[j].tagId) {
            $(lis[i]).find("span.tag")[0].style.background = tagsArr[k][2];
            break;
          }
        }
        break;
      }
    }
  }
}
function openSet() {
  var answer = confirm(
    "This action clears the currently unsaved information\nWhether to save the current information"
  );
  if (answer == true) {
    saveInfo(false);
  } else {
    result = JSON.parse(localStorage.getItem("result"));
    tagInfo = result[urlIndex].tagInfo;
    var table = tagInfoToBe(tagInfo);
    $(".result").html("");
    $(".result").append(table);
    loadProgress();
  }
  $("#myModal").modal();
}
function setting() {
  var x = $("#myForm").serializeArray();
  column = parseFloat(x[0].value) ? parseFloat(x[0].value) : 0;
  newSpace = parseFloat(x[1].value) ? parseFloat(x[1].value) : 0;
  var yu = newSpace % oldSpace;
  if (yu) {
    showTip(
      "Frame interval must be " + oldSpace + " integer times",
      "warning",
      "800"
    );
  } else {
    if (column && newSpace) {
      localStorage.setItem("column", column);
      localStorage.setItem("newSpace", newSpace);
      var lis = $("#row li.fileDiv");
      for (var i = 0; i < lis.length; i++) {
        lis[i].style.width = (1 / column) * 100 + "%";
      }
      getFrame();
      getData();
      initTagInfo();
      $("#myModal").modal("hide");
    }
  }
}

function getImgSrc(image) {
  return "../input/video/" + frameData.urlId + "/" + image;
}
function bigImg(icon) {
  event.preventDefault();
  $("#bigImgBox").html("");
  var img = $(icon)
    .parent()
    .parent()[0].children[1].children[0];
  var width = img.width;
  var height = img.height;
  ratio = width / height;
  bigImgUrl = img.src;

  var realWidth = (clientHeight - 110) * ratio + "px";
  var realHeight = (clientHeight - 110) * ratio + "px";
  var bigImg =
    "<img src='" +
    bigImgUrl +
    "' height='" +
    (clientHeight - 110) +
    "px'" +
    "' width='" +
    (clientHeight - 110) * ratio +
    "px'/>";
  $(".modal-dialog").width((clientHeight - 110) * ratio + 30 + "px");
  $("#bigImgBox").append(bigImg);
  $("#bigImg").modal("show");
  return false;
}

function delTag() {
  if (activeImg.length > 0) {
    for (var i = 0; i < activeImg.length; i++) {
      var img = $('img[id="' + activeImg[i] + '"]');
      var label = $('img[id="' + activeImg[i] + '"]')
        .parent()
        .parent()[0].children[0].children[2].children[0];
      label.innerText = "";
      label.id = "";
    }
    activeImg = [];
    toActive();
    saveInfo(false);
  } else if (activeTime.length > 0) {
    activeTimeId = "";
    var my_progress_bar = $(".my-progress-bar");
    loadProgress();
    for (let i = 0; i < my_progress_bar.length; i++) {
      if (my_progress_bar[i].dataset.tagid) {
        var arr = my_progress_bar[i].dataset.originalTitle.split("-");
        var start = arr[0].slice(0, -1);
        var end = arr[1].slice(0, -1);
        if (activeTime[0] == start && activeTime[1] == end) {
          $(".my-progress-bar")[i].remove();
          break;
        }
      }
    }
    activeTime = [];
    toActiveTime();
    saveTimeInfo();
  }
}
function enableRadio() {
  var radios = $('input[type="radio"]');
  for (var i = 0; i < radios.length; i++) {
    $(radios[i])[0].disabled = false;
  }
}
function disableRadio() {
  var radios = $('input[type="radio"]');
  for (var i = 0; i < radios.length; i++) {
    radios[i].disabled = true;
    radios[i].checked = false;
  }
}
function toActive() {
  if (activeImg.length > 0) {
    enableRadio();
    $(".delTagBtn").show();
  } else {
    $(".delTagBtn").hide();
  }
  var imgDivs = $(".grid-content");
  for (var i = 0; i < imgDivs.length; i++) {
    imgDivs[i].className = "grid-content";
  }
  for (var j = 0; j < activeImg.length; j++) {
    for (var i = 0; i < imgDivs.length; i++) {
      var imgId = imgDivs[i].children[0].children[1].children[0].id;
      var icon = imgDivs[i].children[0];
      if (imgId == activeImg[j]) {
        imgDivs[i].className = "grid-content active";
      }
    }
  }
}

function changeActiveImg(e) {
  var src = $(e)[0].children[1].children[0].id;
  if (src) {
    src = parseFloat(src);
    var length = activeImg.length;
    if (length == 0) {
      activeImg.push(src);
    } else if (length == 1) {
      activeImg.push(src);
      var start = 0;
      var end = 0;
      start = activeImg[0];
      end = activeImg[1];
      var item = start;
      if (start > end) {
        start = end;
        end = item;
      }
      var active = [];
      for (var j = start; j < end + 1; j++) {
        active.push(j);
      }
      activeImg = active;
    } else {
      activeImg = [];
      activeImg.push(src);
    }
    toActive();
  }
}
function changeTag(item) {
  if (activeImg.length > 0) {
    var tag = $(item)[0].nextSibling.innerText;
    var tagId = $(item)[0].value;
    for (var i = 0; i < activeImg.length; i++) {
      var img = $('img[id="' + activeImg[i] + '"]');
      var label = $('img[id="' + activeImg[i] + '"]')
        .parent()
        .parent()[0].children[0].children[2].children[0];
      label.innerText = tag;
      label.id = tagId;
      for (var k = 0; k < tagsArr.length; k++) {
        if (tagsArr[k][0] == tagId) {
          label.style.background = tagsArr[k][2];
          break;
        }
      }
    }
    activeImg = [];
    toActive();
    saveInfo(false);
  } else if (activeTime.length > 0) {
    var my_progress_bar = $(".my-progress-bar");
    var tag = $(item)[0].nextSibling.innerText;
    var tagId = $(item)[0].value;
    var start = parseFloat(activeTime[0]);
    var end = parseFloat(activeTime[1]);
    var id = $(".my-progress-bar").length + 1;
    var flag = false;
    for (let i = 0; i < my_progress_bar.length; i++) {
      if (my_progress_bar[i].dataset.tagid) {
        if ($(".my-progress-bar")[i].id == activeTimeId) {
          id = activeTimeId;
          $(".my-progress-bar")[i].remove();
          flag = true;
          activeTimeId = "";
          break;
        }
      }
    }
    activeTimeId = "";
    if (!flag) {
      loadProgress();
    }
    var progress = $("#myProgress");
    var item = parseFloat(end) - parseFloat(start);
    var background;
    for (var i = 0; i < tagsArr.length; i++) {
      if (tagsArr[i][0] == tagId) {
        background = tagsArr[i][2];
        break;
      }
    }
    var percent = item / duration;
    var progress_bar =
      '<div id="' +
      id +
      '" onclick="changeSeek(' +
      start.toFixed(0) +
      "," +
      end.toFixed(0) +
      "," +
      id +
      ')"class="my-progress-bar"' +
      'style="background:' +
      background +
      ";width:" +
      percent * width +
      "px;left:" +
      (start / duration) * width +
      'px;"' +
      ' role="progressbar" aria-valuemin="0" aria-valuemax="100"' +
      ' data-toggle="popover" rel="popover" data-content="' +
      tag +
      '" data-tagid="' +
      tagId +
      '" data-original-title="' +
      start.toFixed(0) +
      "s-" +
      end.toFixed(0) +
      's">' +
      "<span>" +
      tagId;
    "</span>" + "</div>";
    progress.append(progress_bar);
    $("[data-toggle='popover']").popover({
      trigger: "hover",
      placement: "top",
      container: "body"
    });
    activeTime = [];
    toActiveTime();
    saveTimeInfo();
  }
  disableRadio();
}
function saveTimeInfo(flag) {
  var oldState = result[urlIndex].state;
  if (!flag) {
    var my_progress_bar = $(".my-progress-bar");
    var newTagInfo = [];
    for (var i = 0; i < my_progress_bar.length; i++) {
      if (my_progress_bar[i].dataset.originalTitle) {
        var arr = my_progress_bar[i].dataset.originalTitle.split("-");
        var obj = {
          tagId: my_progress_bar[i].dataset.tagid,
          tag: my_progress_bar[i].dataset.content,
          start: arr[0].slice(0, -1),
          end: arr[1].slice(0, -1)
        };
        newTagInfo.push(obj);
      }
    }
    result[urlIndex].tagInfo = newTagInfo.sort(compare("start"));
    tagInfo = result[urlIndex].tagInfo;
    var table = tagInfoToBe(tagInfo);
    $(".result").html("");
    $(".result").append(table);
    loadProgress();
  } else {
    var answer = confirm("Save successfully, return to the home page ?");
    if (answer) {
      result[urlIndex].times++;
      result[urlIndex].state = 1;
      if (oldState == 0) {
        localStorage.setItem(
          "unTagTotal",
          parseInt(localStorage.getItem("unTagTotal")) - 1
        );
        localStorage.setItem(
          "tagedTotal",
          parseInt(localStorage.getItem("tagedTotal")) + 1
        );
        localStorage.setItem("result", JSON.stringify(result));
        window.location.href = "../coin_annotation_tool.html?type=unTag";
      } else {
        localStorage.setItem(
          "tagedTotal",
          parseInt(localStorage.getItem("tagedTotal")) - 1
        );
        localStorage.setItem(
          "checkedTotal",
          parseInt(localStorage.getItem("checkedTotal")) + 1
        );
        result[urlIndex].checked = true;
        localStorage.setItem("result", JSON.stringify(result));
        window.location.href = "../coin_annotation_tool.html?type=taged";
      }
    } else {
      localStorage.setItem("result", JSON.stringify(result));
    }
  }
}
function tagInfoToBe(tagInfo) {
  var table = "";
  if (tagInfo.length > 0) {
    table +=
      "<table class='table'><thead><th>TagID</th><th>Tag</th><th>Start</th><th>End</th>";
    for (var i in tagInfo) {
      if (tagInfo[i].start == tagInfo[i].end) {
        table +=
          "<tr style='color:red;font-weight:bolder' onclick='goHere(this," +
          JSON.stringify(tagInfo[i]) +
          ")'>";
      } else {
        table +=
          "<tr onclick='goHere(this," + JSON.stringify(tagInfo[i]) + ")'>";
      }
      for (var key in tagInfo[i]) {
        if (key == "start" || key == "end") {
          table += "<td>" + tagInfo[i][key] + "s</td>";
        } else {
          table += "<td>" + tagInfo[i][key] + "</td>";
        }
      }
      table += "</tr>";
    }
    table += "<table>";
  }
  return table;
}
function goHere(self, tagInfo) {
  var index = $(self)[0].rowIndex;
  var className = $(self)
    .parent()
    .parent()
    .parent()
    .parent()
    .parent()[0].className;
  if (className == "modelRight") {
    changeSeek(
      parseFloat(tagInfo.start).toFixed(0),
      parseFloat(tagInfo.end).toFixed(0),
      index,
      true
    );
  } else if (className == "tagRight") {
    var start = parseFloat(tagInfo.start);
    var end = parseFloat(tagInfo.end);
    var item = start;
    if (start >= end) {
      start = end;
      end = item;
    }
    var arr = [];
    for (var j = start; j < end + 1; j++) {
      arr.push(j);
    }
    var newArr = [];
    for (var i = 0; i < framesArr.length; i++) {
      if (framesArr[i][2] >= start && framesArr[i][2] <= end) {
        newArr.push(i);
      }
    }
    activeImg = newArr;
    $(".delTagBtn").show();
    $(".tagLeft").scrollTop(0);
    var fileDivs = document.getElementsByClassName("fileDiv");
    for (var i = 0; i < fileDivs.length; i++) {
      var id =
        fileDivs[i].children[0].children[0].children[0].children[1].children[0]
          .innerText;
      if (tagInfo.start - id == 0) {
        var top = $(fileDivs[i]).position().top - 50;
        $(".tagLeft").scrollTop(top);
      }
    }
  }
}
function saveInfo(flag) {
  var oldState = result[urlIndex].state;
  if (!flag) {
    var time = $(".time");
    var imgs = $("img.miniImg");
    var tags = $(".tag");
    var newTagInfo = [];
    for (var i = 0; i < imgs.length; i++) {
      if (tags[i].id) {
        var obj = {
          tagId: tags[i].id,
          tag: tags[i].innerText,
          frameData: [parseFloat(time[i].innerText)]
        };
        newTagInfo.push(obj);
      }
    }
    result[urlIndex].tagInfo = format(newTagInfo);
    var table = tagInfoToBe(result[urlIndex].tagInfo);
    $(".result").html("");
    $(".result").append(table);
  } else {
    var answer = confirm("Save successfully, return to the home page ?");
    if (answer) {
      result[urlIndex].times++;
      result[urlIndex].state = 1;
      if (oldState == 0) {
        localStorage.setItem(
          "unTagTotal",
          parseInt(localStorage.getItem("unTagTotal")) - 1
        );
        localStorage.setItem(
          "tagedTotal",
          parseInt(localStorage.getItem("tagedTotal")) + 1
        );
        localStorage.setItem("result", JSON.stringify(result));
        window.location.href = "../coin_annotation_tool.html?type=unTag";
      } else {
        localStorage.setItem(
          "tagedTotal",
          parseInt(localStorage.getItem("tagedTotal")) - 1
        );
        localStorage.setItem(
          "checkedTotal",
          parseInt(localStorage.getItem("checkedTotal")) + 1
        );
        result[urlIndex].checked = true;
        localStorage.setItem("result", JSON.stringify(result));
        window.location.href = "../coin_annotation_tool.html?type=taged";
      }
    } else {
      localStorage.setItem("result", JSON.stringify(result));
    }
  }
}

function format(arr) {
  var result = [];
  if (arr.length > 0) {
    var result = [];
    var tagInfoArr = [];
    var obj = {
      tagId: arr[0].tagId,
      tag: arr[0].tag,
      frameData: arr[0].frameData.concat()
    };
    tagInfoArr.push(obj);
    for (var i = 1; i < arr.length; i++) {
      var repeat = false;
      for (var j = 0; j < tagInfoArr.length; j++) {
        if (arr[i].tagId == tagInfoArr[j].tagId) {
          repeat = true;
          tagInfoArr[j].frameData.push(arr[i].frameData[0]);
        }
      }
      if (!repeat) {
        tagInfoArr.push(arr[i]);
      }
    }
    for (var i in tagInfoArr) {
      var frameData = tagInfoArr[i].frameData.concat();
      var data = dispart(frameData);
      var index = 0;
      for (var j = 0; j < data.length; j++) {
        var start = index;
        var end = index;
        if (data[j] != -1) {
          end = j;
        } else {
          index = parseFloat(j) + 1;
          end = parseFloat(j) - 1;
          result.push({
            tagId: tagInfoArr[i].tagId,
            tag: tagInfoArr[i].tag,
            start: data[start],
            end: data[end]
          });
        }
      }
      result.push({
        tagId: tagInfoArr[i].tagId,
        tag: tagInfoArr[i].tag,
        start: data[start],
        end: data[end]
      });
    }
  }
  return result.sort(compare("start"));
}
function compare(property) {
  return function(a, b) {
    var value1 = a[property];
    var value2 = b[property];
    return value1 - value2;
  };
}
function dispart(arr) {
  var cnt = 0;
  var index = 0;
  var j = 0,
    i;
  var newArr = [arr[0]];
  var start = arr[0];
  for (var i = 1; i < arr.length; i++) {
    if (arr[i] - start != newSpace) {
      newArr.push(-1);
    }
    newArr.push(arr[i]);
    start = arr[i];
  }
  return newArr;
}

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
function cloneObj(obj) {
  var str,
    newobj = obj.constructor === Array ? [] : {};
  if (typeof obj !== "object") {
    return;
  } else if (window.JSON) {
    (str = JSON.stringify(obj)), (newobj = JSON.parse(str));
  } else {
    for (var i in obj) {
      newobj[i] = typeof obj[i] === "object" ? cloneObj(obj[i]) : obj[i];
    }
  }
  return newobj;
}
function delVideo(e) {
  var answer = confirm("Are you sure to delete the video?");
  if (answer == true) {
    var oldState = result[urlIndex].state;
    result[urlIndex].times++;
    result[urlIndex].state = 2;
    if (oldState == 0) {
      localStorage.setItem(
        "unTagTotal",
        parseInt(localStorage.getItem("unTagTotal")) - 1
      );
      localStorage.setItem(
        "delTagTotal",
        parseInt(localStorage.getItem("delTagTotal")) + 1
      );
      localStorage.setItem("result", JSON.stringify(result));
      window.location.href = "../coin_annotation_tool.html?type=unTag";
    } else {
      localStorage.setItem(
        "tagedTotal",
        parseInt(localStorage.getItem("tagedTotal")) - 1
      );
      localStorage.setItem(
        "delTagTotal",
        parseInt(localStorage.getItem("delTagTotal")) + 1
      );
      localStorage.setItem("result", JSON.stringify(result));
      window.location.href = "../coin_annotation_tool.html?type=taged";
    }
  }
}
