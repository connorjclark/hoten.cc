$(function() {
    $(document).on("scroll", onScroll);

    $("nav a[href^='#']").on("click", function(e) {
        e.preventDefault();
        $(document).off("scroll");

        $("li.menu-item").removeClass("active");
        $(this).closest("li.menu-item").addClass("active");

        var target = this.hash;
        $target = $(target);
        $("html, body").stop().animate({
            "scrollTop": $target.offset().top - 65
        }, 500, "swing", function() {
            window.location.hash = target;
            $(document).on("scroll", onScroll);
            $("#header-container").addClass("fixed-header");
            $("#access").addClass("menu-open");
        });
    });

    $("#menu-icon").on("click", function() {
        $("#access").toggleClass("menu-open");
    });
});

function onScroll(event) {
    var scrollPosition = $(document).scrollTop();

    $("li.menu-item").each(function() {
        var $currentListElement = $(this);
        var refElementId = $currentListElement.find("a[href^='#']").attr("href");

        if (refElementId) {
            var $refElement = $(refElementId);

            if ($refElement.position().top <= scrollPosition && $refElement.position().top + $refElement.height() > scrollPosition) {
                $("li.menu-item").removeClass("active");
                $currentListElement.addClass("active");
            } else {
                $currentListElement.removeClass("active");
            }
        }
    });

    var $scrollTopDetector = $("#scroll-top-detector");
    if ($scrollTopDetector.position().top <= scrollPosition) {
        $("#header-container").addClass("fixed-header");
        $("#access").addClass("menu-open");
    } else {
        $("#header-container").removeClass("fixed-header");
        $("#access").removeClass("menu-open");
    }
}
