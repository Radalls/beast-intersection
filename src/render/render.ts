import { Events, onInputKeyDown } from "../engine/event";

let app = null;

export const render = () => {
  app = document.getElementById("app");

  document.addEventListener("keydown", onKeydown);

  createHtml('player');
};

export const emit = (eventName: string, data: Object) => {
  console.log(`Event ${eventName} emitted with data ${JSON.stringify(data)}`);
  if (eventName === Events.ENTITY_POSITION_UPDATE) {
    onEntityPositionUpdate(data);
  }
};

export const onKeydown = (e: any) => { onInputKeyDown(e.key); };

const createHtml = (entityName: string) => {
  const newPlayer = document.createElement("div");
  newPlayer.setAttribute("id", entityName);
  newPlayer.setAttribute("class", entityName);
  app!.appendChild(newPlayer);
};

const onEntityPositionUpdate = (data: any) => {
  const entity = document.getElementById(data.entityName.toLowerCase());
  if (entity) {
    entity.style.left = `${data.x * 64}px`;
    entity.style.top = `${data.y * 64}px`;
  }
};
