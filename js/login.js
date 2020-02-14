window.onload = initialize;

function initialize(){
    document.getElementById("form-login").addEventListener("submit", doLogin);
}

function doLogin (event){
    event.preventDefault();
    var email = event.target.email.value;
    var passwd = event.target.psw.value;
    firebase.auth().signInWithEmailAndPassword(email, passwd).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
        console.log(error)
        console.log(event)
        console.log()
        console.log(errorMessage)
    });
    event.preventDefault();
    firebase.auth().onAuthStateChanged(function(user) {
        event.preventDefault();
        if (user) {
            console.log("Tiene la sesion iniciada")
        } else {
    console.log("Has cerrado sesioN")
        }
    });
}
