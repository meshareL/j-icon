'use strict';
import {describe, it, beforeEach, afterEach, expect, jest} from '@jest/globals';
import {shallowMount, enableAutoUnmount} from '@vue/test-utils';
import type {VueWrapper} from '@vue/test-utils';
import JIcon, {plugin} from '../src';
import icons, {alert, code, x} from './icon';
import type {Icon} from '../index';

enableAutoUnmount(afterEach);

describe('Vue j-icon component', () => {
    describe('plugin install', () => {
        describe('register global component', () => {
            it('default name', () => {
                const element = shallowMount(JIcon, {
                    props: {icon: alert},
                    global: {plugins: [[plugin]]}});
                expect(element.vm.$.appContext.app.component(JIcon.displayName!)).not.toBeUndefined();
            });

            it('custom name', () => {
                const name = 'CustomName'
                    , element = shallowMount(JIcon, {
                    props: {icon: alert},
                    global: {plugins: [[plugin, {name}]]}});
                expect(element.vm.$.appContext.app.component(name)).not.toBeUndefined();
            });
        });

        describe('prefix option', () => {
            it('no prefix', () => {
                const element = shallowMount(JIcon, {
                    props: {icon: alert},
                    global: {plugins: [[plugin, {prefix: false}]]}
                });

                expect(element.exists()).toBe(true);
                element.classes().forEach(value => {
                    expect(value).not.toMatch(new RegExp(`(-${alert.name})+`, 'g'));
                });
                expect(element.classes()).toContain(alert.name);
            });

            it('default prefix', () => {
                const element = shallowMount(JIcon, {
                    props: {icon: alert},
                    global: {plugins: [[plugin, {prefix: true}]]}
                });

                expect(element.exists()).toBe(true);
                expect(element.classes()).toContain(`icon-${alert.name}`);
            });

            it('custom prefix', () => {
                const prefix = 'custom-'
                    , element = shallowMount(JIcon, {
                    props: {icon: alert},
                    global: {plugins: [[plugin, {prefix}]]}
                });

                expect(element.exists()).toBe(true);
                expect(element.classes()).toContain(`${prefix}${alert.name}`);
            })
        });

        it('classes option', () => {
            const value = ['0123456789', '9876543210']
                , element = shallowMount(JIcon, {
                props: {icon: alert},
                global: {plugins: [[plugin, {classes: [value]}]]}
            });

            expect(element.exists()).toBe(true);
            expect(element.classes()).toEqual(expect.arrayContaining(value));
        });
    });

    describe('create SVG element', () => {
        function assertion(element: VueWrapper, real: Icon): void {
            expect(element.exists()).toBe(true);
            expect(element.attributes('width')).toBe(String((real.size || [])[0] || real.viewBox[2]));
            expect(element.attributes('height')).toBe(String((real.size || [])[1] || real.viewBox[3]));
            expect(element.attributes('viewBox')).toBe(real.viewBox.join(' '));
            expect(element.attributes('aria-hidden')).toBe('true');
        }

        it('from SVG name', () => {
            const element = shallowMount(JIcon, {props: {icon: 'x'}, global: {plugins: [[plugin, {icons}]]}});
            assertion(element, x);
        });

        it('from icon detail', () => {
            const element = shallowMount(JIcon, {props: {icon: code}});
            assertion(element, code);
        });

        it('size rollback to the viewBox', () => {
            const element = shallowMount(JIcon, {props: {icon: alert}});
            assertion(element, alert);
        });

        it('inherit undeclared properties', () => {
            const element = shallowMount(JIcon, {props: {icon: alert, version: '1.1'}});
            assertion(element, alert);
            expect(element.attributes('version')).toBe('1.1');
        });
    });

    describe('component props', () => {
        let element: VueWrapper;
        beforeEach(() => {
            element = shallowMount(JIcon, {props: {icon: x}});
            expect(element.exists()).toBeTruthy();
        });

        it('width', async () => {
            expect(element.attributes('width')).toBe(String(x.size![0]));

            const width = String(x.size![0] + 1);
            await element.setProps({width});

            expect(element.attributes('width')).toBe(width);
        });

        it('height', async () => {
            expect(element.attributes('height')).toBe(String(x.size![1]));

            const height = String(x.size![1] + 1);
            await element.setProps({height});

            expect(element.attributes('height')).toBe(height);
        });

        it.each(['0', '1'])('tabindex GE 0, aria-hidden become false', async (value: string) => {
            expect(element.attributes('aria-hidden')).toBe('true');

            await element.setProps({tabindex: value});
            expect(element.attributes('tabindex')).toBe(value);
            expect(element.attributes('aria-hidden')).toBe('false');
        });

        it('tabindex less 0, aria-hidden become true', async () => {
            const value = '-1';
            element = shallowMount(JIcon, {props: {icon: x, tabindex: value}});

            expect(element.attributes('tabindex')).toBe(value);
            expect(element.attributes('aria-hidden')).toBe('true');
        });

        it.each(['invalid', NaN])(
            'tabindex invalid string or NaN, not change aria-hidden',
            async (value: number | string) => {
                expect(element.attributes('aria-hidden')).toBe('true');

                await element.setProps({tabindex: value});

                expect(element.attributes('tabindex')).toBeUndefined();
                expect(element.attributes('aria-hidden')).toBe('true');
            });

        it('set ariaLabel, aria-hidden become false', async () => {
            expect(element.attributes('aria-label')).toBeFalsy();
            expect(element.attributes('aria-hidden')).toBe('true');

            const text = 'aria label';
            await element.setProps({ariaLabel: text});

            expect(element.attributes('aria-label')).toBe(text);
            expect(element.attributes('aria-hidden')).toBe('false');
        });

        it('set ariaDescription, aria-hidden become false', async () => {
            expect(element.attributes('aria-description')).toBeFalsy();
            expect(element.attributes('aria-hidden')).toBe('true');

            const text = 'aria description';
            await element.setProps({ariaDescription: text});

            expect(element.attributes('aria-description')).toBe(text);
            expect(element.attributes('aria-hidden')).toBe('false');
        });

        it('set title, add a title element, aria-hidden become false and aria-labelledby reference', async () => {
            expect(element.find('title').exists()).toBeFalsy();
            expect(element.attributes('aria-hidden')).toBe('true');

            const text = 'title';
            await element.setProps({title: text});

            const titleElement = element.find('title');

            expect(titleElement.exists()).toBeTruthy();
            expect(titleElement.text()).toBe(text);
            expect(element.attributes('aria-hidden')).toBe('false');
            expect(element.attributes('aria-labelledby')).toBe(titleElement.attributes('id'));
        });

        it('set desc, add a desc element, aria-hidden become false and aria-describedby reference', async () => {
            expect(element.find('desc').exists()).toBeFalsy();
            expect(element.attributes('aria-hidden')).toBe('true');

            const text = 'desc';
            await element.setProps({desc: text});

            const descElement = element.find('desc');

            expect(descElement.exists()).toBeTruthy();
            expect(descElement.text()).toBe(text);
            expect(element.attributes('aria-hidden')).toBe('false');
            expect(element.attributes('aria-describedby')).toBe(descElement.attributes('id'));
        });
    });

    describe('event', () => {
        it('bind event', () => {
            const onClick = jest.fn<(event: MouseEvent) => void>()
                , element = shallowMount(JIcon, {props: {icon: alert}, attrs: {onClick}});
            element.trigger('click');

            expect(onClick).toBeCalledTimes(1);
        });
    });
});
