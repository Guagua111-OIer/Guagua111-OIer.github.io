"use strict";

function updateCoords(e) {
  pointerX = (e.clientX || e.touches[0].clientX) - canvasEl.getBoundingClientRect().left,
  pointerY = e.clientY || e.touches[0].clientY - canvasEl.getBoundingClientRect().top;
}

function setParticuleDirection(e) {
  var t = anime.random(0, 360) * Math.PI / 180,
      a = anime.random(35, 130), // 粒子扩散范围调整
      n = [-1, 1][anime.random(0, 1)] * a;
  return {
      x: e.x + n * Math.cos(t),
      y: e.y + n * Math.sin(t)
  };
}

function createParticule(e, t) {
  var a = {};
  a.x = e;
  a.y = t;
  a.color = colors[anime.random(0, colors.length - 1)];
  a.radius = anime.random(11.2, 22.4); // 粒子效果圆半径
  a.endPos = setParticuleDirection(a);
  a.draw = function() {
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.radius, 0, 2 * Math.PI, !0);
      ctx.fillStyle = a.color;
      ctx.fill();
  };
  return a;
}

function createCircle(e, t, particleColors) {
    var a = {};
    a.x = e;
    a.y = t;
    a.radius = 0.1;
    a.alpha = 0.5;
    a.lineWidth = 6;
  
    // 选择粒子颜色中数量最少的颜色
    var colorCounts = {};
    particleColors.forEach(color => {
        colorCounts[color] = (colorCounts[color] || 0) + 1;
    });
  
    var minColor = Object.keys(colorCounts).reduce((a, b) => colorCounts[a] < colorCounts[b] ? a : b);
  
    a.draw = function() {
        ctx.globalAlpha = a.alpha;
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.radius, 0, 2 * Math.PI, true);
        ctx.lineWidth = a.lineWidth;
        ctx.strokeStyle = minColor; // 使用数量最少的颜色
        ctx.stroke();
        ctx.globalAlpha = 1;
    };
    return a;
  }
  

function renderParticule(e) {
  for (var t = 0; t < e.animatables.length; t++)
      e.animatables[t].target.draw();
}

function animateParticules(e, t) {
  var particleColors = [];
  var n = [];
  for (var i = 0; i < numberOfParticules; i++) {
      var particule = createParticule(e, t);
      n.push(particule);
      particleColors.push(particule.color);
  }
  var a = createCircle(e, t, particleColors);
  
  anime.timeline().add({
      targets: n,
      x: function(e) {
          return e.endPos.x;
      },
      y: function(e) {
          return e.endPos.y;
      },
      radius: .1,
      duration: anime.random(1200, 1800),
      easing: "easeOutExpo",
      update: renderParticule
  }).add({
      targets: a,
      radius: anime.random(80, 160) * 0.5, // 空心圆半径
      lineWidth: 0,
      alpha: {
          value: 0,
          easing: "linear",
          duration: anime.random(600, 800)
      },
      duration: anime.random(1200, 1800),
      easing: "easeOutExpo",
      update: renderParticule,
      offset: 0
  });
}

function debounce(fn, delay) {
  var timer;
  return function () {
      var context = this;
      var args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
          fn.apply(context, args);
      }, delay);
  };
}

var canvasEl = document.querySelector(".fireworks");
if (canvasEl) {
  var ctx = canvasEl.getContext("2d"),
      numberOfParticules = 30,
      pointerX = 0,
      pointerY = 0,
      tap = "mousedown",
      colors = ["#FF1461", "#18FF92", "#5A87FF", "#FBF38C"],
      setCanvasSize = debounce(function() {
          canvasEl.width = 2 * window.innerWidth,
          canvasEl.height = 2 * window.innerHeight,
          canvasEl.style.width = window.innerWidth + "px",
          canvasEl.style.height = window.innerHeight + "px",
          canvasEl.getContext("2d").scale(2, 2);
      }, 500),
      render = anime({
          duration: 1 / 0,
          update: function() {
              ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
          }
      });

  document.addEventListener(tap, function(e) {
      if ("sidebar" !== e.target.id && "toggle-sidebar" !== e.target.id && "A" !== e.target.nodeName && "IMG" !== e.target.nodeName) {
          render.play();
          updateCoords(e);
          animateParticules(pointerX, pointerY);
      }
  }, !1),
  setCanvasSize(),
  window.addEventListener("resize", setCanvasSize, !1);
}