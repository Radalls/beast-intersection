export const error = ({ message, where }: { message: string, where: string }) => {
    throw {
        message,
        where,
    };
};
