import { supabase } from "./supabase-client.js";

const { createApp } = Vue;

const DEFAULT_SERVICES = [
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
];

createApp({

    data() {
        return {

            services: DEFAULT_SERVICES

        };
    },

    async mounted() {

        try {

            const { data, error } =
                await supabase
                    .from("services")
                    .select("*")
                    .order("created_at", { ascending: true });


            if (error) {
                throw error;
            }


            if (data && data.length > 0) {
                this.services = data;
            }

        } catch (error) {

            console.error(
                "Could not load services:",
                error
            );

        }

    }

}).mount("#app");


// ==========================
// WORK PROJECT CARDS
// ==========================

const FALLBACK_VIDEOS = [
    {
        title: "Project 1",
        description: "FPV drone footage showcasing our work.",
        url: "videos/project1.mp4"
    },

    {
        title: "Project 2",
        description: "Cinematic aerial footage captured with FPV.",
        url: "videos/project1.mp4"
    },

    {
        title: "Project 3",
        description: "Dynamic drone footage for visual storytelling.",
        url: "videos/project2.mp4"
    }
];

const workGrid =
    document.querySelector(".work-cards");

const workVideoPlayer =
    document.getElementById("workVideoPlayer");

const workVideo =
    document.getElementById("workVideo");

const closeWorkVideo =
    document.getElementById("closeWorkVideo");


function createWorkCard(video, index) {

    const card =
        document.createElement("div");

    card.className = "work-card";

    card.dataset.video =
        video.url;


    const clipNumber =
        String(index + 1).padStart(2, "0");


    card.innerHTML = `

        <div class="work-thumbnail">

            <video muted preload="metadata">
                <source src="${video.url}" type="video/mp4">
            </video>

            <div class="play-icon">▶</div>

        </div>

        <div class="work-card-content">

            <p class="card-meta">CLIP ${clipNumber}</p>

            <h3>${video.title}</h3>

            <p>${video.description}</p>

        </div>

    `;

    return card;

}


function renderWorkVideos(videos) {

    workGrid.innerHTML = "";

    videos.forEach(function (video, index) {

        workGrid.appendChild(
            createWorkCard(video, index)
        );

    });

}


async function loadWorkVideos() {

    try {

        const { data, error } =
            await supabase
                .from("videos")
                .select("*")
                .order("created_at", { ascending: false });


        if (error) {
            throw error;
        }


        if (data && data.length > 0) {

            renderWorkVideos(data.slice(0, 3));

        } else {

            renderWorkVideos(FALLBACK_VIDEOS);

        }

    } catch (error) {

        console.error(
            "Could not load videos:",
            error
        );

        renderWorkVideos(FALLBACK_VIDEOS);

    }

}

loadWorkVideos();


/* Open video — event delegation */

workGrid.addEventListener("click", function (event) {

    const card =
        event.target.closest(".work-card");

    if (!card) {
        return;
    }

    workVideo.src =
        card.dataset.video;

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


/* =========================================================
   NAVBAR SCROLL STATE
======================================================== */

const header = document.querySelector("header");

function updateHeader() {

    header.classList.toggle(
        "scrolled",
        window.scrollY > 40
    );

}

updateHeader();

window.addEventListener(
    "scroll",
    updateHeader,
    { passive: true }
);


/* =========================================================
   SCROLL REVEAL
======================================================== */

const revealElements =
    document.querySelectorAll("[data-reveal]");

const prefersReducedMotion =
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


if (
    prefersReducedMotion ||
    !("IntersectionObserver" in window)
) {

    revealElements.forEach(function (el) {
        el.classList.add("revealed");
    });

} else {

    const revealObserver =
        new IntersectionObserver(
            function (entries) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("revealed");

                        revealObserver.unobserve(entry.target);

                    }

                });

            },
            { threshold: 0.15 }
        );

    revealElements.forEach(function (el) {
        revealObserver.observe(el);
    });

}