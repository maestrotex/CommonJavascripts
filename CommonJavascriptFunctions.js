function validateAadhar(contextobject)
{
    var formContext = contextobject.getFormContext(); 
    var aadhar = formContext.getAttribute("cr8d1_aadharcardno").getValue() ;  
  
    var regexp=/^[2-9]{1}[0-9]{3}\s{1}[0-9]{4}\s{1}[0-9]{4}$/;
    
    if(regexp.test(aadhar))
    {
        alert("Valid Aadhar no."); 
        formContext.ui.clearFormNotification("AADH");
        formContext.ui.clearFormNotification("AADH1");
        formContext.ui.clearFormNotification("AADH2");
    }   
    else
    {
        alert("Invalid Aadhar no.");
        formContext.ui.setFormNotification("Invalid Aadhar no.","INFO","AADH");
        formContext.ui.setFormNotification("Invalid Aadhar no.","WARNING","AADH1");
        formContext.ui.setFormNotification("Invalid Aadhar no.","ERROR","AADH2");
    }
}

function generatePayment(contextobject)
{
    var formContext = contextobject;
    var studentname = formContext.getAttribute("cr8d1_studentname").getValue() ;  
   
    var recordId = formContext.data.entity.getId();
    var stdId = recordId.replace("{", "").replace("}", "");
    var fees = prompt("Enter Fees");
       
    var data =
            {
                "cr8d1_name": "Payment info",
                "cr8d1_Student@odata.bind": "/cr8d1_students("+ stdId + ")",
                "cr8d1_fees": parseFloat(fees),
                "cr8d1_duedate" : new Date(),
                "cr8d1_paymentterms" : 346630000            
            }
            

            var confirmStrings = { text:"Are you sure you want to create payment?", title:"Confirmation" };
            var confirmOptions = { height: 200, width: 450 };
            Xrm.Navigation.openConfirmDialog(confirmStrings, confirmOptions).then(
            function (success) {    
                if (success.confirmed)
                {
                    Xrm.WebApi.createRecord("cr8d1_payment", data).then(
                        function success(result) {
                                        var alertStrings = { confirmButtonLabel: "Yes", text: "Payment Created", title: "Message" };
                                        var alertOptions = { height: 120, width: 260 };
                                        Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                                            function (success) {
                                                console.log("Alert dialog closed");
                                            },
                                            function (error) {
                                                console.log(error.message);
                                            }
                                        );
                        },
                        function (error) {
                            alert(error.message);
                        }
                    );
                 }
                else
                    console.log("Dialog closed using Cancel button or X.");
            });

}

function setNameFormatted(contextobject)
{
    var formContext = contextobject.getFormContext(); 
    var studentname = formContext.getAttribute("cr8d1_studentname").getValue();  
    var email = formContext.getAttribute("cr8d1_email").getValue();  
    var phone = formContext.getAttribute("cr8d1_phonenumber").getValue();  
    formContext.getAttribute("cr8d1_studentname").setValue(studentname + "-" + email + "-" + phone);  


}

function onLoad()
{
var fetchXml = "?fetchXml=<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'><entity name='cr8d1_student'><attribute name='cr8d1_studentid' /><attribute name='cr8d1_studentname' /><attribute name='createdon' /><order attribute='cr8d1_studentname' descending='false' /><filter type='and'><condition attribute='cr8d1_age' operator='gt' value='10' /></filter></entity></fetch>";

Xrm.WebApi.retrieveMultipleRecords("cr8d1_student", fetchXml).then(
    function success(result) {
        for (var i = 0; i < result.entities.length; i++) {
            alert(result.entities[i].cr8d1_studentname);
        }                    

        // perform additional operations on retrieved records
    },
    function (error) {
        console.log(error.message);
        // handle error conditions
    }
);
}



