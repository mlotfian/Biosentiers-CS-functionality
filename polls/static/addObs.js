// get all the names

var settings_names = {
  "async": false,
  "url": "https://biolocation.heig-vd.ch:5000/v1/names",
  "method": "GET",
  "timeout": 0,
};

var listNames = function birdName(){
  var allNames = null;
  $.ajax(settings_names).done(function(response) {
  //console.log(response.names[0]);
   allNames = response.names;
});
return allNames;
}();


// disable next button before selection of the location, and enable it

const selectElement = document.querySelector('.leaflet-container-default');
selectElement.addEventListener('click', (event) => {
  document.getElementById("nextBtn").disabled = false;
});


function enableNextButton() {
  document.getElementById("nextBtn").disabled = false;
}



$(document).ready(function() {
  $('.selectpicker').select2({
    width: '180px'
  });
});

$(document).ready(function() {

  // create DatePicker from input HTML element
  $("#datepicker").kendoDatePicker({
    popup: {
      position: "bottom left",
      origin: "top left"
    }
  });

});



// <!--  Autocomplete name, from BioSentiers db -->

var speciesNameInput = document.getElementById("species");

var awesomplete = new Awesomplete(speciesNameInput, {
  minChars: 1,
  autoFirst: true
});

$("#observation_type").on("change", function() {
  var selectedObsType1 = $("#observation_type :selected").text()
  console.log(selectedObsType1)
  var selectedObsType = $("#observation_type :selected").text().split(' ')[0].toLowerCase();
  $.ajax({
      url: 'https://biosentiers.heig-vd.ch/api/species?only=commonName.fr&theme=' + selectedObsType,
      type: 'GET',
      dataType: 'json'
    })
    .success(function(data) {
      var list = [];
      $.each(data, function(key, value) {
        list.push(value.commonName.fr);
      });
      awesomplete.list = list;
    });
});



////// test bird autocomplete with names taken from biolocation database

var birdNameInput = document.getElementById("third");

var awesomplete2 = new Awesomplete(birdNameInput, {
  minChars: 1,
  autoFirst: true
});

var settings = {
  "url": "https://biolocation.heig-vd.ch:5000/v1/names",
  "method": "GET",
  "timeout": 0,
};

$.ajax(settings).done(function(response) {
  awesomplete2.list = response.names
});



//////


var currentTab = 0; // Current tab is set to be the first tab (0)
showTab(currentTab); // Display the current tab

function showTab(n) {
  // This function will display the specified tab of the form...
  var x = document.getElementsByClassName("tab");
  x[n].style.display = "block";
  //... and fix the Previous/Next buttons:
  if (n == 0) {
    document.getElementById("prevBtn").style.display = "none";
    document.getElementById("submitButton").style.display = "none";
  } else if (n == (x.length - 1)) {
    document.getElementById("nextBtn").style.display = "none";
    document.getElementById("submitButton").style.display = "inline";
    document.getElementById("prevBtn").style.display = "inline";
  } else {
    document.getElementById("submitButton").style.display = "none";
    document.getElementById("prevBtn").style.display = "inline";
    document.getElementById("nextBtn").style.display = "inline";
  }
  //... and run a function that will display the correct step indicator:
  fixStepIndicator(n)
}



// the next and previous function

function nextPrev(n) {

//console.log(listNames)
  var sp_name = $("#third").val();
  //console.log(response.names);
// we check whether we are in the step to add the bird species name and if we have selected the third option (typing the bird name)
// and then if yes, to give the probability of occurence of species in that location when we click next
  if (n == 1 && $("#birdSt").hasClass("checkAPI") && $("#third").hasClass("species_form") && $("#third").val() != "" && listNames.includes(sp_name)) {

    var settings = {
      "url": "https://biolocation.heig-vd.ch:5000/v1/predict?lat=" + lat + "&lon=" + lng + "&sp_name=" + sp_name,
      "method": "POST",
      "timeout": 0,
    };
    $.ajax(settings).done(function(response) {

      if(response['probability of occurrence']<=50){
        sweetAlert({
          title: "Please confirm",
          text: `The probability of observing ${sp_name} in a neighbourhood of 1km around your location is ${response['probability of occurrence']}
        percent. This species could be usually observed in ${response.habitat}. Please make sure the location or the species name is added correctly.`,
          icon: "warning",
          dangerMode: true,
        })
        document.getElementById("FlagLocation").value = "true";

      }

      else{
        sweetAlert({
          title: "For your information",
          text: `The probability of observing ${sp_name} in a neighbourhood of 1km around your location is ${response['probability of occurrence']}
        percent. This species could be usually observed in ${response.habitat}`,
          icon: "warning",
          dangerMode: true,
        })

        document.getElementById("FlagLocation").value = "false";
      }

      $("#birdSt").removeClass("checkAPI")

    })

  } else { // if we are in any other step, do not give location feedback

    if (n == -1 && $("#nameSt").hasClass("active")) {
      $("#birdSt").addClass("checkAPI")
    }
    if (n == -1 && $("#birdSt").hasClass("active")) {
      document.getElementById('third').value = "";
    }
    // This function will figure out which tab to display
    var x = document.getElementsByClassName("tab");
    // Exit the function if any field in the current tab is invalid:
    if (n == 1 && !validateForm()) return false;
    // Hide the current tab:
    x[currentTab].style.display = "none";
    // Increase or decrease the current tab by 1:
    currentTab = currentTab + n;
    // if you have reached the end of the form...
    if (currentTab >= x.length) {
      // ... the form gets submitted:
      document.getElementById("regForm").submit();
      return false;
    }
    // Otherwise, display the correct tab:
    showTab(currentTab);
    // } is for the close else
  }

}

// select tag validation


function validateForm() {
  // This function deals with validation of the form fields
  var x, y, i, valid = true;
  var selectedObsType = $("#observation_type :selected").text().split(' ')[0].toLowerCase();


  x = document.getElementsByClassName("tab");
  y = x[currentTab].querySelectorAll("select, input");
  // A loop that checks every input field in the current tab:
  for (i = 0; i < y.length; i++) {
    // If a field is empty...
    if (y[i].value == "" || y[i].value == "mm/dd/yyyy") {
      if (selectedObsType == "bird" && $("#birdSt").hasClass("active")) {
        var radios = document.querySelectorAll('#option1, #option2, #option3');
        if (radios[0].checked == false && radios[1].checked == false && radios[2].checked == false) {
          valid = false;
        } else if (radios[1].checked == true) {
          if (!$("input:radio[name='ans']").is(":checked")) {
            valid = false
          }
        } else if (radios[2].checked == true) {
          if ($("#third").val() == "") {
            valid = false;
            $("#third").addClass("invalid")
          }
        } else {
          valid = true;
        }
      } else if (selectedObsType != "bird" && $("#birdSt").hasClass("active")) {
        if ($("#species").val() == "") {
          valid = false;
          $("#species").addClass("invalid")
        } else {
          valid = true;
        }
      }
      // add an "invalid" class to the field:
      else {
        y[i].className += " invalid";
        // and set the current valid status to false
        valid = false;
      }

    }
  }
  // If the valid status is true, mark the step as finished and valid:
  if (valid) {
    document.getElementsByClassName("step")[currentTab].className += " finish";
  }
  return valid; // return the valid status
}


function fixStepIndicator(n) {
  // This function removes the "active" class of all steps...
  var i, x = document.getElementsByClassName("step");
  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  //... and adds the "active" class on the current step:
  x[n].className += " active";
}

// the radio buttons for adding the species name

var radios = document.querySelectorAll('#option1, #option2, #option3');
var second = document.getElementById('second');
var third = document.getElementById('third');

second.style.display = 'none'; // show
third.style.display = 'none'; // hide
// for (var i = 0; i < radios.length; i++) {
//   radios[i].onclick = function() {
//     var val = this.value;
//     if (val == 'radio1') {
//       second.style.display = 'none';
//       third.style.display = 'none';
//     } else if (val == 'radio2') {
//       second.style.display = 'block';
//       third.style.display = 'none';
//     } else if (val == 'radio3') {
//       second.style.display = 'none';
//       third.style.display = 'block';
//     }
//
//   }
// }

$(document).ready(function() {
  $("#observation_type").change(function() {
    var selectedObsType = $("#observation_type :selected").text().split(' ')[0].toLowerCase();


    if (selectedObsType == "bird") {


      console.log(suggestion)

      document.getElementById("option1").checked = false
      document.getElementById("option2").checked = false
      document.getElementById("option3").checked = false
      second.style.display = 'none';
      third.style.display = 'none';
      $(".sp_name1").hide(); // hide the text field
      $(".sp_name2").show();

      for (var i = 0; i < radios.length; i++) {
        radios[i].onclick = function() {
          var val2 = this.value;

          if (val2 == "radio1") {
            second.style.display = 'none';
            third.style.display = 'none';

            if ($("#label2").hasClass("btn-info")) {
              $("#label2").removeClass("btn-info");
              $("#label2").addClass("btn-light")
            }
            if ($("#label3").hasClass("btn-info")) {
              $("#label3").removeClass("btn-info");
              $("#label3").addClass("btn-light")
            }
            $("#label1").removeClass("btn-light")
            $("#label1").addClass("btn-info")

            document.getElementById("blackBar").style.height = "50%";
            document.getElementById("blackBar").style.top = "45%";

            // if suggestion is not empty uncheck the inner radio buttons
            if ($("#second").children().length != 0) {
              for (var iter = 6; iter < 12; iter++) {
                document.getElementById(iter).checked = false
              };
            }

            // remove classname and name from other elements and add it only to the element selected by user
            if ($("#species").hasClass("species_form")) {
              $("#species").removeClass("species_form");
              document.getElementById("species").removeAttribute("name");
            };
            if ($("#second").children().length !== 0) {
              if ($("#second input[type='hidden']").hasClass("species_form")) {
                $("#second input[type='hidden']").removeClass("species_form");
                for (var x of Array(5).keys()) {
                  document.getElementById(x + 1).removeAttribute("name");
                };
              }
            };
            if ($("#third").hasClass("species_form")) {
              $("#third").removeClass("species_form");
              document.getElementById("third").removeAttribute("name");
            };
            $("#op1").addClass("species_form");
            $('#op1').attr('name', 'name');
          } else if (val2 == "radio2") {
            second.style.display = 'block';
            third.style.display = 'none';

            if ($("#label1").hasClass("btn-info")) {
              $("#label1").removeClass("btn-info");
              $("#label1").addClass("btn-light")
            }
            if ($("#label3").hasClass("btn-info")) {
              $("#label3").removeClass("btn-info");
              $("#label3").addClass("btn-light")
            }
            $("#label2").removeClass("btn-light")
            $("#label2").addClass("btn-info")

            document.getElementById("blackBar").style.height = "58%";
            document.getElementById("blackBar").style.top = "40%";


            if ($("#species").hasClass("species_form")) {
              $("#species").removeClass("species_form");
              document.getElementById("species").removeAttribute("name");
            };
            if ($("#op1").hasClass("species_form")) {
              $("#op1").removeClass("species_form");
              document.getElementById("op1").removeAttribute("name");
            };
            if ($("#third").hasClass("species_form")) {
              $("#third").removeClass("species_form");
              document.getElementById("third").removeAttribute("name");
            };
            var form = document.getElementById('second');
            if ($("#second").children().length == 0) {
              var i = 1; // for the hidden buttons which save the soecies names
              var k = 6; // for radio buttons
              var s = 11; // for the span which illustrates the text of the species

              suggestion.forEach(function(sp) {
                var input = document.createElement('input')
                input.id = k;
                input.type = 'radio';
                input.name = 'ans';
                //input.value = sp.sp_name;
                var link = document.createElement("a");
                link.setAttribute("href", sp.url);
                link.setAttribute("target", "_blank");

                var input_hidden = document.createElement('input')
                input_hidden.id = i
                input_hidden.type = 'hidden';
                // input_hidden.name = 'name';
                // input_hidden.className = "species_form";
                input_hidden.value = sp.sp_name;

                var span = document.createElement("span");

                span.id = s;
                var txt = " " + sp.sp_name;
                var textNode = document.createTextNode(txt);
                link.appendChild(textNode);
                span.appendChild(link);
                // /* var span = document.createElement('span');


                // span.textContent = sp.sp_name;
                form.appendChild(input);
                form.appendChild(input_hidden);
                form.appendChild(span);

                form.appendChild(document.createElement('br'));
                k++;
                i++;
                s++;
              });

            }
            var all_suggest = document.querySelectorAll("[id='6'], [id='7'], [id='8'], [id='9'], [id='10']");
            //console.log(all_suggest)
            for (var j of Array(5).keys()) {
              all_suggest[j].onclick = function() {
                var val3 = this.id;
                var ids = ["6", "7", "8", "9", "10"]
                var ids_hidden = ["1", "2", "3", "4", "5"]
                for (var el of ids) {
                  var filterId = ids_hidden.filter(function(item) {
                    return item !== ids_hidden[ids.indexOf(el)]
                  })
                  if (val3 == el) {
                    for (var el2 of filterId) {
                      if ($("#" + el2).hasClass("species_form")) {
                        $("#" + el2).removeClass("species_form");
                        document.getElementById(el2).removeAttribute("name");
                      };
                      $("#" + ids_hidden[ids.indexOf(el)]).addClass("species_form");
                      $("#" + ids_hidden[ids.indexOf(el)]).attr('name', 'name');
                    }
                  }
                }
              }

            }
          } else if (val2 == "radio3") {
            second.style.display = 'none';
            third.style.display = 'block';

            if ($("#label1").hasClass("btn-info")) {
              $("#label1").removeClass("btn-info");
              $("#label1").addClass("btn-light")
            }
            if ($("#label2").hasClass("btn-info")) {
              $("#label2").removeClass("btn-info");
              $("#label2").addClass("btn-light")
            }
            $("#label3").removeClass("btn-light")
            $("#label3").addClass("btn-info")

            document.getElementById("blackBar").style.height = "50%";
            document.getElementById("blackBar").style.top = "45%";

            // if suggestion is not empty uncheck the inner radio buttons
            if ($("#second").children().length != 0) {
              for (var iter = 6; iter < 12; iter++) {
                document.getElementById(iter).checked = false
              };
            }

            // remove classname and name from other elements and add it only to the element selected by user
            if ($("#species").hasClass("species_form")) {
              $("#species").removeClass("species_form");
              document.getElementById("species").removeAttribute("name");
            };
            if ($("#op1").hasClass("species_form")) {
              $("#op1").removeClass("species_form");
              document.getElementById("op1").removeAttribute("name");
            };
            if ($("#second").children().length !== 0) {
              if ($("#second input[type='hidden']").hasClass("species_form")) {
                $("#second input[type='hidden']").removeClass("species_form");
                for (var x of Array(5).keys()) {
                  document.getElementById(x + 1).removeAttribute("name");
                };
              }
            };
            $("#third").addClass("species_form");
            $('#third').attr('name', 'name');
          }

        }
      }

      // the else part is when the species selected is not bird >> either butterfly, tree or flower

    } else {

      if ($("#label1").hasClass("btn-info")) {
        $("#label1").removeClass("btn-info");
        $("#label1").addClass("btn-light")
      }
      if ($("#label2").hasClass("btn-info")) {
        $("#label2").removeClass("btn-info");
        $("#label2").addClass("btn-light")
      }
      if ($("#label3").hasClass("btn-info")) {
        $("#label3").removeClass("btn-info");
        $("#label3").addClass("btn-light")
      }


      // if suggestion is not empty uncheck the inner radio buttons
      if ($("#second").children().length != 0) {
        for (var iter = 6; iter < 12; iter++) {
          document.getElementById(iter).checked = false
        };
      }

      // remove classname and name from other elements and add it only to the element selected by user
      if ($("#op1").hasClass("species_form")) {
        $("#op1").removeClass("species_form");
        document.getElementById("op1").removeAttribute("name");
      };
      if ($("#second").children().length !== 0) {
        if ($("#second input[type='hidden']").hasClass("species_form")) {
          $("#second input[type='hidden']").removeClass("species_form");
          for (var x of Array(5).keys()) {
            document.getElementById(x + 1).removeAttribute("name");
          };
        }
      };
      if ($("#third").hasClass("species_form")) {
        $("#third").removeClass("species_form");
        document.getElementById("third").removeAttribute("name");
      };
      $(".sp_name2").hide(); // hide the bird radio buttons options
      $(".sp_name1").show(); // show the text field for other species besides birds
      $("#species").addClass("species_form");
      $('#species').attr('name', 'name');


    }

  });
})
//console.log(suggestion)



/// change the blackbar height and top

var goNext = document.getElementById('change1');
var prev = document.getElementById('prev');

function blackBar(el) {
  el.onclick = function() {
    var selectedObsType = $("#observation_type :selected").text().split(' ')[0].toLowerCase();
    if ($("#birdSt").hasClass("active") && selectedObsType == 'bird') {
      if ($('#option2').is(':checked')) {
        document.getElementById("blackBar").style.height = "58%";
        document.getElementById("blackBar").style.top = "40%";
      } else {
        document.getElementById("blackBar").style.height = "50%";
        document.getElementById("blackBar").style.top = "45%";
      }

    } else {
      document.getElementById("blackBar").style.height = "15%";
      document.getElementById("blackBar").style.top = "80%";
    }
  }
}
blackBar(goNext)
blackBar(prev)
