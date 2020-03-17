'use strict';
import {assert} from 'chai';
import {shallowMount, createLocalVue} from '@vue/test-utils';
import jIcon from '../src/j-icon';
import install from '../src/index';
import icons, {Code, Reply, X} from './icon';

const vue = createLocalVue();
vue.use(install, {icons, classNames: ['j-icon']});

describe('Vue j-icon component', () => {
    describe('install plugin', () => {
        describe('icon name class prefix', () => {
            it('not add icon name', () => {
                const vue = createLocalVue();
                vue.use(install, {icons, prefix: false});

                const element = shallowMount(jIcon, {propsData: {icon: 'x'}});
                assert.isTrue(element.exists());
                assert.notInclude(element.classes().join(' '), 'x');
            });

            it('default prefix', () => {
                const vue = createLocalVue();
                vue.use(install, {icons});

                const element = shallowMount(jIcon, {propsData: {icon: 'x'}});
                assert.isTrue(element.exists());
                assert.include(element.classes(), 'icon-x');
            });

            it('custom prefix', () => {
                const vue = createLocalVue();
                vue.use(install, {icons, prefix: 'j-icon-'});

                const element = shallowMount(jIcon, {propsData: {icon: 'x'}});
                assert.isTrue(element.exists());
                assert.include(element.classes(), 'j-icon-x');
            });
        });

        describe('SVG class attribute', () => {
            it('no element class is added', () => {
                const vue = createLocalVue();
                vue.use(install, {icons, prefix: false});

                const element = shallowMount(jIcon, {propsData: {icon: 'x'},context: {staticClass: 'mr-2'}});
                assert.isTrue(element.exists());
                assert.equal(element.classes().join(' '), 'mr-2');
            });

            it('add element class', () => {
                const vue = createLocalVue();
                vue.use(install, {icons, prefix: false, classNames: ['j-icon']});

                const element = shallowMount(jIcon, {propsData: {icon: 'x'}});
                assert.isTrue(element.exists());
                assert.include(element.classes(), 'j-icon');
            });
        });
    });

    describe('create SVG Element', () => {
        it('form SVG name', () => {
            const element = shallowMount(jIcon, {propsData: {icon: 'x'}});
            assert.isTrue(element.exists());
            assert.isTrue(element.isFunctionalComponent);
            assert.equal(element.attributes('width'), X.size[0]);
            assert.equal(element.attributes('height'), X.size[1]);
            assert.equal(element.attributes('aria-hidden'), 'true');
        });

        it('form render function', () => {
            const wrapper = shallowMount(jIcon, {propsData: {icon: Code}});
            assert.isTrue(wrapper.exists());
            assert.isTrue(wrapper.isFunctionalComponent);
        });
    });

    describe('element attribute', () => {
        it('viewBox', () => {
            const element = shallowMount(jIcon, {propsData: {icon: 'x'}});
            assert.equal(element.attributes('viewBox'), X.viewBox.join(' '));
        });

        it('missing the size attribute', () => {
            const element = shallowMount(jIcon, {propsData: {icon: 'reply'}});
            assert.isTrue(element.exists());
            assert.equal(element.attributes('width'), Reply.viewBox[2].toString());
            assert.equal(element.attributes('height'), Reply.viewBox[3].toString());
        });
    });

    describe('component props', () => {
        /** @type {Wrapper<Vue>} */
        let element;
        before(() => {
            element = shallowMount(jIcon, {propsData: {icon: 'x'}});
        });
        it('title', () => {
            const text = 'title';
            const element = shallowMount(jIcon, {propsData: {icon: 'x', title: text}});
            const title = element.find('title');
            assert.isNotNull(title);
            assert.equal(title.text(), text);
        });
        it('width', () => {
            const width = X.size[0] + 1;
            const element = shallowMount(jIcon, {propsData: {icon: 'x', width}});
            assert.equal(element.attributes('width'), width.toString());
        });
        it('height', () => {
            const height = X.size[1] + 1;
            const element = shallowMount(jIcon, {propsData: {icon: 'x', height}});
            assert.equal(element.attributes('height'), height.toString());
        });
        it('ariaLabel', () => {
            const text = 'aria-label';
            const element = shallowMount(jIcon, {propsData: {icon: 'x', ariaLabel: text}});
            assert.equal(element.attributes('aria-label'), text);
            assert.equal(element.attributes('aria-hidden'), 'false');
        });
    });

    describe('event', () => {
        it('bind event', done => {
            const handler = event => {
                const element = event.target;
                if (!(element instanceof SVGSVGElement)) return;
                done();
            };
            const element = shallowMount(jIcon, {propsData: {icon: 'x'}, listeners: {'click': handler}});
            element.trigger('click');
        });
    });
});
