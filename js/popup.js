
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === 'showPasswordPopup') {
    // console.log(`popup page request.message is ${request.message}`);

    // Fetch the customPopup.html content

  }
});




function checkPassword() {
  // Implement your password checking logic here
  // You can use the existing code or customize it based on your needs
  const enteredPassword = document.getElementById('passwordInput').value;

  // Retrieve stored password
  chrome.storage.sync.get(['extensionPassword'], function (result) {
    const storedPassword = result.extensionPassword;

    if (enteredPassword === storedPassword) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.remove(tabs[0].id);
      });
    } else {
      alert('Incorrect password. Please try again.');
    }
  });
}
