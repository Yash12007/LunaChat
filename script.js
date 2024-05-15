// Function to initialize the home screen with stories and posts
function home() {
    document.getElementById("main").innerHTML = `
        <div id="storypanel" style="display: flex; overflow-x: scroll;"></div>
        <div id="posts"></div>
    `;
    getstories();
    appendStories();
    appendPosts();
}
setTimeout(home, 3000);
function appendPosts() {
    var postpanel = document.getElementById("posts");
    postpanel.innerHTML = ""; // Clear existing posts
    if (post.length > 0) {
        for (let i = 0; i < post.length; i++) {
            var postDiv = document.createElement("div");
            postDiv.innerHTML = `<div class="post"><img src="${post[i]}" width="100%" height="100%"></div>`;
            postpanel.appendChild(postDiv);
        }
    }
    setTimeout(appendPosts, 1000);
}
function camera() {
    document.getElementById("main").innerHTML = `
        <video id="video" autoplay height="610px" style="position: absolute; inset: 0px; background-position-x: center;"></video>
        <div id="camcapture" style="position: absolute; bottom: 10px; width: 100%; display: flex; justify-content: center;">
            <button class="btn" onclick="capturePhoto()">
                <i class="bi bi-record-circle"></i>
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-record-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                    <path d="M11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                </svg>
            </button>
        </div>
    `;
    var vid = document.getElementById("video");
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
            vid.srcObject = stream;
            vid.play();
        })
        .catch(function (err) {
            console.log("Error accessing camera: ", err);
        });
}

// Function to stop the camera
function stopCamera() {
    var vid = document.getElementById("video");
    if (vid) {
        var stream = vid.srcObject;
        var tracks = stream.getTracks();
        tracks.forEach(function (track) {
            track.stop();
        });
        vid.srcObject = null;
        vid.parentNode.removeChild(vid);
    } else {
        console.log("Camera is not streaming.");
    }
}

// Function to load Google Maps
function maps() {
    stopCamera();
    var main = document.getElementById("main");
    main.innerHTML = `<iframe width="100%" height="600" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=+(Yash12007)&amp;t=k&amp;z=16&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"></iframe>`;
}

let story = [];
let post = [];

// Function to append stories to the story panel
function appendStories() {
    var storypanel = document.getElementById("storypanel");
    storypanel.innerHTML = ""; // Clear existing stories
    if (story.length > 0) {
        for (let i = 0; i < story.length; i++) {
            var btn = document.createElement("button");
            btn.innerHTML = `<img src="${story[i]}" width="100%" height="100%">`;
            btn.dataset.index = i;
            btn.addEventListener("click", function () {
                var storyIndex = parseInt(this.dataset.index);
                window.open(story[storyIndex], "_self");
            });
            storypanel.appendChild(btn);
        }
    }
}

// Function to initialize stories view
function stories() {
    stopCamera();
    document.getElementById("main").innerHTML = `
        <div id="storypanel" style="display: flex; overflow-x: scroll;"></div>
        <div id="posts"></div>
    `;
    getstories();
    appendStories();
}

// Function to add a story
function addstory(link) {
    if (link) {
        story.push(link);
        appendStories();
    }
}

// Function to add a post
function addpost(link) {
    if (link) {
        post.push(link);
    }
}

// Function to handle Google API client load
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

// Function to initialize Google API client
function initClient() {
    gapi.client.init({
        apiKey: 'AIzaSyALIdZ5SaHQ_A38kmV3Hd92vmt6GXJ0crE', // Optional, but recommended for better API usage tracking
        clientId: '295447884715-4bipurl050pdnsoi0kg6qk47e6fjmfqc.apps.googleusercontent.com',
        discoveryDocs: ["https://people.googleapis.com/$discovery/rest?version=v1"],
        scope: 'https://www.googleapis.com/auth/contacts.readonly'
    }).then(function () {
        // Listen for sign-in state changes
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    }, function (error) {
        console.error("Error initializing the Google API client", error);
    });
}

// Function to update the sign-in status
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        listConnectionNames();
    } else {
        console.log("User not signed in");
    }
}

// Function to handle sign-in button click
function handleAuthClick() {
    const authInstance = gapi.auth2.getAuthInstance();
    if (authInstance) {
        authInstance.signIn();
    } else {
        console.error("Auth instance is not initialized");
    }
}

// Function to handle sign-out button click
function handleSignoutClick() {
    const authInstance = gapi.auth2.getAuthInstance();
    if (authInstance) {
        authInstance.signOut();
    } else {
        console.error("Auth instance is not initialized");
    }
}

// Function to list connection names
function listConnectionNames() {
    gapi.client.people.people.connections.list({
        'resourceName': 'people/me',
        'pageSize': 10,
        'personFields': 'names,emailAddresses'
    }).then(function (response) {
        console.log('Connections:', response.result.connections);
        // Process the connections here
    }, function (error) {
        console.error("Error fetching contacts", error);
    });
}

gapi.load("client:auth2", handleClientLoad);

// Function to show account details
function showaccount() {
    document.getElementById("profile").setAttribute("style", "top:0; left:0;");
}

// Function to hide account details
function hideaccount() {
    document.getElementById("profile").setAttribute("style", "top:-50000px; left:-50000px;");
}

// Function to fetch stories from an external source
function getstories() {
    try {
        fetch("https://yash12007.github.io/LunaChat/stories.txt")
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                story = data;
                appendStories();
            })
            .catch((err) => {
                console.error("Error fetching stories:", err);
            });
    } catch {
        console.log("Can't fetch stories...");
    }
}
