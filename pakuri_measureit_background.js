chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.sendMessage(tab.id, { cmd: "measurIt" }, function handler(response) {
        if (response.res == "ok") {
        }
    });
});