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

Binary Search Tree Insertion
===================

.. avembed:: AV/Binary/BSTinsertPathPRO.html pe

Binary Search Tree Creation
===================================

.. avembed:: AV/Binary/BSTcreatePRO.html pe

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

.. odsascript:: AV/Binary/BSTinsertCON.js

