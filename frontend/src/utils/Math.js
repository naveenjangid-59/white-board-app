import { ELEMENT_ERASE_THRESHOLD } from "@/Constants.js";
import { TOOLS } from "@/Constants.js";

export const getArrowHeadsCoordinates = (x1, x2, y1, y2, arrowLength) => {
  const angle = Math.atan2(y2 - y1, x2 - x1);

  const x3 = x2 - arrowLength * Math.cos(angle - Math.PI / 6);
  const y3 = y2 - arrowLength * Math.sin(angle - Math.PI / 6);

  const x4 = x2 - arrowLength * Math.cos(angle + Math.PI / 6);
  const y4 = y2 - arrowLength * Math.sin(angle + Math.PI / 6);

  return { x3, y3, x4, y4 };
};

export const getDrawablePoints = (x1, y1, x2, y2, x3, y3, x4, y4) => {
  const dist = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  if (dist < 15) {
    return [
      [x1, y1],
      [x2, y2],
    ];
  } else {
    return [
      [x1, y1],
      [x2, y2],
      [x3, y3],
      [x2, y2],
      [x4, y4],
    ];
  }
};

export const isPointCloseToLine = (
  x1,
  y1,
  x2,
  y2,
  pointX,
  pointY,
  isCircle = 0,
) => {
  const distToStart = distanceBetweenPoints(x1, y1, pointX, pointY);
  const distToEnd = distanceBetweenPoints(x2, y2, pointX, pointY);
  const distLine = distanceBetweenPoints(x1, y1, x2, y2);
  if (Math.abs(x1 - x2) < 5 && Math.abs(y1 - y2) < 5)
    return (
      Math.abs(distToStart + distToEnd - distLine) <
      ELEMENT_ERASE_THRESHOLD * 70
    );
  return Math.abs(distToStart + distToEnd - distLine) < ELEMENT_ERASE_THRESHOLD;
};

export const isNearPoint = (x, y, x1, y1) => {
  return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5;
};

export const midPointBtw = (p1, p2) => {
  return {
    x: p1.x + (p2.x - p1.x) / 2,
    y: p1.y + (p2.y - p1.y) / 2,
  };
};
const toCanvasPoint = (canvas, x, y) => {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((x - rect.left) * canvas.width) / rect.width,
    y: ((y - rect.top) * canvas.height) / rect.height,
  };
};

const distanceBetweenPoints = (x1, y1, x2, y2) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
};

export const isPointNearElement = (element, pointX, pointY) => {
  const { x1, y1, x2, y2, type } = element;
  const canvas = document.getElementById("canvas");
  const context = document.getElementById("canvas").getContext("2d");
  switch (type) {
    case TOOLS.LINE:
    case TOOLS.ARROW:
      return isPointCloseToLine(x1, y1, x2, y2, pointX, pointY);
    case TOOLS.RECTANGLE:
    case TOOLS.CIRCLE:
      const { fill } = element.options;
      return (
        isPointCloseToLine(x1, y1, x2, y1, pointX, pointY, 1) ||
        isPointCloseToLine(x2, y1, x2, y2, pointX, pointY, 1) ||
        isPointCloseToLine(x2, y2, x1, y2, pointX, pointY, 1) ||
        isPointCloseToLine(x1, y2, x1, y1, pointX, pointY, 1) ||
        (fill !== "" &&
          pointX <= Math.max(x1, x2) &&
          pointX >= Math.min(x1, x2) &&
          pointY <= Math.max(y1, y2) &&
          pointY >= Math.min(y1, y2))
      );
    case TOOLS.PEN: {
      if (!canvas || !context || !element.path) return false;
      const { x, y } = toCanvasPoint(canvas, pointX, pointY);
      return !!context.isPointInStroke?.(element.path, x, y);
    }
    case TOOLS.TEXT: {
      context.font = `400 ${element.options.strokeWidth}px "Raleway", sans-serif`;
      context.fillStyle = element.options.stroke;
      const textWidth = context.measureText(element.text).width;
      const textHeight = parseInt(element.options.strokeWidth);
      context.restore();
      return (
        isPointCloseToLine(x1, y1, x1 + textWidth, y1, pointX, pointY) ||
        isPointCloseToLine(
          x1 + textWidth,
          y1,
          x1 + textWidth,
          y1 + textHeight,
          pointX,
          pointY,
        ) ||
        isPointCloseToLine(
          x1 + textWidth,
          y1 + textHeight,
          x1,
          y1 + textHeight,
          pointX,
          pointY,
        ) ||
        isPointCloseToLine(x1, y1 + textHeight, x1, y1, pointX, pointY)
      );
    }
    default:
      throw new Error("Type not recognized");
  }
};
