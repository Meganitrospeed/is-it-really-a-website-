function initialize () {
    firstOperand = document.getElementById("first")
    secondOperand = document.getElementById("second")
    result = document.getElementById("result")
    sumForm = document.getElementById("submit")
    sumForm.addEventListener("submit",calculateSum)
}
function calculatesum() {
    var sumResult = parseInt(firstOperand.value) + parseInt(secondOperand.value);
    result.innerHTML = sumResult;
}