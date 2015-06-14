document.addEventListener('DOMContentLoaded', function(){



var MixinFac = (function() {
    
    function interactable(elem){
        
        function dragMoveListener (event) {
            var target = event.target,
                // keep the dragged position in the data-x/data-y attributes
                x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
                y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

            // translate the element
            target.style.webkitTransform =
            target.style.transform =
              'translate(' + x + 'px, ' + y + 'px)';

            // update the posiion attributes
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        }
        
        elem.interactable = interact(elem.html)
            .draggable({
        // enable inertial throwing
        inertia: true,
        // keep the element within the area of it's parent
        restrict: {
          restriction: "parent",
          endOnly: true,
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        },

        // call this function on every dragmove event
        onmove: dragMoveListener,
        // call this function on every dragend event
        onend: function (event) {
          var textEl = event.target.querySelector('p');

          textEl && (textEl.textContent =
            'moved a distance of '
            + (Math.sqrt(event.dx * event.dx +
                         event.dy * event.dy)|0) + 'px');
        }
        })
            .resizable({
    edges: { left: true, right: true, bottom: true, top: true }
  })
  .on('resizemove', function (event) {
    var target = event.target,
        x = (parseFloat(target.getAttribute('data-x')) || 0),
        y = (parseFloat(target.getAttribute('data-y')) || 0);

    // update the element's style
    target.style.width  = event.rect.width + 'px';
    target.style.height = event.rect.height + 'px';

    // translate when resizing from top or left edges
    x += event.deltaRect.left;
    y += event.deltaRect.top;

    target.style.webkitTransform = target.style.transform =
        'translate(' + x + 'px,' + y + 'px)';

    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
    target.textContent = event.rect.width + '×' + event.rect.height;
  });
        
//        .resizable({
//                restrict: {
//                    restriction: 'parent',
//                }
//            })

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
        
    mixins = {
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