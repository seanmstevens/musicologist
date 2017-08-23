let musicInfo = [];

function addSongFromField(event) {
  event.preventDefault();

  const info = $('#musicField').val().replace(/ /g, '+').toLowerCase();

  musicInfo.push(info);
  renderList();
  $('#musicField').eq(0).val('');
}

$('#addButton').click(addSongFromField);
$('#musicField').keyup(function(event) {
  if (event.which == 13) { // User presses Enter
    addSongFromField(event);
  }
});

function renderList() {
    const $list = $('.info').eq(0);

    $list.empty();

    for (let info of musicInfo) {
        info = info.replace(/\+/g, ' ');
        const $item = $('<li class="list-group-item">').text(info);
        $item.append('<span class="close-btn">&#10006</span>')

        $list.append($item)
    }
}

$('#getPlaylistBtn').click(function(event) {
    let searchTerm = musicInfo.join('+');
    console.log(searchTerm);

    $('#musicQueryResults').empty();

    $.ajax({
        url: 'https://itunes.apple.com/search?term=' + searchTerm + '&limit=20',
        dataType: 'json'
    }).then(function(resp) {
        let results = resp.results;
        console.log(results);
        if (results.length === 0) {
            $('#musicQueryResults')
                .append('<h3 class="header-small-margin">No results found.</h3>')
                .append('<small>Try narrowing your search results.</small>');
        }
        $.each(results, function(key, value) {
            $('#musicQueryResults').append('<p class="h5">' + value.artistName + ' - ' + value.trackName + '</p>');
        });
    }).catch(function(err) {
        console.error('Error:', err);
    });
});

$(document.body).on({click: function() {
        const info = $(this).parent().contents().filter(function() {
            return this.nodeType == 3;
        })[0].nodeValue.replace(/ /g, '+');
        musicInfo = $.grep(musicInfo, function(value) {
            return value != info;
        });
        renderList();
    }
}, '.close-btn');
