class Node<T> {
    value: T;
    next: Node<T> | null;
    prev: Node<T> | null;

    constructor(value: T) {
        this.value = value;
        this.next = null;
        this.prev = null;
    }
}

class LinkedList<T> {
    private map: Map<number, Node<T>>;
    private head: Node<T> | null;
    private tail: Node<T> | null;
    private current: Node<T> | null;

    constructor(items: T[]) {
        this.map = new Map();
        this.head = null;
        this.tail = null;
        this.current = null;

        let prevNode: Node<T> | null = null;
        items.forEach((item, index) => {
            const node = new Node(item);
            this.map.set(index, node);

            if (!this.head) {
                this.head = node;
                this.current = node;
            }

            if (prevNode) {
                prevNode.next = node;
                node.prev = prevNode;
            }

            prevNode = node;
        });

        if (prevNode && this.head) {
            this.tail = prevNode;
            (this.tail as Node<T>).next = this.head;
            (this.head as Node<T>).prev = this.tail;
        }
    }

    next(): void {
        if (this.current) {
            this.current = this.current.next;
        }
    }

    prev(): void {
        if (this.current) {
            this.current = this.current.prev;
        }
    }

    getCurrent(): T | null {
        return this.current ? this.current.value : null;
    }
}

export default LinkedList;
