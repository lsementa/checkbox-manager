// Listen for messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const { action, data } = message;

    // Check all event
    if (action === "checkAll") {
        const { startsWith, contains, doesNotInclude } = data;

        // If empty fields check everything
        if (!startsWith && !contains && !doesNotInclude) {

            document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
                // Only process checkboxes that are NOT disabled
                if (!(checkbox.disabled || checkbox.hasAttribute("disabled"))) {
                    checkbox.checked = true;
                }
            });
        } else {

            // Each checkbox
            document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
                // Get the associated label
                const label =
                    checkbox.parentElement.tagName.toLowerCase() === 'label' // Handle wrapping label
                        ? checkbox.parentElement
                        : checkbox.nextSibling && checkbox.nextSibling.nodeType === Node.ELEMENT_NODE // Handle sibling label
                            ? checkbox.nextSibling
                            : document.querySelector(`label[for="${checkbox.id}"]`); // Handle 'for' attribute

                const name = label ? label.textContent.trim() : '';

                // Only process checkboxes that are NOT disabled
                if (!(checkbox.disabled || checkbox.hasAttribute("disabled"))) {
                    if (
                        name &&
                        (!startsWith || name.toLowerCase().startsWith(startsWith.toLowerCase())) &&
                        (!contains || name.toLowerCase().includes(contains.toLowerCase())) &&
                        (!doesNotInclude || !name.toLowerCase().includes(doesNotInclude.toLowerCase()))
                    ) {
                        checkbox.checked = true;
                    }
                }
            });
        }
    }

    // Uncheck all event
    if (action === "uncheckAll") {
        const { startsWith, contains, doesNotInclude } = data;

        // If empty fields uncheck everything
        if (!startsWith && !contains && !doesNotInclude) {
            document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
                // Only process checkboxes that are NOT disabled
                if (!(checkbox.disabled || checkbox.hasAttribute("disabled"))) {
                    checkbox.checked = false;
                }
            });
        } else {
            // Each checkbox
            document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
                // Get the associated label
                const label =
                    checkbox.parentElement.tagName.toLowerCase() === 'label' // Handle wrapping label
                        ? checkbox.parentElement
                        : checkbox.nextSibling && checkbox.nextSibling.nodeType === Node.ELEMENT_NODE // Handle sibling label
                            ? checkbox.nextSibling
                            : document.querySelector(`label[for="${checkbox.id}"]`); // Handle 'for' attribute

                const name = label ? label.textContent.trim() : '';

                // Only process checkboxes that are NOT disabled
                if (!(checkbox.disabled || checkbox.hasAttribute("disabled"))) {
                    if (
                        name &&
                        (!startsWith || name.toLowerCase().startsWith(startsWith.toLowerCase())) &&
                        (!contains || name.toLowerCase().includes(contains.toLowerCase())) &&
                        (!doesNotInclude || !name.toLowerCase().includes(doesNotInclude.toLowerCase()))
                    ) {
                        checkbox.checked = false;
                    }
                }
            });
        }
    }
    
    sendResponse({ status: "success" });
});


