interface Option {
    /** 文件或目录路径 */
    input: string;
    /**
     * 输出文件格式
     *
     * 支持的格式: esm, umd, ts, type
     */
    format: 'esm' | 'umd' | 'ts' | 'type';
}

export default function (option: Option): void;
export { Option };
