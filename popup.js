function flashButton(btn) {
  if (btn.dataset.flashing) return;
  btn.dataset.flashing = '1';
  const original = btn.innerHTML;
  btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Done!`;
  btn.style.opacity = '0.75';
  setTimeout(() => {
    btn.innerHTML = original;
    btn.style.opacity = '';
    delete btn.dataset.flashing;
  }, 1500);
}

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

document.getElementById("checkAll").addEventListener("click", (e) => {
  const startsWith = document.getElementById("startsWith").value.trim();
  const contains = document.getElementById("contains").value.trim();
  const doesNotInclude = document.getElementById("doesNotInclude").value.trim();
  sendMessageToContentScript("checkAll", { startsWith, contains, doesNotInclude });
  flashButton(e.currentTarget);
});

document.getElementById("uncheckAll").addEventListener("click", (e) => {
  const startsWith = document.getElementById("startsWith").value.trim();
  const contains = document.getElementById("contains").value.trim();
  const doesNotInclude = document.getElementById("doesNotInclude").value.trim();
  sendMessageToContentScript("uncheckAll", { startsWith, contains, doesNotInclude });
  flashButton(e.currentTarget);
});

// To clear form fields
document.getElementById('clearButton').addEventListener('click', () => {
  const form = document.getElementById('criteria-form');
  if (form) {
    form.reset();
  }
});

