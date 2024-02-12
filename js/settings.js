document.addEventListener("DOMContentLoaded", function () {
  // Check if a previous password exists in Chrome storage
  chrome.storage.sync.get("extensionPassword", function (result) {
    const previousPassword = result.extensionPassword;
    if (!previousPassword) {
      // If no previous password exists, show only the "New Password" input and button
      document.getElementById("newPassword").style.display = "block";
      document.getElementById("previousPassword").style.display = "none";
      document.getElementById("savePasswordBtn").style.display = "block";
      document.getElementById("savePasswordBtn").innerText = "Set Password";
      document.querySelector("h2").innerText = "Set New Password";
      // Add event listener to the "Save Password" button
      document
        .getElementById("savePasswordBtn")
        .addEventListener("click", saveNewPassword);
      console.log("newPassword");
    } else {
      // If a previous password exists, show the "Previous Password" input and "New Password" input and button
      document.getElementById("previousPassword").style.display = "block";
      document.getElementById("newPassword").style.display = "block";
      document.getElementById("savePasswordBtn").style.display = "block";
      document.getElementById("savePasswordBtn").innerText = "Change Password";
      document.querySelector("h2").innerText = "Change Password";
      // Add event listener to the "Save Password" button
      document
        .getElementById("savePasswordBtn")
        .addEventListener("click", savePassword);
      console.log("previousPassword");
    }
    if (!previousPassword) {
      document
        .getElementById("newPassword")
        .addEventListener("keypress", function (event) {
          if (event.key === "Enter") {
            console.log("keypress newPassword" + `${event.key}`);
            saveNewPassword();
          }
        });
    } else {
      document
        .getElementById("previousPassword")
        .addEventListener("keypress", function (event) {
          if (event.key === "Enter") {
            console.log("keypress previousPassword" + `${event.key}`);

            savePassword();
          }
        });
    }
  });

  // Add event listener to the "Close" link
  document
    .getElementById("closeSettingsLink")
    .addEventListener("click", closeSettings);
  document
    .getElementById("PasswordIcon")
    .addEventListener("click", togglePasswordVisibility);
});

function savePassword() {
  const previousPassword = document.getElementById("previousPassword").value;
  const newPassword = document.getElementById("newPassword").value;
  console.log(`previousPassword is ${newPassword}`);
  // Check if the previous password matches the one stored in Chrome storage
  chrome.storage.sync.get("extensionPassword", function (result) {
    const storedPassword = result.extensionPassword;
    if (previousPassword === storedPassword) {
      // Save the new password if the previous password matches
      if (newPassword.length >= 8) {
        chrome.storage.sync.set(
          { extensionPassword: newPassword },
          function () {
            alert("Password changed successfully!");
            // Close the settings tab after saving the new password
            window.close();
          }
        );
      } else {
        alert("Password must be at least 8 characters long.");
      }
    } else {
      alert("Incorrect previous password. Please try again.");
    }
  });
}

function saveNewPassword() {
  const newPassword = document.getElementById("newPassword").value;
  console.log(`newPassword is ${newPassword}`);

  if (newPassword.length >= 8) {
    // Password meets the length requirement, proceed to save
    chrome.storage.sync.set({ extensionPassword: newPassword }, function () {
      alert("Password saved successfully!");
      // Close the settings tab after saving the new password
      window.close();
    });
  } else {
    // Password does not meet the length requirement, show alert
    alert("Password must be at least 8 characters long.");
  }
}

function closeSettings() {
  window.close();
}
function togglePasswordVisibility() {
  var previousPasswordInput = document.getElementById("previousPassword");
  var newPasswordInput = document.getElementById("newPassword");
  var passwordIcon = document.querySelector(".password-icon");

  if (previousPasswordInput.type === "password") {
    previousPasswordInput.type = "text";
    newPasswordInput.type = "text";
    passwordIcon.classList.remove("fa-eye-slash");
    passwordIcon.classList.add("fa-eye");
  } else {
    previousPasswordInput.type = "password";
    newPasswordInput.type = "password";
    passwordIcon.classList.remove("fa-eye");
    passwordIcon.classList.add("fa-eye-slash");
  }
}
