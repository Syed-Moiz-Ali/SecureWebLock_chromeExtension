// websitelist.js
document.addEventListener('DOMContentLoaded', function () {
  chrome.storage.sync.get(['restrictedWebsites'], function (result) {
    const restrictedWebsites = result.restrictedWebsites || [];
    const websiteList = document.getElementById('websiteList');

    if (restrictedWebsites.length === 0) {
      const listItem = document.createElement('li');
      listItem.textContent = 'No websites added to the restricted list.';
      websiteList.appendChild(listItem);
    } else {
      restrictedWebsites.forEach(function (website) {
        const listItem = document.createElement('li');
        listItem.textContent = website;

        // Add delete button
        const deleteBtn = document.createElement('span');
        deleteBtn.textContent = ' ❌'; // Unicode character for 'x'
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', function () {
          deleteWebsite(website);
          listItem.remove();
        });

        listItem.appendChild(deleteBtn);
        websiteList.appendChild(listItem);
      });
    }
  });
});

function deleteWebsite(website) {
  chrome.storage.sync.get(['restrictedWebsites'], function (result) {
    const restrictedWebsites = result.restrictedWebsites || [];
    const updatedWebsites = restrictedWebsites.filter(w => w !== website);

    chrome.storage.sync.set({ 'restrictedWebsites': updatedWebsites }, function () {
      // console.log('Website deleted:', website);
    });
  });
}

function closeWebsiteList() {
  window.close();
}
