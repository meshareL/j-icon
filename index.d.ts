import {CreateElement, VNode, PluginFunction} from 'vue';

interface Icon<
    V extends Array<number> = [number, number, number, number],
    W extends number = number,
    H extends number = number> {

    (h: CreateElement): VNode[];
    iconName?: string;
    size?: [W, H];
    viewBox: V;
}

interface Options {
    name?: string;
    classNames?: string[];
    prefix?: boolean | string;
    icons?: { [key: string]: Icon };
}

declare const install: PluginFunction<Options>;

export default install;
export { Icon };
