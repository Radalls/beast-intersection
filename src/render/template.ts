import { app } from "./main";

export const createEntity = (entityId: string) => {
    const entity = document.createElement("div");
    entity.setAttribute("id", entityId);
    entity.setAttribute("class", entityId);

    app.appendChild(entity);
};

export const getEntity = (entityId: string) => {
    const entity = document.getElementById(entityId);
    if (!(entity)) {
        throw new Error(`Entity ${entityId} not found.`);
    }

    return entity;
}