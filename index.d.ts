import {CreateElement, VNode, PluginFunction} from 'vue';

interface Icon<
    W extends number = number,
    H extends number = number,
    V extends Array<number> = [number, number, number, number]> {

    (h: CreateElement): VNode[];
    iconName?: string;
    size?: [W, H];
    viewBox: V;
}

interface Options {
    name?: string;
    classNames?: string[];
    icons?: { [key: string]: Icon };
}

declare const install: PluginFunction<Options>;

export default install;
export { Icon };
