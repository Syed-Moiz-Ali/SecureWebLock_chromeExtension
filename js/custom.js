// customPopup.js
document.addEventListener('DOMContentLoaded', function () {
    const cancelButton = document.getElementById('customCancelButton');
    const okButton = document.getElementById('customOkButton');
    const customPasswordInput = document.getElementById('customPasswordInput');
  
    cancelButton.addEventListener('click', function () {
      // Remove the custom password popup from the body
      document.body.removeChild(document.getElementById('customPasswordPopup'));
  
      // Remove the tab
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.remove(tabs[0].id);
      });
    });
  
    okButton.addEventListener('click', function () {
      // Handle custom password verification here
      const enteredCustomPassword = customPasswordInput.value;
  
      // Example: Check if enteredCustomPassword is valid
      chrome.storage.sync.get(['extensionPassword'], function (result) {
        // console.log(`result is ${JSON.stringify(result)}`);
        const storedPassword = result.extensionPassword;
        if (storedPassword !== undefined) {
          // console.log(`Stored Password: ${storedPassword}`);
          // Now you can compare storedPassword with enteredCustomPassword
          if (enteredCustomPassword === storedPassword) {
            sessionStorage.setItem('extensionStoredPassword',enteredCustomPassword);
              document.body.removeChild(document.getElementById('customPasswordPopup'));
          } else {
            // console.log('Incorrect password. Please try again.');
            // alert('Incorrect password. Please try again.');
          }
        } else {
          // console.log('Password not found in storage.');
          alert('first add the password')
        }
      });
      
  
      // Remove the custom password popup from the body
    });
  });
  