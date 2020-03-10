'use strict';
import {assert} from 'chai';
import {shallowMount, createLocalVue} from '@vue/test-utils';
import jIcon from '../src/j-icon';
import install from '../src/index';
import icons, {Code, X} from './icon';

const vue = createLocalVue();
vue.use(install, {icons, classNames: ['j-icon']});

describe('Vue j-icon component', () => {
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
