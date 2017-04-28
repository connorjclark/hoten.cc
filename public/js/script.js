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
            "scrollTop": $target.offset().top - 85
        }, 500, "swing", function() {
            window.location.hash = target;
            $(document).on("scroll", onScroll);
            $("#header-container").addClass("fixed-header");
        });
    });

    $("#menu-icon").on("click", function() {
        $("#access").toggleClass("menu-open");
    });
});

function onScroll(event) {
    var scrollPosition = $(document).scrollTop();

    var heightOfHeader = $("#header-container").height();

    $("li.menu-item").each(function() {
        var $currentListElement = $(this);
        var refElementId = $currentListElement.find("a[href^='#']").attr("href");

        if (refElementId) {
            var $refElement = $(refElementId);
            var $elementPrev = $refElement.prev();
            var elementPrevBottom = $elementPrev.position().top + $elementPrev.height();
            var isShowingSection = scrollPosition >= elementPrevBottom - heightOfHeader;

            if (isShowingSection) {
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
