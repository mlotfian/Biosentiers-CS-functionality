const months = {'1':'January', '2':'February', '3':'March','4':'April',
'5':'May','6':'June', '7':'July', '8':'August', '9':'September','10':'October',
'11':'November','12':'December'};

$(function() {
    $("#datepicker").on("change",function(){

      // get the user values
        var selected = $(this).val();
        var month = parseInt((selected.split('-')[1]),10)
        var sName = $('#species').val();

      // call biosentier API
      var settings = {
        "url": "https://biosentiers.heig-vd.ch/api/species?only=periodStart&only=periodEnd&only=commonName.fr&theme=bird",
        "method": "GET",
        "timeout": 0,
      };

      // make the comparison with the API response and give the feedback
      $.ajax(settings).done(function (response) {
        const filterName = response.filter(
          name => name.commonName.fr === sName);
          console.log(filterName);
          if(filterName.length == 1){
            const startDate = filterName[0].periodStart;
            const endDate = filterName[0].periodEnd;
            // const startDate = filterName.map(pS => pS.periodStart);
            // const endDate = filterName.map(pE => pE.periodEnd);
          if(month<startDate || month>endDate){
            alert(`${sName} seems to be visible in the period of ${months[startDate]} to ${months[endDate]}.
          Could you please make sure that the species name or the date is inserted correctly?
          You can insert the information in any case, rare cases can happen!`)
          }
          else {
            console.log("Input date is within the visibilty period");
          }
          }
          else {
            console.log("API has changed!");
          }

      });

    });
});
