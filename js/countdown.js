const futureTime = new Date("2024-02-07T00:00:00+07:00").getTime();

const countdownInterval = setInterval(() => {
    let currentTime = new Date().getTime();
    let remainingTime = futureTime - currentTime;

    let hours = Math.floor(remainingTime / (1000 * 60 * 60));
    let minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

    document.getElementById(
        "countdown"
    ).innerHTML = `Please check back in<br>${hours} hours ${minutes} minutes ${seconds} seconds.`;

    if (remainingTime <= 0) {
        clearInterval(countdownInterval);
        document.getElementById("countdown").innerHTML = "";
    }
}, 1000);
