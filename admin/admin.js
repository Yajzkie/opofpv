/* =========================================================
   FIREBASE — AUTH & STORAGE ONLY
   ========================================================= */

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";


import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";


import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-storage.js";


/* =========================================================
   SUPABASE — DATABASE
   ========================================================= */

import {
    supabase
} from "../supabase-client.js";


/* =========================================================
   FIREBASE CONFIG
   ========================================================= */

const firebaseConfig = {

    apiKey: "AIzaSyAjLa5pLDOPTEYWZ9pAgWyyYKs3OVCZm48",

    authDomain:
        "osofpv-6803c.firebaseapp.com",

    projectId:
        "osofpv-6803c",

    storageBucket:
        "osofpv-6803c.firebasestorage.app",

    messagingSenderId:
        "842580589962",

    appId:
        "1:842580589962:web:e0d8ba927d2e1898fa9c73"

};


/* =========================================================
   INITIALIZE FIREBASE
   ========================================================= */

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const storage = getStorage(app);


/* =========================================================
   CHECK LOGIN
   ========================================================= */

onAuthStateChanged(auth, function (user) {

    if (!user) {

        window.location.href = "login.html";

        return;

    }

    loadServices();

    loadVideos();

});


/* =========================================================
   LOGOUT
   ========================================================= */

document
    .getElementById("logoutButton")
    .addEventListener("click", async function () {

        await signOut(auth);

        window.location.href = "login.html";

    });


/* =========================================================
   SERVICES
   ========================================================= */

async function loadServices() {

    const servicesList =
        document.getElementById("servicesList");

    servicesList.innerHTML =
        "<p>Loading...</p>";


    try {

        const { data, error } =
            await supabase
                .from("services")
                .select("*")
                .order("created_at", { ascending: true });


        if (error) {
            throw error;
        }


        servicesList.innerHTML = "";


        if (!data || data.length === 0) {

            servicesList.innerHTML =
                "<p>No services yet.</p>";

            return;

        }


        data.forEach(function (service) {

            const card =
                document.createElement("div");

            card.className = "admin-item";


            card.innerHTML = `

                <img
                    class="admin-thumb"
                    src="${service.background || ""}"
                    alt=""
                >

                <div>

                    <h3>${service.title}</h3>

                    <p>
                        ${service.description}
                    </p>

                </div>

                <button
                    class="delete-button"
                    data-id="${service.id}"
                    data-type="services"
                >
                    Delete
                </button>

            `;


            servicesList.appendChild(card);

        });


        addDeleteListeners();

    } catch (error) {

        console.error(error);

        servicesList.innerHTML =
            "<p>Could not load services.</p>";

    }

}


/* =========================================================
   ADD SERVICE
   ========================================================= */

document
    .getElementById("serviceForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();


        const title =
            document.getElementById("serviceTitle").value;

        const description =
            document.getElementById("serviceDescription").value;

        const file =
            document.getElementById("serviceImage").files[0];


        if (!file) {

            alert("Please select an image.");

            return;

        }


        /* Check file type */

        if (!file.type.startsWith("image/")) {

            alert("Please select an image file.");

            return;

        }


        try {

            const submitButton =
                this.querySelector("button[type='submit']");


            submitButton.disabled = true;

            submitButton.textContent =
                "Uploading...";


            /* =========================================
               CREATE STORAGE PATH
            ========================================= */

            const fileName =
                Date.now() + "_" + file.name;


            const storageRef =
                ref(
                    storage,
                    "services/" + fileName
                );


            /* =========================================
               UPLOAD IMAGE
            ========================================= */

            const snapshot =
                await uploadBytes(
                    storageRef,
                    file
                );


            console.log(
                "Uploaded:",
                snapshot.metadata.fullPath
            );


            /* =========================================
               GET DOWNLOAD URL
            ========================================= */

            const downloadURL =
                await getDownloadURL(
                    snapshot.ref
                );


            console.log(
                "Image URL:",
                downloadURL
            );


            /* =========================================
               SAVE TO SUPABASE
            ========================================= */

            const { error } =
                await supabase
                    .from("services")
                    .insert({
                        title: title,

                        description: description,

                        background: downloadURL
                    });


            if (error) {
                throw error;
            }


            this.reset();

            closeModal("serviceModal");

            loadServices();


        } catch (error) {

            console.error(error);

            alert("Could not add service: " + error.message);


        } finally {

            const submitButton =
                this.querySelector("button[type='submit']");


            submitButton.disabled = false;

            submitButton.textContent =
                "Add Service";

        }

    });


/* =========================================================
   VIDEOS
   ========================================================= */

async function loadVideos() {

    const videosList =
        document.getElementById("videosList");

    videosList.innerHTML =
        "<p>Loading...</p>";


    try {

        const { data, error } =
            await supabase
                .from("videos")
                .select("*")
                .order("created_at", { ascending: false });


        if (error) {
            throw error;
        }


        videosList.innerHTML = "";


        if (!data || data.length === 0) {

            videosList.innerHTML =
                "<p>No videos yet.</p>";

            return;

        }


        data.forEach(function (video) {

            const card =
                document.createElement("div");

            card.className = "admin-item";


            card.innerHTML = `

                <div>

                    <h3>${video.title}</h3>

                    <p>
                        ${video.description}
                    </p>

                </div>

                <button
                    class="delete-button"
                    data-id="${video.id}"
                    data-type="videos"
                >
                    Delete
                </button>

            `;


            videosList.appendChild(card);

        });


        addDeleteListeners();

    } catch (error) {

        console.error(error);

        videosList.innerHTML =
            "<p>Could not load videos.</p>";

    }

}


/* =========================================================
   ADD VIDEO
   ========================================================= */

document
    .getElementById("videoForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();


        const title =
            document.getElementById("videoTitle").value;

        const description =
            document.getElementById("videoDescription").value;

        const file =
            document.getElementById("videoFile").files[0];


        if (!file) {

            alert("Please select a video.");

            return;

        }


        /* Check file type */

        if (!file.type.startsWith("video/")) {

            alert("Please select a video file.");

            return;

        }


        try {

            const submitButton =
                this.querySelector("button[type='submit']");


            submitButton.disabled = true;

            submitButton.textContent =
                "Uploading...";


            /* =========================================
               CREATE STORAGE PATH
            ========================================= */

            const fileName =
                Date.now() + "_" + file.name;


            const storageRef =
                ref(
                    storage,
                    "videos/" + fileName
                );


            /* =========================================
               UPLOAD VIDEO (Firebase Storage)
            ========================================= */

            const snapshot =
                await uploadBytes(
                    storageRef,
                    file
                );


            console.log(
                "Uploaded:",
                snapshot.metadata.fullPath
            );


            /* =========================================
               GET DOWNLOAD URL
            ========================================= */

            const downloadURL =
                await getDownloadURL(
                    snapshot.ref
                );


            console.log(
                "Video URL:",
                downloadURL
            );


            /* =========================================
               SAVE TO SUPABASE
            ========================================= */

            const { error } =
                await supabase
                    .from("videos")
                    .insert({
                        title: title,

                        description: description,

                        url: downloadURL,

                        file_name: fileName
                    });


            if (error) {
                throw error;
            }


            /* =========================================
               FINISH
            ========================================= */

            this.reset();

            closeModal("videoModal");

            loadVideos();


            alert("Video uploaded successfully!");


        } catch (error) {

            console.error(error);

            alert(
                "Upload failed: " +
                error.message
            );


        } finally {

            const submitButton =
                this.querySelector("button[type='submit']");


            submitButton.disabled = false;

            submitButton.textContent =
                "Add Video";

        }

    });


/* =========================================================
   DELETE
   ========================================================= */

function addDeleteListeners() {

    const buttons =
        document.querySelectorAll(".delete-button");


    buttons.forEach(function (button) {

        button.addEventListener("click", async function () {

            const id =
                this.dataset.id;

            const type =
                this.dataset.type;


            const confirmed =
                confirm(
                    "Are you sure you want to delete this?"
                );


            if (!confirmed) {
                return;
            }


            try {

                const { error } =
                    await supabase
                        .from(type)
                        .delete()
                        .eq("id", id);


                if (error) {
                    throw error;
                }


                if (type === "services") {

                    loadServices();

                } else {

                    loadVideos();

                }

            } catch (error) {

                console.error(error);

                alert("Could not delete item.");

            }

        });

    });

}


/* =========================================================
   MODALS
   ========================================================= */

document
    .getElementById("addServiceButton")
    .addEventListener("click", function () {

        openModal("serviceModal");

    });


document
    .getElementById("addVideoButton")
    .addEventListener("click", function () {

        openModal("videoModal");

    });


document
    .querySelectorAll(".close-modal")
    .forEach(function (button) {

        button.addEventListener("click", function () {

            closeModal(
                this.dataset.close
            );

        });

    });


function openModal(id) {

    document
        .getElementById(id)
        .classList.add("active");

}


function closeModal(id) {

    document
        .getElementById(id)
        .classList.remove("active");

}
