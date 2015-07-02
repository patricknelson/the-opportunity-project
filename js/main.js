var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubeIframeAPIReady() {

  jQuery(function($) {

    var bodyElement;

    if(false) bodyElement = $("body")
    else bodyElement = $("html,body")

    //Insert YouTube API
    $('body').scrollspy({
      target: "#side-nav",
      offset: 120
    });

    // Globals

  var done = true;
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
      //'slideshow/syariah_slide_11.jpg',
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
        // && typeof(YT.Player) === 'object'
        if (player ) {
          player.destroy();
          player = null;
        }
      }

      function placeVideo(container, videoID, params) {
        destroyVideo();
        if (!params) params = {};
        console.log(container);
        player = new YT.Player(container, {
          height: params.height || '540',
          width: params.width || '870',
          videoId: videoID,
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          },
          playerVars: {rel: 0}
        });

        return player;

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

      var UAMobile = false;
      function UAMobileTrue() {

        if (UAMobile) {
          if (UAMobile == 1) {
            return false;
          } else {
            return true;
          }
        }

        if(! navigator.userAgent.match(/Android/i) &&
          ! navigator.userAgent.match(/webOS/i) &&
          ! navigator.userAgent.match(/iPhone/i) &&
          ! navigator.userAgent.match(/iPod/i) &&
          ! navigator.userAgent.match(/iPad/i) &&
          ! navigator.userAgent.match(/Blackberry/i) &&
          ! navigator.userAgent.match(/iPad/i) )
        {

          UAMobile = 1;
          return false;

        } else {

          // do tablet stuff
          UAMobile = 2;
          return true;

        }
      }

      function onPlayerReady(evt) {
        if (!UAMobileTrue())
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
          img.css('background-image', "url('http://broll.ebayinc.com/TOP/images/" + imgs[x] + "')");
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
          useCSS: false,
          nextText: "",
          animation: "slide",
          slideshow: false,
          before: function(slider) {
            var cur = slider.currentSlide;
            $('.slide-count', '.counter').text(parseInt(cur) + 1)
          },
          startAt: 1
        });
      }

      // Calculates absolute screen middle

      var lastScrollTop = 0;

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

      function bindBubbles() {

        $.each($('.bubble'), function() {
          $(this).click(function() {

            if (isMobile()) {
              var videoID = $(this).attr('data-video');
              var container = 'modal-video';
              var containerJquery = $('#' + container);
              containerJquery.html('');

              placeVideo(container, videoID);
              $('#myModal').modal();

              return;
            }

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
        });
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
            //img.attr('src', 'images/explore-gray.png');
          } else {
            //img.attr('src', 'images/explore.png');
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

        bindBubbles();


        $('a', '.the-nav').click(function(e) {

          e.preventDefault();
          var dis = $(this);
          var href = dis.attr('href');

          var element = $(href);

          var newScrollTop = element.position().top;
          if (isMobile()) newScrollTop -= 60;

          if (element) {
            bodyElement.animate({
              scrollTop: newScrollTop
            })
          }
        });

        if (window.location.hash) {
          var hash = window.location.hash;
          var re = new RegExp("^#video-");
          if (hash.match(re)) {
            video = hash.replace(re, '');

            var a = $('.bubble[data-video="'+video+'"]');
            var top = a.parents('section').position().top;

            if (top)
              bodyElement.animate({
                scrollTop: top
              });

            window.setTimeout(function() {
              a.click();

            }, 1000);
          }
        }

      })();

      var wasMobile = false;

      function checkMobile() {
        var xs = $('.visible-xs:visible').length > 0;
        if (!xs) return $('.visible-sm:visible').length > 0;
        else return true;
      }

      function isMobile() {
        return wasMobile;
      }

      function deviceChange() {

        var returnValue = checkMobile(); // This gives us the actual value

        if (returnValue != wasMobile) {
          wasMobile = returnValue;
          return true;
        }
        return false; // isMobile will return checkMobile the first time, then only true if there was a change
        // If
      }

      wasMobile = isMobile(); // Store wasMobile in here for the first time to make it itself

      var sliders = [];

      function destroyMobileSliders() {
        $('body').off('click.mobile');
        $('.the-nav').off('click.mobile');
        unconstrainSizes();
        if ($('.bubbles-wrapper')) {
          $.each( $('.bubbles-wrapper.bubble-slider'), function(i) {
            var slider = $(this);
            slider.removeClass('flexslider'); // in case it has it
            $(this).replaceWith(sliders[i]);
          });
          bindBubbles();
        }
      }

      function setupMobileSlider() {
        if (!isMobile()) return;


        $('body').on('click.mobile', function() {
          $('#side-nav').removeClass('shown');
        });

        $('.the-nav').on('click.mobile', function(e) {
          e.stopPropagation();

          $('#side-nav').toggleClass('shown');
          constrainSizes();
        });

        if ($('.bubbles-wrapper')) {
          sliders = [];
          $('.bubbles-wrapper.bubble-slider').each(function() {
            var element = $(this);
            sliders.push(element.clone());
            // Destroy bubble 5
            $('.bubble-5', element).parent().remove();
            element.addClass('flexslider').flexslider({
              controlNav: false,
              selector: '.bubbles li',
              prevText: "",
              nextText: "",
              animation: "slide",
              slideshow: false,
              start: constrainSizes,
              startAt: 1,
              after: bindBubbles
    //          itemWidth: 270,
              //itemMargin: 0
            });

          });

        }

      }

      function constrainSizes() {
        $.each($('.constrain'), function() {
          var that = $(this);

          var width = that.width();
          that.css('height', width+"px");
        });
      }
      function unconstrainSizes() {
        $.each($('.constrain'), function() {
          var that = $(this);

          that.css('height', "");
        });
      }

      function mobileSetup() {
        console.log('resize or orientation change');
        if (isMobile())
          constrainSizes();

        if (deviceChange()) {
          if (isMobile()) {
            setupMobileSlider(); // Includes a constrain sizes
          } else {
            destroyMobileSliders();
          }
        }

      }

      $(window).resize(mobileSetup);
      $(window).on("orientationchange", function(e) {

        if (window.orientation && navigator.userAgent.match(/iPad/i)) {
          if (window.orientation == 90 || window.orientation == 270 || window.orientation == -90) {
              // Fade body out
              $('#wrapper').fadeOut(500, function() {
                window.location.reload();
              });
          }
        }
        console.log("Orientation change");
        mobileSetup();
      });

      mobileSetup();

      $('#myModal').on('hidden.bs.modal', function() {

        var containerJquery = $('#modal-video');

        containerJquery.after($('<div></div>').attr('id', containerJquery.attr('id')))

        containerJquery.remove();

      });

      $('.back-to-top').click(function() {
        bodyElement.animate({scrollTop: $('#intro-container').offset().top});
      });

      $('.explore-btn').click(function() {
        bodyElement.animate({scrollTop: $('.container-fluid:eq(1)').offset().top});
      });

      $(window).scroll(function() {
        if (wasMobile) return;
        var y = $(window).scrollTop();
        // need to add half the window height
        var yHeight = $(window).height();
        y = y + (yHeight / 2);

        var lastContainer = $('.container-wrapper:last');

        var lastTop = lastContainer.position().top;
        var height = lastContainer.height();

        var total = lastTop + (height / 2);

        var nav = $('.the-nav');

        if (y >= total) {
          // Stop it from moving
          nav.css('top', total + 'px').css('position', 'absolute');
        } else {
          nav.css('top', '50%').css('position', 'fixed');
        }


      });

  }); //end jquery block


} // End YouTube block
