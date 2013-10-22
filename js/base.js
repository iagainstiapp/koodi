/* Tallennus localstorageen - sis�lt�� kaikki*/
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
            + "<span class='editable'>"
            + localStorage.getItem(orderList[j])
            + "</span> <a href='#'>X</a></li>" //Poistomahdollisuuden voi ottaa my�hemmin pois
        );
    }
         
    // Lis�� todo:n
    $form.submit(function(e) {
        e.preventDefault();
        $.publish('/add/', []);
		$('ul li').css('background-color', '#8ae1e6'); //vaihtaa todo-ty�n v�rin siniseksi
    });
	
	// Vaihtaa taustav�ri� ym.
	
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
	 
	 localStorage.bgUl = "#8ae1e6";
     $('ul li').css('background-color',localStorage.bgUl);
	 
	 localStorage.hideText = "none";
     $('#text').css('display',localStorage.hideText);
	 
	 localStorage.showDo = "block";
     $('#do-when').css('display',localStorage.showDo);
	 
	 localStorage.showTime = "block";
     $('#do-time').css('display',localStorage.showTime);
	 
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
		//Yll�olevalla piilotetulla koodilla voidaan tulla n�kyviin takaisin piilotetut divit


    // Poistaa yksitt�isen todo:n, j�tin t�m�n toistaiseksi t�h�n
    $itemList.delegate('a', 'click', function(e) {
        var $this = $(this);
        e.preventDefault();
        $.publish('/remove/', [$this]);
    });
     
    // Lajittelee (sort) yksitt�isi� todo-teht�vi�
	
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
 
    // Tyhjent�� kaikki, otin t�m�n pois kommentilla my�s html:st�
    /*$clearAll.click(function(e) {
        e.preventDefault();
        $.publish('/clear-all/', []);
    });*/
 
    // Fade In and Fade Out efekti� poistolinkkin hoveriin
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
            // Ottaa input-kent�n arvon ja tallentaa sen localstorageen
            localStorage.setItem(
                "todo-" + i, $newTodo.val()
            );
             
            // Asettaa todo:n maksimi laskurin niin, ett� lista ei resetoidu, kun sivu p�ivitet��n
            localStorage.setItem('todo-counter', i);
             
            // Liitt�� uuden todo-ty�n arvon (value)
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
             
            // Tyhjent�� input-kent�n
            $newTodo.val("");
             
            i++;
        }
    });
     
    $.subscribe('/remove/', function($this) {
        var parentId = $this.parent().attr('id');
         
        // Poistaa todo-ty�n localstoragesta klikatun parent elementin id:n perusteella
        localStorage.removeItem(
            "'" + parentId + "'"
        );
         
        // Fade out-efekti, kun todo-ty� poistetaan DOMista
        $this.parent().fadeOut(function() {
            $this.parent().remove();
             
            $.publish('/regenerate-list/', []);
        });
    });
     
    $.subscribe('/regenerate-list/', function() {
        var $todoItemLi = $('#show-items li');
        // Tyhjent�� j�rjestys arrayn
        order.length = 0;
         
        // K�y l�pi todo-ty�t listalta, nappaa ID:n ja ty�nt�� (push) sen arrayhin
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
   	
});
