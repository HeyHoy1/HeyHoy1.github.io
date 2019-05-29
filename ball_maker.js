//'use strict';

console.clear();
var maxBubbles = 10; //25
var container = document.querySelector('.demo');
var containerWidth = container.clientWidth;
var containerHeight = container.clientHeight;
var content = document.querySelector('.demo__content');
var title = document.querySelector('.demo__title');
title.content = document.querySelector('.demo-title__content');
title.splash = document.querySelector('.demo-title__splash');

var shape = document.querySelector('.bubble');
var shapeWidth = shape.clientWidth;
var shapeHeight = shape.clientHeight;

var bubbles = [];

var minX = 0;
var minY = 0;

var bubble_colors = ["red", "orange", "yellow", "green", "lightblue", "blue", "purple"];

var baseShapeSize = 200;
var minShapeSize = 50;

var time = 7;
var minTime = 4;

var posibleSides = ['top', 'right', 'bottom', 'left'];

//------------------------------

function Bubble( pos ) {
    this.bubble_level = Math.ceil( Math.random() * 7);
    this.bubble = shape.cloneNode( true ); 
    this.setSize();
    this.setPos();
    this.addAnimation();
    content.appendChild( this.bubble );
    this.content = this.bubble.querySelector('.bubble__group');
    this.splash = this.bubble.querySelector('.bubble__splash');
    this.isCollapsed = false;
    
    
    var that = this;
    
    
    this.bubble.onclick = function () {
        if ( !that.isCollapsed ) {
            that.isCollapsed = true;
            that.collapse();
        }
    }
}

//------------------------------

Bubble.prototype.collapse = function () {
    var that = this;
    
    function resetBubble() {
        var s = document.getElementById('score');
        //var text = document.getElementsByClassName('shape _hidden');       
        s.innerHTML = parseInt(s.innerHTML)+8-that.bubble_level;
        that.bubble_level = Math.ceil( Math.random() * 7);
        //alert(s.innerHTML);
        
       
        var tl = new TimelineLite();
        that.setSize();
        that.setPos();

        tl.to( that.content, .3, {
            'scale': 1,
            'opacity': 1,
            'delay': 2,
            'onComplete': function() { 
                that.isCollapsed = false; 
                }
        } );
    }
    
    var tl = new TimelineLite();
    tl.set( this.content, {
            'scale': 0,
            'transform-origin': '100px 100px',
            'opacity': 0
        } );
    tl.set( this.splash, {
        'scale': .5,
        'transform-origin': '100px 100px',
        'opacity': 1,
    } );
    tl.to( this.splash, .15, {
        'scale': 1.5,
        'opacity': 0,
        'ease': Power1.easeOut,
        'onComplete': resetBubble
    } );
}

//------------------------------

Bubble.prototype.setPos = function () {
    var target = this.getSide();
    this.bubble.style.transform = 'translate3d(' + target.coords.x +'px, ' + target.coords.y + 'px, 0)';
    //stop-color="blue" 
                  //class="stop-1"/>   
    //this.bubble.style.fill="#0000";
    //this.bubble.style.fill-opacity="0.5";
}

//------------------------------

Bubble.prototype.setSize = function () {
    var that = this;
    this.shapeSize = that.bubble_level * (baseShapeSize - minShapeSize)/7  + minShapeSize;
    this.bubble.style.width = this.shapeSize + 'px';   
    this.bubble.style.height = this.shapeSize + 'px';   
    
    this.bubble.style.fill=bubble_colors[that.bubble_level-1];
    this.maxX = containerWidth - this.shapeSize;
    this.maxY = containerHeight - this.shapeSize;
}

//------------------------------

Bubble.prototype.addAnimation = function () {
    
    var minX = 0;
    var newTime = Math.random() * time + minTime;
    var elem = this.bubble;
    var delay = Math.random() * time;
    var tl = new TimelineLite();
    var that = this;
    
    animate();
    
    function animate () {
        var target = that.getSide( that.side );
        that.side = target.side;
        var propSet = { x: target.coords.x,
                        y: target.coords.y,
                        ease: SlowMo.easeInOut,
                        delay: delay,
                        onComplete: animate
                    };        
        tl.to( elem, newTime, propSet);
        
        if ( delay ) {
            delay = 0;
        }
    }   
}

//------------------------------

Bubble.prototype.getSide = function () {
    var targetParams = {
        side: '',
        coords: {}
    };
    var maxRandX = Math.round( Math.random() * this.maxX );
    var maxRandY = Math.round( Math.random() * this.maxY );
    
    var sides = {'top': 
                    { x: maxRandX, 
                      y: minY },
                 'right': 
                    { x: this.maxX, 
                      y: maxRandY },
                 'bottom': 
                    { x: maxRandX, 
                      y: this.maxY },
                 'left': { 
                     x: minX, 
                     y: maxRandY }
                };
        
    delete sides[ this.side ];
    var keys = Object.keys( sides );    
    var randPos = Math.floor( Math.random() * keys.length );
    var newSide = keys[ randPos ];    
    
    targetParams.side = newSide;
    targetParams.coords = sides[ newSide ];
    
    return targetParams;
    
}

//------------------------------

function addBubble () {
    var bubble = new Bubble( i );
    bubbles.push( bubble );
}

//------------------------------

for ( var i = 0; i < maxBubbles; i ++ ) {
    addBubble();
}

//------------------------------

window.onresize = function () {
    containerWidth = container.clientWidth;
    containerHeight = container.clientHeight;
    
    bubbles.forEach( function ( item ) {
        item.maxX = containerWidth - item.shapeSize;
        item.maxY = containerHeight - item.shapeSize;
        // item.addAnimation();
    });
}

//------------------------------

title.onclick = function () {
    var that = this;
    
    function resetElem() {
        var tl = new TimelineLite();
        
        tl.to( that.content, .3, {
            'scale': 1,
            'opacity': 1,
            'onComplete': function() { 
                that.isCollapsed = false; 
                }
        } );
    }
    
    var tl = new TimelineLite();
    tl.set( this.content, {
            'scale': 0,
            'opacity': 0
        } );
    tl.set( this.splash, {
        'scale': .5,
        'opacity': 1,
    } );
    tl.to( this.splash, .15, {
        'scale': 1.5,
        'opacity': 0,
        'ease': Power1.easeOut,
        'onComplete': resetElem
    } );
}