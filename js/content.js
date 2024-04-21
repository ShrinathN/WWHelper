// content.js


chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    console.log("Received message from background script:", message);
    alert(message.data);
  });


function send_summarise_request() {
    // Send a message with data to the background script
    chrome.runtime.sendMessage({ action: 'summarise_request', data: message_list_to_string(get_list_of_messages()) }, (response) => {
        // Callback function to handle the response from the background script
        if (response && response.received) {
            console.log('Data WEW successfully received summarise_request background script');
        } else {
            console.log('Background script did not confirm receipt of data');
        }
    });
}

function send_generate_request() {
    // Send a message with data to the background script
    chrome.runtime.sendMessage({ action: 'generate_request', data: message_list_to_string(get_list_of_messages()) }, (response) => {
        // Callback function to handle the response from the background script
        if (response && response.received) {
            console.log('Data WEW successfully received generate_request background script');
            console.log(response.data);
        } else {
            console.log('Background script did not confirm receipt of data');
        }
    });
}


function page_loaded() {
    if (document.querySelector("#app > div > div.two._aigs > header > div > div > div > div > span > div > div:nth-child(1)") == null) {
        return false;
    } else {
        return true;
    }
}

function add_buttons() {
    let sidebar = document.querySelector("#app > div > div.two._aigs > header > div > div > div > div > span > div > div:nth-child(1)");
    let button_summarise = document.createElement("button");
    button_summarise.textContent = "Summarise";
    button_summarise.style.color = "red";
    sidebar.appendChild(button_summarise);

    button_summarise.addEventListener("click", function () {
        send_summarise_request();
    });

    let button_generate = document.createElement("button");
    button_generate.textContent = "Generate";
    button_generate.style.color = "red";
    sidebar.appendChild(button_generate);

    button_generate.addEventListener("click", function () {
        send_generate_request();
    });

}

function message_list_to_string(message_list) {
    let string_to_send = "";
    for (let i = 0; i < message_list.length; i++) {
        if (message_list[i].sent) {
            string_to_send += "You:" + message_list[i].message + "\n";
        } else {
            string_to_send += "Them:" + message_list[i].message + "\n";
        }
    }
    return string_to_send;
}

function get_list_of_messages() {
    let message_list = [];
    let messages_divs = document.getElementsByClassName("_ao3e selectable-text copyable-text");
    for (let i = 1; i < messages_divs.length; i++) {
        if (messages_divs[i].textContent != "") {
            let temp_message = {
                "sent": messages_divs[i].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.classList.contains("message-out"),
                "message": messages_divs[i].textContent
            }
            message_list.push(temp_message);
        }
    }

    return message_list;
}


function do_everything() {

    if (!page_loaded()) {
        window.setTimeout(do_everything, 500);
        return;
    }

    add_buttons();
}

do_everything();