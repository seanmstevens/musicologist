const musicInfo = [];

function addSongFromField(event) {
  event.preventDefault();

  const info = $('#musicField').eq(0).val();

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

  for (const info of musicInfo) {
    const $item = $('<li class="list-group-item">').text(info);

    $list.append($item)
  }
}

$('#getPlaylistBtn').click(function(event) {
    let searchTerm = $('#musicField').val().replace(/ /g, '+').toLowerCase();
    console.log(searchTerm);

    $('#musicQueryResults').empty();

    $.ajax({
        url: 'https://itunes.apple.com/search?term=' + searchTerm + '&limit=20',
        dataType: 'json'
    }).then(function(resp) {
        let results = resp.results;
        $.each(results, function(key, value) {
            console.log('Artist: ' + value.artistName, 'Track: ' + value.trackName);
            $('#musicQueryResults').append('<p class="h5">' + value.artistName + ': ' + value.trackName + '</p>')
        });
    }).catch(function(err) {
        console.error('Error:', err);
    });
    console.log('Testing Music Call');
});
