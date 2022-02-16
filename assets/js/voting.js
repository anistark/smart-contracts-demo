$("body").css("overflow", "hidden");
var voteCol1 = $(".ch1"),
    voteCol2 = $(".ch2"),
    voteCol3 = $(".ch3"),
    voteCol4 = $(".ch4"),
    voteCol5 = $(".ch5");

var contestants = ["34", "55", "21", "84", "42"];

$("#sResults").on("click", function () {
    $(".poll-item").each(function (i) {
        var percent = contestants[i];
        var num = percent / 100;
        $(".vote").addClass("results-r-in");
        $(this).find(".blob-amount").css("transform", "scale(1, " + num + ")");
    });
    voteCol4.addClass("is--winner");
});

$(".vote").on("click", function () {
    console.log('Voting for:');
    // $(this).prepend('<b class="click-voted">+1</b>');
    // setTimeout(function () {
    //     $(".click-voted").remove();
    // }, 600);
});

// $(".expand-btn").on("click", function () {
//     $(".poll-details").addClass("open");
//     $("#ltmWrapper").css("fill", "#333");
//     // $(this).parent().css('flex', '100%');
// });

// $(".close-panel").on("click", function () {
//     $(this).parent().removeClass("open");
//     $("#ltmWrapper").css("fill", "#fff");
// });

// on load

