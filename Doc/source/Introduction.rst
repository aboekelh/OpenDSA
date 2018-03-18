.. _Introduction:

Introduction
============

This documentation describes various components of the OpenDSA system.
This includes the support infrastructure for authoring OpenDSA
modules, information helpful for developing AVs and exercises,
documentation for the textbook configuration system (to control which
modules and exercises are generated for a specific book instance and
how the exercises are scored),
documentation for using the front-end (client-side) portion of the
logging and scoring infrastructure,
and documentation for the back-end (server-side) API and data storage
system.

AVs and exercises are typically built using the JavaScript Algorithm
Visuailzation library (JSAV).
Complete documentation for JSAV can be found at
http://jsav.io.

If you are new to OpenDSA, it will help you to keep in mind as you
look through this manual that it targets many different use cases.
Fortunately, you do not need to absorb everything, because
you are probably concerned with only one of several possible roles
at any given time.
Those roles include:

#. Content developer: Someone who wants to create or modify modules,
   visualizations, or exercises.
   Content developers will want to read the sections on creating content.

#. Instructor: Someone with a class to manage. If so, you want to read
   about the instructor tools. If you just want to set up a standard
   course configuration at Canvas, then you only need to read the
   instructions at https://opendsa.org.
   If you want to modify existing content, ddd new content, or create
   your own book instance by picking and choosing from the OpenDSA
   collection of materials, then look at compiling a book instance and
   the configuration system.
   [Note that you probably can do most of this with the online
   configuration system at https://opendsa.org.]

#. System administrator: Someone who wants to set up their own copy of
   OpenDSA. OpenDSA separates the front end content delivery server
   from the back end data collection server. You might want to set up
   either or both, in which case you should look at the installation
   guides.

#. OpenDSA Infrastructure developer: If you want to help to extend the
   OpenDSA infrastructure, then you will need to understand the
   details of the part of the system that you are targetting.
