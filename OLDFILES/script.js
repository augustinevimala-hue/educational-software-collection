// --- Kids Dictation & Typing Web App: Corrected Menu and Functions ---

let stockWords = [
  "elephant", "giraffe", "school", "bottle", "window", "sunshine", "green", "flower", "cloud", "river"
];
let currentSession = [];
let wordIndex = 0, score = 0, attempts = 0;

function say(text, repeat=2) {
  let synth = window.speechSynthesis;
  let speak = (tx) => {
    let utter = new SpeechSynthesisUtterance(tx);
    utter.lang = 'en-IN';
    utter.rate = 0.88;
    utter.pitch = 1.0;
    synth.speak(utter);
  };
  for (let i = 0; i < repeat; i++) setTimeout(() => speak(text), i * 1200);
}

function showWelcome() {
  document.getElementById("screen").innerHTML = `
    <h1 class="mb-4">Welcome!</h1>
    <button class="btn btn-primary btn-lg mb-3" onclick="startTypingExercise()">Start Spelling Test</button>
    <button class="btn btn-success btn-lg mb-3" onclick="startSpellingTest()">Start Typing Exercise</button>
    <div>
      <input type="file" accept=".txt,.csv" id="fileInput" style="display:none" onchange="importWords(event)">
      <button class="btn btn-info btn-lg" onclick="document.getElementById('fileInput').click()">Import Words</button>
    </div>
    <div class="credit" style="margin-top:1.5em;">Developed by Augustine Anbananthan</div>
  `;
}
showWelcome();

// ----- TYPING EXERCISE -----
function startTypingExercise() {
  currentSession = [...stockWords];
  currentSession = currentSession.length > 10 ? shuffle(currentSession).slice(0, 10) : shuffle(currentSession);
  wordIndex = score = attempts = 0;
  showTypingWord();
}

function showTypingWord() {
  if (wordIndex >= currentSession.length) return showResult();
  attempts = 0;
  let word = currentSession[wordIndex];
  document.getElementById("screen").innerHTML = `
    <div class="mb-2" style="font-size:2.0rem;color:#0060a8;">Type the word (listen carefully):</div>
    <input class="form-control mb-3" id="ans" autofocus autocomplete="off" placeholder="Type here..." onkeydown="if(event.key=='Enter'){submitTypingAnswer();}">
    <button class="btn btn-warning btn-lg mb-3" onclick="say('${word}',2)">🔊 Hear Again</button>
    <button class="btn btn-primary btn-lg" onclick="submitTypingAnswer()">Submit</button>
    <button class="btn btn-info btn-lg mt-2" onclick="showWelcome()">← Main Menu</button>
    <div class="credit" style="margin-top:1.5em;">Developed by Augustine Anbananthan</div>
  `;
  say(word, 2);
  setTimeout(() => { document.getElementById("ans").focus(); }, 400);
}

function submitTypingAnswer() {
  let ans = document.getElementById("ans").value.trim().toLowerCase();
  let word = currentSession[wordIndex].toLowerCase();
  if (ans == "") return;
  attempts++;
  let correct = ans === word;
  if (correct) {
    score++;
    showFeedback("Correct!", "#25c025");
    setTimeout(() => { wordIndex++; showTypingWord(); }, 1200);
  } else if (attempts < 3) {
    showFeedback("Wrong, try again!", "#d03030");
    setTimeout(() => {
      say(word, 2);
      document.getElementById("ans").value = '';
      document.getElementById("ans").focus();
    }, 1300);
  } else {
    showFeedback(`Incorrect! The word was: <b>${word}</b>`, "#d03030", true);
    setTimeout(() => { wordIndex++; showTypingWord(); }, 2000);
  }
}

// ----- SPELLING TEST -----
function startSpellingTest() {
  currentSession = [...stockWords];
  currentSession = currentSession.length > 10 ? shuffle(currentSession).slice(0, 10) : shuffle(currentSession);
  wordIndex = score = attempts = 0;
  showSpellingWord();
}

function showSpellingWord() {
  if (wordIndex >= currentSession.length) return showResult();
  attempts = 0;
  let word = currentSession[wordIndex];
  document.getElementById("screen").innerHTML = `
    <div class="mb-2" style="font-size:2.0rem;color:#0060a8;">Type the word as shown:</div>
    <div class="mb-2" style="font-size:2.8rem;font-weight:bold;">${word}</div>
    <input class="form-control mb-3" id="ans" autofocus autocomplete="off" placeholder="Type here..." onkeydown="if(event.key=='Enter'){submitSpellingAnswer();}">
    <button class="btn btn-warning btn-lg mb-3" onclick="say('${word}',2)">🔊 Hear Again</button>
    <button class="btn btn-primary btn-lg" onclick="submitSpellingAnswer()">Submit</button>
    <button class="btn btn-info btn-lg mt-2" onclick="showWelcome()">← Main Menu</button>
    <div class="credit" style="margin-top:1.5em;">Developed by Augustine Anbananthan</div>
  `;
  say(word, 2);
  setTimeout(() => { document.getElementById("ans").focus(); }, 400);
}

function submitSpellingAnswer() {
  let ans = document.getElementById("ans").value.trim().toLowerCase();
  let word = currentSession[wordIndex].toLowerCase();
  if (ans == "") return;
  attempts++;
  let correct = ans === word;
  if (correct) {
    score++;
    showFeedback("Correct!", "#25c025");
    setTimeout(() => { wordIndex++; showSpellingWord(); }, 1200);
  } else if (attempts < 3) {
    showFeedback("Wrong, try again!", "#d03030");
    setTimeout(() => {
      say(word, 2);
      document.getElementById("ans").value = '';
      document.getElementById("ans").focus();
    }, 1300);
  } else {
    showFeedback(`Incorrect! The word was: <b>${word}</b>`, "#d03030", true);
    setTimeout(() => { wordIndex++; showSpellingWord(); }, 2000);
  }
}

function showFeedback(msg, color, reveal=false) {
  let fdbk = document.createElement('div');
  fdbk.innerHTML = msg;
  fdbk.style = `font-size:2rem;font-weight:bold;color:${color};background:#fffbe6;margin:12px 0;`;
  document.getElementById("screen").appendChild(fdbk);
  if(reveal) say("The word is " + currentSession[wordIndex].toLowerCase(), 2);
  else say(msg, 1);
}

function showResult() {
  document.getElementById("screen").innerHTML = `
    <div class="score">Session Complete!<br>Your Score: ${score} / ${currentSession.length}</div>
    <button class="btn btn-success btn-lg mb-3" onclick="showWelcome()">Main Menu</button>
    <div class="credit" style="margin-top:1.5em;">Developed by Augustine Anbananthan</div>
  `;
  say(`Session complete! Your score is ${score} out of ${currentSession.length}`, 1);
}

function shuffle(arr) {
  let a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function importWords(event) {
  let file = event.target.files[0];
  if (!file) return;
  let reader = new FileReader();
  reader.onload = function(e) {
    let txt = e.target.result;
    let newWords = txt.split(/\r?\n/).map(x=>x.trim()).filter(x=>x.length>1);
    stockWords = Array.from(new Set(stockWords.concat(newWords)));
    alert("Imported " + newWords.length + " new words. The next session will use them.");
    showWelcome();
  };
  reader.readAsText(file);
}
