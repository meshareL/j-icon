interface Option {
    /** 文件或目录路径(绝对路径) */
    input: string;
    /** 文件输出路径(绝对路径) */
    output: string;
    /**
     * 输出文件格式
     *
     * @default ['json', 'esm', 'umd', 'ts', 'type']
     */
    format?: Array<'json' | 'esm' | 'umd' | 'ts' | 'type'>;
    /**
     * 是否压缩文件
     *
     * @default false
     */
    minify?: boolean;
    /**
     * 目标 Vue 代码. 2 或 3
     *
     * @default 3
     */
    target?: number;
    /**
     * 输出文件名称
     *
     * @default index
     */
    name?: string;
}

export default function (option: Option): Promise<void>;
export { Option };
