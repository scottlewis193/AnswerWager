function startUp() {
  document.body.addEventListener("showMessage", function (evt) {
    alert(evt.detail.value);
  });
  htmx.config.globalViewTransitions = true;
}

/* From Modernizr */
// function whichTransitionEvent() {
//   var t;
//   var el = document.createElement("fakeelement");
//   var transitions = {
//     transition: "transitionend",
//     OTransition: "oTransitionEnd",
//     MozTransition: "transitionend",
//     WebkitTransition: "webkitTransitionEnd",
//   };

//   for (t in transitions) {
//     if (el.style[t] !== undefined) {
//       return transitions[t];
//     }
//   }
// }

/* From Modernizr */
function whichAnimationEvent() {
  var t;
  var el = document.createElement("fakeelement");
  var animations = {
    animation: "animationend",
    OAnimation: "oAnimationEnd",
    MozAnimation: "animationend",
    WebkitAnimation: "webkitAnimationEnd",
  };

  for (t in animations) {
    if (el.style[t] !== undefined) {
      return animations[t];
    }
  }
}

function copyText(e) {
  const GAMEID = e.innerText.replace("Game ID: ", "");
  navigator.clipboard.writeText(GAMEID);
  e.classList.add("copyanimation");
  e.innerText = "COPIED";

  var animationEvent = whichAnimationEvent();
  animationEvent &&
    e.addEventListener(animationEvent, function () {
      e.classList.remove("copyanimation");
      e.innerText = "Game ID: " + GAMEID;
    });
}

var interval;
let counter = 0;

function startCountdown(seconds) {
  interval = setInterval(countdown, 1000);
  counter = seconds;
}

function stopCountdown() {
  interval = clearInterval(interval);
}

function countdown() {
  if (counter == 0) {
    stopCountdown();
    return;
  }
  document.getElementById("counter")?.innerText = counter;
  counter--;
}

htmx.on("htmx:load", function (evt) {
  if (evt.detail.elt.nextSibling?.id == "counter") {
    startCountdown(30);
  }
});
