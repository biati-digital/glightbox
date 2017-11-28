(function() {
    function addEvent(eventName, {
        onElement,
        withCallback,
        once = false,
        useCapture = false
    } = {}, thisArg) {
        var tstst = onElement;
        var element = onElement || []

        function handler(event) {
            withCallback.call(thisArg, event, this)
            if (once) {
                handler.destroy();
            }
        }
        handler.destroy = function() {
            element.removeEventListener(eventName, handler, useCapture)
        }
        element.addEventListener(eventName, handler, useCapture)
        return handler
    }


    function scrollPosition() {
        return window.pageYOffset || document.documentElement.scrollTop
    }

    function addClass(node, name) {
        if (hasClass(node, name)) {
            return;
        }
        if (node.classList) {
            node.classList.add(name)
        } else {
            node.className += " " + name
        }
    }

    function removeClass(node, name) {
        var c = name.split(' ')
        if (node.classList) {
            node.classList.remove(name)
        } else {
            node.className = node.className.replace(name, "")
        }
    }

    function hasClass(node, name) {
        return (node.classList ? node.classList.contains(name) : new RegExp("(^| )" + name + "( |$)", "gi").test(node.className));
    }

    var nav = document.getElementById('fixed');
    var fixedheader = addEvent('scroll', {
        onElement: window,
        withCallback: function(event, target){
            var scroll = window.pageYOffset || document.documentElement.scrollTop;

            if (scroll > 100 ) {
                addClass(nav, 'below');
            }
            if (scroll < 100) {
                removeClass(nav, 'below');
            }
        }
    })

    if (window.IntersectionObserver) {
        var sections = document.querySelectorAll('.box-container');
        var intersectionObserver = new IntersectionObserver(
            function(entries) {
                if (!entries.length) {
                    return;
                }
                var element = entries[0].target;
                if (entries[0].isIntersecting) {
                    var boxes = element.querySelectorAll('.box');
                    for (let i = 0; i < boxes.length; i++) {
                        var box = boxes[i];
                        showBox(box, i * 100);
                    }
                }
            }, {
                threshold: [0.1, 1],
                // rootMargin: ['100px', '0px', '0px', '0px']
            }
        );

        for (let i = 0; i < sections.length; i++) {
          const element = sections[i];
          addClass(element, 'inviewport');
          intersectionObserver.observe(element);
        }
    }


    function showBox(elm, delay) {
        setTimeout(() => {
            addClass(elm, 'visible');
        }, delay);
    }



    var codeExamples = function(){
        var codes = document.querySelectorAll('.code');
        for (let i = 0; i < codes.length; i++) {
            var code = codes[i];
            var editor = CodeMirror.fromTextArea(code, {
                lineNumbers: false,
                viewportMargin: Infinity
            });
        }
    }
    codeExamples();



}());