import rough from "roughjs";
import { TOOLS, ARROW_LENGTH } from "../Constants.js";
import { getArrowHeadsCoordinates, getDrawablePoints } from "./Math.js";
const generator = rough.generator();

function getElement(id, x1, y1, x2, y2, { activeToolItem, stroke, fill }) {
  let options = {
    seed: id + 1,
    stroke: stroke,
  };
  const newElement = {
    id,
    x1,
    y1,
    x2,
    y2,
    options,
  };

  switch (activeToolItem) {
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
      newElement.roughElement = generator.line(x1, y1, x2, y2, options);
      break;
  }
  return newElement;
}

function getLastElement(lastElement, x2, y2, { activeToolItem }) {
  const ele = { ...lastElement };

  switch (activeToolItem) {
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

export { getElement, getLastElement };
