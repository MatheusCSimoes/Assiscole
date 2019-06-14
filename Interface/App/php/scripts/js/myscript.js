$(document).on('click', '.panel-heading span.icon_minim', function (e) {
    var $this = $(this);
    if (!$this.hasClass('panel-collapsed')) {
        $this.parents('.panel').find('.panel-body').slideUp();
        $this.parents('.panel').find('.panel-footer').slideUp();
        $this.addClass('panel-collapsed');
        $this.removeClass('glyphicon-minus').addClass('glyphicon-plus');
    } else {
        $this.parents('.panel').find('.panel-body').slideDown();
        $this.parents('.panel').find('.panel-footer').slideDown();
        $this.removeClass('panel-collapsed');
        $this.removeClass('glyphicon-plus').addClass('glyphicon-minus');
    }
});
$(document).on('focus', '.panel-footer input.chat_input', function (e) {
    var $this = $(this);
    if ($('#minim_chat_window').hasClass('panel-collapsed')) {
        $this.parents('.panel').find('.panel-body').slideDown();
        $('#minim_chat_window').removeClass('panel-collapsed');
        $('#minim_chat_window').removeClass('glyphicon-plus').addClass('glyphicon-minus');
    }
});
$('.panel-heading span.icon_minim').trigger( "click" );
// $(document).on('click', '.icon_close', function (e) {
//     //$(this).parent().parent().parent().parent().remove();
//     $( "#chat_window_1" ).remove();
// });

$( "#btn-chat" ).click(function() {
    sendMessage();
});

$("#btn-input").keypress(function(e) {
    if (e.which == 13)
    {
        sendMessage();
    }
});

function addMessage(message, tipo)
{
    var htmlOut = "";
    var d = new Date();
    var date = d.getHours()+':'+d.getMinutes()

    if(tipo == 'sent')
        htmlOut = '<div class="row msg_container base_sent">'+
                    '<div class="col-md-10 col-xs-10 ">'+
                        '<div class="messages msg_sent">'+
                            '<p>'+message+'</p>'+
                            '<time datetime="2009-11-13T20:00">'+date+'</time>'+
                        '</div>'+
                    '</div>'+
                    '<div class="col-md-2 col-xs-2 avatar">'+
                        '<img src="http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-1.jpg" class="img-responsive ">'+
                    '</div>'+
                '</div>';
    else if(tipo == 'receive')
        htmlOut = '<div class="row msg_container base_receive">'+
                    '<div class="col-md-2 col-xs-2 avatar">'+
                                '<img src="http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-1.jpg" class=" img-responsive ">'+
                            '</div>'+
                            '<div class="col-xs-10 col-md-10">'+
                                '<div class="messages msg_receive">'+
                                    '<p>'+message+'</p>'+
                                    '<time datetime="2009-11-13T20:00">'+date+'</time>'+
                                '</div>'+
                            '</div>'+
                '</div>';
    $(".panel-body").append(htmlOut);
    $('.panel-body').scrollTop($('.panel-body')[0].scrollHeight);  
}

function sendMessage()
{
    var message = $("#btn-input").val();
    if (message == '')
    {
        message = 0;
    }
    addMessage(message, "sent");   
    console.log(message)         
    $("#btn-input").val("");
    $.ajax({
        // url: "../../../SectorTic_Sms/whatsapp/version de trabajo/Cercanos/ajax/sinwapp.php",
        url: "http://chatpaginas.aplicando.com.co/Cercanos/ajax/sinwapp.php",
        cache: false,
        dataType: "json",
        method: "POST",
        data: {                    
            message: message
        }
    }).done(function(data) {
        console.log(data);
        // addMessage(data.messages[i], "toMe");
            if (data)
            {
                for (var i in data.messages)
                {
                    addMessage(data.messages[i], "receive");
                }
            }
    }).error(function(data) {
        console.log(data);
    });
}   
