export type Dialog = {
    _: 'Dialog';
    _currentId?: number;
    _currentOptionIndex?: number;
    _currentOptionsValues?: DialogText['_value'][];
    _currentTextId?: DialogText['_id'];
    _currentValue?: DialogText['_value'];
    texts: DialogText[];
};

export type DialogText = {
    _id: number;
    _next?: DialogText['_id'];
    _nextDialog?: number;
    _options: DialogText['_id'][];
    _questEnd?: string;
    _questStart?: string;
    _value: string;
};
