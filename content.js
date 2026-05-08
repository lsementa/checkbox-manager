function getCheckboxLabel(el) {
    const ariaLabel = el.getAttribute('aria-label');
    if (ariaLabel) return ariaLabel.trim();

    const labelledBy = el.getAttribute('aria-labelledby');
    if (labelledBy) {
        const text = labelledBy.split(/\s+/)
            .map(id => document.getElementById(id)?.textContent.trim())
            .filter(Boolean).join(' ');
        if (text) return text;
    }

    if (el.title) return el.title.trim();

    if (el.id) {
        const forLabel = document.querySelector(`label[for="${el.id}"]`);
        if (forLabel) return forLabel.textContent.trim();
    }

    const wrapLabel = el.closest('label');
    if (wrapLabel) return wrapLabel.textContent.trim();

    let next = el.nextSibling;
    while (next) {
        if (next.nodeType === Node.TEXT_NODE && next.textContent.trim()) {
            return next.textContent.trim();
        }
        if (next.nodeType === Node.ELEMENT_NODE) {
            return next.textContent.trim();
        }
        next = next.nextSibling;
    }

    return el.textContent.trim();
}

function matchesCriteria(name, { startsWith, contains, doesNotInclude }) {
    const n = name.toLowerCase();
    return (
        (!startsWith || n.startsWith(startsWith.toLowerCase())) &&
        (!contains || n.includes(contains.toLowerCase())) &&
        (!doesNotInclude || !n.includes(doesNotInclude.toLowerCase()))
    );
}

// Use the native setter so React-controlled inputs pick up the change
const nativeCheckedSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'checked')?.set;

function setNativeCheckbox(el, checked) {
    if (el.checked === checked) return;
    if (nativeCheckedSetter) {
        nativeCheckedSetter.call(el, checked);
    } else {
        el.checked = checked;
    }
    el.dispatchEvent(new Event('change', { bubbles: true }));
    el.dispatchEvent(new Event('input', { bubbles: true }));
}

function setAriaCheckbox(el, checked) {
    const isChecked = el.getAttribute('aria-checked') === 'true';
    if (isChecked !== checked) {
        el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const { action, data } = message;
    if (action !== 'checkAll' && action !== 'uncheckAll') {
        sendResponse({ status: 'unknown' });
        return;
    }

    const checked = action === 'checkAll';
    const hasFilter = data.startsWith || data.contains || data.doesNotInclude;

    // Native checkboxes (handles plain HTML and custom-styled ones from MUI, Ant Design, etc.)
    document.querySelectorAll('input[type="checkbox"]').forEach((el) => {
        if (el.disabled || el.hasAttribute('disabled')) return;
        if (hasFilter) {
            const name = getCheckboxLabel(el);
            if (!name || !matchesCriteria(name, data)) return;
        }
        setNativeCheckbox(el, checked);
    });

    // ARIA checkboxes and toggle switches (custom components, headless UI, etc.)
    document.querySelectorAll('[role="checkbox"], [role="switch"]').forEach((el) => {
        if (el.tagName.toLowerCase() === 'input') return; // already handled above
        if (el.getAttribute('aria-disabled') === 'true') return;
        if (hasFilter) {
            const name = getCheckboxLabel(el);
            if (!name || !matchesCriteria(name, data)) return;
        }
        setAriaCheckbox(el, checked);
    });

    sendResponse({ status: 'success' });
});
