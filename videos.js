import { supabase } from "./supabase-client.js";


/* =========================================================
   ELEMENTS
   ========================================================= */

const grid =
    document.getElementById("allVideosGrid");

const workVideoPlayer =
    document.getElementById("workVideoPlayer");

const workVideo =
    document.getElementById("workVideo");

const closeWorkVideo =
    document.getElementById("closeWorkVideo");


/* =========================================================
   RENDER
   ========================================================= */

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


function renderVideos(videos) {

    grid.innerHTML = "";


    if (!videos || videos.length === 0) {

        grid.innerHTML =
            "<p class='videos-loading'>No videos yet. Check back soon.</p>";

        return;

    }


    videos.forEach(function (video, index) {

        grid.appendChild(
            createWorkCard(video, index)
        );

    });

}


/* =========================================================
   LOAD
   ========================================================= */

async function loadVideos() {

    try {

        const { data, error } =
            await supabase
                .from("videos")
                .select("*")
                .order("created_at", { ascending: false });


        if (error) {
            throw error;
        }


        renderVideos(data);

    } catch (error) {

        console.error(error);

        grid.innerHTML =
            "<p class='videos-loading'>Could not load videos.</p>";

    }

}

loadVideos();


/* =========================================================
   PLAYER — EVENT DELEGATION
   ========================================================= */

grid.addEventListener("click", function (event) {

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


/* Close button */

closeWorkVideo.addEventListener(
    "click",
    closePlayer
);


/* Click outside video */

workVideoPlayer.addEventListener(
    "click",
    function (event) {

        if (event.target === workVideoPlayer) {

            closePlayer();

        }

    }
);


/* ESC key */

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {

            closePlayer();

        }

    }
);


function closePlayer() {

    workVideo.pause();

    workVideo.removeAttribute("src");

    workVideo.load();

    workVideoPlayer.classList.remove("active");

    document.body.style.overflow = "";

}
