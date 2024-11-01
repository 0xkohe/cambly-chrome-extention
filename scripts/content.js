$(document).ready(function () {
    // Get the target element to observe
	//
    const targetSelector = "#root > div > div:nth-of-type(2) > div:nth-of-type(2)"

    // Set up the MutationObserver
    const observer = new MutationObserver((mutations, observer) => {
        const targetDiv = document.querySelector(targetSelector);

        // Execute the process only if the target element is found
        if (targetDiv) {
            // Add the text area
            targetDiv.insertAdjacentHTML('beforeend', '<textarea id="myTextArea" placeholder="Enter text here" style="width: 80%; margin-top: 10px; resize: both; overflow: auto; field-sizing: content;"></textarea>');

            // Check if the current URL matches the specified format (ignoring GET parameters)
            const urlPattern = /^https:\/\/www\.cambly\.com\/en\/student\/tutors\/(\w+)/;
            const match = window.location.href.match(urlPattern);

            if (match) {
                const tutorId = match[1]; // Get the ID from the URL

                // Retrieve the value from chrome.storage and set it to the text area
                chrome.storage.local.get([tutorId], function (result) {
                    const savedText = result[tutorId];
                    if (savedText) {
                        $('#myTextArea').val(savedText); // Set the existing content to the text area
                    }
                });

                // Handle the blur event of the text area
                $('#myTextArea').on('blur', function () {
                    const text = $(this).val(); // Get the content of the text area
                    let data = {};
                    data[tutorId] = text;
                    chrome.storage.local.set(data, function () {
                        console.log('Text saved for tutorId: ' + tutorId);
                    });
                });
            }

            // Stop observing once the target DOM is found
            observer.disconnect();
        }
    });

    // Observe changes to the body element
    observer.observe(document.body, { childList: true, subtree: true });
});

