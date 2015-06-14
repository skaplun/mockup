document.addEventListener('DOMContentLoaded', function(){



var MixinFac = (function() {
    var htmlSnippets = {
        dragHandler : crel('div', {'class': 'rd_m_draghandler'}),
        delbutton : crel('div', {'class': 'rd_m_del'}, 'X')
    }
    
    function interactable(elem){
        
        function setResizeConstants(){
            console.log(arguments)
            console.log(this)
            //  this.initFontSize = parseFloat(this.alsoResize.css('fontSize'), 10);
            //  this.initWidth = this.html[0].clientWidth;
        }
        function resizeText(e, uiObj){
            return this.alsoResize.css('fontSize', this.initFontSize * (uiObj.size.width / this.initWidth))
        }
        
        elem.html.appendChild(htmlSnippets.dragHandler.cloneNode(true));
        elem.html.appendChild(htmlSnippets.delbutton.cloneNode(true));
        console.log(elem.html.innerHTML)
        elem.$html
            .resizable({
                create : setResizeConstants,
                resize : resizeText,
                alsoResize: '.rd_m_draghandler',
            })
            .draggable({
                handle: '.rd_m_draghandler',
                 containment: 'parent'
                 
            })

        return elem
        console.log(elem)    
    }
    
    
    function button (elem) { 
        function print(e){
            console.log('p')
        }
            
        function print2(){
            console.log('p2')
        }

        var events = {
            'click' : [print, print2]
        }
        
        addEventObj(events, elem);
        
        return elem;
        
    }
        
    var mixins = {
        'button' : [button, interactable]
    
    }
    
    function addEventObj(mixin, elem){
        Object.keys(mixin).forEach(function(event){
            mixin[event].forEach(function(cb){
                elem.on(event, cb);
            })
        }) 
    }
    
    function set(elem){

        if(!mixins[elem.type]) return;
        
        mixins[elem.type].forEach(function(mixin){
            mixin(elem)
        })
        
        console.log(elem)
        return elem;
        
    }
    
    return {
        set : set
    }

})();


var Mockup = (function(){
    
    function elem(html, type){
        this.html = html;
        this.$html = $(html);
        this.type = type;
    }

    elem.prototype = {

        del : function(){
            this.$html.remove();
            return this;
        },

        on : function(event, cb){
            console.log(arguments)
            this.$html.on(event, cb)
            return this;
        },

        off : function(event){
            this.$html.off(event);
            return this;
        }

    }
    
    var html = {
         form : crel('form', {'class': 'rd_m_form', 'data-rd_type' : 'Form'}, 
                      crel('label', {'for': 'first', contenteditable : 'true'}, 'first Label'),
                      crel('input', {'name': 'first', type : 'text'}),
                      crel('label', {'for': 'second', contenteditable : 'true'}, 'second Label'),
                      crel('input', {'name': 'second', type : 'text'})
                     ),
          list : crel('ul', {'class': 'rd_m_list', 'data-rd_type' : 'list'}, 
                      crel('li', {'contenteditable' : 'true'}, 'item 1'),
                      crel('li', {'contenteditable': 'true'}, 'item 2'),
                      crel('li', {'contenteditable': 'true'}, 'item 3') 
                     ),
          h1 : crel('h1', {'contenteditable': 'true', 'class' : 'rd_m_h1', 'data-rd_type' : 'h1'}, 'Title'), 
          h2 :  crel('h2', {'contenteditable': 'true', 'class' : 'rd_m_h2', 'data-rd_type' : 'h2'}, 'Subtitle'),
          paragraph : crel('p', {'contenteditable': 'true', 'class' : 'rd_m_p', 'data-rd_type' : 'p'}, 'Paragraph with lots of text'),
          link : crel('a', {'onclick': false, 'contenteditable' : "true", 'class' : 'rd_m_a' }, 'Link'),
          button : crel('div', {'class': 'rd_m_button', 'data-rd_type' : 'Button'},
                        crel('div', {'class': 'rd_m_text', 'contenteditable': 'true'}, 'Button')),
          image : crel('div', {'class': 'rd_m_image', 'data-rd_type' : 'I'},
                      crel('form', {'class': 'rd_m_save'},
                           crel('input', {'type': 'file'})
                ))
    
    }
    
   
    function findByKey(key, obj){
        var hKeys = Object.keys(obj);
        if(hKeys.indexOf(key) > -1) return obj[key];
    }

    /*
     * @elemStr {String}
     *
     */
    
    function get(elemStr) {
        var domEl = findByKey(elemStr, html);
        return MixinFac.set(new elem(domEl, elemStr))
        
    }
    
    return {
        get : get
    }

})();





   var button = Mockup.get('button')
//   console.log(button)
   document.getElementById('container').appendChild(button.html);
    
})