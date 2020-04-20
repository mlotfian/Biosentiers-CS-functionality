$(function() {
    $("#datepicker").on("change",function(){

      // get the user values
        var selected = $(this).val();
        var month = parseInt((selected.split('-')[1]),10)
        var sName = $('#species').val();


        const months = {'1':'January', '2':'February', '3':'March','4':'April',
      '5':'May','6':'June', '7':'July', '8':'August', '9':'September','10':'October',
    '11':'November','12':'December'};
      // call biosentier API
      var settings = {
        "url": "https://biosentiers.heig-vd.ch/api/species?only=periodStart&only=periodEnd&only=commonName.fr&theme=bird",
        "method": "GET",
        "timeout": 0,
      };

      $.ajax(settings).done(function (response) {
        const filterName = response.filter(
          name => name.commonName.fr === sName);
          const startDate = filterName.map(pS => pS.periodStart);
          const endDate = filterName.map(pE => pE.periodEnd);
        if(month<startDate[0] || month>endDate[0]){
          alert(`${sName} seems to be visible in the period of ${months[startDate[0]]} to ${months[endDate[0]]}. Could you please make sure that the species name or the date is inserted correctly? You can insert the information in any case, rare cases can happen!`)
        }
        else {
          console.log("within the period");
        }
      });

    });
});
