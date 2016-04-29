var ThoughtBubble = React.createClass({
    getInitialState: function() {
        return {
            linked: false
        };
    },
    handleLink: function(event) {
        var element = $(event.target);
        if (this.state.linked) {
            element.css('color', '#000000');
            element.css('font-weight', 'normal');
            var index = stagedLinks.indexOf(this.props.thought._id);
            stagedLinks.splice(index, 1);
        } else {
            element.css('color', '#337ab7');
            element.css('font-weight', 'bold');
            stagedLinks.push(this.props.thought._id);
        }
        
        this.state.linked = !this.state.linked;
        console.log(stagedLinks);
    },
    render: function() {
        return (
            <div className="thoughtBubble">
                <div className="thoughtLink" onClick={this.handleLink}>
                    <i className="fa fa-link" aria-hidden="true"></i>
                </div>
                <div className="bubbleText">
                    {this.props.thought.text}
                </div>
            </div>
            );
    }
});

var ThoughtList = React.createClass({
    render: function() {
        var nodes = this.props.thoughts.map(function(thought) {
            return (
                <ThoughtBubble key={thought._id} thought={thought} />
            )
        });
        return (
            <div class="thoughtList">
                {nodes}
            </div>
            );
    }
});

function renderThoughtList(thoughts) {
    ReactDOM.render(
        <ThoughtList thoughts={thoughts} />,
        document.getElementById('results')
    );
}


var stagedTags = [];
var stagedLinks = [];

$(function(){
    $('#thoughtInput').focus();
    
    $('#thoughtBox').submit(function(event) {
        event.preventDefault();

        stageThought();
    });
    
    $('#tagForm').submit(function(event) {
        event.preventDefault();
        
        tagAction();
    });
    
    $('#stagedTags').on('click', '.tag', deleteTag);
    
    $('#closeStage').click(closeStage);
});

function addThought(text, tags, links, callback) {
    $.post(
        '/api/thoughts',
        {
            text: text,
            tags: tags,
            links: links
        }
    ).always(function() { 
        callback();
    });
}

function stageThought() {
    $('#thoughtInput').prop('disabled', true);
    
    var text = $('#thoughtInput').val();
    var tags = generateTags(text);
    pullFromTags(tags, function(results) {
        renderThoughtList(results);
    });
    tags.forEach(function(tag) {
        stageTag(tag);
    });
    
    $('#stagedText').text(text);
    $('#stage').css('opacity', 1.0);
    $('#tagInput').focus();
}

function tagAction() {
    var tagText = $('#tagInput').val();
    
    if (tagText == '') {
        addThought($('#stagedText').text(), stagedTags, stagedLinks, thoughtAdded);
        closeStage();
    } else {
        $('#tagInput').val('');
        stageTag(tagText);
    }
}

function stageTag(tagText) {
    stagedTags.push(tagText);
    
    $('#stagedTags').append('<span class="tag label">' + tagText + '</span>');
}

function thoughtAdded() {
    $('#thoughtInput').val('');
    $('#thoughtInput').prop('disabled', false);
    $('#thoughtInput').focus();
}

function generateTags(text) {
    // For now, pull out singularized nouns
    // Exclude pronouns
    var terms = nlp_compromise.text(text).terms();
    var tags = [];
    for (var i = 0; i < terms.length; i++) {
        if (terms[i].pos.Noun && (!terms[i].pos.Pronoun)) {
            if (terms[i].pos.Plural) {
                tags.push(terms[i].singularize());
            } else {
                tags.push(terms[i].normal);
            }
        }
    }
    
    return tags;
}

function deleteTag(event) {
    var tag = $(this);
    var index = stagedTags.indexOf(tag.text());
    tag.remove();
    stagedTags.splice(index, 1);
}

function pullFromTags(tags, callback) {
    $.get('/api/thoughts/search?tags=' + encodeURI(JSON.stringify(tags)),
    function(data) {
        callback(data);
    });
}

function closeStage() {
    $('#stage').css('opacity', 0);
    renderThoughtList([]);
    $('#thoughtInput').prop('disabled', false);
    stagedTags = [];
    $('#stagedTags').html('');
    $('#tagInput').val('');
}