#include <iostream>
#include <vector>
#include <unordered_map>
#include <queue>
#include <algorithm>
using namespace std;

// Node structure for Linked List
struct ListNode {
    int data;
    ListNode* next;
    ListNode(int val) : data(val), next(nullptr) {}
};

// Node structure for Binary Search Tree
struct TreeNode {
    int data;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int val) : data(val), left(nullptr), right(nullptr) {}
};

// Function to print array
void printArray(const vector<int>& arr) {
    cout << "Array: [";
    for (size_t i = 0; i < arr.size(); i++) {
        cout << arr[i];
        if (i < arr.size() - 1) cout << ", ";
    }
    cout << "]" << endl;
}

// Function to print linked list
void printLinkedList(ListNode* head) {
    cout << "Linked List: ";
    ListNode* current = head;
    while (current != nullptr) {
        cout << current->data;
        if (current->next != nullptr) cout << " -> ";
        current = current->next;
    }
    cout << " -> NULL" << endl;
}

// Function to print BST (inorder traversal)
void printBST(TreeNode* root) {
    if (root == nullptr) return;
    printBST(root->left);
    cout << root->data << " ";
    printBST(root->right);
}

// Function to print HashMap
void printHashMap(const unordered_map<int, int>& hashMap) {
    cout << "HashMap: {";
    bool first = true;
    for (const auto& pair : hashMap) {
        if (!first) cout << ", ";
        cout << pair.first << ":" << pair.second;
        first = false;
    }
    cout << "}" << endl;
}

// 1. Array to Linked List conversion
ListNode* arrayToLinkedList(const vector<int>& arr) {
    if (arr.empty()) return nullptr;
    
    ListNode* head = new ListNode(arr[0]);
    ListNode* current = head;
    
    for (size_t i = 1; i < arr.size(); i++) {
        current->next = new ListNode(arr[i]);
        current = current->next;
    }
    
    return head;
}

// 2. Array/Linked List to BST conversion
TreeNode* insertIntoBST(TreeNode* root, int value) {
    if (root == nullptr) {
        return new TreeNode(value);
    }
    
    if (value < root->data) {
        root->left = insertIntoBST(root->left, value);
    } else {
        root->right = insertIntoBST(root->right, value);
    }
    
    return root;
}

TreeNode* arrayToBST(const vector<int>& arr) {
    if (arr.empty()) return nullptr;
    
    TreeNode* root = nullptr;
    for (int value : arr) {
        root = insertIntoBST(root, value);
    }
    
    return root;
}

TreeNode* linkedListToBST(ListNode* head) {
    vector<int> arr;
    ListNode* current = head;
    
    // Convert linked list to array
    while (current != nullptr) {
        arr.push_back(current->data);
        current = current->next;
    }
    
    // Sort array for balanced BST
    sort(arr.begin(), arr.end());
    
    return arrayToBST(arr);
}

// 3. Linked List to Array conversion
vector<int> linkedListToArray(ListNode* head) {
    vector<int> arr;
    ListNode* current = head;
    
    while (current != nullptr) {
        arr.push_back(current->data);
        current = current->next;
    }
    
    return arr;
}

// 4. BST to HashMap conversion
void bstToHashMapHelper(TreeNode* root, unordered_map<int, int>& hashMap, int& index) {
    if (root == nullptr) return;
    
    bstToHashMapHelper(root->left, hashMap, index);
    hashMap[index++] = root->data;
    bstToHashMapHelper(root->right, hashMap, index);
}

unordered_map<int, int> bstToHashMap(TreeNode* root) {
    unordered_map<int, int> hashMap;
    int index = 0;
    bstToHashMapHelper(root, hashMap, index);
    return hashMap;
}

// 5. HashMap to BST conversion
TreeNode* hashMapToBST(const unordered_map<int, int>& hashMap) {
    if (hashMap.empty()) return nullptr;
    
    vector<int> values;
    for (const auto& pair : hashMap) {
        values.push_back(pair.second);
    }
    
    // Sort values for balanced BST
    sort(values.begin(), values.end());
    
    return arrayToBST(values);
}

// Function to free linked list memory
void freeLinkedList(ListNode* head) {
    while (head != nullptr) {
        ListNode* temp = head;
        head = head->next;
        delete temp;
    }
}

// Function to free BST memory
void freeBST(TreeNode* root) {
    if (root == nullptr) return;
    freeBST(root->left);
    freeBST(root->right);
    delete root;
}

// Function to get user input for array
vector<int> getArrayInput() {
    vector<int> arr;
    int n, val;
    
    cout << "Enter the number of elements: ";
    cin >> n;
    
    cout << "Enter " << n << " elements:" << endl;
    for (int i = 0; i < n; i++) {
        cin >> val;
        arr.push_back(val);
    }
    
    return arr;
}

// Function to get user input for linked list
ListNode* getLinkedListInput() {
    vector<int> arr = getArrayInput();
    return arrayToLinkedList(arr);
}

// Function to get user input for BST
TreeNode* getBSTInput() {
    vector<int> arr = getArrayInput();
    return arrayToBST(arr);
}

// Function to get user input for HashMap
unordered_map<int, int> getHashMapInput() {
    unordered_map<int, int> hashMap;
    int n, key, value;
    
    cout << "Enter the number of key-value pairs: ";
    cin >> n;
    
    cout << "Enter " << n << " key-value pairs:" << endl;
    for (int i = 0; i < n; i++) {
        cout << "Key " << i + 1 << ": ";
        cin >> key;
        cout << "Value " << i + 1 << ": ";
        cin >> value;
        hashMap[key] = value;
    }
    
    return hashMap;
}

int main() {
    int choice;
    vector<int> arr;
    ListNode* linkedList = nullptr;
    TreeNode* bst = nullptr;
    unordered_map<int, int> hashMap;
    
    cout << "=== Data Structure Conversion Menu ===" << endl;
    cout << "1. Array to Linked List" << endl;
    cout << "2. Array/Linked List to BST" << endl;
    cout << "3. Linked List to Array" << endl;
    cout << "4. BST to HashMap" << endl;
    cout << "5. HashMap to BST" << endl;
    cout << "6. Exit" << endl;
    
    do {
        cout << "\nEnter your choice (1-6): ";
        cin >> choice;
        
        switch (choice) {
            case 1: {
                cout << "\n--- Array to Linked List ---" << endl;
                arr = getArrayInput();
                cout << "\nInput: ";
                printArray(arr);
                
                linkedList = arrayToLinkedList(arr);
                cout << "Output: ";
                printLinkedList(linkedList);
                break;
            }
            
            case 2: {
                cout << "\n--- Array/Linked List to BST ---" << endl;
                cout << "Choose input type:" << endl;
                cout << "1. Array" << endl;
                cout << "2. Linked List" << endl;
                
                int subChoice;
                cout << "Enter choice (1-2): ";
                cin >> subChoice;
                
                if (subChoice == 1) {
                    arr = getArrayInput();
                    cout << "\nInput: ";
                    printArray(arr);
                    bst = arrayToBST(arr);
                } else if (subChoice == 2) {
                    linkedList = getLinkedListInput();
                    cout << "\nInput: ";
                    printLinkedList(linkedList);
                    bst = linkedListToBST(linkedList);
                }
                
                cout << "Output BST (inorder): ";
                printBST(bst);
                cout << endl;
                break;
            }
            
            case 3: {
                cout << "\n--- Linked List to Array ---" << endl;
                linkedList = getLinkedListInput();
                cout << "\nInput: ";
                printLinkedList(linkedList);
                
                arr = linkedListToArray(linkedList);
                cout << "Output: ";
                printArray(arr);
                break;
            }
            
            case 4: {
                cout << "\n--- BST to HashMap ---" << endl;
                bst = getBSTInput();
                cout << "\nInput BST (inorder): ";
                printBST(bst);
                cout << endl;
                
                hashMap = bstToHashMap(bst);
                cout << "Output: ";
                printHashMap(hashMap);
                break;
            }
            
            case 5: {
                cout << "\n--- HashMap to BST ---" << endl;
                hashMap = getHashMapInput();
                cout << "\nInput: ";
                printHashMap(hashMap);
                
                bst = hashMapToBST(hashMap);
                cout << "Output BST (inorder): ";
                printBST(bst);
                cout << endl;
                break;
            }
            
            case 6:
                cout << "Exiting program..." << endl;
                break;
                
            default:
                cout << "Invalid choice! Please enter a number between 1-6." << endl;
        }
        
        // Clean up memory after each operation
        if (choice == 1 || choice == 3) {
            freeLinkedList(linkedList);
            linkedList = nullptr;
        }
        if (choice == 2 || choice == 4 || choice == 5) {
            freeBST(bst);
            bst = nullptr;
        }
        
    } while (choice != 6);
    
    // Final cleanup
    freeLinkedList(linkedList);
    freeBST(bst);
    
    return 0;
}
