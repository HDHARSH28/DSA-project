// Data Structure Classes

class ListNode {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

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
        node.next = curr;
        prev.next = node;
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

class BSTNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

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

// Dynamic Structure Handler

class DynamicDS {
    constructor() {
        this.ds = [];
        this.type = 'array';
    }

    switchTo(type) {
        if (this.type === type) return;
        // Convert current ds to new type
        if (type === 'array') {
            if (this.type === 'linkedlist') {
                this.ds = this.ds.toArray();
            } else if (this.type === 'bst') {
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
        // If insert at end, use array
        if (index === undefined || index === this.getLength()) {
            this.switchTo('array');
            this.ds.push(value);
        } else {
            this.switchTo('linkedlist');
            this.ds.insertAt(index, value);
        }
    }

    removeAt(index) {
        this.switchTo('linkedlist');
        this.ds.removeAt(index);
    }

    search(value) {
        this.switchTo('bst');
        return this.ds.search(value);
    }

    getAll() {
        if (this.type === 'array') return this.ds;
        return this.ds.toArray();
    }

    getLength() {
        if (this.type === 'array') return this.ds.length;
        if (this.type === 'linkedlist') return this.ds.toArray().length;
        if (this.type === 'bst') return this.ds.toArray().length;
        return 0;
    }
}

// Example Express Backend

const express = require('express');
const app = express();
app.use(express.json());

const dynamicDS = new DynamicDS();

app.post('/insert', (req, res) => {
    const { index, value } = req.body;
    dynamicDS.insertAt(index, value);
    res.json({ data: dynamicDS.getAll(), type: dynamicDS.type });
});

app.delete('/remove', (req, res) => {
    const { index } = req.body;
    dynamicDS.removeAt(index);
    res.json({ data: dynamicDS.getAll(), type: dynamicDS.type });
});

app.get('/search/:value', (req, res) => {
    const value = parseInt(req.params.value);
    const found = dynamicDS.search(value);
    res.json({ found, type: dynamicDS.type });
});

app.get('/all', (req, res) => {
    res.json({ data: dynamicDS.getAll(), type: dynamicDS.type });
});

app.listen(3000, () => {
    console.log('Dynamic DS backend running on port 3000');
});