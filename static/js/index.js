'use strict';

const icons = {
    alarmFill: {
        code: '{\n' +
            '    name: \'alarm-fill\',\n' +
            '    viewBox: [0, 0, 16, 16],\n' +
            '    size: [16, 16],\n' +
            '    attributes: {\n' +
            '        \'xmlns\': \'http://www.w3.org/2000/svg\'\n' +
            '    },\n' +
            '    render: () => [h(\'path\', {\'fill-rule\': \'evenodd\', \'d\': \'M6 .5a.5.5 0 01.5-.5h3a.5.5 0 010 1H9v1.07a7.001 7.001 0 013.274 12.474l.601.602a.5.5 0 01-.707.708l-.746-.746A6.97 6.97 0 018 16a6.97 6.97 0 01-3.422-.892l-.746.746a.5.5 0 01-.707-.708l.602-.602A7.001 7.001 0 017 2.07V1h-.5A.5.5 0 016 .5zM.86 5.387A2.5 2.5 0 114.387 1.86 8.035 8.035 0 00.86 5.387zM11.613 1.86a2.5 2.5 0 113.527 3.527 8.035 8.035 0 00-3.527-3.527zM8.5 5.5a.5.5 0 00-1 0v3.362l-1.429 2.38a.5.5 0 10.858.515l1.5-2.5A.5.5 0 008.5 9V5.5z\'})]\n' +
            '}',
        icon: {
            name: 'alarm-fill',
            viewBox: [0, 0, 16, 16],
            size: [16, 16],
            attributes: {
                'xmlns': 'http://www.w3.org/2000/svg'
            },
            render: () => [Vue.h('path', {'fill-rule': 'evenodd', 'd': 'M6 .5a.5.5 0 01.5-.5h3a.5.5 0 010 1H9v1.07a7.001 7.001 0 013.274 12.474l.601.602a.5.5 0 01-.707.708l-.746-.746A6.97 6.97 0 018 16a6.97 6.97 0 01-3.422-.892l-.746.746a.5.5 0 01-.707-.708l.602-.602A7.001 7.001 0 017 2.07V1h-.5A.5.5 0 016 .5zM.86 5.387A2.5 2.5 0 114.387 1.86 8.035 8.035 0 00.86 5.387zM11.613 1.86a2.5 2.5 0 113.527 3.527 8.035 8.035 0 00-3.527-3.527zM8.5 5.5a.5.5 0 00-1 0v3.362l-1.429 2.38a.5.5 0 10.858.515l1.5-2.5A.5.5 0 008.5 9V5.5z'})]}
    },
    alignBottom: {
        code: '{\n' +
            '    name: \'align-bottom\',\n' +
            '    viewBox: [0, 0, 16, 16],\n' +
            '    size: [16, 16],\n' +
            '    attributes: {\n' +
            '        \'xmlns\': \'http://www.w3.org/2000/svg\'\n' +
            '    },\n' +
            '    render: () => [h(\'path\', {\'d\': \'M6 2a1 1 0 011-1h2a1 1 0 011 1v10a1 1 0 01-1 1H7a1 1 0 01-1-1V2z\'}), h(\'path\', {\'fill-rule\': \'evenodd\', \'d\': \'M1 14.5a.5.5 0 01.5-.5h13a.5.5 0 010 1h-13a.5.5 0 01-.5-.5z\'})]\n' +
            '}',
        icon: {
            name: 'align-bottom',
            viewBox: [0, 0, 16, 16],
            size: [16, 16],
            attributes: {
                'xmlns': 'http://www.w3.org/2000/svg'
            },
            render: () => [Vue.h('path', {'d': 'M6 2a1 1 0 011-1h2a1 1 0 011 1v10a1 1 0 01-1 1H7a1 1 0 01-1-1V2z'}), Vue.h('path', {'fill-rule': 'evenodd', 'd': 'M1 14.5a.5.5 0 01.5-.5h13a.5.5 0 010 1h-13a.5.5 0 01-.5-.5z'})]}
    }
};

Vue.createApp({
    template: `<main class="container-lg">
            <div v-for="(icon, index) of icons" :key="icon.code" class="col-12 d-flex" :class="{'mt-6': index !== 0}">
                <div class="col-1 d-flex flex-items-center flex-justify-center">
                    <j-icon :icon="icon.icon" width="48" height="48"/>
                </div>
                <div class="col-11 overflow-y-auto">
                    <pre><code v-html="icon.code"></code></pre>
                </div>
            </div>
        </main>`,
    setup() {
        const results = Object.values(icons)
            .map(value => ({code: hljs.highlightAuto(value.code).value, icon: value.icon}));

        return { icons: results };
    }
})
    .use(JIcon, {classes: ['j-icon'], prefix: 'j-icon-'})
    .mount('#app');
