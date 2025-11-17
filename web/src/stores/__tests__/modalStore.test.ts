import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useModalStore } from '../modalStore';
import { defineComponent, h } from 'vue';

describe('modalStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    describe('state', () => {
        it('should have correct initial state', () => {
            const store = useModalStore();

            expect(store.modals).toEqual([]);
        });
    });

    describe('openModal', () => {
        it('should add a modal to the stack', () => {
            const store = useModalStore();
            const TestComponent = defineComponent({
                render() {
                    return h('div', 'Test Modal');
                },
            });

            store.openModal(TestComponent);

            expect(store.modals).toHaveLength(1);
            expect(store.modals[0].component).toBe(TestComponent);
            expect(store.modals[0].id).toBeGreaterThan(0);
        });

        it('should add modal with props', () => {
            const store = useModalStore();
            const TestComponent = defineComponent({
                props: ['title', 'message'],
                render() {
                    return h('div', `${this.title}: ${this.message}`);
                },
            });

            const props = { title: 'Alert', message: 'Hello World' };
            store.openModal(TestComponent, props);

            expect(store.modals).toHaveLength(1);
            expect(store.modals[0].props).toEqual(props);
        });

        it('should stack multiple modals', () => {
            const store = useModalStore();
            const Modal1 = defineComponent({ render: () => h('div', 'Modal 1') });
            const Modal2 = defineComponent({ render: () => h('div', 'Modal 2') });
            const Modal3 = defineComponent({ render: () => h('div', 'Modal 3') });

            store.openModal(Modal1);
            store.openModal(Modal2);
            store.openModal(Modal3);

            expect(store.modals).toHaveLength(3);
            expect(store.modals[0].component).toBe(Modal1);
            expect(store.modals[1].component).toBe(Modal2);
            expect(store.modals[2].component).toBe(Modal3);
        });

        it('should assign incremental IDs to modals', () => {
            const store = useModalStore();
            const TestComponent = defineComponent({ render: () => h('div', 'Test') });

            store.openModal(TestComponent);
            store.openModal(TestComponent);
            store.openModal(TestComponent);

            const id1 = store.modals[0].id;
            const id2 = store.modals[1].id;
            const id3 = store.modals[2].id;

            expect(id2).toBe(id1 + 1);
            expect(id3).toBe(id2 + 1);
        });

        it('should handle modals without props', () => {
            const store = useModalStore();
            const TestComponent = defineComponent({ render: () => h('div', 'Test') });

            store.openModal(TestComponent);

            expect(store.modals[0].props).toEqual({});
        });
    });

    describe('closeTopModal', () => {
        it('should remove the top modal from stack', () => {
            const store = useModalStore();
            const Modal1 = defineComponent({ render: () => h('div', 'Modal 1') });
            const Modal2 = defineComponent({ render: () => h('div', 'Modal 2') });

            store.modals = [
                { id: 1, component: Modal1 },
                { id: 2, component: Modal2 },
            ];

            expect(store.modals).toHaveLength(2);

            store.closeTopModal();

            expect(store.modals).toHaveLength(1);
            expect(store.modals[0].component).toEqual(Modal1);
        });

        it('should handle closing when no modals are open', () => {
            const store = useModalStore();

            expect(store.modals).toHaveLength(0);

            store.closeTopModal();

            expect(store.modals).toHaveLength(0);
        });

        it('should close modals in LIFO order', () => {
            const store = useModalStore();
            const Modal1 = defineComponent({ render: () => h('div', 'Modal 1') });
            const Modal2 = defineComponent({ render: () => h('div', 'Modal 2') });
            const Modal3 = defineComponent({ render: () => h('div', 'Modal 3') });

            store.modals = [
                { id: 1, component: Modal1 },
                { id: 2, component: Modal2 },
                { id: 3, component: Modal3 },
            ];

            store.closeTopModal();
            expect(store.modals).toHaveLength(2);
            expect(store.modals[1].component).toEqual(Modal2);

            store.closeTopModal();
            expect(store.modals).toHaveLength(1);
            expect(store.modals[0].component).toEqual(Modal1);

            store.closeTopModal();
            expect(store.modals).toHaveLength(0);
        });

        it('should be safe to call multiple times on empty stack', () => {
            const store = useModalStore();

            store.closeTopModal();
            store.closeTopModal();
            store.closeTopModal();

            expect(store.modals).toHaveLength(0);
        });
    });

    describe('topModal getter', () => {
        it('should return null when no modals are open', () => {
            const store = useModalStore();

            expect(store.topModal).toBeNull();
        });

        it('should return the top modal', () => {
            const store = useModalStore();
            const Modal1 = defineComponent({ render: () => h('div', 'Modal 1') });
            const Modal2 = defineComponent({ render: () => h('div', 'Modal 2') });

            store.modals = [
                { id: 1, component: Modal1 },
                { id: 2, component: Modal2 },
            ];

            expect(store.topModal).not.toBeNull();
            expect(store.topModal?.component).toEqual(Modal2);
        });

        it('should update when modals are added', () => {
            const store = useModalStore();
            const Modal1 = defineComponent({ render: () => h('div', 'Modal 1') });
            const Modal2 = defineComponent({ render: () => h('div', 'Modal 2') });

            store.modals = [{ id: 1, component: Modal1 }];
            expect(store.topModal?.component).toEqual(Modal1);

            store.modals.push({ id: 2, component: Modal2 });
            expect(store.topModal?.component).toEqual(Modal2);
        });

        it('should update when modals are removed', () => {
            const store = useModalStore();
            const Modal1 = defineComponent({ render: () => h('div', 'Modal 1') });
            const Modal2 = defineComponent({ render: () => h('div', 'Modal 2') });

            store.modals = [
                { id: 1, component: Modal1 },
                { id: 2, component: Modal2 },
            ];

            expect(store.topModal?.component).toEqual(Modal2);

            store.modals.pop();
            expect(store.topModal?.component).toEqual(Modal1);

            store.modals.pop();
            expect(store.topModal).toBeNull();
        });

        it('should return modal with correct props', () => {
            const store = useModalStore();
            const TestComponent = defineComponent({ render: () => h('div', 'Test') });
            const props = { title: 'Test Title', value: 42 };

            store.modals = [{ id: 1, component: TestComponent, props }];

            expect(store.topModal?.props).toEqual(props);
        });
    });

    describe('integration scenarios', () => {
        it('should handle opening and closing modals in sequence', () => {
            const store = useModalStore();
            const Modal1 = defineComponent({ render: () => h('div', 'Modal 1') });
            const Modal2 = defineComponent({ render: () => h('div', 'Modal 2') });

            store.openModal(Modal1, { step: 1 });
            expect(store.topModal?.props).toEqual({ step: 1 });

            store.openModal(Modal2, { step: 2 });
            expect(store.topModal?.props).toEqual({ step: 2 });
            expect(store.modals).toHaveLength(2);

            store.closeTopModal();
            expect(store.topModal?.props).toEqual({ step: 1 });
            expect(store.modals).toHaveLength(1);

            store.closeTopModal();
            expect(store.topModal).toBeNull();
            expect(store.modals).toHaveLength(0);
        });

        it('should maintain unique IDs across open/close cycles', () => {
            const store = useModalStore();
            const TestComponent = defineComponent({ render: () => h('div', 'Test') });

            store.openModal(TestComponent);
            const firstId = store.topModal!.id;

            store.closeTopModal();

            store.openModal(TestComponent);
            const secondId = store.topModal!.id;

            expect(secondId).toBeGreaterThan(firstId);
        });
    });
});
