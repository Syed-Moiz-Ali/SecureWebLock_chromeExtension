// addwebsites.js
document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("saveWebsitesButton")
    .addEventListener("click", saveWebsites);
  document
    .getElementById("closeAddWebsitesButton")
    .addEventListener("click", closeAddWebsites);

  document
    .getElementById("websitesInput")
    .addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        saveWebsites();
      }
    });
});
function saveWebsites() {
  const websitesInput = document.getElementById("websitesInput").value;
  const newWebsitesArray = websitesInput
    .split(",")
    .map((website) => website.trim());

  // Fetch existing restricted websites array from Chrome storage
  chrome.storage.sync.get("restrictedWebsites", function (result) {
    const existingWebsitesArray = result.restrictedWebsites || [];
    const duplicateWebsites = newWebsitesArray.filter((newWebsite) =>
      existingWebsitesArray.includes(newWebsite)
    );

    if (duplicateWebsites.length > 0) {
      // Alert if there are duplicate websites
      alert(
        "The following website(s) already exist in the list: " +
          duplicateWebsites.join(", ")
      );
    } else {
      // Concatenate the new websites array with the existing one
      const updatedWebsitesArray =
        existingWebsitesArray.concat(newWebsitesArray);

      // Remove duplicates (if any)
      const uniqueWebsitesArray = Array.from(new Set(updatedWebsitesArray));

      // Save the updated array back to Chrome storage
      chrome.storage.sync.set(
        { restrictedWebsites: uniqueWebsitesArray },
        function () {
          alert("Websites saved successfully!");
          // Close the add websites tab after saving
          window.close();
        }
      );
    }
  });
}

function closeAddWebsites() {
  window.close();
}
