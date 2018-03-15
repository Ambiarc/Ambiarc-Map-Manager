var mouseDown = false;

$('document').ready(function(){

    $('.ctrl-zoom-in').on('mousedown', zoomInHandler);
    $('.ctrl-zoom-in, .ctrol-zoom-out').on('mouseup', function(){
        mouseDown = false;
    });

    $('.ctrl-zoom-out').on('mousedown', zoomOutHandler);


});

var zoomInHandler = function(e){

    mouseDown = true;
    ambiarc.zoomCamera(0.2, 0.5);

    //constant zooming on click and hold
    // console.log("calling first animation frame");
    // window.requestAnimationFrame(function(){
    // zooming(0.01)
    // });
};

var zoomOutHandler = function(e){

    mouseDown = true;
    ambiarc.zoomCamera(-0.2, 0.5);

    //constant zooming on click and hold
    // console.log("calling first animation frame");
    // window.requestAnimationFrame(function(){
    // zooming(-0.01)
    // });
};

var zooming = function(zoomValue){
    if(mouseDown == true){
        ambiarc.zoomCamera(zoomValue, 0.5);
        window.requestAnimationFrame(zooming);
    }
}