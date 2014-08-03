(function ($) {
    
    $.fn.projectList = function (input) {
        var settings, opts = {}, container, me = $.fn.projectList, id = 0, getPromise, project;

        if (typeof input === 'string') {
            opts.username = input;
        } else { opts = input; }
        
        settings = $.extend({}, $.fn.projectList.options, opts);
        
        me.settings = settings;
        me.projects = {};
        //window.console.log(settings);
        if (settings.isContainer) {
            container = this;
        } else {
            container = $(settings.containerID);
        }
            
        
        
        getPromise = me.getProjects(me, settings.username);
        getPromise.done(function (projects) {
            var project, widget;
            for (project in projects) {
                me.projects[project] = project;
                
                if ($.inArray(projects[project].name, settings.hide) === -1) {
                    
                    widget = me.widget(settings, projects[project], id);
                    $(container).append(widget);
                }
                id += 1;
            }
        });
        
        return this;
    };
    
    
    $.fn.projectList.widget = function (settings, project, id) {
        var widget = "<div class='project-well' id='project-" + project.name + "' style='margin-right:" + settings.marginRight + "; margin-bottom:" + settings.marginBottom + "; '> <div class='project-header'> <a target='" + settings.linksOpenIn + "' href='" + project.url + "'> ";
        
        if (project.img !== null) {
            widget += "<span class='project-icon'><img src='" + project.img + "' alt='" + project.name + "'></span>";
        }
        widget += "<h4 class='project-name'>" + project.name + " </h4> </a> <span class='project-lang'> " + (project.lang === null ? '' : project.lang) + "</span></div><div class='project-body'> <div class='project-description'> <small> " + project.desc + "</small></div> <div class='project-links'>";
        if (settings.images.demo !== '' && project.demoURL !== '' && project.demoURL !== undefined) {
            widget += "<a target='" + settings.linksOpenIn + "' href='" + project.demoURL + "'><img class='project-link-img' src='" + settings.images.demo + "' alt='clone' title='Demo' ></a>";
        }
        if (settings.images.wiki !== '' && project.wikiURL !== '' && project.wikiURL !== undefined) {
            widget += "<a target='" + settings.linksOpenIn + "' href='" + project.wikiURL + "'><img class='project-link-img'src='" + settings.images.wiki + "' alt='clone' title='Wiki' ></a>";
        }
        if (settings.images.download !== '' && project.dlURL !== '' && project.dlURL !== undefined) {
            widget += "<a target='" + settings.linksOpenIn + "' href='" + project.dlURL + "'><img class='project-link-img' src='" + settings.images.download + "' alt='clone' title='Downloads' ></a>";
        }
        if (settings.images.fork !== '' && project.forkURL !== '' && project.forkURL !== undefined) {
            widget += "<a target='" + settings.linksOpenIn + "' href='" + project.forkURL + "'><img class='project-link-img' src='" + settings.images.fork + "' alt='clone' title='Fork' ></a>";
        }
        if (settings.images.clone !== '' && project.cloneURL !== '' && project.cloneURL !== undefined) {
            widget += "<a class='project-git-clone-link' target='" + settings.linksOpenIn + "' href='" + project.cloneURL + "'><img class='project-link-img' src='" + settings.images.clone + "' alt='clone' title='Clone' ></a>";
        }
        
        widget += "</div> </div> </div>";
        
        return $.parseHTML(widget);
    };
    
    
    $.fn.projectList.getProjects = function (me, username) {
        var usernames, deferred = $.Deferred(),
            projectTemplate = {
                img : me.settings.githubDefaultIcon
            },
            AjaxQuerys = [], projects = {};
         
        if (typeof username === 'string') {
            usernames = {
                github : username,
                bitbucket : username
            };
        } else { usernames = username; }
        
        
        function ajaxGet(getUrl) {
            var deferr = $.Deferred();
            $.ajax({
                url : getUrl,
                dataType : "jsonp",
                crossDomain : true,
                async : false
            }).done(function (data) {
                //window.console.log(data);
                deferr.resolve(data);
            }).fail(function (ex) {
                deferr.reject(ex);
            });
            return deferr.promise();
        }
        
        if (usernames.github !== '') {
            (function () {
                var getURL = "https://api.github.com/users/" + usernames.github + "/repos", getPromise, retPromise;
                getPromise = ajaxGet(getURL);
                retPromise = getPromise.done(function (data) {
                //window.console.log(data);
                    var repos = data.data;
                    $.each(repos, function (index, repoData) {
                        var repo = {
                            origin : "github",
                            name : repoData.name,
                            url : repoData.html_url,
                            cloneURL : repoData.clone_url,
                            desc : repoData.description,
                            wikiURL : repoData.html_url + '/wiki',
                            isFork : repoData.fork,
                            lang : repoData.language,
                            img : (function () {
                                if (repoData.fork) {
                                    return me.settings.images.fork;
                                } else {
                                    return me.settings.images.githubDefaultIcon;
                                }
                            }()),
                            demoURL : '',
                            forkURL : repoData.html_url + "/fork",
                            dlURL : '',
                            parent : (function () {
                                var ret;
                                if (repoData.fork) {
                                    $.ajax({
                                        url : repoData.url,
                                        async : false,
                                        success : function (data) {
                                            //console.log(data);
                                            return data.parent.full_name;
                                        }
                                    });
                                } else { return ''; }
                                
                            }())
                                
                        };
                        projects[repo.name] = repo;
                    });
                });
                AjaxQuerys.push(retPromise);
                
            }());
                              
        }
        
        if (usernames.bitbucket !== '') {
            (function () {
                var getURL = "https://bitbucket.org/api/2.0/repositories/" + usernames.bitbucket, getPromise, retPromise;
                getPromise = ajaxGet(getURL);
                retPromise = getPromise.done(function (data) {
                    var repos = data.values;
                        //console.log(repos);
                    $.each(repos, function (index, repoData) {
                        var repo = {
                            origin : "bitbucket",
                            name : repoData.name,
                            url : repoData.links.html.href,
                            cloneURL : repoData.links.html.href + ".git",
                            desc : repoData.description,
                            wikiURL : (function () {
                                if (repoData.has_wiki === true) {
                                    return repoData.links.html.href + '/wiki';
                                } else {return ''; }
                            }()),
                            isFork : false,
                            lang : repoData.language,
                            img : repoData.links.avatar.href,
                            forkURL : (function () {
                                if (repoData.fork_policy !== "no_public_forks") {
                                    return repoData.links.html.href + '/fork';
                                } else {return ''; }
                            }())
                        };
                        projects[repo.name] = repo;
                    });
                  
                });
                AjaxQuerys.push(retPromise);
                
            }());
        }

        //console.log(AjaxQuerys);
        $.when.apply(null, AjaxQuerys).done(function () {
            deferred.resolve(projects);
        });
        
        return deferred.promise();
    };
    
    $.fn.projectList.options = {
        isContainer : true,
        templateID : '',
        containerID : '',
        marginRight : '20px',
        marginBottom : '20px',
        username : {
            github : '',
            bitbucket : '',
            customURL : ''
        },
        displayUsernames : false,
        hide : [],
        images : {
            githubDefaultIcon : "img/repo.png",
            demo : "img/desktop.png",
            clone : "img/clone.png",
            wiki : "img/wiki.png",
            fork : "img/fork.png",
            download : "img/download.png"
        },
        linksOpenIn : '_blank',
        showStars : true,
        showZeroStars : false //who wants to show that off? :P
    };
}(jQuery));