function sendMessageToContentScript(action, data = {}) {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    if (tabs.length === 0) {
      console.error("No active tab found.");
      return;
    }

    const activeTabId = tabs[0].id;

    try {
      // Get the active tab's details
      const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
      // Check if the tab's URL is restricted
      if (!activeTab || !activeTab.url || 
          activeTab.url.startsWith("chrome://") || 
          activeTab.url.startsWith("about:") || 
          activeTab.url.startsWith("edge://")) {
          return; // Stop further execution
      }
  
      // Inject content script if the URL is valid
      await chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          files: ["content.js"],
      });
  
  } catch (error) {
      console.error("Error injecting content script:", error);
  }
  
    // Send the message
    chrome.tabs.sendMessage(activeTabId, { action, data }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error communicating with content script:", chrome.runtime.lastError.message);
      }
    });
  });
}

document.getElementById("checkAll").addEventListener("click", () => {
  const startsWith = document.getElementById("startsWith").value.trim();
  const contains = document.getElementById("contains").value.trim();
  const doesNotInclude = document.getElementById("doesNotInclude").value.trim();
  sendMessageToContentScript("checkAll", { startsWith, contains, doesNotInclude });
});

document.getElementById("uncheckAll").addEventListener("click", () => {
  const startsWith = document.getElementById("startsWith").value.trim();
  const contains = document.getElementById("contains").value.trim();
  const doesNotInclude = document.getElementById("doesNotInclude").value.trim();
  sendMessageToContentScript("uncheckAll", { startsWith, contains, doesNotInclude });
});

// To clear form fields
document.getElementById('clearButton').addEventListener('click', () => {
  const form = document.getElementById('criteria-form');
  if (form) {
    form.reset();
  }
});

