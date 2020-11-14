'use strict';
import {assert} from 'chai';
import {shallowMount} from '@vue/test-utils';
import JIcon from '../src/j-icon';
import install from '../src/index';
import icons, {code, x} from './icon';

describe('Vue j-icon component', () => {
    describe('install plugin', () => {
        describe('prefix option', () => {
            it('no prefix', () => {
                const element = shallowMount(JIcon, {
                    props: {icon: 'x'},
                    global: {plugins: [[install, {icons, prefix: false}]]}
                });


                assert.isTrue(element.exists());
                assert.notInclude(element.classes(), ['x', 'icon-x']);
            });

            it('default prefix', () => {
                const element = shallowMount(JIcon, {
                    props: {icon: 'x'},
                    global: {plugins: [[install, {icons, prefix: true}]]}
                });

                assert.isTrue(element.exists());
                assert.include(element.classes(), 'icon-x');
            });

            it('custom prefix', () => {
                const element = shallowMount(JIcon, {
                    props: {icon: 'x'},
                    global: {plugins: [[install, {icons, prefix: 'j-icon-'}]]}
                });

                assert.isTrue(element.exists());
                assert.include(element.classes(), 'j-icon-x');
            });
        });

        it('classes option', () => {
            const element = shallowMount(JIcon, {
                props: {icon: 'x'},
                global: {plugins: [[install, {icons, prefix: false, classes: ['j-icon']}]]}
            });

            assert.isTrue(element.exists());
            assert.include(element.classes(), 'j-icon');
        });
    });

    describe('create SVG element', () => {
        function assertion(element, detail) {
            assert.isTrue(element.exists());
            assert.equal(element.attributes('width'), detail.size[0]);
            assert.equal(element.attributes('height'), detail.size[1]);
            assert.equal(element.attributes('viewBox'), detail.viewBox.join(' '));
            assert.equal(element.attributes('aria-hidden'), 'true');
        }

        it('from SVG name', () => {
            assertion(shallowMount(
                JIcon,
                {
                    props: {icon: 'x'},
                    global: {plugins: [[install, {icons}]]}
                }),
                x);
        });

        it('from icon detail', () => {
            const element = shallowMount(JIcon, {props: {icon: code, style: {'text-align': 'center'}}});
            assertion(element, code);
            assert.include(element.classes(), 'clazz');
            assert.equal(element.attributes('focusable'), 'false');
            assert.include(element.attributes('style'), 'display: inline-block');
        });
    });

    describe('component props', () => {
        /** @type {VueWrapper} */
        let element;
        before(() => {
            element = shallowMount(JIcon, {props: {icon: x}});
            assert.isTrue(element.exists());
        });

        it('title', async () => {
            assert.isFalse(element.find('title').exists());

            const text = 'title';
            await element.setProps({title: text});

            assert.isTrue(element.find('title').exists());
            assert.equal(element.find('title').text(), text);
        });

        it('width', async () => {
            assert.equal(element.attributes('width'), x.size[0]);

            const width = x.size[0] + 1;
            await element.setProps({width});

            assert.equal(element.attributes('width'), width);
        });

        it('height', async () => {
            assert.equal(element.attributes('height'), x.size[1]);

            const height = x.size[1] + 1;
            await element.setProps({height});

            assert.equal(element.attributes('height'), height);
        });

        it('ariaLabel', async () => {
            assert.isNotOk(element.attributes('aria-label'));
            assert.equal(element.attributes('aria-hidden'), 'true');

            const text = 'ariaLabel';
            await element.setProps({ariaLabel: text});

            assert.equal(element.attributes('aria-label'), text);
            assert.equal(element.attributes('aria-hidden'), 'false');
        });
    });

    describe('event', () => {
        it('bind event', done => {
            const onClick = event => {
                const element = event.target;
                if (!(element instanceof SVGSVGElement)) return;
                done();
            };

            const element = shallowMount(JIcon, {props: {icon: x}, attrs: {onClick}});
            element.trigger('click');
        });
    });
});
