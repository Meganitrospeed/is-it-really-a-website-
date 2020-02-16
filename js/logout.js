window.onload = initialize;

function initialize(){
    document.getElementById("logout").addEventListener("click", doLogout);
}
checkstatus();
function doLogout (event){
    event.preventDefault();
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        checkstatus();
    }).catch(function(error) {
        // An error happened.
        console.log(error);
    });
}

function checkstatus (){
    firebase.auth().onAuthStateChanged(function(user) {
        event.preventDefault();
        if (user) {
            console.log("Tiene la sesion iniciada")
        } else {
            console.log("Has cerrado sesion")

        }
    });
}