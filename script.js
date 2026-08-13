// ==========================
// MOBILE NAVIGATION
// ==========================

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

menuToggle.addEventListener("click", function () {
    navMenu.classList.toggle("active");
});

const navLinks = document.querySelectorAll("#navMenu a");

navLinks.forEach(function (link) {

    link.addEventListener("click", function () {
        navMenu.classList.remove("active");
    });

});


// ==========================
// VIDEO PLAYLIST
// ==========================

const video = document.getElementById("workVideo");
const playlist = document.querySelector(".playlist");
const videoPlayer = document.querySelector(".video-player");
const backButton = document.getElementById("backToPlaylist");

const playlistItems = document.querySelectorAll(".playlist-item");


playlistItems.forEach(function (item) {

    item.addEventListener("click", function () {

        const videoSource = this.dataset.video;

        console.log("Selected video:", videoSource);

        // Change video
        video.src = videoSource;
        video.load();

        // Change active playlist item
        playlistItems.forEach(function (button) {
            button.classList.remove("active");
        });

        this.classList.add("active");


        // Mobile
        if (window.innerWidth <= 800) {

            playlist.style.display = "none";
            videoPlayer.style.display = "block";

        }


        // Play selected video
        video.play().catch(function (error) {
            console.log("Video play error:", error);
        });

    });

});


// ==========================
// BACK TO PLAYLIST - MOBILE
// ==========================

backButton.addEventListener("click", function () {

    video.pause();

    videoPlayer.style.display = "none";
    playlist.style.display = "flex";

});