export type Dialog = {
    _: 'Dialog';
    _currentId?: DialogText['_id'];
    _currentValue?: DialogText['_value'];
    _currentOptionIndex?: number;
    _currentOptionsValues?: DialogText['_value'][];
    texts: DialogText[];
};

export type DialogText = {
    _id: number;
    _value: string;
    _next?: DialogText['_id'];
    _options: DialogText['_id'][];
};