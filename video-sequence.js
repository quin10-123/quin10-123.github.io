// Video sequence player.
// <div class="video-sequence" data-clips="a.mp4, b.mp4, c.mp4"></div>
// plays the clips one after another and starts over at the end, forever.

document.querySelectorAll('.video-sequence').forEach(function (box) {
  var clips = box.dataset.clips.split(',')
    .map(function (s) { return s.trim(); })
    .filter(Boolean);

  // One <video> per clip, loaded up front, so switching is instant.
  var videos = clips.map(function (src) {
    var v = document.createElement('video');
    v.src = src;
    v.muted = true;
    v.playsInline = true;
    v.preload = 'auto';
    v.setAttribute('muted', '');
    v.setAttribute('playsinline', '');
    box.appendChild(v);
    return v;
  });

  function play(i) {
    videos.forEach(function (v, n) {
      if (n !== i) { v.pause(); v.classList.remove('active'); }
    });
    var v = videos[i];
    v.currentTime = 0;
    v.classList.add('active');
    var p = v.play();
    if (p && p.catch) p.catch(function () {}); // ignore autoplay refusals
  }

  videos.forEach(function (v, i) {
    v.addEventListener('ended', function () { play((i + 1) % videos.length); });
  });

  play(0);
});
