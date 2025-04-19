interface Node<T> {
    value: T;
    next: Node<T> | null;
    prev: Node<T> | null;
}

class CircularLinkedList<T> {
    private head: Node<T> | null = null;
    private tail: Node<T> | null = null;
    private current: Node<T> | null = null;

    constructor(items: T[]) {
        if (items.length === 0) return;

        // Create first node
        this.head = this.createNode(items[0]);
        this.current = this.head;
        let prev = this.head;

        // Create rest of the nodes
        for (let i = 1; i < items.length; i++) {
            const node = this.createNode(items[i]);
            prev.next = node;
            node.prev = prev;
            prev = node;
        }

        // Set tail and make circular
        this.tail = prev;
        if (this.tail && this.head) {
            this.tail.next = this.head;
            this.head.prev = this.tail;
        }
    }

    private createNode(value: T): Node<T> {
        return { value, next: null, prev: null };
    }

    next(): T | null {
        if (!this.current || !this.current.next) return null;
        this.current = this.current.next;
        return this.current.value;
    }

    prev(): T | null {
        if (!this.current || !this.current.prev) return null;
        this.current = this.current.prev;
        return this.current.value;
    }

    getCurrent(): T | null {
        return this.current ? this.current.value : null;
    }

    hasNext(): boolean {
        return !!(this.current && this.current.next);
    }

    hasPrev(): boolean {
        return !!(this.current && this.current.prev);
    }

    reset(): void {
        this.current = this.head;
    }
}

export default CircularLinkedList;
