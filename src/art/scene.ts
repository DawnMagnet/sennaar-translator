import { birdsSvg, cloudSvg } from "./clouds";
import { farDunesSvg, nearDunesSvg } from "./dunes";
import { figuresSvg } from "./figures";
import { towerSvg } from "./tower";

/** Static, trusted markup only: nothing here is derived from user input. */
export const sceneMarkup = () =>
  `<div class="scene" aria-hidden="true">` +
  `<div class="scene__cloud scene__cloud--a">${cloudSvg("a")}</div>` +
  `<div class="scene__cloud scene__cloud--b">${cloudSvg("b")}</div>` +
  `<div class="scene__birds">${birdsSvg()}</div>` +
  `<div class="scene__tower">${towerSvg()}</div>` +
  `<div class="scene__dunes-far">${farDunesSvg()}</div>` +
  `<div class="scene__figures">${figuresSvg()}</div>` +
  `<div class="scene__dunes-near">${nearDunesSvg()}</div>` +
  `</div>`;
