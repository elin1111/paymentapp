console.log("started");

const cardField = document.getElementById("xcardnum");
const cvvField = document.getElementById("xcvv");

setAccount("ifields_cardknoxdev6b1b1631c4d24117befb618917", "EN", "2");
const paymentForm = document.getElementById("payment-form");
paymentForm.addEventListener("submit", function (e) {
    console.log("event");
    e.preventDefault();
    const submitBtn = document.getElementById("submit-btn");
    submitBtn.disabled = true;
    getTokens(
        function () {
            console.log("Success");
            console.log(cardField.value, cvvField.value);
            console.log(process(paymentForm));
            //document.getElementById('payment-form').submit();
        },
        function () {
            //onError
            console.log("Error");
            submitBtn.disabled = false;
        },
        30000 //30 second timeout
    );
});

function process(formElement) {
    let formData = {};
    // Loop through all form elements
    let duplicate = document.getElementById("xallowduplicate")
    for (var i = 0; i < formElement.elements.length; i++) {
        var element = formElement.elements[i];
        // Check if the element is an input element with a name and value
        if (element.type !== "submit" && element.id) {
            formData[element.id] = element.value;
        }
    }
    if (duplicate.checked) {
        formData["xallowduplicate"] = "true"
    }
    
    // formData["xversion"] = "5.0.0";
    // formData["xsoftwarename"] = "ennb";
    // formData["xsoftwareversion"] = "0.0.1";
    let payload = {
        url: "https://x1.cardknox.com/gatewayjson",
        json: formData,
    };
    // Convert formData object to JSON
    let jsonData = JSON.stringify(payload);
    let xhr = new XMLHttpRequest();
    let url = "/submit";
    xhr.responseType = "json"
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
        let response = xhr.response;
        console.log(response);
        if (response.Response.xResult == "V") {
            console.log(response.Response)
            verify3DS(response.Response);
        } else {
            // transaction is complete and no further processing is necessary
            console.log(response);
        }
    };
    xhr.send(jsonData);
}

let style = {
    padding: "3px",
    width: "1px",
    "font-family": "Poppins sans-serif",
    "font-weight": 400,
    width: "85%",
    height: "21px",
    padding: "9px 20px",
    "text-align": "left",
    border: 0,
    outline: 0,
    "border-radius": "6px",
    "background-color": "#fff",
    "font-size": "15px",
    "font-weight": 300,
    color: "#8D8D8D",
    transition: "all 0.3s ease",
    //"margin-top": "16px",
};
setIfieldStyle("card-number", style);
setIfieldStyle("cvv", style);

enable3DS("staging", handle3DSResults);

function handle3DSResults(
    actionCode,
    xCavv,
    xEciFlag,
    xRefNum,
    xAuthenticateStatus,
    xSignatureVerification
) {
    let url = "/submit";
    var postData = {
        xRefNum: xRefNum,
        xCavv: xCavv,
        xEci: xEciFlag,
        x3dsAuthenticationStatus: xAuthenticateStatus,
        x3dsSignatureVerificationStatus: xSignatureVerification,
        x3dsActionCode: actionCode,
        x3dsError: ck3DS.error,
    };
    
    // postData["xversion"] = "5.0.0";
    // postData["xsoftwarename"] = "ennb";
    // postData["xsoftwareversion"] = "0.0.1";
    let fullpostdata = {
        url: "https://x1.cardknox.com/verifyjson",
        json: postData,
    };
    let jsonData = JSON.stringify(fullpostdata);
    console.log(jsonData)
    let xhr = new XMLHttpRequest();
    xhr.responseType = "json"
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
        console.log(xhr.response)
    }
    xhr.send(jsonData)
    // $.ajax({
    //     method: "POST",
    //     url: url,
    //     data: fullpostdata,
    // })
    //     .done(function (resp) {
    //         console.log(resp);
    //         // handle the server response
    //     })
    //     .fail(function (xhr, status, err) {
    //         console.log(xhr, status, err);
    //         // handle a failure
    //     });
}
