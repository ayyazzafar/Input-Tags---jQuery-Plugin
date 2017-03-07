// az_inputTags Plugin start       

    $.fn.az_inputTags   = function( options ){
      
    var self = this;
    var selector = self.selector;
    
  // setup releated form reset event
  this.setup_form_reset_event = function(input){
        var form = input.closest('form');
        if(form.length)
        {
            // now check if this plugin registered its reset event with this form
            if(!form.data('az_input_tags_reset_event_registered'))
            {
                // saving old value
             
                
                 form.find('.az_inputTags_container').each(function(){
                     
                     var old_input = $(this).find('input[type="hidden"]');
                     old_input[0].oldValue = old_input.val();
                     
                 });
                
                // storing indication that event is registered
                form.data('az_input_tags_reset_event_registered', true);
                $(form).on('reset',  function(){
                    
                    
                     form.find('.az_inputTags_container').each(function(){
                         //alert('test');
                         console.log('####');
                         var wrapper = this;
                         var selector = $(wrapper).attr('data-selector');
                         console.log( $(wrapper).find('input[type="hidden"]'));
                        
                             var old_data = JSON.parse($(wrapper).find('input[type="hidden"]')[0].oldValue);
                             //alert(JSON.stringify(old_data));
                             var obj = $(selector).az_inputTags();
                             obj.deleteAllTags();
                             setTimeout(function(){
                                 
                                 obj.insertTags(old_data);
                             }, 1);
                             
                         
                        
                    });
                });
            }
        }
    }
  /*
     * ## ADJUST PADDING AND HEIGHTS
     */
    this.adjustPadding = function(visible_input){
            if(self.settings.external_tags)
            {
                return false;
            }   
            var wrapper         = $(visible_input).closest('.az_inputTags_container');
            // checking if any of its parent is hidden or not 
            // if yes then we have to get measurements through its clone as hidden content does not give accurate details on fly
            
            
            var hidden_parent_clone = wrapper.parents()
            .filter(function() { 
                return $(this).css('display') == 'none'; 
            }).first().clone();
            $('body').append(hidden_parent_clone);
            
            if(hidden_parent_clone.length>0)
            {
                // making clone to get actual height and width as it can be inside the elements with display none
                var wrapper_clone = hidden_parent_clone.find('.az_inputTags_container');
                hidden_parent_clone.addClass('hiddenVisiblity');
                hidden_parent_clone.css('display', 'block');
            }
            else
            {
                
                wrapper_clone = wrapper;
            }
            
            
            
            
           
            var clone_tags_container  = wrapper_clone.find('.az_inputTags_tags_container');
            var tags = clone_tags_container.find('.tag');
            var wrapper_height = clone_tags_container.height();
        
            var tags_container =  wrapper.find('.az_inputTags_tags_container');
            var clone_tags_container =  wrapper_clone.find('.az_inputTags_tags_container');
             var standard_padding_top = clone_tags_container.position().top;
            
             
             
            //alert(visible_input.css('width')+' '+visible_input.css('padding-left'));
            if(tags.length>0)
            {
               
                
             
                var last_tag = tags[tags.length-1];
                var first_tag = tags[0];
                var frist_tag_position = $(first_tag).position();
                
                var clone_last_tag = tags[tags.length-1];
                var last_tag_height = $(last_tag).outerHeight();
                var last_tag_position = $(last_tag).position();
                var last_tag_width = $(last_tag).outerWidth();
                // if input padding left reached to the end of input then bring cursor back
               // alert(wrapper_clone.find('input[type="text"]').width()+'-'+parseInt(visible_input.css('padding-left'))+'='+(parseInt(wrapper_clone.find('input[type="text"]').width())-parseInt(visible_input.css('padding-left'))));
                //visible_input.css('height', wrapper_height+'px');
                var space_occupied_by_last_tag = last_tag_position.left+last_tag_width;
                    //var available_space_after_last_tag = wrapper_clone.find('input[type="text"]').outerWidth()-70;
                     var available_space_after_last_tag = wrapper_clone.find('input[type="text"]').outerWidth()-space_occupied_by_last_tag;
                    
                 //if(space_occupied_by_last_tag<available_space_after_last_tag)
                 var min_required_space_for_one_tag = 60;
                 if(available_space_after_last_tag>=min_required_space_for_one_tag)
                {
                       visible_input.css('padding-left', last_tag_position.left+last_tag_width+(self.settings.tags_spacing*2)+'px');
                       
                       visible_input.css('padding-top',(self.settings.input_padding_top+last_tag_position.top)+'px');
                  
                    visible_input.css('height', ((self.settings.input_padding_top*2)+wrapper_height - parseInt($(clone_last_tag).css('margin-bottom')))+'px');
                    
                   //visible_input.css('padding-top',(standard_padding_top+tags_container.outerHeight())+'px');
                }
                else
                {
                    
                      visible_input.css('padding-left', (self.settings.tags_spacing)+'px');
                        visible_input.css('padding-top',(self.settings.input_padding_top+clone_tags_container.outerHeight())+'px');
                       // alert( last_tag_position.top);
                        visible_input.css('height', ((self.settings.input_padding_top *2)+clone_tags_container.height()+last_tag_height)+'px');
                }
                
                
            }
            else
            {
              //  alert('test'); 
               // reset measurments
                visible_input.css('padding-left', parseInt(clone_tags_container.css('left'))+'px');
                visible_input.css('padding-top', parseInt(clone_tags_container.css('top'))+'px');
                visible_input.css('height','auto');
 
            }
            // adjusting height
            var input_height = visible_input.outerHeight();
               // wrapper.css('height', input_height+7+'px');
        // removing clone
        hidden_parent_clone.remove();
    };
    
    
     /*
     * ## Insert Tag 
     */
    /*
     * 
     * @param {type} object
     * @returns {Boolean}
     */
    this.insertTag = function(object){
        var wrapper         = $(this).closest('.az_inputTags_container');
        var data_input = wrapper.find(self.selector);
        if(self.settings.max_tags>0 && (JSON.parse(data_input.val()).length >= self.settings.max_tags))
       {
           return false;
       }
        console.log('#### inserting suggestion');
        console.log(object);
            object.id = parseInt(object.id);
            
            if((typeof object!='object') || (!object)){
                return false;
            };
            
            
            
            
            var visible_input = wrapper.find('.az_inputTags_input');
            var current_tags = data_input.val();
            
            try
            {
                var titles = JSON.parse(current_tags);
            
            }
            catch(e)
            {
                var titles = [];
            }
            
            // check if this tag is inserted already or not if yes then cancel insertion
            var tag_exists = false;
            
            var matching_objects = titles.filter(function(value){
                if(((value.id==object.id && value.id!=0) || (object.id==0 && object.title == value.title) ) && self.loaded==true)
                {
                   // alert('skipping tag');
                    console.log(value);
                    console.log(object);
                    return true;
                }
                else
                {
                    
                    return false;
                }
                
            });
            if(matching_objects.length>0 || (self.settings.onlySuggestedTags==true && object.id==0))
            {
                visible_input.val('');
                visible_input.focus();
                return false;
            }
           
            var title = object.title;
            var input   = $(this);
            
            var selector = wrapper.attr('data-selector');
            
            
            
            $(visible_input).focus();
            var tags_container  = wrapper.children('.az_inputTags_tags_container');
            var tag             =   $('<div class="tag input-tag" data-id="'+object.id+'" data-title="'+object.title+'"><span class="text">'+title+'</span><div class="no-display-transition cross fa fa-close"></div></div>');
            $('body').append(tag);
            // inserting title in original hidden input
            
            
            
            titles.push(object);
            titles = JSON.stringify(titles);
            // don't insert in data input if plugin is still loading
            if(self.loaded==true)
            {
                data_input.val(titles).trigger('change');
            }
            tags_container.append(tag);
            var tags = tags_container.children('.tag');
            
            var last_tag = tags[tags.length-1];
            var last_tag_position = $(last_tag).position();
            var last_tag_width = $(last_tag).outerWidth();
            var last_tag_height = $(last_tag).outerHeight();
           

            var wrapper_height = tags_container.height();
          //visible_input.css('padding-left', last_tag_position.left+last_tag_width);
           // 
          
           if(last_tag_height+parseInt($(last_tag).css('margin-bottom'))<wrapper_height)
           {
               //visible_input.css('padding-top',(last_tag_position.top+last_tag_height-20)+'px');
           }
           
           //visible_input.css('height', wrapper_height+7+'px');
           
           visible_input.val('');
          
          
           tag.children('.cross').on('click', function(){
              var index = $(this).closest('.tag').index();
              self.delete_tag(index, visible_input);
              
           });
           
           
           
            
           
            self.adjustPadding(visible_input); 
            
     
    }
    
    /*
     * 
     * @param {array} array_of_objects
     * @returns {$.fn.az_inputTags}
     */
    this.insertTags = function(array_of_objects)
    {
        $.each(array_of_objects, function(index, object){
            self.insertTag(object);
        });
       
        return this;
    }
    
    
    /*
     * 
     * @param {integer} tag_index
     * @param {object} visible_input
     * @returns {undefined}
     */
    /*
     * ## DELETE TAG
     */
    this.delete_tag = function(tag_index, visible_input){
        
        var wrapper         = $(visible_input).closest('.az_inputTags_container');  
        wrapper.find('.tag:eq('+tag_index+')').remove(); 
            
              self.adjustPadding(visible_input);
              
            var data_input = wrapper.find('input[type="hidden"]');
             
            var current_tags = data_input.val();
            try
            {
                var titles = JSON.parse(current_tags);
            
            }
            catch(e)
            {
                var titles = [];
            }
            
            // updating data input field ( hidden field )
            var new_data = titles.filter(function(element, index){
                return index != tag_index;
            });
            data_input.val(JSON.stringify(new_data));
            
              visible_input.focus();
              data_input.trigger('change'); 
    }
    
    this.deleteAllTags = function(){
        
       $.each($(this), function(){
          
          var wrapper = $(this).closest('.az_inputTags_container'); 
          var data_input = wrapper.find("input[type='hidden']");
          var visible_input = wrapper.find(".az_inputTags_input");
          
          var tags = wrapper.find('.tag');
          console.log(tags);
          $.each(tags, function(index, tag){
              var index = $(tag).index();
              setTimeout(function(){
                  self.delete_tag(0, visible_input);
              }, 1);
             
          });
           data_input.val('[]');
       });
      
      
    }
    
    
    
    
     // MAKING options optional
    
    self.loaded = false;
    if(typeof options!=='object')
    {
        options = {};
    }
    var selector_class = selector.split('.')[1];
    var default_options = {
        wrap:'<div class="az_inputTags_container" data-selector="'+selector+'"></div>',
        wrapper_classes: '',
        tags_spacing:5, // px
        max_tags:0,     // unlimited
        onlySuggestedTags:false,
        addBtn:false,
        input_padding_top:0,
        external_tags:true,
        suggestions:{
            enabled:false, 
            post_url: '',
            post_data:'',
            onSuggestionsLoad:function(){},
            beforeSuggestionSearch:function(){},
        }
        
        
    };
    self.settings = $.extend(true,default_options, options);
    
    console.log(self.settings );
    this.each(function(){
        
        var input = $(this);
        if(input.closest('.az_inputTags_container').length<1)
        {
            setTimeout(function(){
                self.setup_form_reset_event(input);
            }, 400);
            
            
            
            var wrapper = $(input).wrap(self.settings.wrap).parent();
            input.attr('type', 'hidden');
            var input_classes = input.attr('class');
            var input_placeholder = input.attr('placeholder');
            if(self.settings.addBtn)
            {
                self.settings.wrapper_classes+=" has_add_btn";
            }
            
            if(self.settings.external_tags)
            {
                self.settings.wrapper_classes+=" has_external_tags";
            }
            
            
            wrapper.addClass('az_inputTags_container '+self.settings.wrapper_classes);
            wrapper.append('<div style="clear:both"></div>');
            // creating new input to stay visible
            
            var visible_input = $('<input type="text" class="az_inputTags_input"  />');
            
            visible_input.addClass(input_classes);
            visible_input.attr('placeholder', input_placeholder);
            // removing main selector class which reserverd only for original input
            visible_input.removeClass(selector_class);
            
            
            wrapper.append(visible_input);
            if(self.settings.addBtn)
            {
                var addBtn = $('<button type="button" style="height:'+visible_input.outerHeight()+'px" class="add">Add</button>');
                visible_input.after(addBtn);
            }
            // registering focus event on input so it can adjust paddings in case elements are hidden
          
            // getting position details for tags container
            var tags_container_top = visible_input.css('padding-top');
            self.settings.input_padding_top = parseInt(tags_container_top);
            
            var tags_container_left = '5px';
            var tags_container_width = 'width: 100%; ';
            if(!self.settings.external_tags)
            {
                tags_container_width  = 'width:'+visible_input.outerWidth()+'px';
            }
            
            var tags_container  = $("<div class='az_inputTags_tags_container' style='top:"+tags_container_top+"; left:"+tags_container_left+"; "+tags_container_width+"'></div>");

            wrapper.append(tags_container);
            
            tags_container.on('click', function(){
               visible_input.focus(); 
            });
            $(window).on('click', function(e){
                if(!wrapper.find('.az_input_suggestion_box').is(e.target)
                        && wrapper.find('.az_input_suggestion_box').has(e.target).length===0
                    &&   (e.target != $('html').get(0)))
                {
                    // check if suggestion box is enabled then hide it
                    if(self.settings.suggestions.enabled)
                    {
                        // hide suggestion box
                        wrapper.find('.az_input_suggestion_box').slideUp();
                    }
                }
            });
            visible_input.blur(function(){
                
            });
            
            visible_input.keydown(function(e){
              if(e.which == 13) { // enter
                    e.preventDefault();
                    e.stopPropagation();
                   
                    
                    
                    return false;
                }
                // end enter key check
               if(e.which == 8 && (e.target.value.length<1)) // backspace
                {
                    var total_tags = wrapper.find('.tag').length;
                    if(total_tags>0)
                    {
                        var last_tag_index = total_tags-1;
                        self.delete_tag(last_tag_index, visible_input);
                    }
                    
                } 
                
            });
            // End key down event
            visible_input.keyup(function(e) {
                 
                var title = $(this).val();
                if(e.which == 13) { // enter
                    e.preventDefault();
                    e.stopPropagation();
                   
                   // check if user selected suggestion with keyboard then select suggestion instead of other action
                   if(wrapper.find('.az_input_suggestion_box .az_input_suggestion.active').length)
                   {
                       wrapper.find('.az_input_suggestion_box .az_input_suggestion.active').trigger('click');
                       
                       return false;
                   }
                  
                   else
                   {
                       // check if searched text exists in the the suggestions
                       var matched_suggestion = false;
                       var suggestions = $('.az_input_suggestion_box .az_input_suggestion').each(function(){
                           var suggestion = $(this);
                           console.log('HTMLLLLLL', suggestion.html().toLowerCase(), 'length', suggestion.html().toLowerCase().length);
                           console.log('Titleeeeee', title.toLowerCase(), 'length', title.toLowerCase().length);
                           if(suggestion.html().toLowerCase().trim()==title.toLowerCase().trim())
                           {
                               matched_suggestion = {id:suggestion.attr('data-id'), title:suggestion.html()};
                               self.insertTag(matched_suggestion);
                               return false;
                           }
                       });
                       
                   }
                   
                    if(title.length>0 /*&& (title.indexOf(' ') < 0)*/)
                    {
//                        var az_inputTags_obj = $(this).az_inputTags();
//                        az_inputTags_obj.insertTag({id:0, title:title});
                        
                        //var az_inputTags_obj = $(this).az_inputTags();
                        
                        self.insertTag({id:0, title:title});
                    }
                   
                    return false;
                }
                else if(e.which==38 || e.which==40)
                {
                    var total_suggestions = wrapper.find('.az_input_suggestion_box .az_input_suggestion').length;
                    if(total_suggestions)
                    {
                        var current_active_index = -1;
                    
                        var next_index;;
                        if(wrapper.find('.az_input_suggestion_box .az_input_suggestion.active').length)
                        {
                            current_active_index = wrapper.find('.az_input_suggestion_box .az_input_suggestion').index(wrapper.find('.az_input_suggestion_box .az_input_suggestion.active'));
                        }
                         
                        



                        if(e.which==38) // up
                        {
                            if(current_active_index==0)
                            {
                                next_index = total_suggestions-1;
                            }
                            else
                            {
                                next_index = current_active_index-1
                            };
                        }
                        else
                        {
                            // down
                            if(current_active_index+1==total_suggestions)
                            {
                                next_index = 0;
                            }
                            else
                            {
                                next_index = current_active_index+1
                            };
                        }
                        wrapper.find('.az_input_suggestion_box .az_input_suggestion').removeClass('active');
                        current_active_index = wrapper.find('.az_input_suggestion_box .az_input_suggestion:eq('+next_index+')').addClass('active');
                        
                        console.log('next index >>>> ', next_index);
                    }
                    else
                    {
                        
                    }
                    
                }
                else if(e.key===',' && $(this).val().length>1)
                {
                    e.preventDefault();
                    e.stopPropagation();
                    //var az_inputTags_obj = $(this).az_inputTags();
                    //az_inputTags_obj.insertTag({id:0, title:title});
                    title = title.replace(',', '');
                    
                    self.insertTag({id:0, title:title});
                    return false;
                }
                else if((e.which!=38 && e.which!=40))
                {
                    console.log('key code is ', e.which);
                    visible_input.focus();
                    self.settings.suggestions.beforeSuggestionSearch.call(self);
                    // show suggestion box only if user enabled
                    if(self.settings.suggestions.enabled)
                    {
                        // showing suggestion box
                            var data = self.settings.suggestions.post_data;
//                            console.log('hi');
//                            alert(JSON.stringify(data));
                            
                            $.extend(data, {string:title});
                            
                            
                            // exclude already selected tags
                            var selected_tags_data = JSON.parse(input.val());
                            $(visible_input).az_input_suggestion_box(
                            {
                                
                                suggestions: {
                                    url:self.settings.suggestions.post_url, data:data,
                                    excluded_suggestions:selected_tags_data
                                }, 
                                success:function(serverResponse){

                                  self.settings.suggestions.onSuggestionsLoad.call(self, serverResponse);
                                    visible_input.focus();

                                }, 
                              
                                onclick:function(suggestion){
                                   
                                   
                                   self.insertTag(suggestion);
                                   this.hide_suggestion_box(); // just provide the selector of which suggestions should be hidden
                                }
                            });
                            
                            // after loading suggestions box move add button inside suggestions box
                            setTimeout(function(){
                                var btn = wrapper.find('button.add').remove();
    //                            console.log('##btn', btn);
    //                            console.log('az_input_tags',  wrapper.find('.az_inputTags_input'));
                                wrapper.find('.az_inputTags_input').after(btn);
                                btn.after('<div style="clear:both"></div>');
                            }, 100);
                            
                    }
                    
                }
                return false;
            });
        }
        
        
        
 
           // setting default title of original hidden input and loading predefined tags
       if(wrapper)
       {
           //alert('test');
           console.log('wrapper', wrapper);
           $("<div style='clear:both'></div>").insertAfter(wrapper.find('button.add'));
           
           if(wrapper.find(selector).val().length<1 )
            {
                
                wrapper.find(selector).val('[]');
            }
            else
            {
                console.log(self);
                    var arr_titles = JSON.parse(wrapper.find(selector).val());
                  
                    
                    $.each(arr_titles, function(key, object){
                        self.insertTag(object); // {id:2, title:'some title'}
                    });
                    
                
            }
       }
            
       
        

 
    });
    
    
    self.loaded = true;
    
    
   
    return this;
};
    


//    $(window).resize(function(){
//       
//        $('.az_inputTags_container').each(function(){
//            var selector = $(this).attr('data-selector');
//            var hidden_input    =  $(this).find(selector);
//            var visible_input   =  $(this).find('.az_inputTags_input');
//             console.log(visible_input.outerHeight());
//            $(hidden_input).az_inputTags().adjustPadding(visible_input);
//           
//        });
//    });
 $('body').on('click', '.az_inputTags_container button.add', function(){
     var wrapper = $(this).closest('.az_inputTags_container');
            var hidden_input    =  $(wrapper).find('input[type="hidden"]');
              $(hidden_input).az_inputTags();
              var e = $.Event("keyup");
e.which = 13; // # Some key code value
console.log('##################', $(this).closest('.az_inputTags_container').find('input[type="text"]'));
               $(this).closest('.az_inputTags_container').find('input[type="text"]').trigger(e);
           });