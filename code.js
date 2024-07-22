document.addEventListener("DOMContentLoaded", () => {
    const app = document.querySelector(".app");
    const socket = io();

    let uname;

    app.querySelector(".join-screen #join-user").addEventListener("click", function() {
        let username = app.querySelector(".join-screen #username").value;

        if (username.length === 0) {
            return;
        }

        socket.emit("newuser", username);
        uname = username;

        app.querySelector(".join-screen").classList.remove("active");
        app.querySelector(".chat-screen").classList.add("active");
    });

    app.querySelector("#send-message").addEventListener("click", function() {
        let message = app.querySelector("#message-input").value;

        if (message.length === 0) {
            return;
        }

        renderMessage("my", {
            username: uname,
            text: message
        });

        socket.emit("chat", {
            username: uname,
            text: message
        });

        app.querySelector("#message-input").value = "";
    });

    socket.on("update", function(update) {
        renderMessage("update", update);
    });

    socket.on("chat", function(message) {
        renderMessage("other", message);
    });

    function renderMessage(type, message) {
        let messageContainer = app.querySelector(".messages");
        let el = document.createElement("div");

        if (type === "my") {
            el.classList.add("message", "my-message");
            el.innerHTML = `
                <div>
                    <div class="name">You</div>
                    <div class="text">${message.text}</div>
                </div>
            `;
        } else if (type === "other") {
            el.classList.add("message", "other-message");
            el.innerHTML = `
                <div>
                    <div class="name">${message.username}</div>
                    <div class="text">${message.text}</div>
                </div>
            `;
        } else if (type === "update") {
            el.classList.add("update");
            el.innerText = message;
        }

        messageContainer.appendChild(el);
        messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
    }
});

