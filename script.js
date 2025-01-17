document.addEventListener("DOMContentLoaded", () => {
    const loadingScreen = document.querySelector(".loading-screen");
    const dashboard = document.querySelector(".dashboard");
    const usernameDisplay = document.getElementById("username");
    const balanceDisplay = document.getElementById("balance");
    const startMiningBtn = document.getElementById("start-mining");
    const miningStatus = document.getElementById("mining-status");
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

    // Simulate fetching user info
    const userInfo = {
        username: "User123",
        balance: 0,
    };

    // Display user info after loading
    setTimeout(() => {
        loadingScreen.style.display = "none";
        dashboard.style.display = "block";
        usernameDisplay.textContent = userInfo.username;
        balanceDisplay.textContent = userInfo.balance.toFixed(4);
    }, 3000);

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