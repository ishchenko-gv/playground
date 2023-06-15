const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

requestAnimationFrame(drawCanvas);

function drawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawClock(ctx, new Date(), getConfig());
  requestAnimationFrame(drawCanvas);
}

function getConfig() {
  const { width, height } = canvas;

  const config = document
    .querySelector('[data-script="clock"]')
    .src.split("?")[1]
    ?.split("&")
    .reduce((acc, value) => {
      const [k, v] = value.split("=");
      acc[k] = v;
      return acc;
    }, {});

  return {
    ...config,
    size: Math.min(width, height),
  };
}

function drawClock(ctx, date, config) {
  drawClockFace(ctx, config);
  drawClockArrows(ctx, date, config);
}

function drawClockFace(ctx, config) {
  const centerPoint = [config.size / 2, config.size / 2];

  ctx.arc(centerPoint[0], centerPoint[1], config.size / 2, 0, 2 * Math.PI);
  ctx.fillStyle = config.backgroundColor;
  ctx.fill();

  for (let i = 0; i < 60; i++) {
    const angle = (360 / 60) * i;

    let notchLength = (config.notchBasicLength / 110) * config.size;
    let notchWidth = (config.notchBasicWidth / 102) * config.size;
    const notchIndent = config.size / 30;

    if (i % 30 === 0) {
      notchLength = (config.notch30Length / 150) * config.size;
      notchWidth = (config.notch30Width / 150) * config.size;
    } else if (i % 15 === 0) {
      notchLength = (config.notch15Length / 140) * config.size;
      notchWidth = (config.notch15Width / 140) * config.size;
    } else if (i % 5 === 0) {
      notchLength = (config.notch5Length / 130) * config.size;
      notchWidth = (config.notch5Width / 130) * config.size;
    }

    const startPoint = getPointByAngle(
      centerPoint,
      config.size / 2 - notchLength - notchIndent,
      angle
    );

    const endPoint = getPointByAngle(
      centerPoint,
      config.size / 2 - notchIndent,
      angle
    );

    drawLine(ctx, startPoint, endPoint, {
      width: notchWidth,
      color: config.notchColor,
    });
  }
}

function drawClockArrows(ctx, date, config) {
  const { hours, minutes, seconds } = getTimeParts(date);

  const hoursAngle = (360 / 12) * hours;
  const minutesAngle = (360 / 60) * minutes;
  const secondsAngle = (360 / 60) * seconds;

  const centerPoint = [config.size / 2, config.size / 2];

  const hoursArrowEndPoint = getPointByAngle(
    centerPoint,
    (config.size / 2) * 0.65,
    hoursAngle
  );

  const minutesArrowEndPoint = getPointByAngle(
    centerPoint,
    (config.size / 2) * 0.75,
    minutesAngle
  );

  const secondsArrowEndPoint = getPointByAngle(
    centerPoint,
    (config.size / 2) * 0.87,
    secondsAngle
  );

  drawLine(ctx, centerPoint, hoursArrowEndPoint, {
    width: config.size / 100,
    color: config.hoursArrowColor,
  });

  drawLine(ctx, centerPoint, minutesArrowEndPoint, {
    width: config.size / 100,
    color: config.minutesArrowColor,
  });

  drawLine(ctx, centerPoint, secondsArrowEndPoint, {
    width: config.size / 100,
    color: config.secondsArrowColor,
  });

  ctx.arc(centerPoint[0], centerPoint[1], config.size * 0.015, 0, 2 * Math.PI);
  ctx.fillStyle = config.secondsArrowColor;
  ctx.fill();
}

function getPointByAngle(center, radius, angle) {
  return [
    center[0] + radius * Math.sin((2 * Math.PI * angle) / 360),
    center[1] - radius * Math.cos((2 * Math.PI * angle) / 360),
  ];
}

function drawLine(
  ctx,
  startPoint,
  endPoint,
  opts = { width: 2, color: "black" }
) {
  ctx.beginPath();
  ctx.moveTo(...startPoint);
  ctx.lineTo(...endPoint);
  ctx.closePath();
  ctx.lineWidth = opts.width;
  ctx.strokeStyle = opts.color;
  ctx.stroke();
  ctx.lineWidth = 1;
}

function getTimeParts(date) {
  return {
    hours: date.getHours() + ((100 / 60) * date.getMinutes()) / 100,
    minutes: date.getMinutes() + ((100 / 60) * date.getSeconds()) / 100,
    seconds: date.getSeconds() + date.getMilliseconds() / 1000,
  };
}
