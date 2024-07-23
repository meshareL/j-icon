import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, vitest, expect } from 'vitest';
import parse from '../src/cli/parse';
import type { SVGElement } from '../src/cli/parse';

vitest.mock('svgo', async importOriginal => {
    return {
        ...await importOriginal<typeof import('svgo')>(),
        optimize: (input: string) => {
            // 返回文件默认内容, 禁止 svgo 优化文件, 否则无法准确测试生成的代码内容
            return { data: input };
        }
    };
});

const __dirname = dirname(fileURLToPath(import.meta.url)),
      dir = resolve(__dirname, 'asset');

const alertElement: SVGElement = {
    nodeName: 'svg',
    attributes: {
        width: '16',
        height: '16',
        viewBox: '0 0 16 16'
    },
    children: [
        {
            nodeName: 'path',
            attributes: {
                'fill-rule': 'evenodd',
                d: 'M8.22 1.754a.25.25 0 00-.44 0L1.698 13.132a.25.25 0 00.22.368h12.164a.25.25 0 00.22-.368L8.22 1.754zm-1.763-.707c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0114.082 15H1.918a1.75 1.75 0 01-1.543-2.575L6.457 1.047zM9 11a1 1 0 11-2 0 1 1 0 012 0zm-.25-5.25a.75.75 0 00-1.5 0v2.5a.75.75 0 001.5 0v-2.5z'
            }
        }
    ]
},
      archiveElement: SVGElement = {
          nodeName: 'svg',
          attributes: {
              width: '16',
              height: '16',
              viewBox: '0 0 16 16',
              xmlns: 'http://www.w3.org/2000/svg'
          },
          children: [
              {
                  nodeName: 'path',
                  attributes: {
                      'fill-rule': 'evenodd',
                      d: 'M1.75 2.5a.25.25 0 00-.25.25v1.5c0 .138.112.25.25.25h12.5a.25.25 0 00.25-.25v-1.5a.25.25 0 00-.25-.25H1.75zM0 2.75C0 1.784.784 1 1.75 1h12.5c.966 0 1.75.784 1.75 1.75v1.5A1.75 1.75 0 0114.25 6H1.75A1.75 1.75 0 010 4.25v-1.5zM1.75 7a.75.75 0 01.75.75v5.5c0 .138.112.25.25.25h10.5a.25.25 0 00.25-.25v-5.5a.75.75 0 111.5 0v5.5A1.75 1.75 0 0113.25 15H2.75A1.75 1.75 0 011 13.25v-5.5A.75.75 0 011.75 7zm4.5 1a.75.75 0 000 1.5h3.5a.75.75 0 100-1.5h-3.5z'
                  }
              }
          ]
      },
      clockElement: SVGElement = {
          nodeName: 'svg',
          attributes: {
              width: '16',
              height: '16',
              viewBox: '0 0 16 16',
              xmlns: 'http://www.w3.org/2000/svg'
          },
          children: [
              {
                  nodeName: 'path',
                  attributes: {
                      'fill-rule': 'evenodd',
                      d: 'M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm7-3.25v2.992l2.028.812a.75.75 0 0 1-.557 1.392l-2.5-1A.751.751 0 0 1 7 8.25v-3.5a.75.75 0 0 1 1.5 0Z'
                  }
              }
          ]
      },
      codeElement: SVGElement = {
          nodeName: 'svg',
          attributes: {
              width: '16',
              height: '16',
              viewBox: '0 0 16 16',
              xmlns: 'http://www.w3.org/2000/svg'
          },
          children: [
              {
                  nodeName: 'path',
                  attributes: {
                      'fill-rule': 'evenodd',
                      d: 'm11.28 3.22 4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734L13.94 8l-3.72-3.72a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215Zm-6.56 0a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042L2.06 8l3.72 3.72a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L.47 8.53a.75.75 0 0 1 0-1.06Z'
                  }
              }
          ]
      },
      cloudElement: SVGElement = {
          nodeName: 'svg',
          attributes: {
              width: '16',
              height: '16',
              viewBox: '0 0 16 16',
              xmlns: 'http://www.w3.org/2000/svg'
          },
          children: [
              {
                  nodeName: 'path',
                  attributes: {
                      'fill-rule': 'evenodd',
                      d: 'M2 7.25A5.225 5.225 0 0 1 7.25 2a5.222 5.222 0 0 1 4.767 3.029A4.472 4.472 0 0 1 16 9.5c0 2.505-1.995 4.5-4.5 4.5h-8A3.474 3.474 0 0 1 0 10.5c0-1.41.809-2.614 2.001-3.17Zm1.54.482a.75.75 0 0 1-.556.832c-.86.22-1.484.987-1.484 1.936 0 1.124.876 2 2 2h8c1.676 0 3-1.324 3-3s-1.324-3-3-3a.75.75 0 0 1-.709-.504A3.72 3.72 0 0 0 7.25 3.5C5.16 3.5 3.5 5.16 3.5 7.25c.002.146.014.292.035.436l.004.036.001.008Z'
                  }
              }
          ]
      },
      zoomOutElement: SVGElement = {
          nodeName: 'svg',
          attributes: {
              width: '16',
              height: '16',
              viewBox: '0 0 16 16',
              xmlns: 'http://www.w3.org/2000/svg'
          },
          children: [
              {
                  nodeName: 'path',
                  attributes: { d: 'M4.5 6.75h6a.75.75 0 0 1 0 1.5h-6a.75.75 0 0 1 0-1.5Z' }
              },
              {
                  nodeName: 'path',
                  attributes: { d: 'M0 7.5a7.5 7.5 0 1 1 13.307 4.747l2.473 2.473a.749.749 0 1 1-1.06 1.06l-2.473-2.473A7.5 7.5 0 0 1 0 7.5Zm7.5-6a6 6 0 1 0 0 12 6 6 0 0 0 0-12Z' }
              }
          ]
      };

describe('j-icon-cli parse', () => {
    it('Read a single file', () => {
        const result = parse(resolve(dir, 'alert.svg'));
        expect(result.size).toBe(1);

        const alert = Array.from(result.entries()).at(0)!;
        expect(alert[0]).toBe('alert');
        expect(alert[1]).toEqual(alertElement);
    });

    it('Read all files in the directory', () => {
        const result = parse(resolve(dir, 'folder/folder'));
        expect(result.size).toBe(2);
        expect(Array.from(result.keys())).toEqual([ 'clock', 'code' ]);
        expect(Array.from(result.values())).toEqual([ clockElement, codeElement ]);
    });

    it('Read all files in a nested directory', () => {
        const result = parse(resolve(dir));
        expect(result.size).toBe(7);
        expect(Array.from(result.keys())).toEqual(expect.arrayContaining([
            'alert',
            'archive',
            'clock',
            'code',
            'cloud',
            'zoom-out'
        ]));
        expect(Array.from(result.values())).toEqual(expect.arrayContaining([
            alertElement,
            archiveElement,
            clockElement,
            codeElement,
            cloudElement,
            zoomOutElement
        ]));
    });

    it('Empty directory', () => {
        expect(parse(resolve(dir, 'empty')).size).toBe(0);
    });
});
