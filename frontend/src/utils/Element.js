import rough from "roughjs";
import { TOOLS, ARROW_LENGTH } from "../Constants.js";
import { getArrowHeadsCoordinates, getDrawablePoints } from "./Math.js";
const generator = rough.generator();
import { getSvgPathFromStroke } from "./svgPathFromStroke.js";
import { getStroke } from "perfect-freehand";

function hydrateElement(element) {
  if (!element || typeof element !== "object") return element;

  switch (element.type) {
    case TOOLS.PEN: {
      const points = Array.isArray(element.points) ? element.points : [];
      return {
        ...element,
        path: new Path2D(
          getSvgPathFromStroke(getStroke(points, { size: element.size ?? 1 })),
        ),
      };
    }
    case TOOLS.LINE:
      return {
        ...element,
        roughElement: generator.line(
          element.x1,
          element.y1,
          element.x2,
          element.y2,
          element.options,
        ),
      };
    case TOOLS.RECTANGLE:
      return {
        ...element,
        roughElement: generator.rectangle(
          element.x1,
          element.y1,
          element.x2 - element.x1,
          element.y2 - element.y1,
          element.options,
        ),
      };
    case TOOLS.CIRCLE:
      return {
        ...element,
        roughElement: generator.ellipse(
          (element.x1 + element.x2) / 2,
          (element.y1 + element.y2) / 2,
          element.x2 - element.x1,
          element.y2 - element.y1,
          element.options,
        ),
      };
    case TOOLS.ARROW: {
      const { x3, y3, x4, y4 } = getArrowHeadsCoordinates(
        element.x1,
        element.x2,
        element.y1,
        element.y2,
        ARROW_LENGTH,
      );
      const points = getDrawablePoints(
        element.x1,
        element.y1,
        element.x2,
        element.y2,
        x3,
        y3,
        x4,
        y4,
      );
      return {
        ...element,
        roughElement: generator.linearPath(points, element.options),
      };
    }
    default:
      return element;
  }
}

function getElement(
  id,
  x1,
  y1,
  x2,
  y2,
  { activeToolItem, stroke, fill, size },
) {
  let options = {
    seed: id + 1,
    stroke,
    fill: fill || "transparent",
    strokeWidth: size,
  };
  const newElement = {
    id,
    x1,
    y1,
    x2,
    y2,
    type: activeToolItem,
    options,
  };

  switch (activeToolItem) {
    case TOOLS.TEXT: {
      newElement.text = "";
      break;
    }
    case TOOLS.PEN: {
      const penElement = {
        id,
        points: [{ x: x1, y: y1 }],
        type: activeToolItem,
        size,
        path: new Path2D(
          getSvgPathFromStroke(getStroke([{ x: x1, y: y1 }], { size: size })),
        ),
        stroke,
      };
      return penElement;
    }
    case TOOLS.LINE:
      console.log("down inside line");
      newElement.roughElement = generator.line(x1, y1, x2, y2, options);
      break;
    case TOOLS.RECTANGLE:
      newElement.roughElement = generator.rectangle(
        x1,
        y1,
        x2 - x1,
        y2 - y1,
        options,
      );
      break;
    case TOOLS.CIRCLE:
      newElement.roughElement = generator.ellipse(
        (x1 + x2) / 2,
        (y1 + y2) / 2,
        x2 - x1,
        y2 - y1,
        options,
      );
      break;
    case TOOLS.ARROW:
      let { x3, y3, x4, y4 } = getArrowHeadsCoordinates(
        x1,
        x2,
        y1,
        y1,
        ARROW_LENGTH,
      );
      const points = getDrawablePoints(x1, y1, x2, y2, x3, y3, x4, y4);

      newElement.roughElement = generator.linearPath(points, options);
      break;
    default:
      break;
  }
  return newElement;
}

function getLastElement(lastElement, x2, y2, { activeToolItem }) {
  const ele = { ...lastElement };

  switch (activeToolItem) {
    case TOOLS.PEN: {
      ele.points = [...ele.points, { x: x2, y: y2 }];
      ele.path = new Path2D(
        getSvgPathFromStroke(getStroke(ele.points, { size: ele.size })),
      );
      break;
    }
    case TOOLS.LINE:
      ele.x2 = x2;
      ele.y2 = y2;
      ele.roughElement = generator.line(
        ele.x1,
        ele.y1,
        ele.x2,
        ele.y2,
        ele.options,
      );
      break;
    case TOOLS.RECTANGLE:
      ele.x2 = x2;
      ele.y2 = y2;
      ele.roughElement = generator.rectangle(
        ele.x1,
        ele.y1,
        ele.x2 - ele.x1,
        ele.y2 - ele.y1,
        ele.options,
      );
      break;
    case TOOLS.CIRCLE:
      ele.x2 = x2;
      ele.y2 = y2;
      ele.roughElement = generator.ellipse(
        (ele.x1 + ele.x2) / 2,
        (ele.y1 + ele.y2) / 2,
        ele.x2 - ele.x1,
        ele.y2 - ele.y1,
        ele.options,
      );
      break;
    case TOOLS.ARROW:
      ele.x2 = x2;
      ele.y2 = y2;
      let { x3, y3, x4, y4 } = getArrowHeadsCoordinates(
        ele.x1,
        x2,
        ele.y1,
        y2,
        ARROW_LENGTH,
      );
      const points = getDrawablePoints(ele.x1, ele.y1, x2, y2, x3, y3, x4, y4);
      ele.roughElement = generator.linearPath(points, ele.options);
      break;
    default:
      break;
  }
  return ele;
}

export { getElement, getLastElement, hydrateElement };
