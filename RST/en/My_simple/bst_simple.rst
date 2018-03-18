. This file is part of the OpenDSA eTextbook project. See
.. http://algoviz.org/OpenDSA for more details.
.. Copyright (c) 2012-2016 by the OpenDSA Project Contributors, and
.. distributed under an MIT open source license.

.. avmetadata::
   :author: Matthew McQuaigue
   :requires: binary tree terminology; binary tree traversal;
   :satisfies: BST
   :topic: Binary Trees

.. odsalink:: AV/Binary/BSTCON.css

Binary Search Trees
===================

:term:`Tree <tree>` structures enable efficient access and efficient
update to large collections of data.
:term:`Binary trees <binary tree>` in particular are widely used and
relatively easy to implement.
But binary trees are useful for many things besides searching.
Just a few examples of applications that trees can speed up include
:ref:`prioritizing jobs  <Heaps>`,
:ref:`describing mathematical expressions  <BinaryTreeImpl>`
and the syntactic elements of computer programs,
or organizing the information needed to drive
:ref:`data compression algorithms  <Huffman>`.

This chapter covers terminology used for discussing binary trees,
:term:`tree traversals <tree traversal>`, approaches to implementing
tree :term:`nodes <node>`, and various examples of binary trees.

Binary Search Tree Definition
-----------------------------

A :term:`binary search tree` (:term:`BST`)
is a :term:`binary tree` that conforms to the
following condition, known
as the :term:`binary search tree property`.
All :term:`nodes <node>` stored in the left subtree of a node whose
:term:`key` value is :math:`K` have key values
less than or equal to :math:`K`.
All nodes stored in the right subtree of a node whose key value
is :math:`K` have key values greater than :math:`K`.
Figure :num:`Figure #BSTShape` shows two BSTs for a collection of
values.
One consequence of the binary search tree property is that if the BST
nodes are printed using an
:ref:`inorder traversal  <BinaryTreeTraversal>`,
then the resulting enumeration will be in
sorted order from lowest to highest.

.. _BSTShape:

.. odsafig:: Images/BSTShape2.png
   :width: 500
   :align: center
   :capalign: justify
   :figwidth: 90%
   :alt: Two Binary Search Trees

   Two Binary Search Trees for a collection of values.
   Tree (a) results if values are inserted
   in the order 37, 24, 42, 7, 2, 40, 42, 32, 120.
   Tree (b) results if the same values are inserted in the
   order 120, 42, 42, 7, 2, 32, 37, 24, 40.

Here is a class declaration for the BST.
Recall that there are various ways to deal with
:term:`keys <key>` and
:ref:`comparing records  <Comparison>`
Three typical approaches are :term:`key-value pairs <key-value pair>`,
a special comparison method such as using the ``Comparator`` class,
and passing in a :term:`comparator function <comparator>`.
Our BST implementation will require that records implement the
``Comparable`` interface.

.. codeinclude:: Binary/BST
   :tag: BST

Insertion
---------
Lets Take a look at the process of inserting a new node into a Binary Search Tree
Here we can see a slide show with the recursive insertion of into a binary tree.

.. inlineav:: BSTinsertCON ss
  :output: show

Note that, except for the last node in the path, inserthelp will not actually change the child pointer for any of the nodes that are visited. In that sense, many of the assignments seem redundant. However, the cost of these additional assignments is worth paying to keep the insertion process simple. The alternative is to check if a given assignment is necessary, which is probably more expensive than the assignment!

We have to decide what to do when the node that we want to insert has a key value equal to the key of some node already in the tree. If during insert we find a node that duplicates the key value to be inserted, then we have two options. If the application does not allow nodes with equal keys, then this insertion should be treated as an error (or ignored). If duplicate keys are allowed, our convention will be to insert the duplicate in the left subtree.

The shape of a BST depends on the order in which elements are inserted. A new element is added to the BST as a new leaf node, potentially increasing the depth of the tree. Figure 11.11.1 illustrates two BSTs for a collection of values. It is possible for the BST containing nn nodes to be a chain of nodes with height nn. This would happen if, for example, all elements were inserted in sorted order. In general, it is preferable for a BST to be as shallow as possible. This keeps the average cost of a BST operation low.

This is a practice module on how to insert a given node into a binary search tree.

.. avembed:: AV/Binary/BSTinsertPathPRO.html pe

This next practice module will do the same as the one above, but now you must read the algorithm to know what kind on insert is being done.

.. avembed:: AV/Binary/BSTrandinsertPRO.html pe

Creation
--------

.. avembed:: AV/Binary/BSTcreatePRO.html pe

Find
----

The first operation that we will look at in detail will find the record that matches a given key. Notice that in the BST class, public member function find calls private member function findhelp. Method find takes the search key as an explicit parameter and its BST as an implicit parameter, and returns the record that matches the key. However, the find operation is most easily implemented as a recursive function whose parameters are the root of a subtree and the search key. Member findhelp has the desired form for this recursive subroutine and is implemented as follows.

.. inlineav:: BSTsearchCON ss

.. avembed:: AV/Binary/BSTfindPRO.html pe

Remove
------

Removing a node from a BST is a bit trickier than inserting a node,
but it is not complicated if all of the possible cases are considered
individually.
Before tackling the general node removal process, we will first see
how to remove from a given subtree the node with the largest key
value.
This routine will be used later by the general node removal function.

.. inlineav:: BSTdeletemaxCON ss

The return value of the ``deletemax`` method is the subtree of
the current node with the maximum-valued node in the subtree removed.
Similar to the ``inserthelp`` method, each node on the path back to
the root has its right child pointer reassigned to the subtree
resulting from its call to the ``deletemax`` method.

A useful companion method is ``getmax`` which returns a
pointer to the node containing the maximum value in the subtree.

.. codeinclude:: Binary/BST
  :tag: getmax

Now we are ready for the ``removehelp`` method.
Removing a node with given key value :math:`R` from the BST
requires that we first find :math:`R` and then remove it from the
tree.
So, the first part of the remove operation is a search to find
:math:`R`.
Once :math:`R` is found, there are several possibilities.
If :math:`R` has no children, then :math:`R`'s parent has its
pointer set to NULL.
If :math:`R` has one child, then :math:`R`'s parent has
its pointer set to :math:`R`'s child (similar to ``deletemax``).
The problem comes if :math:`R` has two children.
One simple approach, though expensive, is to set :math:`R`'s parent to
point to one of :math:`R`'s subtrees, and then reinsert the remaining
subtree's nodes one at a time.
A better alternative is to find a value in one of the
subtrees that can replace the value in :math:`R`.

Thus, the question becomes:
Which value can substitute for the one being removed?
It cannot be any arbitrary value, because we must preserve the BST
property without making major changes to the structure of the tree.
Which value is most like the one being removed?
The answer is the least key value greater than the one
being removed, or else the greatest key value less than (or equal to)
the one being removed.
If either of these values replace the one being removed,
then the BST property is maintained.

.. inlineav:: BSTremoveCON ss

When duplicate node values do not appear in the tree, it makes no
difference whether the replacement is the greatest value from the
left subtree or the least value from the right subtree.
If duplicates are stored in the left subtree, then we must select
the replacement from the *left* subtree. [#]_
To see why, call the least value in the right subtree :math:`L`.
If multiple nodes in the right subtree have value :math:`L`,
selecting :math:`L` as the replacement value for the root of the
subtree will result in a tree with equal values to the right of the
node now containing :math:`L`.
Selecting the greatest value from the left subtree does not
have a similar problem, because it does not violate the Binary Search
Tree Property if equal values appear in the left subtree.

.. [#] Alternatively, if we prefer to store duplicate values in the
       right subtree, then we must replace a deleted node with the
       least value from its right subtree.


.. avembed:: AV/Binary/BSTremovepathPRO.html ss

.. avembed:: AV/List/llistinsertPRO.html pe
.. avembed:: AV/List/llistDeletePRO.html pe



.. odsascript:: AV/Binary/BSTsearchCON.js
.. odsascript:: AV/Binary/BSTdeletemaxCON.js
.. odsascript:: AV/Binary/BSTremoveCON.js
.. odsascript:: AV/Binary/BSTinsertCON.js
