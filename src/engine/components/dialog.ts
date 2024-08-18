export type Dialog = {
    _: 'Dialog';
    _currentId?: DialogText['_id'];
    _currentOptionIndex?: number;
    _currentOptionsValues?: DialogText['_value'][];
    _currentValue?: DialogText['_value'];
    texts: DialogText[];
};

export type DialogText = {
    _id: number;
    _next?: DialogText['_id'];
    _options: DialogText['_id'][];
    _value: string;
};
