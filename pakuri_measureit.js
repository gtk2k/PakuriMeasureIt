/// <reference path="jquery-1.8.3.min.js"/>
var started = false;
var startX = 0;
var startY = 0;
var x, y, w, h;
var pxDispWidth = 100, pxDispHeight = 20;
var timerId = null, timerId2 = null;
var bodyMarginH = $("body").css("margin");
var bodyMarginV = bodyMarginV;
if (!bodyMarginH) {
    bodyMargin = parseInt($("body").css("marginLeft")) + parseInt($("body").css("marginRight"));
} else {
    bodyMarginH = bodyMarginV = parseInt(bodyMarginH) * 2;
}
var cnv = null;
var ctx = null;


$(document).on("keydown", function(e){
    if (e.keyCode === 27) {
        $("#chm_ext_pkrmi_pxdisp").remove();
        $("#chm_ext_pkrmi_cnv").remove();
        $(".chm_ext_marching_ants").remove();
        cnv = null;
    }
});
$(window).resize(function (e) {
    if (timerId) {
        clearTimeout(timerId);
        timerId = null;
    }
    timerId = setTimeout(function () {
        cnvResize();
    }, 80);
});
$("<span>")
    .attr("id", "chm_ext_pkrmi_pxdisp")
    .css("display", "none")
    .appendTo($("body"));
$("<div>")
    .attr("id", "chm_ext_pkrmi_marching_ants_left")
    .addClass("chm_ext_marching_ants")
    .width(1)
    .appendTo($("body"));
$("<div>")
    .attr("id", "chm_ext_pkrmi_marching_ants_right")
    .addClass("chm_ext_marching_ants")
    .width(1)
    .appendTo($("body"));
$("<div>")
    .attr("id", "chm_ext_pkrmi_marching_ants_top")
    .addClass("chm_ext_marching_ants")
    .height(1)
    .appendTo($("body"));
$("<div>")
    .attr("id", "chm_ext_pkrmi_marching_ants_bottom")
    .addClass("chm_ext_marching_ants")
    .height(1)
    .appendTo($("body"));

function addMaskCanvas() {
    var pxDispPos = "top";
    
    cnv = $("<canvas>")
        .width(document.body.offsetWidth)
        .height(document.body.offsetHeight)
        .mousedown(function (e) {
            started = true;
            startX = e.offsetX;
            startY = e.offsetY;
            w = h = 0;
            var pxDispTop = startY - pxDispHeight;
            if(pxDispTop < 0){
                pxDispPos = "bottom";
                pxDispTop = 0;
            }
            ctx.clearRect(0, 0, this.offsetWidth, this.offsetHeight);
            ctx.fillRect(0, 0, this.offsetWidth, this.offsetHeight);
            $("#chm_ext_pkrmi_marching_ants_left").height(0);
            $("#chm_ext_pkrmi_marching_ants_right").height(0);
            $("#chm_ext_pkrmi_marching_ants_top").width(0);
            $("#chm_ext_pkrmi_marching_ants_bottom").width(0);
            $("#chm_ext_pkrmi_pxdisp")
                .css({
                    left: startX,
                    top: pxDispTop,
                    display: ""
                })
                .text("0x0");
        })
        .mousemove(function (e) {
            if (!started) return;
            var oX = e.offsetX;
            var oY = e.offsetY;
            if (oX < startX) x = oX; else x = startX;
            if (oY < startY) y = oY; else y = startY;
            w = abs2(oX - startX);
            h = abs2(oY - startY);
            ctx.clearRect(0, 0, this.offsetWidth, this.offsetHeight);
            ctx.fillRect(0, 0, this.offsetWidth, this.offsetHeight);
            if (!w || !h) return;
            ctx.clearRect(x, y, w, h);
            $("#chm_ext_pkrmi_marching_ants_left")
                .css({
                    left: x,
                    top: y
                })
                .height(h);
            $("#chm_ext_pkrmi_marching_ants_right")
                .css({
                    left: x + w - 1,
                    top: y
                })
                .height(h);
            $("#chm_ext_pkrmi_marching_ants_top")
                .css({
                    left: x,
                    top: y
                })
                .width(w);
            $("#chm_ext_pkrmi_marching_ants_bottom")
                .css({
                    left: x,
                    top: y + h -1
                })
                .width(w);
                
            var pxDispLeft = x;
            var pxDispTop = y - pxDispHeight;
            if (startX < oX) {
                if (w > pxDispWidth + 20) {
                    pxDispLeft = x + w - pxDispWidth - 1;
                } else {
                    pxDispLeft = x + 1;
                }
            }else{
                if (w > pxDispWidth + 20) {
                    pxDispLeft = x + 1;
                } else {
                    pxDispLeft = x - pxDispWidth - 1;
                }
            }
            if (startY < oY) {
                if (h > pxDispHeight + 20) {
                    pxDispTop = y + h - pxDispHeight - 1;
                } else {
                    pxDispTop = y + 1;
                }
            } else {
                if (h > pxDispHeight + 20) {
                    pxDispTop = y + 1;
                } else {
                    pxDispTop = y - pxDispHeight - 1;
                }
            }
            $("#chm_ext_pkrmi_pxdisp")
                .css({ 
                    left: pxDispLeft, 
                    top: pxDispTop,
                    display: ""
                })
                .text(w + "x" + h);
        })
        .mouseup(function (e) {
            started = false;
            $("#chm_ext_pkrmi_pxdisp").text(w + "x" + h);
        })
        .attr({
            id: "chm_ext_pkrmi_cnv",
        })
        .appendTo($("body"))[0];
    ctx = cnv.getContext("2d");
    cnvResize();
    //var cnvWidth = document.body.offsetWidth + bodyMarginH;
    //var cnvHeight = document.body.offsetHeight + bodyMarginV;
    //ctx.clearRect(0, 0, cnvWidth, cnvHeight);
    //ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    //ctx.fillRect(0, 0, cnvWidth, cnvHeight);
}

function cnvResize() {
    var cnvWidth = document.body.offsetWidth + bodyMarginH;
    var cnvHeight = document.body.offsetHeight + bodyMarginV;
    $("#chm_ext_pkrmi_cnv")
        .attr({
            width: cnvWidth,
            height: cnvHeight
        })
        .width(document.body.offsetWidth + bodyMarginH)
        .height(document.body.offsetHeight + bodyMarginV);
    if (ctx) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        ctx.fillRect(0, 0, cnvWidth, cnvHeight);
        ctx.clearRect(x, y, w, h);
    }
}

function abs2(x) {
    var b = x >> 31;
    return (x ^ b) - b;
}

chrome.extension.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.cmd == "measurIt") {
        addMaskCanvas();
    }
    sendResponse({ res: "ok" });
});