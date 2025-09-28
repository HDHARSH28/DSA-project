// Data Structure Classes for Dynamic Mode

// Node for Linked List
class ListNode {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

// Linked List implementation
class LinkedList {
    constructor() {
        this.head = null;
    }
    insertAt(index, value) {
        let node = new ListNode(value);
        if (index === 0) {
            node.next = this.head;
            this.head = node;
            return;
        }
        let curr = this.head, prev = null, i = 0;
        while (curr && i < index) {
            prev = curr;
            curr = curr.next;
            i++;
        }
        // Assuming a valid index for insertion or insertion at the end
        if (prev) {
            node.next = curr;
            prev.next = node;
        }
    }
    removeAt(index) {
        if (!this.head) return;
        if (index === 0) {
            this.head = this.head.next;
            return;
        }
        let curr = this.head, prev = null, i = 0;
        while (curr && i < index) {
            prev = curr;
            curr = curr.next;
            i++;
        }
        if (curr) prev.next = curr.next;
    }
    toArray() {
        let arr = [], curr = this.head;
        while (curr) {
            arr.push(curr.value);
            curr = curr.next;
        }
        return arr;
    }
}

// Node for Binary Search Tree
class BSTNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

// Binary Search Tree implementation
class BST {
    constructor() {
        this.root = null;
    }
    insert(value) {
        this.root = this._insert(this.root, value);
    }
    _insert(node, value) {
        if (!node) return new BSTNode(value);
        if (value < node.value) node.left = this._insert(node.left, value);
        else node.right = this._insert(node.right, value);
        return node;
    }
    search(value) {
        return this._search(this.root, value);
    }
    _search(node, value) {
        if (!node) return false;
        if (node.value === value) return true;
        if (value < node.value) return this._search(node.left, value);
        return this._search(node.right, value);
    }
    toArray() {
        let arr = [];
        function inorder(node) {
            if (!node) return;
            inorder(node.left);
            arr.push(node.value);
            inorder(node.right);
        }
        inorder(this.root);
        return arr;
    }
}

// Dynamic Structure Handler - Manages the current DS and handles switching
class DynamicDS {
    constructor() {
        this.ds = []; // Initial data structure is an Array
        this.type = 'array';
    }

    // Utility function to convert current data to the target type
    switchTo(type) {
        if (this.type === type) return;

        if (type === 'array') {
            if (this.type === 'linkedlist' || this.type === 'bst') {
                this.ds = this.ds.toArray();
            }
        } else if (type === 'linkedlist') {
            let ll = new LinkedList();
            for (let i = 0; i < this.ds.length; i++) {
                ll.insertAt(i, this.ds[i]);
            }
            this.ds = ll;
        } else if (type === 'bst') {
            let bst = new BST();
            for (let v of this.ds) bst.insert(v);
            this.ds = bst;
        }
        this.type = type;
    }

    insertAt(index, value) {
        // Insertion logic favors Array for push (end) and LinkedList for indexed insertion
        if (index === undefined || index === this.getLength()) {
            this.switchTo('array');
            this.ds.push(value);
        } else {
            this.switchTo('linkedlist');
            this.ds.insertAt(index, value);
        }
    }

    removeAt(index) {
        // Removal by index uses LinkedList
        this.switchTo('linkedlist');
        this.ds.removeAt(index);
    }

    search(value) {
        // Search operation uses BST
        this.switchTo('bst');
        return this.ds.search(value);
    }

    getAll() {
        // Returns the data as an Array for the frontend
        if (this.type === 'array') return this.ds;
        return this.ds.toArray();
    }

    getLength() {
        if (this.type === 'array') return this.ds.length;
        // For complexity estimation, calling toArray().length is not ideal,
        // but it's the simplest way to abstract length across structures here.
        if (this.type === 'linkedlist' || this.type === 'bst') return this.ds.toArray().length;
        return 0;
    }

    getType() {
        return this.type;
    }
}

module.exports = DynamicDS;
