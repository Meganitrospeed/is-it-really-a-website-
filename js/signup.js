window.onload = initialize;

function initialize(){
    document.getElementById("form-signup").addEventListener("submit", signup);
}

function signup (event){
    event.preventDefault();
    var email = event.target.email.value;
    var passwd = event.target.psw.value;
    firebase.auth().createUserWithEmailAndPassword(email, passwd).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
        e.preventDefault()
    });
    e.preventDefault()
}