import { EventTypes, onInputKeyDown } from "../engine/event";

let app = null;

export const render = () => {
    app = document.getElementById("app");
    document.addEventListener("keydown", onKeydown);
    createHtml('player');
};

export const emit = ({ type, entityId, data }: {
    type: EventTypes,
    entityId: string,
    data?: Object,
}) => {
    console.log(`[${type}] - ${entityId}: ${JSON.stringify(data)}`);

    if (type === EventTypes.ENTITY_POSITION_UPDATE) {
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
