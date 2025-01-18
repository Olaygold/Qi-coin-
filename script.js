document.addEventListener("DOMContentLoaded", () => {
    const loadingScreen = document.querySelector(".loading-screen");
    const dashboard = document.querySelector(".dashboard");
    const usernameDisplay = document.getElementById("username");
    const balanceDisplay = document.getElementById("balance");
    const startMiningBtn = document.getElementById("start-mining");
    const collectTokensBtn = document.getElementById("collect-tokens");
    const navButtons = document.querySelectorAll(".nav-bar button");
    const sections = document.querySelectorAll(".dashboard > div");
    const fillElement = document.getElementById("fill");
    const countdownElement = document.getElementById("countdown");
    const minedTokensElement = document.getElementById("mined-tokens");

    let balance = 0;
    let miningInterval;
    let countdownTimer;
    const miningDuration = 3 * 60 * 60; // 3 hours in seconds
    const totalTokens = 10.3637; // Total tokens to be mined in 3 hours
    let remainingTime = miningDuration;

    // Add your server URL here
    const serverUrl = "https://qi-coin.onrender.com";  // Replace with your actual server URL

    // Fetch user info from server
    fetch(`${serverUrl}/get-user-info`)
        .then(response => response.json())
        .then(data => {
            const userInfo = data; // Assuming the server returns the user info
            setTimeout(() => {
                loadingScreen.style.display = "none";
                dashboard.style.display = "block";
                usernameDisplay.textContent = userInfo.username;
                balanceDisplay.textContent = userInfo.balance.toFixed(4);
            }, 3000);
        })
        .catch(error => {
            console.error("Error fetching user info:", error);
            alert("Failed to load user info");
        });

    // Navigation logic
    navButtons.forEach((button, index) => {
        button.addEventListener("click", () => {
            sections.forEach((section) => section.classList.remove("active"));
            sections[index].classList.add("active");
        });
    });

    // Start mining logic
    startMiningBtn.addEventListener("click", () => {
        startMiningBtn.disabled = true;
        collectTokensBtn.disabled = true;
        fillElement.style.height = "0%";
        remainingTime = miningDuration;

        // Start countdown
        countdownTimer = setInterval(() => {
            if (remainingTime > 0) {
                remainingTime--;
                updateCountdown();
                updateFill();
                updateMinedTokens();
            } else {
                clearInterval(countdownTimer);
                collectTokensBtn.disabled = false;
            }
        }, 1000);
    });

    // Collect tokens
    collectTokensBtn.addEventListener("click", () => {
        alert("10.3637 QI Tokens added to your balance!");
        startMiningBtn.disabled = false;
        collectTokensBtn.disabled = true;
        fillElement.style.height = "0%";
        countdownElement.textContent = "3:00:00";
        minedTokensElement.textContent = "Tokens Mined: 0.0000 QI";

        // Update the balance on the UI
        balance += totalTokens;
        balanceDisplay.textContent = balance.toFixed(4);

        // Send updated data to the server (example)
        const updatedData = {
            username: usernameDisplay.textContent,
            balance: balance,  // Send the updated balance
        };
        fetch(`${serverUrl}/update-user-info`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        })
        .then(response => response.json())
        .then(result => console.log("Server response:", result))
        .catch(error => console.error("Error sending data:", error));
    });

    // Update countdown display
    function updateCountdown() {
        const hours = Math.floor(remainingTime / 3600);
        const minutes = Math.floor((remainingTime % 3600) / 60);
        const seconds = remainingTime % 60;
        countdownElement.textContent = `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }

    // Update bucket fill animation
    function updateFill() {
        const progress = ((miningDuration - remainingTime) / miningDuration) * 100;
        fillElement.style.height = `${progress}%`;
    }

    // Update mined tokens display
    function updateMinedTokens() {
        const elapsed = miningDuration - remainingTime;
        const mined = (elapsed / miningDuration) * totalTokens;
        minedTokensElement.textContent = `Tokens Mined: ${mined.toFixed(4)} QI`;
    }
});
