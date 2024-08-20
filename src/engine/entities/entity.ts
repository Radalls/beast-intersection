import { Component } from '@/engine/components/@component';

export type Entity = {
    [K in keyof Component]: Component[K] | undefined;
};
