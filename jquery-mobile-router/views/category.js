define(['jquery', 
        'underscore', 
        'backbone',
        'text!templates/categoryViewTemplate.html',
        'text!templates/listEntriesViewTemplate.html',
        'models/Categories',
        'models/Entries',
        'models/Labels'
        ],
function($, _, Backbone,categoryViewTemplate,listEntriesViewTemplate,Categories,Entries,Labels){

  var CategoryView = Backbone.View.extend({

    el:"#category",
    listentries:"#listEntriesView",

    events : {
      "expand #listEntriesView":"entryExpanded"
    },

    initialize:function() {
        if(Categories.size()==0) {
          Categories.setLang(this.options.lang);
          Categories.fetch();
          Categories.off("reset",this.render,this);
          Categories.on("reset",this.render,this);
          Labels.setLang(this.options.lang);
          Labels.fetch();
        }
        
        Entries.setCategory(this.options.id);
        Entries.setLang(this.options.lang);
        Entries.setEntry(this.options.idEntry);
        this.render();
        Entries.fetch();
        Entries.off('reset'); //remove previous callbacks
        Entries.on( 'reset', this.renderList, this );
    },

    //render the content into div of view
    render: function(){
      //this.el is the root element of Backbone.View. By default, it is a div.
      //$el is cached jQuery object for the view's element.
      //append the compiled template into view div container
      this.$el.html(_.template(categoryViewTemplate,{
                                    entries:Entries,
                                    category:Categories.get(Entries.idCategory)
                                    }));
                                    
      //Trigger jquerymobile rendering
      var thisel=this.$el;
      this.$el.off('pagebeforeshow'); //remove previous callbacks
      this.$el.on( 'pagebeforeshow',function(event){
         console.log("pagebeforeshow");
         thisel.trigger('pagecreate');
      });
      //return to enable chained calls
      return this;
    },


    renderList: function() {
      console.log("renderList");
      $.mobile.hidePageLoadingMsg()
      console.log(Entries.idEntry);

      $(this.listentries).html(_.template(listEntriesViewTemplate,{
                                    entries:Entries,
                                    labels:Labels.attributes
                                  }));

      this.$el.trigger('pagecreate');

      return this;
    },

    entryExpanded:function(e) {
      console.log(e);
      e.preventDefault();
      e.stopPropagation();
      console.log("Entry expanded");
      var expandedElement=this.getExpandedElement();
      var expandedEntryId=expandedElement.attr("data-entryid");
      if(expandedEntryId!=undefined) {
        //Change url TODO: SEE HOW TO NOT TRIGGER ROUTER (maybe desactivate then reactived?)
        //window.location.replace("#category?lang="+Entries.lang+"&id="+Entries.idCategory+"&idEntry="+expandedEntryId);
        //Attach a collapsed handler
        expandedElement.on("collapse.expanded",function(e) {
            e.preventDefault();
            e.stopPropagation();
            $(this).off("collapse.expanded");
            window.location.replace("#category?lang="+Entries.lang+"&id="+Entries.idCategory);
        });
        
      }
    },

    getExpandedElement:function() {
      return $("#listEntriesView div.ui-collapsible").not("div.ui-collapsible-collapsed");
    }

  });
  return CategoryView;
});


