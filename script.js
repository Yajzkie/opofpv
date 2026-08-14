const { createApp } = Vue;

createApp({

    data() {

        return {

            currentService: 0,

            services: [
                        {
                            title: "Aerial Photography",
                            description: "High-quality aerial photography captured from above.",
                            background: "images/bg1.jpg"
                        },

                        {
                            title: "Drone Videography",
                            description: "Professional cinematic drone footage for businesses, properties, and events.",
                            background: "images/drone-video.jpg"
                        },

                        {
                            title: "Real Estate Drone Shots",
                            description: "Showcase properties with stunning aerial photos and videos.",
                            background: "images/real-estate.jpg"
                        },

                        {
                            title: "Event Coverage",
                            description: "Capture memorable events from a unique aerial perspective.",
                            background: "images/event.jpg"
                        }


                     ]

        };

    },

    methods: {

        nextService() {

            this.currentService =
                (this.currentService + 1) %
                this.services.length;

        },

        previousService() {

            this.currentService =
                (this.currentService - 1 + this.services.length) %
                this.services.length;

        }

    }

}).mount("#app");








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