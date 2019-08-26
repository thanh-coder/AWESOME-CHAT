function increaseNumberNotification(className){
    let currentValue = +$(`.${className}`).text();
    currentValue += 1;
    if(currentValue === 0){
        $(`.${className}`).css("opacity","0").html("");
    } else{
        $(`.${className}`).css("opacity","1").html(currentValue);
    }
}
function decreaseNumberNotification(className){
    let currentValue = +$(`.${className}`).text();
    currentValue -= 1;
    if(currentValue === 0){
        $(`.${className}`).css("opacity","0").html("");
    } else{
        $(`.${className}`).css("opacity","1").html(currentValue);
    }
}
