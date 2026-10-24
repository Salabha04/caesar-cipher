
const messageInput = document.getElementById("message");
const resultBox = document.getElementById("result");
const shiftInput = document.getElementById("shift");
const shiftSlider = document.getElementById("shiftSlider");
const shiftValue = document.getElementById("shiftValue");

const encryptBtn = document.getElementById("encryptBtn");
const decryptBtn = document.getElementById("decryptBtn");
const swapBtn = document.getElementById("swapBtn");

// Find the Copy and Clear buttons by their IDs
const copyBtn = document.getElementById("copyBtn");
const clearBtn = document.getElementById("clearBtn");

// Keep slider, number input, and displayed value synchronized
function updateShift(value) {
    if (shiftSlider) shiftSlider.value = value;
    if (shiftInput) shiftInput.value = value;
    if (shiftValue) shiftValue.textContent = value;
}

if (shiftSlider) {
    shiftSlider.addEventListener("input", () => {
        updateShift(shiftSlider.value);
    });
}

if (shiftInput) {
    shiftInput.addEventListener("input", () => {
        let value = Number(shiftInput.value);

        if (shiftInput.value !== "" && Number.isFinite(value)) {
            value = Math.max(0, Math.min(25, value));
            updateShift(value);
        }
    });
}

// Send message to the Python Flask backend
async function processMessage(action) {
    const message = messageInput.value;
    const shift = Number(shiftInput.value);

    if (!message.trim()) {
        alert("Please enter a message first!");
        return;
    }

    try {
        const response = await fetch(`https://caesar-cipher-backend.onrender.com/${action}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: message,
                    shift: shift
                })
            }
        );

        if (!response.ok) {
            throw new Error("Backend request failed");
        }

        const data = await response.json();
        resultBox.value = data.result;

    } catch (error) {
        console.error(error);
        alert("Backend connection failed. Make sure Flask is running.");
    }
}

// Encrypt button
encryptBtn.addEventListener("click", () => {
    processMessage("encrypt");
});

// Decrypt button
decryptBtn.addEventListener("click", () => {
    processMessage("decrypt");
});

// Use Result as Input button
swapBtn.addEventListener("click", () => {
    if (resultBox.value.trim() === "") {
        alert("There is no result to use!");
        return;
    }

    messageInput.value = resultBox.value;
});

// Copy Result button
copyBtn.addEventListener("click", async () => {
    if (!resultBox.value.trim()) {
        alert("There is no result to copy!");
        return;
    }

    try {
        await navigator.clipboard.writeText(resultBox.value);
        alert("Result copied successfully!");
    } catch (error) {
        // Fallback for browsers where clipboard access is unavailable
        resultBox.focus();
        resultBox.select();

        const copied = document.execCommand("copy");

        if (copied) {
            alert("Result copied successfully!");
        } else {
            alert("Please select and copy the result manually.");
        }
    }
});

// Clear button
clearBtn.addEventListener("click", () => {
    messageInput.value = "";
    resultBox.value = "";
    updateShift(3);
});
