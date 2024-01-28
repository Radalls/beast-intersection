import { EventTypes, onInputKeyDown } from "../engine/event";

let app = null;

export const render = () => {
    app = document.getElementById("app");
    document.addEventListener("keydown", onKeydown);
};

export const emit = ({ type, entityId, data }: {
    type: EventTypes,
    entityId: string,
    data?: Object,
}) => {
    console.log(`[${type}] - ${entityId}: ${JSON.stringify(data)}`);

    if (type === EventTypes.ENTITY_CREATE) {
        createHtml(entityId);
    }

    if (type === EventTypes.ENTITY_SPRITE_CREATE) {
        createSprite(entityId, data);
    }

    if ([EventTypes.ENTITY_POSITION_CREATE, EventTypes.ENTITY_POSITION_UPDATE].includes(type)) {
        onEntityPositionUpdate(entityId, data);
    }
};

export const onKeydown = (e: any) => { onInputKeyDown(e.key); };

const createHtml = (entityId: string) => {
    const entity = document.createElement("div");
    entity.setAttribute("id", entityId);
    entity.setAttribute("class", "entity");
    app!.appendChild(entity);
};

const createSprite = (entityId: string, data: any) => {
    const entity = document.getElementById(entityId);
    if (!entity) return;

    entity.style.height = `${data.height}px`;
    entity.style.width = `${data.width}px`;
};

const onEntityPositionUpdate = (entityId: string, data: any) => {
    const entity = document.getElementById(entityId);
    if (!entity) return;

    entity.style.left = `${data.x * 64}px`;
    entity.style.top = `${data.y * 64}px`;
};
