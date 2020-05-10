
function predict_click() {
  document.getElementById('submitButton').disabled = true;
  setTimeout(function(){
       document.getElementById("submitButton").disabled = false;
     }, 4000);
  var file = document.querySelector("input[type=file]").files[0];
  var reader = new FileReader();

  // load local file picture
  reader.addEventListener("load", function () {
    var localBase64 = reader.result.split("base64,")[1];
    doPredict({ base64: localBase64 });

  }, false);

  if (file) {
    reader.readAsDataURL(file);
  }

}


/*
  Purpose: Does a v2 prediction based on user input
  Args:
    value - { base64 : base64Value }
*/
function doPredict(value) {
  //document.getElementById('submitButton').disabled = true;
  app.models.predict(Clarifai.GENERAL_MODEL, value).then(
    function(response) {
      var concepts = response['outputs'][0]['data']['concepts'];
      console.log(concepts);
      const userSelection = document.getElementById('species_type').value;
      const evaluationResult = concepts.filter(
        concept => concept.name === userSelection && concept.value >= 0.9);
      if (evaluationResult.length == 0) {
        sweetAlert({
          title: "Please confirm",
          text: `Our image recognition model says that a ${userSelection} is not present in this photo.
          Could you please make sure the observation type is selected correctly?
          Yes, of course we trust you more than the machine :)`,
          icon: "warning",
          dangerMode: true,
          })

          document.getElementById("Flagimage").value = "true";
      }
      console.log(evaluationResult);
    },
    function(err) {
      console.log(err);
    }
  );
}
