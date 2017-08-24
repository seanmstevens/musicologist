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
    const $list = $('#playlistParameters').eq(0);

    $list.empty();

    $.each(musicInfo, function(idx, info) {
        info = info.replace(/\+/g, ' ');
        const $item = $('<li class="list-group-item">').text(info);
        $item.append('<span class="close-btn">&#10006;</span>')

        $list.append($item)
    });
}

function generateResults(results) {
    const $container = $('#musicQueryResults');
    const $table = $('<table></table>');
    const $tableHead = $('<thead><tr><th>Song</th><th>Artist</th><th>Album</th><th>Year</th></tr></thead>');
    const $tableBody = $('<tbody></tbody>');
    const $row = $('<tr></tr>');

    $table.append($tableHead).append($tableBody);
    $container.append($table);

    $.each(results, function(key, value) {
        const $thisRow = $row.clone();
        $thisRow.append('<td>' + value.trackName + '</td>')
            .append('<td>' + value.artistName + '</td>')
            .append('<td>' + value.collectionName + '</td>')
            .append('<td>' + value.releaseDate + '</td>');
        $tableBody.append($thisRow);
    });
}

$('#getPlaylistBtn').click(function(event) {
    let searchTerm = musicInfo.join('+');

    $('#musicQueryResults').empty();

    $.ajax({
        url: 'https://itunes.apple.com/search?term=' + searchTerm + '&limit=20',
        dataType: 'json'
    }).then(function(resp) {
        let results = resp.results;
        if (results.length === 0) {
            $('#musicQueryResults')
                .append('<h3 class="header-small-margin">No results found.</h3>')
                .append('<small>Try narrowing your search results.</small>');
        } else {
            generateResults(results);
        }
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
