function addEvent(el, evnt, funct){
	if(el === null || el === undefined){return;}
	if (el.attachEvent){
    return el.attachEvent('on'+evnt, funct);
  }
  return el.addEventListener(evnt, funct, false);
}