// background.js
console.log('Background Script Loaded');

chrome.runtime.onInstalled.addListener(function () {
  console.log('Extension Installed');
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log('Message received by background script:', request.message);

  if (request.message === 'restrictedPageDetected') {
    console.log('Restricted Page Detected. Waiting for page load.');

    chrome.webNavigation.onBeforeNavigate.addListener(function (details) {
      console.log('Cancelling navigation to prevent content loading.');
      chrome.tabs.update(details.tabId, { url: 'chrome://newtab' });
    }, { url: [{ hostContains: '' }] });

    chrome.webNavigation.onCompleted.addListener(function (details) {
      console.log('Page fully loaded. Sending message to content script.');
      chrome.tabs.sendMessage(details.tabId, { message: 'showPasswordPopup' });
    }, { url: [{ hostContains: '' }] });
  }
  if (request.message === 'closeTab') {
    console.log(`message.message is ${request.message}`);
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.remove(tabs[0].id);
    });
    // window.close()
}
});
