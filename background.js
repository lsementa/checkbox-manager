chrome.action.onClicked.addListener(async (tab) => {
    try {
        // Dynamically inject content.js into the active tab
        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["content.js"],
        });
    } catch (error) {
        console.error("Failed to inject content script:", error);
    }
});
