var blob = new Blob([document.querySelector('#ai').textContent]);

var aiWorker = new Worker(window.URL.createObjectURL(blob));

aiWorker.isThinking = false;

aiWorker.onmessage = function(e) {
    // console.log('diu');
   // do shit about e.data from AI thread
   // fire keyboard events
   aiWorker.isThinking = false;
};
