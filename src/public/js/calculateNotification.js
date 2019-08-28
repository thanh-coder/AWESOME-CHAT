function increaseNumberNotification(className,number){
    let currentValue = +$(`.${className}`).text();
    currentValue += number;
    if(currentValue === 0){
        $(`.${className}`).css("opacity","0").html("");
    } else{
        $(`.${className}`).css("opacity","1").html(currentValue);
    }
}
function decreaseNumberNotification(className,number){
    let currentValue = +$(`.${className}`).text();
    currentValue -= number;
    if(currentValue === 0){
        $(`.${className}`).css("opacity","0").html("");
    } else{
        $(`.${className}`).css("opacity","1").html(currentValue);
    }
}
