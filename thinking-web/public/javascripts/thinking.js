stagedTags = [];

$(function(){
    $('#thoughtInput').focus();
    
    $('#thoughtBox').submit(function(event) {
        event.preventDefault();
        
//        addThought($('#thoughtInput').val(), function() {
//            $('#thoughtInput').val('');
//        });
        stageThought();
    });
    
    $('#tagForm').submit(function(event) {
        event.preventDefault();
        
        tagAction();
    });
});

function addThought(text, tags, callback) {
    $.post(
        '/api/thoughts',
        {
            text: text,
            tags: tags
        }
    ).always(function() { 
        callback();
    });
}

function stageThought() {
    $('#thoughtInput').prop('disabled', true);
    
    //TODO: run NLP
    var text = $('#thoughtInput').val();
    
    $('#stagedText').text(text);
    $('#stage').css('visibility', 'visible');
    $('#tagInput').focus();
}

function tagAction() {
    var tagText = $('#tagInput').val();
    
    if (tagText == '') {
        addThought($('#stagedText').text(), stagedTags, thoughtAdded);
        unstage();
    } else {
        $('#tagInput').val('');
        stageTag(tagText);
    }
}

function stageTag(tagText) {
    stagedTags.push(tagText);
    
    $('#stagedTags').append('<span class="tag">' + tagText + '</span>');
}

function unstage() {
    $('#stage').css('visibility', 'hidden');
    stagedTags = [];
    $('#stagedText').text('');
    $('#stagedTags').text('');
}

function thoughtAdded() {
    $('#thoughtInput').val('');
    $('#thoughtInput').prop('disabled', false);
    $('#thoughtInput').focus();
}