/* =========================================================
   FIREBASE
   ========================================================= */

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";


import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";


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


/* =========================================================
   ELEMENTS
   ========================================================= */

const form =
    document.getElementById("loginForm");

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

const loginButton =
    document.getElementById("loginButton");

const loginMessage =
    document.getElementById("loginMessage");

const checkLink =
    document.getElementById("checkLink");

const checkPilot =
    document.getElementById("checkPilot");

const checkKey =
    document.getElementById("checkKey");


/* =========================================================
   REDIRECT IF ALREADY SIGNED IN
   ========================================================= */

let justSignedIn = false;

onAuthStateChanged(auth, function (user) {

    if (user && !justSignedIn) {

        window.location.href = "admin.html";

    }

});


/* =========================================================
   PRE-ARM CHECKLIST
   ========================================================= */

function setCheck(item, ok) {

    item.classList.toggle("ok", ok);

    const status =
        item.querySelector("em");

    status.textContent =
        ok ? "OK" : "STANDBY";

}

function updateChecklist() {

    setCheck(
        checkPilot,
        emailInput.value.trim() !== ""
    );

    setCheck(
        checkKey,
        passwordInput.value.length >= 6
    );

}

emailInput.addEventListener("input", updateChecklist);

passwordInput.addEventListener("input", updateChecklist);


/* =========================================================
   ERROR MESSAGES
   ========================================================= */

const errorMessages = {

    "auth/invalid-email":
        "That email address doesn't look right.",

    "auth/missing-password":
        "Enter your password.",

    "auth/invalid-credential":
        "Access denied — wrong email or password.",

    "auth/wrong-password":
        "Access denied — wrong email or password.",

    "auth/user-not-found":
        "Access denied — wrong email or password.",

    "auth/too-many-requests":
        "Too many failed attempts. Wait a moment and try again.",

    "auth/network-request-failed":
        "No link to ground control. Check your connection."

};

function showError(code) {

    loginMessage.textContent =
        errorMessages[code] ||
        "Authentication failed. Try again.";

}


/* =========================================================
   LOGIN
   ========================================================= */

form.addEventListener("submit", async function (event) {

    event.preventDefault();

    const email =
        emailInput.value.trim();

    const password =
        passwordInput.value;


    loginButton.disabled = true;

    loginButton.textContent =
        "Arming…";

    loginMessage.classList.remove("success");

    loginMessage.textContent =
        "";


    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );


        justSignedIn = true;


        checkPilot.classList.add("ok");

        checkKey.classList.add("ok");


        loginButton.textContent =
            "Armed ✓";

        loginMessage.classList.add("success");

        loginMessage.textContent =
            "ARMED — launching…";


        setTimeout(function () {

            window.location.href = "admin.html";

        }, 700);


    } catch (error) {

        console.error(error);

        showError(error.code);


        checkPilot.classList.remove("ok");

        checkKey.classList.remove("ok");

        checkPilot.classList.add("fail");

        setTimeout(function () {

            checkPilot.classList.remove("fail");

        }, 1500);


        loginButton.disabled = false;

        loginButton.textContent =
            "Authenticate";

    }

});
