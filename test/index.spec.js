'use strict';
import {assert} from 'chai';
import {shallowMount, createLocalVue} from '@vue/test-utils';
import JIcon from '../src/j-icon';
import install from '../src/index';
import icons, {Code, reply, x} from './icon';

describe('Vue j-icon component', () => {
    describe('install plugin', () => {
        describe('prefix option', () => {
            it('no prefix', () => {
                const localVue = createLocalVue();
                localVue.use(install, {icons, prefix: false});

                const element = shallowMount(JIcon, {localVue, propsData: {icon: 'x'}});
                assert.isTrue(element.exists());
                assert.notInclude(element.classes(), 'x');
            });

            it('default prefix', () => {
                const localVue = createLocalVue();
                localVue.use(install, {icons});

                const element = shallowMount(JIcon, {localVue, propsData: {icon: 'x'}});
                assert.isTrue(element.exists());
                assert.include(element.classes(), 'icon-x');
            });

            it('custom prefix', () => {
                const localVue = createLocalVue();
                localVue.use(install, {icons, prefix: 'j-icon-'});

                const element = shallowMount(JIcon, {localVue, propsData: {icon: 'x'}});
                assert.isTrue(element.exists());
                assert.include(element.classes(), 'j-icon-x');
            });
        });

        describe('classes option', () => {
            it('add element class', () => {
                const localVue = createLocalVue();
                localVue.use(install, {icons, prefix: false, classes: ['j-icon']});

                const element = shallowMount(JIcon, {localVue, propsData: {icon: 'x'}});
                assert.isTrue(element.exists());
                assert.include(element.classes(), 'j-icon');
            });

            it('merge classNames', () => {
                const localVue = createLocalVue();
                localVue.use(install, {icons, prefix: false, classes: ['classes'], classNames: ['classnames']});

                const element = shallowMount(JIcon, {localVue, propsData: {icon: 'x'}});
                assert.isTrue(element.exists());
                assert.includeMembers(element.classes(), ['classes', 'classnames']);
            });
        });
    });

    describe('create SVG Element', () => {
        function assertion(element, detail) {
            assert.isTrue(element.exists());
            assert.equal(element.attributes('width'), detail.size?.[0] ?? detail.viewBox[2]);
            assert.equal(element.attributes('height'), detail.size?.[1] ?? detail.viewBox[3]);
            assert.equal(element.attributes('viewBox'), detail.viewBox.join(' '));
            assert.equal(element.attributes('aria-hidden'), 'true');
        }

        it('from SVG name', () => assertion(shallowMount(JIcon, {localVue: createLocalVue().use(install, {icons}), propsData: {icon: 'x'}}), x));

        it('from render function', () => assertion(shallowMount(JIcon, {propsData: {icon: Code}}), Code));

        it('from icon object', () => assertion(shallowMount(JIcon, {propsData: {icon: x}}), x));

        it('rollback to the viewBox', () => assertion(shallowMount(JIcon, {propsData: {icon: reply}}), reply));

        describe('merge class', () => {
            it('create the element using the SVG name', () => {
                const iicons = Object.assign({}, icons, {classed: Object.assign({}, reply, {class: 'prefix suffix'})})
                    , localVue = createLocalVue();
                localVue.use(install, {icons: iicons});

                let element = shallowMount(JIcon, {localVue, propsData: {icon: 'classed'}});
                assert.isTrue(element.exists());
                assert.includeMembers(element.classes(), ['prefix', 'suffix']);

                element = shallowMount(JIcon, {localVue, propsData: {icon: 'classed'}, context: {staticClass: 'one two'}});
                assert.isTrue(element.exists());
                assert.includeMembers(element.classes(), ['prefix', 'suffix', 'one', 'two']);

                element = shallowMount(JIcon, {
                    localVue,
                    propsData: {icon: 'classed'},
                    context: {staticClass: 'one', class: ['two', 'three']}
                });
                assert.isTrue(element.exists());
                assert.includeMembers(element.classes(), ['prefix', 'suffix', 'one', 'two', 'three']);
            });

            it('create the element using the icon object', () => {
                let i = Object.assign({}, reply, {class: 'prefix suffix'});
                let element = shallowMount(JIcon, {propsData: {icon: i}});
                assert.isTrue(element.exists());
                assert.includeMembers(element.classes(), ['prefix', 'suffix']);

                i = Object.assign({}, reply, {class: ['prefix', 'suffix']});
                element = shallowMount(JIcon, {propsData: {icon: i}});
                assert.isTrue(element.exists());
                assert.includeMembers(element.classes(), ['prefix', 'suffix']);

                element = shallowMount(JIcon, {propsData: {icon: i}, context: {staticClass: 'one two'}});
                assert.isTrue(element.exists());
                assert.includeMembers(element.classes(), ['prefix', 'suffix', 'one', 'two']);

                element = shallowMount(JIcon, {propsData: {icon: i}, context: {staticClass: 'one', class: ['two', 'three']}});
                assert.isTrue(element.exists());
                assert.includeMembers(element.classes(), ['prefix', 'suffix', 'one', 'two', 'three']);
            });
        });

        describe('merge style', () => {
            it('create the element using the SVG name', () => {
                const iicons = Object.assign({}, icons, {styled: Object.assign({}, reply, {style: 'display: inline-block'})})
                    , localVue = createLocalVue();
                localVue.use(install, {icons: iicons});

                let element = shallowMount(JIcon, {localVue, propsData: {icon: 'styled'}});
                assert.isTrue(element.exists());
                assert.equal(element.element.style.display, 'inline-block');

                element = shallowMount(JIcon, {localVue, propsData: {icon: 'styled'}, context: {staticStyle: {'text-align': 'center'}}});
                assert.isTrue(element.exists());
                assert.equal(element.element.style.display, 'inline-block');
                assert.equal(element.element.style.textAlign, 'center');

                element = shallowMount(JIcon, {
                    localVue,
                    propsData: {icon: 'styled'},
                    context: {staticStyle: {'font-size': '14px'}, style: 'padding: 1px'}});
                assert.isTrue(element.exists());
                assert.equal(element.element.style.display, 'inline-block');
                assert.equal(element.element.style.fontSize, '14px');
                assert.equal(element.element.style.padding, '1px');
            });

            it('create the element using the icon object', () => {
                let i = Object.assign({}, reply, {style: 'display: inline-block'});
                let element = shallowMount(JIcon, {propsData: {icon: i}});
                assert.isTrue(element.exists());
                assert.equal(element.element.style.display, 'inline-block');

                i = Object.assign({}, reply, {style: {display: 'inline-block'}});
                element = shallowMount(JIcon, {propsData: {icon: i}});
                assert.isTrue(element.exists());
                assert.equal(element.element.style.display, 'inline-block');

                element = shallowMount(JIcon, {propsData: {icon: i}, context: {staticStyle: {'text-align': 'center'}}});
                assert.isTrue(element.exists());
                assert.equal(element.element.style.display, 'inline-block');
                assert.equal(element.element.style.textAlign, 'center');

                element = shallowMount(JIcon, {propsData: {icon: i}, context: {staticStyle: {'font-size': '14px'}, style: 'padding: 1px;'}});
                assert.isTrue(element.exists());
                assert.equal(element.element.style.display, 'inline-block');
                assert.equal(element.element.style.fontSize, '14px');
                assert.equal(element.element.style.padding, '1px');
            });
        });

        it('icon additional attribute', () => {
            const element = shallowMount(JIcon, {propsData: {icon: reply}});

            assert.isTrue(element.exists());
            assert.equal(element.attributes('focusable'), 'true');
        });

        it('override icon attribute', () => {
            const element = shallowMount(JIcon, {propsData: {icon: reply}, attrs: {focusable: 'false'}});

            assert.isTrue(element.exists());
            assert.equal(element.attributes('focusable'), 'false');
        });
    });

    describe('component props', () => {
        /** @type {Wrapper<Vue>} */
        let element;
        before(() => {
            element = shallowMount(JIcon, {propsData: {icon: x}});
            assert.isTrue(element.exists());
        });

        it('title', () => {
            assert.isFalse(element.find('title').exists());

            const text = 'title';
            const el = shallowMount(JIcon, {propsData: {icon: x, title: text}});

            assert.isTrue(el.find('title').exists());
            assert.equal(el.find('title').text(), text);
        });

        it('width', () => {
            assert.equal(element.attributes('width'), x.size[0]);

            const width = x.size[0] + 1;
            const el = shallowMount(JIcon, {propsData: {icon: x, width}});

            assert.equal(el.attributes('width'), width.toString());
        });

        it('height', () => {
            assert.equal(element.attributes('height'), x.size[1]);

            const height = x.size[1] + 1;
            const el = shallowMount(JIcon, {propsData: {icon: x, height}});

            assert.equal(el.attributes('height'), height.toString());
        });

        it('ariaLabel', () => {
            assert.isNotOk(element.attributes('aria-label'));
            assert.equal(element.attributes('aria-hidden'), 'true');

            const text = 'ariaLabel';
            const el = shallowMount(JIcon, {propsData: {icon: x, ariaLabel: text}});

            assert.equal(el.attributes('aria-label'), text);
            assert.equal(el.attributes('aria-hidden'), 'false');
        });
    });

    describe('event', () => {
        it('bind event', done => {
            const handler = event => {
                const element = event.target;
                if (!(element instanceof SVGSVGElement)) return;
                done();
            };

            const element = shallowMount(JIcon, {propsData: {icon: x}, listeners: {'click': handler}});
            element.trigger('click');
        });
    });
});
