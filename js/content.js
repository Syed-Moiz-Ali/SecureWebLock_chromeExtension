// content.js
// console.log('Content Script Loaded');

chrome.storage.sync.get(["restrictedWebsites"], function (result) {
  //   console.log('Checking restricted websites');
  const restrictedWebsites = result.restrictedWebsites || [];
  //   console.log(`restrictedWebsites is ${restrictedWebsites}`);
  const currentWebsite = window.location.hostname;
  //   console.log(`currentWebsite is ${currentWebsite}`);
  const extensionStoredPassword = sessionStorage.getItem(
    "extensionStoredPassword"
  );
  //   console.log(`extensionStoredPassword is ${extensionStoredPassword}`)
  if (extensionStoredPassword !== null) {
    //   console.log('password was stored previously')
  } else {
    if (
      restrictedWebsites.some((website) =>
        currentWebsite.includes(new URL(website).hostname)
      )
    ) {
      // console.log('Sending message to background script');
      chrome.runtime.sendMessage({ message: "showPasswordPopup" });

      // Create a container div for the background styles

      const screenWidth = window.screen.width;
      const screenHeight = window.screen.height;
      const backgroundContainer = document.createElement("div");
      backgroundContainer.id = "backgroundContainer";
      backgroundContainer.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
      backgroundContainer.style.backdropFilter = "blur(5px)";
      backgroundContainer.style.position = "fixed";
      backgroundContainer.style.top = "0";
      backgroundContainer.style.left = "0";
      backgroundContainer.style.width = `${screenWidth}px`;
      backgroundContainer.style.height = `${screenHeight}px`;
      backgroundContainer.style.zIndex = "999";
      document.body.appendChild(backgroundContainer);

      fetch(chrome.runtime.getURL("/html/custom.html"))
        .then((response) => response.text())
        .then((html) => {
          // Create a container div for the popup
          const popupContainer = document.createElement("div");
          popupContainer.id = "popupContainer";
          popupContainer.style.position = "fixed";
          // popupContainer.style.top = '50%';
          // popupContainer.style.left = '50%';
          // popupContainer.style.transform = 'translate(-50%, -50%)';
          // popupContainer.style.backgroundColor = 'white';
          // popupContainer.style.padding = '30px';
          // popupContainer.style.borderRadius = '10px';
          popupContainer.style.zIndex = "10000"; // Ensure popup appears above background
          popupContainer.innerHTML = html;

          // Append the popup container to the body
          document.body.appendChild(popupContainer);

          // Now, you can interact with the elements in the custom password popup
          const cancelButton = document.getElementById("customCancelButton");
          const okButton = document.getElementById("customOkButton");
          const customPasswordInput = document.getElementById(
            "customPasswordInput"
          );

          if (!cancelButton || !okButton || !customPasswordInput) {
            console.error("Error: One or more elements not found.");
            return;
          }

          cancelButton.addEventListener("click", function () {
            // Remove the custom password popup and background container from the body
            const customPasswordPopup =
              document.getElementById("popupContainer");
            if (customPasswordPopup) {
              document.body.removeChild(customPasswordPopup);
            }

            const backgroundContainer = document.getElementById(
              "backgroundContainer"
            );
            if (backgroundContainer) {
              document.body.removeChild(backgroundContainer);
            }

            // Remove the tab
            chrome.runtime.sendMessage({ message: "closeTab" });
          });

          // Function to handle clicking on the "OK" button
          const handleOkButtonClick = function () {
            // Handle custom password verification here
            const enteredCustomPassword = customPasswordInput.value;

            // Example: Check if enteredCustomPassword is valid
            chrome.storage.sync.get(["extensionPassword"], function (result) {
              // console.log(`result is ${JSON.stringify(result)}`);
              const storedPassword = result.extensionPassword;
              if (storedPassword !== undefined) {
                // console.log(`Stored Password: ${storedPassword}`);
                // Now you can compare storedPassword with enteredCustomPassword
                if (enteredCustomPassword === storedPassword) {
                  sessionStorage.setItem(
                    "extensionStoredPassword",
                    enteredCustomPassword
                  );
                  const customPasswordPopup =
                    document.getElementById("popupContainer");
                  const backgroundContainerId = document.getElementById(
                    "backgroundContainer"
                  );
                  if (customPasswordPopup) {
                    document.body.removeChild(customPasswordPopup);
                    document.body.removeChild(backgroundContainerId);
                  }
                } else {
                  alert("entered password is wrong");
                }
              } else {
                alert("first add the password");
                // console.log('Password not found in storage.');
              }
            });
          };

          // Add event listener to the "OK" button
          okButton.addEventListener("click", handleOkButtonClick);

          // Add event listener to input field to listen for Enter key press
          customPasswordInput.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
              handleOkButtonClick();
            }
          });
        });
    } else {
      // console.log('No restricted websites found')
    }
  }
});
