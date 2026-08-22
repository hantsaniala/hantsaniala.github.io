(function () {
  var el = document.getElementById('typing-text');
  if (!el) return;

  var phrases = [
    'Ship Reliable Backends',
    'Scale Without the Headache',
    'From MVP to Production',
    'Cut Costs, Boost Performance',
    'APIs That Just Work',
    'Your Backend, Done Right',
  ];

  var TYPING_SPEED = 50;
  var DELETING_SPEED = 25;
  var PAUSE_AFTER_TYPE = 1200;
  var PAUSE_AFTER_DELETE = 400;

  var phraseIdx = 0;
  var charIdx = 0;
  var deleting = false;


  var audioCtx = null;
  function playClick() {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      var now = audioCtx.currentTime;
      var bufferSize = audioCtx.sampleRate * 0.012;
      var buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      var data = buffer.getChannelData(0);
      for (var k = 0; k < bufferSize; k++) {
        data[k] = (Math.random() * 2 - 1) * Math.pow(1 - k / bufferSize, 12);
      }
      var noise = audioCtx.createBufferSource();
      noise.buffer = buffer;
      var bandpass = audioCtx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.value = 3500;
      bandpass.Q.value = 2;
      var gain = audioCtx.createGain();
      gain.gain.value = 0.06;
      noise.connect(bandpass);
      bandpass.connect(gain);
      gain.connect(audioCtx.destination);
      noise.start(now);
      noise.stop(now + 0.015);
    } catch (e) { void e; }
  }

  function tick() {
    var current = phrases[phraseIdx];
    if (!deleting) {
      charIdx++;
      el.textContent = current.slice(0, charIdx);
      playClick();
      if (charIdx === current.length) {
        setTimeout(function () { deleting = true; tick(); }, PAUSE_AFTER_TYPE);
        return;
      }
      setTimeout(tick, TYPING_SPEED);
    } else {
      charIdx--;
      el.textContent = current.slice(0, charIdx);
      playClick();
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(tick, PAUSE_AFTER_DELETE);
        return;
      }
      setTimeout(tick, DELETING_SPEED);
    }
  }
  tick();
})();

(function () {
  var counters = document.querySelectorAll('.counter');
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var counterEl = entry.target;
        var target = parseInt(counterEl.getAttribute('data-target') || '0');
        var suffix = counterEl.getAttribute('data-suffix') || '';
        var current = 0;
        var increment = Math.max(1, Math.floor(target / 40));
        var timer = setInterval(function () {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          counterEl.textContent = current + suffix;
        }, 30);
        observer.unobserve(counterEl);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(function (c) { observer.observe(c); });
})();
