# EmbedTube

Embed Youtube player wrapper class.

## install

```
bower install embed-tube
```

## usage

```javascript
$(function () {
    var URL = 'https://www.youtube.com/watch?v=vj6OM906Mhs';

    var isReady = false;
    var isPlaying = false;


    // init movie
    var movie = new EmbedTube({
        url: URL,
        elementId: 'demo-movie'
    });


    // init controller
    var $controller = $('#controller');

    $controller.on('click', function (e) {
        e.preventDefault();

        if (!isReady) {
            return;
        }

        if (isPlaying) {
            movie.pause();
        } else {
            movie.play();
        }
    });


    // movie on ready
    movie.on('ready', function () {
        console.log('movie is ready!!');
        isReady = true;
        movie.play();
    });

    // movie on start
    movie.on('playing', function () {
        console.log('movie start');
        isPlaying = true;
        $controller.text('pause');
    });

    // movie on pause
    movie.on('paused', function () {
        console.log('movie pause');
        isPlaying = false;
        $controller.text('start');
    });
});

```