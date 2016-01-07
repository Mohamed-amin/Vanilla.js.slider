'use strict'

var Slider = function(selector) {

    var slider = this;
    var element = document.querySelector(selector);
    slider.ul = element.children[0];
    slider.li = slider.ul.children;
    var selector = selector || '.slider';

    // generic for Loop wrapper dor consistency
    function iterator(el, cb) {
        for (var i = el.length - 1; i >= 0; i--) {
            cb(i);
        };
    }
    slider.slideTo = function(index) {
        if (index < 0) {
            return;
        } else if (index > slider.li.length - 1) {
            index = 0;
        }
        slider.ul.style.left = '-' + (100 * index) + '%'
        slider.currentSlide = index;
        var nodes = document.querySelectorAll(selector + ' .indicators span');

        // remove the current indicator active
        iterator(nodes, function(i) {
            nodes[i].removeAttribute('class');
        })
        document.querySelector(selector + ' .indicators span[data-slide="' + index + '"]').setAttribute("class", "active");
    };
    slider.prev = function() {
        slider.slideTo(slider.currentSlide - 1)
    };
    slider.next = function() {
        slider.slideTo(slider.currentSlide + 1)
    };
    slider.resize = function() {
        if (event && event.type === 'resize') {
            iterator(slider.li, function(i) {
                slider.li[i].removeAttribute('style');
            });
        }
    };
    slider.init = function() {
        var listWidth = element.clientWidth;
        iterator(slider.li, function(i) {
            slider.li[i].style.width = listWidth + 'px';
        });

        slider.ul.style.width = (listWidth * slider.li.length) + 'px';
        slider.currentSlide = 0;
        document.querySelector(selector + ' .indicators span[data-slide="0"]').setAttribute("class", "active");
    };

    // reset and recalculate styles after window resize 
    window.onresize = function(event) {
        slider.resize();
        // using setTimeout tom make sure that init() run after resizing.
        setTimeout(function() {
            slider.init();
            slider.slideTo(0);
        }, 0);
    };

    // Bind Direction Controllers to next and previous 
    var nextCtrl = document.querySelector(selector + ' .next');
    var prevCtrl = document.querySelector(selector + ' .prev');
    nextCtrl.onclick = function() {
        slider.next();
    }
    prevCtrl.onclick = function() {
            slider.prev();
        }
    //generate indicators according to the slides number
    var indicatorsWrapperElm = document.querySelector(selector + ' .indicators');

    iterator(slider.li, function(i) {
        var indicatorElm = document.createElement('span');
        indicatorElm.dataset.slide = i;
        indicatorsWrapperElm.appendChild(indicatorElm);
    });

    // Bind click event on the indicators to slides
    var indicator = document.querySelectorAll(selector + ' .indicators span');
    iterator(slider.li, function(i) {
        indicator[i].onclick = function() {
            var slideNumber = parseInt(this.dataset.slide, 10);
            slider.slideTo(slideNumber);
        }
    })
}
