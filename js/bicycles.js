window.onload = initialize;
const ADD = "add";
const UPDATE = "update";
var operation = ADD;
var keyBicycleToEdit;
var logstatus = 0;
var uid = "";
const formItem = document.getElementById("form-bicycle");

let file = formItem.image.files[0];
let fileName = file.name;
function initialize() {
    initializeFirebase();
    checkstatus();
    document.getElementById("logout").addEventListener("click", doLogout);
    document.getElementById("cancel-button").addEventListener("click", resetForm);

    captureSubmitEventWhenAddingItem();

    downloadBicycles();
}

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
            //Obtenemos la UID del usuario para poder trabajar con ella mas tarde :)
            console.log("Authenticated user with uid:", user.uid);
            var logstatus = 1;

            uid = user.uid;
        } else {
            console.log("Has cerrado sesioN")
            var logstatus = 0;
        }
    });
}

function validation (){
    var fusuario = document.getElementById('color').value;
    var frango = document.getElementById('model').value;
    var ftmeses = document.getElementById('stock').value;
    if ((fusuario.length == 0) | (frango.length == 0) | (ftmeses.length == 0))
    {
        alert("Name must be filled out");
        return false;
    }
    if(isNaN(ftmeses)){
        alert("Meses is not a number");
    }
}

function resetForm() {
    document.getElementById("update-button").style.display = "none";
    document.getElementById("cancel-button").style.display = "none";
    document.getElementById("add-button").style.display = "block";
    operation = ADD;
}

function captureSubmitEventWhenAddingItem() {
    document.getElementById("form-bicycle").addEventListener("submit", addOrUpdateItem,);

}

function addOrUpdateItem(event) {
    validation();

    event.preventDefault();

    var formItems = event.target;

    if (operation == ADD) {

        if (uid == "rnoV3ffjqAQp64AYkMb0vR8OuXS2") {
            var refBicycles = firebase.database().ref("BicycleStore/bicycles");
            const formItems = document.getElementById("form-bicycle");
            let file = formItems.image.files[0];
            let fileName = file.name;

            let user = formItems.usuario.value;
            let rank = formItems.rango.value;
            let tMonth = formItems.tmeses.value;

            let ref = firebase.storage().ref().child(fileName);
            ref.put(file).then(function (snapshot) {
                console.log('Uploaded a blob or file!');

                ref.getDownloadURL().then(function (url) {
                    refBicycles.push({
                        usuario: user,
                        rango: rank,
                        tmeses: tMonth,
                        image_url: url
                    });
                }).catch(function (error) {
                    console.log(error);
                });
            });
            refBicycles.push({
                usuario: formItems.usuario.value,
                rango: formItems.rango.value,
                tmeses: formItems.tmeses.value

            });
            //location.reload();
        };
    } else if (uid == "rnoV3ffjqAQp64AYkMb0vR8OuXS2") {
        var refBicycles = firebase.database().ref("BicycleStore/bicycles/" + keyBicycleToEdit);
        validation()
        refBicycles.update({
            usuario: formItems.usuario.value,
            rango: formItems.rango.value,
            tmeses: formItems.tmeses.value
        });
        document.getElementById("update-button").style.display = "none";
        document.getElementById("cancel-button").style.display = "none";
        document.getElementById("add-button").style.display = "block";
        operation = ADD;
        location.reload();
    } else {
        console.log("No tienes permisos para añadir o editar registros");
        alert("No tienes permisos, logeate para editar si eres un usuario con permisos");
    }
    formItems.reset();
}

function downloadBicycles() {
    var bicycles = firebase.database().ref("BicycleStore/bicycles");

    bicycles.on("value", showBicycles);
}

function showBicycles(snap) {

    var data = snap.val();

    var rows = "";

    for (var key in data) {
        rows += '<tr>' +
            "<td>" +
            '<img data-bicycle-id="' + key + '" class="img-fluid imgOnDB" src="' +
            data[key].image_url + '" alt="image"/>' +
            "</td>" +
            '<td>' + data[key].usuario + '</td>' +
            '<td>' + data[key].rango + '</td>' +
            '<td>' + data[key].tmeses + '</td>' +
            '<td>' +
            '<i class="fas fa-trash-alt delete" data-bicycle="' + key + '"></i>' +
            '<i class="fas fa-edit edit" data-bicycle="' + key + '"></i>' +
            '</td>' +
            '</tr>';
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////
    //Modificaciones de Juan <3
    //Modificaciones:
    // Integrado DataTables
    //Reescribiendo el codigo se podria haber acortado bastante con las funciones de datatable add() y remove()
    //Al no querer reescribirlo todo despues de cada modificacion hay un location.reload(); para que vuelva a indexar los datos
    // JQuery cambiado de slim al normal minificado para que incluya AJAX ( Aunque al final no acabe usandolo :( )
    $(document).ready(function() {
        var t = $('#myTable').DataTable();
        $('#addRow').on( 'click', function () {
            t.row.add( [
                data[key].usuario,
                data[key].rango,
                data[key].tmeses,
            ] ).draw( false );
        } );

        // Automatically add a first row of data
        $('#addRow').click();
    } );

    ///////////////////////////////////////////////////////////////////////////////////////////////
    var myTBody = document.getElementById("my-tbody");
    myTBody.innerHTML = rows;

    var editButtons = document.getElementsByClassName("edit");
    var deleteButtons = document.getElementsByClassName("delete");
    for (var i = 0; i < deleteButtons.length; i++) {
        deleteButtons[i].addEventListener("click", deleteBicycle);
        editButtons[i].addEventListener("click", editBicycle);
    }
}

function editBicycle(event) {
    document.getElementById("update-button").style.display = "block";
    document.getElementById("cancel-button").style.display = "block";
    document.getElementById("add-button").style.display = "none";
    operation = UPDATE;

    var buttonClicked = event.target;

    var formBicycle = document.getElementById("form-bicycle");

    keyBicycleToEdit = buttonClicked.getAttribute("data-bicycle");
    var refBicycleToEdit = firebase.database().ref("/BicycleStore/bicycles/" + keyBicycleToEdit);

    refBicycleToEdit.once("value", function (snap) {
        var data = snap.val();

        formBicycle.usuario.value = data.usuario;
        formBicycle.rango.value = data.rango;
        formBicycle.tmeses.value = data.tmeses;
    });


}

function deleteBicycle(event) {
    if (uid == "rnoV3ffjqAQp64AYkMb0vR8OuXS2") {
        var buttonClicked = event.target;

        var keyBicycleToDelete = buttonClicked.getAttribute("data-bicycle");
        var refBicycleToDelete = firebase.database().ref("BicycleStore/bicycles/" + keyBicycleToDelete);
        refBicycleToDelete.remove();
        location.reload()
    } else {
        console.log("No tienes permisos para borrar, pierdete!");
        alert("No tienes permisos para ejecutar esta accion");
    }
};


function initializeFirebase() {
    // Your web app's Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyD2qIy31Yoj8SBpqo-ov1VJYyXDbdQUKpw",
        authDomain: "para-lnd-e7e08.firebaseapp.com",
        databaseURL: "https://para-lnd-e7e08.firebaseio.com",
        projectId: "para-lnd-e7e08",
        storageBucket: "para-lnd-e7e08.appspot.com",
        messagingSenderId: "413249981469",
        appId: "1:413249981469:web:76298d47167d54a5e84af4",
        measurementId: "G-3N4K9KLEJY"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
}