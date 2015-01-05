var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubeIframeAPIReady() {

  jQuery(function($) {

  //Insert YouTube API


  // Globals

  var done = false;
  var player;
  var slideshowImages = {
    slideshow2: [
      'slideshow/syariah_slide_1.jpg',
      'slideshow/syariah_slide_2.jpg',
      'slideshow/syariah_slide_3.jpg',
      'slideshow/syariah_slide_4.jpg',
      'slideshow/syariah_slide_5.jpg',
      'slideshow/syariah_slide_6.jpg',
      'slideshow/syariah_slide_7.jpg',
      'slideshow/syariah_slide_8.jpg',
      'slideshow/syariah_slide_9.jpg',
      'slideshow/syariah_slide_10.jpg',
      'slideshow/syariah_slide_11.jpg',
      'slideshow/syariah_slide_12.jpg',
      'slideshow/syariah_slide_13.jpg',
      'slideshow/syariah_slide_14.jpg',
      'slideshow/syariah_slide_15.jpg'
    ],
    slideshowUcup: [
      'slideshow/ucup-1.jpg'
    ],
    slideshowMegi: [
      'slideshow/megi_slide_1.jpg',
      'slideshow/megi_slide_2.jpg',
      'slideshow/megi_slide_3.jpg',
      'slideshow/megi_slide_4.jpg',
      'slideshow/megi_slide_5.jpg'
    ]
  };

  var sectionMiddles = {};

  // YouTube Functions

      function destroyVideo() {
        if (player) {
          player.destroy();
          player = null;
        }
      }

      function placeVideo(container, videoID) {
        destroyVideo();

      player = new YT.Player(container, {
        height: '540',
        width: '870',
        videoId: videoID,
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      });
      }

      function activateBubble(sel, deactivate, section) {
        var sel = $(sel);
        if (sel.hasClass('active')) return;
        $(deactivate).removeClass('active');
        sel.addClass('active');

        // We need to check which data attribute it has

        var slideshowAttribute = sel.attr('data-slideshow');

        if (slideshowAttribute) {
          var images = slideshowImages[slideshowAttribute] || [];


          var slideshow = createSlideshow(images);
          var container = sel.attr('data-target');

          $(container).html('').append(slideshow);
          initiateSlideshow(container, section);
        } else {
          var videoID = sel.attr('data-video');
          var container = sel.attr('data-target');
          if (videoID && container) {
            placeVideo(container, videoID);
          }
        }

        // Gonna hide the nav
        $('.the-nav').hide();

      }


      function onPlayerReady(evt) {
        evt.target.playVideo();
      }

      function onPlayerStateChange(evt) {
        if (evt.data == YT.PlayerState.PLAYING && !done) {
          setTimeout(stopVideo, 6000);
          done = true;
        }
      }

      function stopVideo() {
        player.stopVideo();
      }

      // Close all sections be it slideshow or video

      function closeSections() {
        if ($('.entered').hasClass('slideshow')) {

          //$('.flexslider', '.entered').remove(); //this is self calling no need to do it here

          $('.entered').removeClass('slideshow');
        } else {
          var iframe = $('iframe.video-container');
          var oldNode = $('<div></div>').addClass('video-container').attr('id', iframe.attr('id'));

          iframe.after(oldNode);
          iframe.remove();
        }
        $('.active', 'ul.bubbles').removeClass('active');
        $('.entered').removeClass('entered');
        $('.the-nav').show();
      };

      // Create HTML for slideshow based on array of image paths

      function createSlideshow(imgs) {

        //lets create that div
        var flx = $('<div></div>').addClass('flexslider');
        var ul = $('<ul></ul>').addClass('slides');

        var img, li, counter, current;

        for (var x in imgs) {
          current = (parseInt(x) + 1);
          li = $('<li></li>');

          img = $('<div></div>').addClass('the-image');
          img.css('background-image', "url('images/" + imgs[x] + "')");
          li.append(img);
          ul.append(li);

        }

        flx.append(ul);

        // Now we do the counter
        if (imgs.length > 1) {
          var counter = $('<div></div>');
          counter.addClass('counter');
          counter.html('<span class="slide-count">1</span> of <span class="slide-total">' + imgs.length + '</span>');
          flx.append(counter);
        }

        return flx;

      };

      // Takes a slideshow, initiates it, and sets up the section

      function initiateSlideshow(ctx, section) {
        $(section).addClass('slideshow');
        $('.flexslider', ctx).not('.bubbles-wrapper').flexslider({
          controlNav: false,
          prevText: "",
          nextText: "",
          animation: "slide",
          slideshow: false,
          before: function(slider) {
            var cur = slider.currentSlide;
            console.log(cur);
            $('.slide-count', '.counter').text(parseInt(cur) + 1)
          },
          startAt: 1
        });
      }

      // Calculates absolute screen middle

      function calculateScreenMiddle(scrollTop) {

        var scrollTop = scrollTop || $("body").scrollTop();
        var windowYSize = $(window).height();

        var windowHalfSize = windowYSize / 2;

        var actualMiddle = scrollTop + windowHalfSize;

        /*
        This tests it by using a red line to see where the breakpoint would be
        var hr = $('<div></div>');
        hr.css('height', '10px').css('width', '100%').css('background-color', 'red').attr('id', 'fake');
        hr.css('position', 'absolute').css('top', actualMiddle + "px");
        $('#fake').remove();

        $('body').append(hr); /**/

        return actualMiddle;

      }

      // Get section element middles

      function getSectionMiddles(recalc) {
        if (!recalc && !$.isEmptyObject(sectionMiddles)) return sectionMiddles;
        var middles = {};

        if (middles.length > 0) return middles;

        $('.fake').remove();
        $('section.measured').each(function(index) {
          //get its top position, width, and then do the magic
          var dis = $(this);
          var id = dis.attr('id');

          var sectionYSize = dis.outerHeight();
          var topPosition = dis.position().top;

          var halfYSize = sectionYSize / 2;
          var actualMiddle = topPosition + halfYSize

          /*
          This tests it by using a red line to see where the breakpoint would be
          var hr = $('<div></div>');
          hr.css('height', '10px').css('width', '100%').css('background-color', 'red').addClass('fake');
          hr.css('position', 'absolute').css('top', actualMiddle + "px");

          $('body').append(hr); /**/

          middles[id] = actualMiddle;

        });

        sectionMiddles = middles;
        return middles;

      }

      function getClosestElementToPosition(position, down) {

        // We want closest downward I guess? Depends
        var middles = getSectionMiddles();

        // Should be sorted first unfortunately

        var sorted = [];

        for (var x in middles) {
          // x is the element ID
          sorted.push([x, middles[x]]);
        }

        if (down) {
          sorted = sorted.sort(function(a, b) {return a[1] - b[1]})

          // Now they're sorted properly
          var elem = sorted[0][0];

          for (var x in sorted) {
            var thisElement = sorted[x];
            var key = sorted[x][0];
            var value = sorted[x][1];

            if (position > value) elem = key;

          }

        } else {
          sorted = sorted.sort(function(a, b) {return b[1] - a[1]})

          // Now they're sorted properly
          var elem = sorted[0][0];

          for (var x in sorted) {
            var thisElement = sorted[x];
            var key = sorted[x][0];
            var value = sorted[x][1];

            if (position < value) elem = key;

          }
        }

        return elem;

      }

      var lastScrollTop = 0;

      function scrollUpdate(e) {
        // Big problem is minor changes due to mouse wheel or something.
        // If we want to detect it better we need to make a tolerance or something
        var dis = $(this);
        var st = dis.scrollTop();
        var element = getClosestElementToPosition(calculateScreenMiddle(st), (st > lastScrollTop));
        activateNavItem(element);
        lastScrollTop = st;

        // Okay we have teh element. We need to activate it
      }

      function activateNavItem(points) {

        //we need to get the active element so we know where to position the bar
        containerID = '#' + points;
        //We can get the anchor of the nav by its href
        var anchor = $('a[href="'+containerID+'"]', '.the-nav');

        $('li', '.the-nav').removeClass('active');
        anchor.parent().addClass('active');

        // now we have the container ID.
        var sidebarHeight = $('.the-nav').height();
        var container = $(containerID);

        // We need to get container positional requirements
        var containerHeight = container.outerHeight(),
        containerY = container.position().top;

        var heightOffset = (containerHeight - sidebarHeight) / 2;

        var newYPosition = heightOffset + containerY;
        newYPosition += "px";

        $('.the-nav').css('top', newYPosition).css('position', 'absolute');

      }

      (function() {

        // Async block function to separate the initialization logic from the api funcs

        // Bind close button to close Sections

        $('.close--button').click(closeSections);

        // BootStrap Customization - probably going to be removed

        $('#side-nav').on('activate.bs.scrollspy', function() {

          var containerID = $('.active a', this).attr('href');
          var img = $('#explore-image');

          if (containerID == '#kolabo-container') {
            img.attr('src', 'images/explore-gray.png');
          } else {
            img.attr('src', 'images/explore.png');
          }

          return;
        /*
          //we need to get the active element so we know where to position the bar
          var containerID = $('.active a', this).attr('href');
          // now we have the container ID.
          var sidebarHeight = $(this).height();

          var container = $(containerID);

          // We need to get container positional requirements
          var containerHeight = container.outerHeight(),
            containerY = container.position().top;

          var heightOffset = (containerHeight - sidebarHeight) / 2;

          var newYPosition = heightOffset + containerY;
          newYPosition += "px";

          $('.the-nav').css('top', newYPosition).css('position', 'absolute');

          */

        });

        // Bubble on click

        $('.bubble').click(function() {

          var parent = '#' + $(this).parents('.container-wrapper').attr('id');
          $('.container-wrapper').not(parent).removeClass('entered').removeClass('slideshow');
          parent = $(parent);
          if (parent.hasClass('entered')) {
            //see no evil
          } else {
            parent.addClass('entered');
            destroyVideo();
          }

          activateBubble(this, '.active', parent);
        });

        //$(window).on('scroll', scrollUpdate);

        $('a', '.the-nav').click(function(e) {
          e.preventDefault();
          var dis = $(this);
          var href = dis.attr('href');

          var element = $(href);
          if (element) {
            $('body').animate({
              scrollTop: element.position().top
            })
          }
        });

        //$(window).on('resize', getSectionMiddles);


      })();

      function isMobile() {
        return $('.visible-xs:visible').length > 0;
      }

      if ($('.bubbles-wrapper') && isMobile()) {
        $('.bubbles-wrapper.flexslider').flexslider({
          controlNav: false,
          selector: '.bubbles li',
          prevText: "",
          nextText: "",
          animation: "slide",
          slideshow: false,
          startAt: 3
//          itemWidth: 270,
          //itemMargin: 0
        });
      }

  }); //end jquery block


} // End YouTube block
