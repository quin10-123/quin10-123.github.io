// Step-by-step video player.
// Usage: see the "video-steps" block in projects/master-thesis.html.
// Each .step has data-loop (clip that loops) and optionally data-intro
// (clip that plays once when you arrive at the step via "Next").

document.querySelectorAll('.video-steps').forEach(function (player) {
  var stage = player.querySelector('.video-stage');
  var steps = Array.prototype.slice.call(player.querySelectorAll('.step'));
  var prevBtn = player.querySelector('[data-prev]');
  var nextBtn = player.querySelector('[data-next]');
  var counter = player.querySelector('.step-count');
  var videos = {};
  var current = 0;
  var token = 0; // cancels a pending "intro finished" when the user clicks again

  // Create one <video> per clip up front, so switching is instant.
  function getVideo(src) {
    if (!videos[src]) {
      var v = document.createElement('video');
      v.src = src;
      v.muted = true;
      v.playsInline = true;
      v.preload = 'auto';
      v.setAttribute('muted', '');
      v.setAttribute('playsinline', '');
      stage.appendChild(v);
      videos[src] = v;
    }
    return videos[src];
  }

  steps.forEach(function (s) {
    if (s.dataset.intro) getVideo(s.dataset.intro);
    getVideo(s.dataset.loop);
  });

  function play(src, loop, onEnd) {
    var v = getVideo(src);
    Object.keys(videos).forEach(function (k) {
      if (videos[k] !== v) {
        videos[k].pause();
        videos[k].classList.remove('active');
      }
    });
    v.loop = loop;
    v.currentTime = 0;
    v.classList.add('active');
    v.onended = onEnd || null;
    var p = v.play();
    if (p && p.catch) p.catch(function () {}); // ignore autoplay refusals
  }

  function goTo(i, withIntro) {
    current = i;
    var myToken = ++token;
    var step = steps[i];

    steps.forEach(function (s, n) { s.classList.toggle('active', n === i); });
    counter.textContent = 'Step ' + (i + 1) + ' of ' + steps.length;
    prevBtn.disabled = i === 0;
    nextBtn.disabled = i === steps.length - 1;

    if (withIntro && step.dataset.intro) {
      play(step.dataset.intro, false, function () {
        if (myToken === token) play(step.dataset.loop, true);
      });
    } else {
      play(step.dataset.loop, true);
    }
  }

  prevBtn.addEventListener('click', function () { if (current > 0) goTo(current - 1, false); });
  nextBtn.addEventListener('click', function () { if (current < steps.length - 1) goTo(current + 1, true); });

  player.classList.add('ready');
  goTo(0, false);
});
