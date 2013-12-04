       $(function()
        {
    	    $(".doIt-wrapper").show();
			$(".progress-status-wrapper").show();	

    	    $("input").focus(function()
    	    {
    	    $(".doIt-wrapper").hide();
			$(".progress-status-wrapper").hide();	
    	    });

        });