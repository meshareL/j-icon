'use strict';

function Code(h) {
    return [h('path', {attrs: {'fill-rule': 'evenodd', 'd': 'M9.5 3L8 4.5 11.5 8 8 11.5 9.5 13 14 8 9.5 3zm-5 0L0 8l4.5 5L6 11.5 2.5 8 6 4.5 4.5 3z'}})];
}
Code.size = [14, 16];
Code.viewBox = [0, 0, 14, 16];

function Reply(h) {
    return [h('path', {attrs: {'fill-rule': 'evenodd', 'd': 'M6 3.5c3.92.44 8 3.125 8 10-2.312-5.062-4.75-6-8-6V11L.5 5.5 6 0v3.5z'}})];
}
Reply.viewBox = [0, 0, 14, 16];

function X(h) {
    return [h('path', {attrs: {'fill-rule': 'evenodd', 'd': 'M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z'}})];
}
X.size = [12, 16];
X.viewBox = [0, 0, 12, 16];

const reply = {
    name: 'reply',
    viewBox: [0, 0, 14, 16],
    attributes: {focusable: 'true'},
    render(h) {
        return [h('path', {attrs: {'fill-rule': 'evenodd', 'd': 'M6 3.5c3.92.44 8 3.125 8 10-2.312-5.062-4.75-6-8-6V11L.5 5.5 6 0v3.5z'}})];
    }
};

const x = {
    name: 'x',
    viewBox: [0, 0, 12, 16],
    size: [12, 16],
    render(h) {
        return [h('path', {attrs: {'fill-rule': 'evenodd', 'd': 'M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z'}})];
    }
};

export default { reply: Reply, x };
export { Code, Reply, X, reply, x };
