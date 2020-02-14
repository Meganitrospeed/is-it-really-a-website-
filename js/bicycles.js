window.onload = initialize;

const ADD = "add";
const UPDATE = "update";
var operation = ADD;
var keyBicycleToEdit;
function initialize() {
    initializeFirebase();

    document.getElementById("cancel-button").addEventListener("click", resetForm);

    captureSubmitEventWhenAddingItem();

    downloadBicycles();
}

function resetForm() {
    document.getElementById("update-button").style.display = "none";
    document.getElementById("cancel-button").style.display = "none";
    document.getElementById("add-button").style.display = "block";
    operation = ADD;
}

function captureSubmitEventWhenAddingItem() {
    document.getElementById("form-bicycle").addEventListener("submit", addOrUpdateItem);
}

function addOrUpdateItem(event) {
    event.preventDefault();

    var formItems = event.target;

    if (operation == ADD) {
        var refBicycles = firebase.database().ref("BicycleStore/bicycles");
        refBicycles.push({
            usuario: formItems.usuario.value,
            rango: formItems.rango.value,
            tmeses: formItems.tmeses.value
        });
        location.reload();
    } else {
        var refBicycles = firebase.database().ref("BicycleStore/bicycles/" + keyBicycleToEdit);

        refBicycles.update({
            usuario: formItems.usuario.value,
            rango: formItems.rango.value,
            tmeses: formItems.tmeses.value
        });
        location.reload();
        document.getElementById("update-button").style.display = "none";
        document.getElementById("cancel-button").style.display = "none";
        document.getElementById("add-button").style.display = "block";
        operation = ADD;
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
    var buttonClicked = event.target;

    var keyBicycleToDelete = buttonClicked.getAttribute("data-bicycle");
    var refBicycleToDelete = firebase.database().ref("BicycleStore/bicycles/" + keyBicycleToDelete);
    refBicycleToDelete.remove();
    location.reload();
}

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