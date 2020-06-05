addEvent(document.getElementById("run_btn"), "click", function(e){
    disasters.Run();
});
addEvent(document.getElementById("run_25_btn"), "click", function(e){
    disasters.Run(25);
});
addEvent(document.getElementById("run_100_btn"), "click", function(e){
    disasters.Run(100);
});