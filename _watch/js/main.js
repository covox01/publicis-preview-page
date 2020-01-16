$(document).ready(function() {
    function init() {
        dropdownSelect();
        
    }

    $.getJSON( "preview_connect.json", function( data ) {
        console.log(data);
        
        data = data.preview_connect;
        
        $("title").html(data.Agency);
        $(".client-name h1").html(data.Client);
        $("#campaign-name-container h2").html(data.Campaign);

        $.each( data.Units, function( key, Units_val ) {

            $("#version-options").append("<li id='" + Units_val.Version_Name + "' class='version-item'> <p>" + Units_val.Version_Name + "</p></li>")

            $.each(Units_val.Sizes, function(key, Sizes_val){
                $('#size-options').append("<li id='" + Sizes_val + "' class='size-item'> <p>" + Sizes_val.size.width + "x" + Sizes_val.size.height + "</p></li>")
                $('.banner-container-1').append(
                    "<div id='" + Sizes_val.file + "' class='banner-margin'> <iframe class='iframed' frameBorder='0' width='" + Sizes_val.size.width + "' height='" + Sizes_val.size.height + "' src='"+ data.File_Path + "/" + Units_val.Version_Name + "/" + Sizes_val.file + "'></iframe></li>"
                )    
                // $('#iframeWindow').onload = function() {}
            })
        });
    }); 

function dropdownSelect() {
    var versionDropdown = document.getElementById("version-dropdown");
    var versionOptions = document.getElementById("version-options")
    var sizeDropdown = document.getElementById("size-dropdown");
    var versionDropdownClicked = false
    var sizeDropdownClicked = false
     // gsap.set(versionDropdown, {clip:"rect(0px, 300px, 0px, 0px);"}); 
    
    TweenMax.set("#version-sort-down", {rotation: 0, force3D: false})

    // Animation functions for both Version Dropdowns and Sizes Dropdowns
        function showVersions(){
        // --- Once clicked, animate arrow.
            var tl = new TimelineMax()
            gsap.to("#version-sort-down", {duration: .2, rotation: 180, transformOrigin: "center", opacity: .5});
            gsap.to(versionDropdown, {duration: .2, borderBottomLeftRadius: "1px"});
         // --- Once clicked, show options for sizes.
            $("#version-options").css("display", "block")
        }

        function hideVersions(){
        // --- Once clicked, animate arrow.
            gsap.to("#version-sort-down", {duration: .2, rotation: 0, transformOrigin: "center", opacity: 1});
            gsap.to(versionDropdown, {duration: .2, borderBottomLeftRadius: "5px"});
         // --- Hide version options
            $("#version-options").css("display", "none")
        }

        function showSizes(){
        // --- Once clicked, animate arrow.
            gsap.to("#size-sort-down", {duration: .2, rotation: 180, opacity: .5});
            gsap.to(sizeDropdown, {duration: .2, borderBottomRightRadius: "1px"});
        // --- Once clicked, show options for sizes.
            $("#size-options").css("display", "block")
        }

        function hideSizes(){
        // --- Once clicked, animate arrow.
            gsap.to("#size-sort-down", {duration: .2, rotation: 0, opacity: 1});
            gsap.to(sizeDropdown, {duration: .2, borderBottomRightRadius: "5px"});
        // --- Hide size options
            $("#size-options").css("display", "none")
        }

    // Version options reveals if dropdown is clicked
        $(versionDropdown).on('click', function() {
            event.preventDefault()
            if (!versionDropdownClicked){
                $(versionDropdown).addClass("open")
                versionDropdownClicked = true
                sizeDropdownClicked = false
                showVersions()
                hideSizes()

                console.log('version dropdown', versionDropdownClicked)
            } else {
                versionDropdownClicked = false
                hideVersions()
            }
        });

    // Size options reveals if size dropdown is clicked
        $(sizeDropdown).on('click', function() {
            event.preventDefault()
            if (!sizeDropdownClicked){
                sizeDropdownClicked = true
                versionDropdownClicked = false
                showSizes()
                hideVersions()
            } else {
                sizeDropdownClicked = false
                hideSizes()
            }
        });

    // If user clicks outside of dropdown menu it disappears
        $('.trigger').on('click', function(){
            if(versionDropdownClicked === true || sizeDropdownClicked === true) {
                versionDropdownClicked = false
                sizeDropdownClicked = false
                hideSizes()
                hideVersions()
                console.log('v-drop close', versionDropdownClicked)
            }
        })

}

  init();
});
