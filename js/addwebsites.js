// addwebsites.js
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('saveWebsitesButton').addEventListener('click', saveWebsites);
    document.getElementById('closeAddWebsitesButton').addEventListener('click', closeAddWebsites);
    function saveWebsites() {
      const websitesInput = document.getElementById('websitesInput').value;
      const newWebsitesArray = websitesInput.split(',').map(website => website.trim());
    
      // Fetch existing restricted websites array from Chrome storage
      chrome.storage.sync.get('restrictedWebsites', function (result) {
          const existingWebsitesArray = result.restrictedWebsites || [];
    
          // Concatenate the new websites array with the existing one
          const updatedWebsitesArray = existingWebsitesArray.concat(newWebsitesArray);
    
          // Remove duplicates (if any)
          const uniqueWebsitesArray = Array.from(new Set(updatedWebsitesArray));
    
          // Save the updated array back to Chrome storage
          chrome.storage.sync.set({ 'restrictedWebsites': uniqueWebsitesArray }, function () {
              alert('Websites saved successfully!');
              // Close the add websites tab after saving
              window.close();
          });
      });
    }
    
    
    function closeAddWebsites() {
      window.close();
    }
  });
  
  