window.onload = initialize();
var submit;
function initialize(){
    submit = document.getElementById("form-test");
    submit.addEventListener("submit",validatAndSend);
}
function validateAndSend(event){
    var submit = event.target();
    var formname = submit["name"].value;
    var formAge = submit["age"].value;
    if(!formname){
        console.log("name required");
        event.preventDefault();
        return;
    }
}