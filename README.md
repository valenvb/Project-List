Project-List
============

A jQuery plugin for nicely displaying all your projects. Currently pulls data from GitHub and Bitbucket.
***

##Usage
For simplest use, do

```
$('<containing element>').projectList('<username>')
```

and it will come out like this:

![demo](https://dl.dropboxusercontent.com/u/3881786/Screen%20Shot%202014-08-02%20at%207.33.04%20PM.png)

These wells (yes, mostly copied from bootstrap) will be appended to \<containing element\>.

If you only use one or the other (github or bitbucket) don't worry, it will handle that just fine. However, if you have a different account name for each service, 

```
.projectList({username : {github:'github-user', bitbucket:'bitbucket-user'}})
```

will serve you well.

Here is the full list of options, as currently implemeted (yes, there are more in the  code):

```
$.fn.projectList.options = {
        isContainer : true, //if 'this' is the container to put the widgets in 
        containerID : '', //if isContainter isn't true, then put them here
        marginRight : '20px', //margins around the widgets
        marginBottom : '20px',
        username : {
            github : '',
            bitbucket : ''
        },
        hide : [], //add any repos here you don't wand displayed (must match name exactly) 
        images : { //where the script will find it's images
            githubDefaultIcon : "img/repo.png", //the default icon for repos from github
            clone : "img/clone.png", //image for clone link
            wiki : "img/wiki.png", //image for wiki link
            fork : "img/fork.png", //image for fork link
            download : "img/download.png" //image for downloads/releases link
        },
        linksOpenIn : '_blank', //target attribute for all links
    };

```

These can be set either by passing an object to the invocation of `.projectList()` or by calling:
 
````
$.fn.projectList.options.<option> = <value>; //or other JavaScript equivalents.
````
before the first `.projectList()`.
***
####TODO:
- display the parent if a forked repo (with option OFC)
- show stars from GitHub (w/ option)
- make custom API URL's work
- allow injection of custom properties before the render
- re-render function
- documentation
