const { createApp } = Vue;

createApp({

    data() {
        return {

            services: [
                {
                    title: "Aerial Photography",
                    description: "High-quality aerial photography captured from above.",
                    background: "images/bg1.jpg"
                },

                {
                    title: "Drone Videography",
                    description: "Professional cinematic drone footage.",
                    background: "images/drone-video.jpg"
                },

                {
                    title: "Real Estate",
                    description: "Stunning aerial photos and videos for properties.",
                    background: "images/real-estate.jpg"
                },

                {
                    title: "Event Coverage",
                    description: "Capture events from a unique aerial perspective.",
                    background: "images/event.jpg"
                }
            ]

        };
    }

}).mount("#app");


// ==========================
// WORK PROJECT CARDS
// ==========================

const workCards = document.querySelectorAll(".work-card");

const workVideoPlayer =
    document.getElementById("workVideoPlayer");

const workVideo =
    document.getElementById("workVideo");

const closeWorkVideo =
    document.getElementById("closeWorkVideo");


/* Open video */

workCards.forEach(function (card) {

    card.addEventListener("click", function () {

        const videoSource =
            this.dataset.video;

        workVideo.src = videoSource;

        workVideoPlayer.classList.add("active");

        document.body.style.overflow = "hidden";

        workVideo.load();

        workVideo.play().catch(function (error) {

            console.log(
                "Video play error:",
                error
            );

        });

    });

});


/* Close video */

function closeVideo() {

    workVideo.pause();

    workVideo.removeAttribute("src");

    workVideo.load();

    workVideoPlayer.classList.remove("active");

    document.body.style.overflow = "";

}


/* Close button */

closeWorkVideo.addEventListener(
    "click",
    closeVideo
);


/* Click outside video */

workVideoPlayer.addEventListener(
    "click",
    function (event) {

        if (event.target === workVideoPlayer) {

            closeVideo();

        }

    }
);


/* ESC key */

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {

            closeVideo();

        }

    }
);

/* =========================================================
   MOBILE NAVIGATION
========================================================= */

const menuToggle =
    document.getElementById("menuToggle");

const navMenu =
    document.getElementById("navMenu");


menuToggle.addEventListener("click", function () {

    navMenu.classList.toggle("active");

});


const navLinks =
    document.querySelectorAll("#navMenu a");


navLinks.forEach(function (link) {

    link.addEventListener("click", function () {

        navMenu.classList.remove("active");

    });

});