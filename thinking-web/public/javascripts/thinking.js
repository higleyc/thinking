$(function(){
    $('#thoughtBox').submit(function(event) {
        event.preventDefault();
        
        addThought($('#thoughtInput').val(), function() {
            $('#thoughtInput').val('');
        });
    });
});

function addThought(text, callback) {
    $.post(
        '/api/thoughts',
        {
            text: text
        }
    ).always(function() { 
        callback();
    });
}