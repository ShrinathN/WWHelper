// background.js

// Event listener for messages from content scripts or other parts of the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'summarise_request') {

        //sending receipt
        sendResponse({ received: true });

        //getting and sending summary
        send_prompt("The participants are talking about ", create_summarise_prompt(message.data), send_summary_response);

    } else if (message.action === 'generate_request') {

        //sending receipt
        sendResponse({ received: true });

        //getting and sending summary
        send_prompt("", create_generate_prompt(message.data), send_generate_response);

    }
});

function send_summary_response(response) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'summarise_result', data: response });
    });
}

function send_generate_response(response) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'generate_result', data: response });
    });
}

function send_prompt(text_to_add, prompt, callback) {
    const postData = {
        "max_context_length": 1700,
        "max_length": 150,
        "prompt": prompt,
        "quiet": true,
        "rep_pen": 1.1,
        "rep_pen_range": 320,
        "rep_pen_slope": 0.7,
        "temperature": 2.0,
        "tfs": 1,
        "top_a": 0,
        "top_k": 100,
        "top_p": 0.92,
        "typical": 1,
        "sampler_order": [6, 0, 1, 3, 4, 2, 5],
        "min_p": 0,
        "dynatemp_range": 0,
        "dynatemp_exponent": 1,
        "smoothing_factor": 0,
        "presence_penalty": 0,
    };

    // Make the POST request
    fetch('http://127.0.0.1:8080/api/v1/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    })
        .then((response) => response.json())
        .then((data) => {
            console.log('Received data from POST request:', data.results[0].text);
            callback(text_to_add + data.results[0].text);
        })
        .catch((error) => {
            console.error('Error making POST request:', error);
        });
}


function create_summarise_prompt(data) {
    let base_prompt = "Given the below text messages from two individuals, generate a summary. Using context clues, vocabulary and grammar to deduce the subject of conversation.\n";
    let final_prompt = base_prompt + data + "\n---\nThe participants are talking about";
    return final_prompt;
}

function create_generate_prompt(data) {
    let base_prompt = "Given the below text messages from two individuals, predict the next line for the user \"You\". Using context clues, vocabulary and grammar to deduce the subject of conversation. Generate only a single comment.\n";
    let final_prompt = base_prompt + data + "\n---\nYou: ";
    return final_prompt;
}