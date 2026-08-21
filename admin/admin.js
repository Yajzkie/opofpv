/* =========================================================
   FIREBASE
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
    getFirestore,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-storage.js";


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

const db = getFirestore(app);

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

        const snapshot =
            await getDocs(
                collection(db, "services")
            );


        servicesList.innerHTML = "";


        if (snapshot.empty) {

            servicesList.innerHTML =
                "<p>No services yet.</p>";

            return;

        }


        snapshot.forEach(function (service) {

            const data = service.data();

            const card =
                document.createElement("div");

            card.className = "admin-item";


            card.innerHTML = `

                <div>

                    <h3>${data.title}</h3>

                    <p>
                        ${data.description}
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

        const background =
            document.getElementById("serviceBackground").value;


        try {

            await addDoc(
                collection(db, "services"),
                {
                    title: title,
                    description: description,
                    background: background
                }
            );


            this.reset();

            closeModal("serviceModal");

            loadServices();

        } catch (error) {

            console.error(error);

            alert("Could not add service.");

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

        const snapshot =
            await getDocs(
                collection(db, "videos")
            );


        videosList.innerHTML = "";


        if (snapshot.empty) {

            videosList.innerHTML =
                "<p>No videos yet.</p>";

            return;

        }


        snapshot.forEach(function (video) {

            const data = video.data();

            const card =
                document.createElement("div");

            card.className = "admin-item";


            card.innerHTML = `

                <div>

                    <h3>${data.title}</h3>

                    <p>
                        ${data.description}
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
               UPLOAD VIDEO
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
               SAVE TO FIRESTORE
            ========================================= */

            await addDoc(
                collection(db, "videos"),
                {

                    title: title,

                    description: description,

                    url: downloadURL,

                    fileName: fileName,

                    createdAt:
                        new Date()

                }
            );


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

                await deleteDoc(
                    doc(db, type, id)
                );


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