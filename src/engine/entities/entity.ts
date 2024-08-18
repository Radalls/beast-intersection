import { Component } from '../components/@component';

export type Entity = {
    [K in keyof Component]: Component[K] | undefined;
};
