/* Tallennus localstorageen - sisältää kaikki*/
$(function() {
    var i = Number(localStorage.getItem('todo-counter')) + 1,
        j = 0,
        k,
        $form = $('#todo-form'),
        $removeLink = $('#show-items li a'),
        $itemList = $('#show-items'),
        $editable = $('.editable'),
        $clearAll = $('#clear-all'),
        $newTodo = $('#todo'),
        order = [],
        orderList;
 
    // Lataa todo-listan
    orderList = localStorage.getItem('todo-orders');
     
    orderList = orderList ? orderList.split(',') : [];
     
    for( j = 0, k = orderList.length; j < k; j++) {
        $itemList.append(
            "<li id='" + orderList[j] + "'>"
			+ "<input type='checkbox' class='checkbox'>"
            + "<span class='editable'>"
            + localStorage.getItem(orderList[j])
            + "</span> <a class='poisto' href='#'>X</a></li>" //Poistomahdollisuuden voi ottaa myöhemmin pois
        );
    }
         
    // Lisää todo:n
    $form.submit(function(e) {
        e.preventDefault();
        $.publish('/add/', []);
		//$('ul li').css('background-color', '#8ae1e6'); //vaihtaa todo-työn värin siniseksi
    });
	
	// Vaihtaa taustaväriä ym.
	
	$(function(){

	$('#body').css('background-color',localStorage.bgcolor);
	$('#body').css('background-image',localStorage.bgimage);
	$('#todo').css('background-color',localStorage.bgcolorTodo);
	$('#todo').css('border',localStorage.border);
	$('#submit').css('background-image',localStorage.bgsubmit);
	$('ul li').css('background-color',localStorage.bgUl);
	$('#text').css('display',localStorage.hideText);
	$('#do-when').css('display',localStorage.showDo);
	$('#do-time').css('display',localStorage.showTime);
	$('#doItNow').css('display',localStorage.showDo);
	

   $('#todo').focus(function(){
     localStorage.bgcolor = "#14c3cc";
     $('#body').css('background-color',localStorage.bgcolor);
	 
	 localStorage.bgimage = "none";
     $('#body').css('background-image',localStorage.bgimage);
	 
	 localStorage.bgcolorTodo = "#8ae1e6";
     $('#todo').css('background-color',localStorage.bgcolorTodo);
	 
	localStorage.border = "solid 2px #c5f0f3";
     $('#todo').css('border',localStorage.border);
	 
	 localStorage.bgsubmit = "url('images/button_sin.png')";
     $('#submit').css('background-image',localStorage.bgsubmit);
	 
	 /*localStorage.bgUl = "#8ae1e6";
     $('ul li').css('background-color',localStorage.bgUl);*/
	 
	 localStorage.hideText = "none";
     $('#text').css('display',localStorage.hideText);
	 
	 localStorage.showDo = "block";
     $('#do-when').css('display',localStorage.showDo);
	 
	 localStorage.showTime = "block";
     $('#do-time').css('display',localStorage.showTime);
	 
   });
   $('#submit').click(function() {
	localStorage.showDoit = "block";
   $('#doItNow').css('display',localStorage.showDo);
   });
});
	
	/*$('#todo').focus(function () {
		$('#todo').css('background-color', '#8ae1e6').css('border', 'solid 2px #c5f0f3');
		$('#body').css('background-image', 'none').css('background-color', '#14c3cc');
		$('#submit').css('background-image', 'url("images/button_sin.png")');
		$('ul li').css('background-color', '#8ae1e6');
		$('#text').css('display', 'none');
		$('#do-when').css('display', 'block');
		$('#do-time').css('display', 'block');
	
	});*//*.blur(function() {
			$('#text').css('display', 'inline');
		});*/
		//Ylläolevalla piilotetulla koodilla voidaan tulla näkyviin takaisin piilotetut divit


    // Poistaa yksittäisen todo:n, jätin tämän toistaiseksi tähän
    $itemList.delegate('a', 'click', function(e) {
        var $this = $(this);
        e.preventDefault();
        $.publish('/remove/', [$this]);
		var laskuri = $('input[type="checkbox"]:checked').length;
		var countList = $("#show-items").children("li").length - 1;
		var val = laskuri / countList;
		document.getElementById("progressbar").value = val;
    });
     
    // Lajittelee (sort) yksittäisiä todo-tehtäviä
	
	/*$itemList.sortable({
       items: "li:not(.ui-li-divider)"
    });*/
    $itemList.sortable();
    $itemList.disableSelection();
    $itemList.bind( "sortstop", function(event, ui) {
      // $itemList.listview('refresh');
	  $.publish('/regenerate-list/', []);
    });
	

	/*$itemList.sortable({
        revert: true,
        stop: function() {
            $.publish('/regenerate-list/', []);
        }
    });*/
     
    // Muokkaa ja tallentaa todo:n localstorageen
    $editable.inlineEdit({
        save: function(e, data) {
                var $this = $(this);
                localStorage.setItem(
                    $this.parent().attr("id"), data.value
                );
            }
    });
 
    // Tyhjentää kaikki, otin tämän pois kommentilla myös html:stä
    /*$clearAll.click(function(e) {
        e.preventDefault();
        $.publish('/clear-all/', []);
    });*/
 
    // Fade In and Fade Out efektiä poistolinkkin hoveriin
    $itemList.delegate('li', 'mouseover mouseout', function(event) {
        var $this = $(this).find('a');
        if(event.type === 'mouseover') {
            $this.stop(true, true).fadeIn();
        } else {
            $this.stop(true, true).fadeOut();
        }
    });
         
    // Subscribes
    $.subscribe('/add/', function() {
        if ($newTodo.val() !== "") {
            // Ottaa input-kentän arvon ja tallentaa sen localstorageen
            localStorage.setItem(
                "todo-" + i, $newTodo.val()
            );
             
            // Asettaa todo:n maksimi laskurin niin, että lista ei resetoidu, kun sivu päivitetään
            localStorage.setItem('todo-counter', i);
             
            // Liittää uuden todo-työn arvon (value)
            $itemList.append(
                "<li id='todo-" + i + "'>"
                + "<span class='editable'>"
                + localStorage.getItem("todo-" + i)
                + " </span><a href='#'>x</a></li>"
            );
 
            $.publish('/regenerate-list/', []);
 
            // Piilottaa uuden listan ja fade in
            $("#todo-" + i)
                .css('display', 'none')
                .fadeIn();
             
            // Tyhjentää input-kentän
            $newTodo.val("");
             
            i++;
        }
    });
     
    $.subscribe('/remove/', function($this) {
        var parentId = $this.parent().attr('id');
         
        // Poistaa todo-työn localstoragesta klikatun parent elementin id:n perusteella
        localStorage.removeItem(
            "'" + parentId + "'"
        );
         
        // Fade out-efekti, kun todo-työ poistetaan DOMista
        $this.parent().fadeOut(function() {
            $this.parent().remove();
             
            $.publish('/regenerate-list/', []);
        });
    });
     
    $.subscribe('/regenerate-list/', function() {
        var $todoItemLi = $('#show-items li');
        // Tyhjentää järjestys arrayn
        order.length = 0;
         
        // Käy läpi todo-työt listalta, nappaa ID:n ja työntää (push) sen arrayhin
        $todoItemLi.each(function() {
            var id = $(this).attr('id');
            order.push(id);
        });
         
        // Muuttaa arrayn stringiksi ja tallentaa localstorageen
        localStorage.setItem(
            'todo-orders', order.join(',')
        );
    });
     
    $.subscribe('/clear-all/', function() {
        var $todoListLi = $('#show-items li');
         
        order.length = 0;
        localStorage.clear();
        $todoListLi.remove();
    });
	
	// Vaihtaa tekstit NOW!, Within 1 week, Before...
	$('html').addClass('js');

	$(function() {
	  var counter = 1;
	  $('#do-time').click(function() {
		$('div','#do-time')
		  .stop() 
		  .hide() 
		  .filter( function() { return this.id.match('div' + counter); })
		  .show('fast');
		counter == 3? counter = 1 : counter++; 
		return false; 
	  });
	});
	
	//Kun klikkaa DONE-nappulaa finishing_task.html, niin kaikki poistuu localstoragesta
	$('#done').click(function(){
		localStorage.clear();
   });
   $('#done_orange').click(function(){
		localStorage.clear();
   });
   $('#giveup_black').click(function(){
		localStorage.clear();
   });
   
   	// Listan laskemiseen
	//var countList = $("#show-items").children("li").length;
	//alert(countList);
	
	
	//laskee valittujen checkboxien määrän. Vielä kun saisi laskemaan
//aina kun uusi boxi valitaan
//var laskuri = $('input[type="checkbox"]:checked').length;
	//alert(laskuri);

//$('#laskuri').click(function(){
	                                    
	//alert($('input[type="checkbox"]:checked').length);

	//});
	
// tarkistaa onko rivejä listassa ennen kuin siirtyy seuraavalle sivulle
$("#goBack").click(function()
  {
  window.history.back()
  });
  
$("#letsDo").click(function(){
		var countList = $("#show-items").children("li").length;
		if (countList > 0) {
			window.location.href="inprogress.html"
		}
	});
	
	$(".checkbox").click(function(){
	var laskuri = $('input[type="checkbox"]:checked').length;
	var countList = $("#show-items").children("li").length;
	var val = laskuri / countList;
	document.getElementById("progressbar").value = val;
	});
	
	//$(".poisto").ready(function(){
	function updateValue(){
	var laskuri = $('input[type="checkbox"]:checked').length;
	var countList = $("#show-items").children("li").length;
	var val = laskuri / countList;
	document.getElementById("progressbar").value = val;
	};


// vertailee tehtyjä tehtäviä totaliin ja antaa palautesivun
$("#imdone").click(function(){
	// Total laskenta
	//var itemList = $("#show-items");
	var laskuri = $('input[type="checkbox"]:checked').length;
	var countList = $("#show-items").children("li").length;

	if ( countList == laskuri ) {
		window.location.href="finishing_task.html";
	}
	else if ( laskuri / countList >= 0.66 ) {
		window.location.href="finishing_task_orange.html";
	}
	else if ( laskuri / countList >= 0.33 ) {
		window.location.href="finishing_task_black.html";
	}
	else {
		window.location.href="finishing_task_black.html";
	}
});

});

	

