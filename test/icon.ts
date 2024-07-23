import { h as createElement } from 'vue';
import type { Icon } from '../index';

const alert: Icon<16, 16> = {
    name: 'alert',
    viewBox: [ 0, 0, 16, 16 ],
    render: () => createElement('path', { 'fill-rule': 'evenodd', d: 'M8.22 1.754a.25.25 0 00-.44 0L1.698 13.132a.25.25 0 00.22.368h12.164a.25.25 0 00.22-.368L8.22 1.754zm-1.763-.707c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0114.082 15H1.918a1.75 1.75 0 01-1.543-2.575L6.457 1.047zM9 11a1 1 0 11-2 0 1 1 0 012 0zm-.25-5.25a.75.75 0 00-1.5 0v2.5a.75.75 0 001.5 0v-2.5z' })
},
      code: Icon<16, 16> = {
          name: 'code',
          viewBox: [ 0, 0, 16, 16 ],
          size: [ 16, 16 ],
          render: () => createElement('path', { 'fill-rule': 'evenodd', d: 'M4.72 3.22a.75.75 0 011.06 1.06L2.06 8l3.72 3.72a.75.75 0 11-1.06 1.06L.47 8.53a.75.75 0 010-1.06l4.25-4.25zm6.56 0a.75.75 0 10-1.06 1.06L13.94 8l-3.72 3.72a.75.75 0 101.06 1.06l4.25-4.25a.75.75 0 000-1.06l-4.25-4.25z' })
      },
      reply: Icon<16, 16> = {
          name: 'reply',
          viewBox: [ 0, 0, 16, 16 ],
          attributes: { xmlns: 'http://www.w3.org/2000/svg' },
          render: () => createElement('path', { 'fill-rule': 'evenodd', d: 'M6.78 1.97a.75.75 0 010 1.06L3.81 6h6.44A4.75 4.75 0 0115 10.75v2.5a.75.75 0 01-1.5 0v-2.5a3.25 3.25 0 00-3.25-3.25H3.81l2.97 2.97a.75.75 0 11-1.06 1.06L1.47 7.28a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 0z' })
      },
      x: Icon<16, 16> = {
          name: 'x',
          viewBox: [ 0, 0, 16, 16 ],
          size: [ 16, 16 ],
          attributes: { xmlns: 'http://www.w3.org/2000/svg' },
          render: () => createElement('path', { 'fill-rule': 'evenodd', d: 'M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z' })
      };

export default { reply, x };
export { alert, code, reply, x };
