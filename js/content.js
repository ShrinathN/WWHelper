// content.js


chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    console.log("Received message from background script:", message);

    //getting the type of result
    if(message.action === "summarise_result") {
        alert(message.data);
    } else if(message.action === "generate_result") {
        document.getElementsByClassName("x1n2onr6 xh8yej3 lexical-rich-text-input")[1].innerText = message.data;
        console.log(message.data)
    }
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

    let button_summarise = document.createElement("img");
    button_summarise.setAttribute("style", "height:24px,width:24px,display:block");
    button_summarise.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAAAAAAAAQCEeRdzAAAE4UlEQVR4nIVWV0htRxQ9fxZEAyHEaCxRBFFE1A+5qKCClVgxEOz12XvvvfeGHXvviqDYUIIiqGAUlUhIRHkmPwHjM2BMsjNr4ByMuTEDw+Ge6117zVpr71EQ5CxtbW0hJCREKC8vV83Pz/eMjY1t8fHx2bK3t//Wzs7u1NraesfU1LRTS0vra0VFxY/lYchdqqqqQlFRkbC+vq7S1NSUzYr86O/vT4mJiVRcXEw1NTVUXV1N7G8oJSWFgoKCyMXF5c7Y2LhSQUHh7UIGBgbC6uqqsLCwIAsMDDwFMABHR0dpenqapqamaHx8nH8eGhqi/v5+6ujooJKSEgoLCyNHR8cf1NXVneWCsy+Era0tYWBgwN3b2/tDVlYWTU5O0tzcHAefmJigwcFBDtrX10fd3d0cHLuzs5NaWlooNTWVvLy8/tDV1Q39V4H29nZhdnZWxsAfS0tLiZ2C2Ge+wXh4eJj29/fp8vKSbm9v6erqinZ2dnih5uZmvpmklJmZSQzjT01NTXcJ3MLCQtjd3VUJCAi4zM7O5uAzMzMcHMyxHx4e6PDwkFZWVujk5ITEdXNzw09RX19PtbW1fMMv5svPysrKn/ECDFRoaGgoYAW4LADHRiFIcnd3x8EYCS4Xk1F6h7W3t8eNx66oqKCysjJi4SAzM7NuXqCtre0jZup7GArWMBPP+fl5burz87PEFp7A4LOzM6nA9fU1D0NlZSUHh8Tp6enk7u7+qKKioisw/b7y9fWlkZERfgKxAE4AxiLb8/NzqcDp6alUAH5UVVVx9ohyYWEhsd4hKMKSmSywal0JCQkcfGxsTJIJJ0AR6L69vU2Li4t8I0U4jbiWl5cl9iJ4Xl4eRUZGkkwmWxHc3Ny+QWWAIy14vjwFCoE5niiM78V1dHREzD9eABgAz8nJIYQlLi6OHBwcvhNsbW3PYRDAYSCe0F4sIoKjWG9vL48qFmLa2tpKdXV1nH1BQQEHR1QzMjJ4AebDrwKbLxdgAHAcH8mBzsg/IopCYrPBp6enJ1paWuLgjY2NnD1GR25uLqFBYXBaWhrFxMSQh4fHb4KNjc0+tAN4V1cXbx4wRSF0L04EYLzb2Nigi4sLqbFgLqR5CY4ZhQ0PnJycvhdYXgeSk5M5MOtoaYtjAO97enr4OFhbW+OmQlJ5zAGclJTEmy00NJSsrKzWBR0dnSBMRRwZW2T3esNMMBazjlMDHJq/BEciob+fnx8ZGhrmCUpKSp+6urr+gh+AJdoexqHtX3YovkeEIRdiiKQAHHoDHKzj4+M5eEREBHl6ev6upqZmxLvZxMSkESNXnClgCgnYhcMZIxUHBwdSPJEuyApwPEVwdjFRdHQ0Z29paTktDTx2K33i7Oz8Hn8M9uJMwawHc8Tv/v5eKnB8fMyZvgZHcoKDgxHPD4y94T9GtoaGxpcYtdAT7EVwNA/ebW5ucnDEFOajgKg3gMEcQ45draSvr/9O7sWjp6cXyYr8hR8iIaKRSAlkQu5hMBiL4GAeFRXFr0+AGxkZFb55dbLLwouZ/hOOCvNgphhDyAFgURYwDw8P55ozWe4ZwYg3wcXFLovPzc3Nu9iPHjAVkQpIgA22+AwCmMIsLU/M0HH2D4Ph/yO/Wmyef8FGbhKbistscF1itrD2f2QdesWaaI3lPFuK4n+svwGYhsYJBXQ52wAAAABJRU5ErkJggg==");
    sidebar.appendChild(document.createElement("br"));
    sidebar.appendChild(button_summarise);

    button_summarise.addEventListener("click", function () {
        send_summarise_request();
    });

    let button_generate = document.createElement("img");
    button_generate.setAttribute("style", "height:24px,width:24px,display:block");
    button_generate.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAAAAAAAAQCEeRdzAAAE0UlEQVR4nJVTaUwcZRgeMVKOnd3Z2WuAWe52TcrZ0gDllKMeJTWhVRs0IrUJu91ddhcWLC33LVAKclhND9E2aWpEIdhGmmhCA7T2j40Ca8DGxjYgBRSwGk309XtnwXbZDcUfT+aZ5z2e953vG0oqZZ5YBzdawlBeYgnlLZEIT3xnpAzlItcJEkbIc1t7X1/kJiLNtvOyqNworlkb43P6QJjqaJRaFitnmafWTMWMsyFqWBuhliUrZYxoLU45NpdQicGKrFPPBjx4/zl/6Nqjhh6Czkw1VCfz370RzXUkhSj2BXOsWsYyT+JmaIhPtVIqz43mWl6NUH1EE81pA3QkU26pT+VtXaRhcxoPLY+gLZ0XjLqJYVu6erkyib9ljvXt18X49Frj/S63Z/jP4TDRanY/buJkgCuGcGxAR4b6j9Z1zdcD4yeJ4TvEELfsEkx50O1U3SZDej36+RwMglSsXyuZrnW1yYl0+/NxaEj1g/IEDhKCZPrV6Z0PedWVKtntO9aewUMTKapJUEJdohIak1TQlMzB2yk+AppSOEHDWFmsHAqjGTgYprjCsozb+sN3eMFb8tJ2ZWVnGgdHYxVgyYqHwn0JUPR8DFj3RIA17WkoJkCOmpnEj72cDpdq8n8JDeR9abHYYXonA5GYpuLCtr5Sk5MJhVlxYNbrwFRUDKbCIjBZLGAymexATjSjuRCqqqtgsO/CA41mWzhNi5z+FQdBQq6XP+/nTya7V5idBia9FowmCxiMZigwmcFstgM5anqDCcrLjsGVvg+Xt20NCaHJgBsa2LeQUPs1zIWyBB8oNmqh5rgBmsp1UFxUAMYCswDkqFW+pYXmxlr4+fvR+6HBgfLNGZBbEM15v36x9DWob2iEofdyAEZfgNnBbCgtNgpAjtoXp3KgtrYO7o4Pz4eGBCo2ZSCWiKlgX0Xw9Mhnvzc11IHFpIdzzYfhUkceHC8xCECOmsVkgIa66v9nQNM0FRoSJF+4/fX8+TPdoNXpQWewwGGjlZyHWQBy1DB2/mwPzE9fXyAGys1tQK4a7+cjujc+fHdu6gZYrVYoMhrg4qEDYC0wCkBeZNQLMczBXKwR26/pxgYID09PqrO5ohX+mYGBj3tBe0QPn+RlwzcHUwUgRw1jADPQ1VJxAmtc9XIp4jmolAr3D7obu2w3ry7h1TxitkCVIV8ActRsN4eWenuaujmVcgvWbNoA/0Zcd4uHB5UYvyuyuqLsVx2ZOF9vEIAcNRKLwhyxiz/4cQarBy6iggLU0lujQ/evXR2ALy/3CUCOGsZc/b0bGjBkVUZCC6BFXsSAZ2dsI/N/L07BX3M2AchRw5jI2+u/fMbFZ1oT3KSMmJKIPCk550sr+ECFwi9AIeV4NjIyXLM0PbIICxPw5+y3ApCjtmtHuIb14VnMxRqsxR4M8/CT2Q2IwCpV3pF5NV2pbddmn+kYW0ltH11JPjm6/OK7Y7+dHR6HOz/aABbtmPnJBp/eGIfcc9dXUtpHlzFXqCG12EOm4rxXTewG6KrZe0if3PLVncT6z39IrBucWsPu2sGpHRX9k6l1/ZMlpwcmSs8MTGQ29E/uJFpczcM8AaQ2hfTQ7H1Tjz0dzkCmUHqycrk7K5O5BMPK3L0YOySs6xwBpAf2Wuv7LyqGqdbpF7H4AAAAAElFTkSuQmCC");
    sidebar.appendChild(document.createElement("br"));
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