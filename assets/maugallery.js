Utilities
JavaScript Minifier
Online JavaScript Minifier Tool and Compressor, with Fast and Simple API Access
Input JavaScript
(function($) {
  $.fn.mauGallery = function(options) {
    var options = $.extend($.fn.mauGallery.defaults, options);
    var tagsCollection = [];
    return this.each(function() {
      $.fn.mauGallery.methods.createRowWrapper($(this));
      if (options.lightBox) {
        $.fn.mauGallery.methods.createLightBox(
          $(this),
          options.lightboxId,
          options.navigation
        );
      }
      $.fn.mauGallery.listeners(options);

      $(this)
        .children(".gallery-item")
        .each(function(index) {
          $.fn.mauGallery.methods.responsiveImageItem($(this));
          $.fn.mauGallery.methods.moveItemInRowWrapper($(this));
          $.fn.mauGallery.methods.wrapItemInColumn($(this), options.columns);
          var theTag = $(this).data("gallery-tag");
          if (
            options.showTags &&
            theTag !== undefined &&
            tagsCollection.indexOf(theTag) === -1
          ) {
            tagsCollection.push(theTag);
          }
        });

      if (options.showTags) {
        $.fn.mauGallery.methods.showItemTags(
          $(this),
          options.tagsPosition,
          tagsCollection
        );
      }

      $(this).fadeIn(500);
    });
  };
  $.fn.mauGallery.defaults = {
    columns: 3,
    lightBox: true,
    lightboxId: null,
    showTags: true,
    tagsPosition: "bottom",
    navigation: true
  };
  $.fn.mauGallery.listeners = function(options) {
    $(".gallery-item").on("click", function() {
      if (options.lightBox && $(this).prop("tagName") === "IMG") {
        $.fn.mauGallery.methods.openLightBox($(this), options.lightboxId);
      } else {
        return;
      }
    });

    $(".gallery").on("click", ".nav-link", $.fn.mauGallery.methods.filterByTag);
    $(".gallery").on("click", ".mg-prev", () =>
      $.fn.mauGallery.methods.prevImage(options.lightboxId)
    );
    $(".gallery").on("click", ".mg-next", () =>
      $.fn.mauGallery.methods.nextImage(options.lightboxId)
    );
  };
  $.fn.mauGallery.methods = {
    createRowWrapper(element) {
      if (
        !element
          .children()
          .first()
          .hasClass("row")
      ) {
        element.append('<div class="gallery-items-row row"></div>');
      }
    },
    wrapItemInColumn(element, columns) {
      if (columns.constructor === Number) {
        element.wrap(
          `<div class='item-column mb-4 col-${Math.ceil(12 / columns)}'></div>`
        );
      } else if (columns.constructor === Object) {
        var columnClasses = "";
        if (columns.xs) {
          columnClasses += ` col-${Math.ceil(12 / columns.xs)}`;
        }
        if (columns.sm) {
          columnClasses += ` col-sm-${Math.ceil(12 / columns.sm)}`;
        }
        if (columns.md) {
          columnClasses += ` col-md-${Math.ceil(12 / columns.md)}`;
        }
        if (columns.lg) {
          columnClasses += ` col-lg-${Math.ceil(12 / columns.lg)}`;
        }
        if (columns.xl) {
          columnClasses += ` col-xl-${Math.ceil(12 / columns.xl)}`;
        }
        element.wrap(`<div class='item-column mb-4${columnClasses}'></div>`);
      } else {
        console.error(
          `Columns should be defined as numbers or objects. ${typeof columns} is not supported.`
        );
      }
    },
    moveItemInRowWrapper(element) {
      element.appendTo(".gallery-items-row");
    },
    responsiveImageItem(element) {
      if (element.prop("tagName") === "IMG") {
        element.addClass("img-fluid");
      }
    },
    openLightBox(element, lightboxId) {
      $(`#${lightboxId}`)
        .find(".lightboxImage")
        .attr("src", element.attr("src"));
      $(`#${lightboxId}`).modal("toggle");
    },
    prevImage() {
      let activeImage = null;
      $("img.gallery-item").each(function() {
        if ($(this).attr("src") === $(".lightboxImage").attr("src")) {
          activeImage = $(this);
        }
      });
      let activeTag = $(".tags-bar span.active-tag").data("images-toggle");
      let imagesCollection = [];
      if (activeTag === "all") {
        $(".item-column").each(function() {
          if ($(this).children("img").length) {
            imagesCollection.push($(this).children("img"));
          }
        });
      } else {
        $(".item-column").each(function() {
          if (
            $(this)
              .children("img")
              .data("gallery-tag") === activeTag
          ) {
            imagesCollection.push($(this).children("img"));
          }
        });
      }
      let index = 0,
        next = null;

      $(imagesCollection).each(function(i) {
        if ($(activeImage).attr("src") === $(this).attr("src")) {
          index = i - 1;
        }
      });
      next =
        imagesCollection[index] ||
        imagesCollection[imagesCollection.length - 1];
      $(".lightboxImage").attr("src", $(next).attr("src"));
    },
    nextImage() {
      let activeImage = null;
      $("img.gallery-item").each(function() {
        if ($(this).attr("src") === $(".lightboxImage").attr("src")) {
          activeImage = $(this);
        }
      });
      let activeTag = $(".tags-bar span.active-tag").data("images-toggle");
      let imagesCollection = [];
      if (activeTag === "all") {
        $(".item-column").each(function() {
          if ($(this).children("img").length) {
            imagesCollection.push($(this).children("img"));
          }
        });
      } else {
        $(".item-column").each(function() {
          if (
            $(this)
              .children("img")
              .data("gallery-tag") === activeTag
          ) {
            imagesCollection.push($(this).children("img"));
          }
        });
      }
      let index = 0,
        next = null;

      $(imagesCollection).each(function(i) {
        if ($(activeImage).attr("src") === $(this).attr("src")) {
          index = i + 1;
        }
      });
      next = imagesCollection[index] || imagesCollection[0];
      $(".lightboxImage").attr("src", $(next).attr("src"));
    },
    createLightBox(gallery, lightboxId, navigation) {
      gallery.append(`<div class="modal fade" id="${
        lightboxId ? lightboxId : "galleryLightbox"
      }" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-body">
                            ${
                              navigation
                                ? '<div class="mg-prev" style="cursor:pointer;position:absolute;top:50%;left:-15px;background:white;"><</div>'
                                : '<span style="display:none;" />'
                            }
                            <img class="lightboxImage img-fluid" alt="Contenu de l'image affich?e dans la modale au clique"/>
                            ${
                              navigation
                                ? '<div class="mg-next" style="cursor:pointer;position:absolute;top:50%;right:-15px;background:white;}">></div>'
                                : '<span style="display:none;" />'
                            }
                        </div>
                    </div>
                </div>
            </div>`);
    },
    showItemTags(gallery, position, tags) {
      var tagItems =
        '<li class="nav-item"><span class="nav-link active active-tag"  data-images-toggle="all">Tous</span></li>';
      $.each(tags, function(index, value) {
        tagItems += `<li class="nav-item active">
                <span class="nav-link"  data-images-toggle="${value}">${value}</span></li>`;
      });
      var tagsRow = `<ul class="my-4 tags-bar nav nav-pills">${tagItems}</ul>`;

      if (position === "bottom") {
        gallery.append(tagsRow);
      } else if (position === "top") {
        gallery.prepend(tagsRow);
      } else {
        console.error(`Unknown tags position: ${position}`);
      }
    },
    filterByTag() {
      if ($(this).hasClass("active-tag")) {
        return;
      }
      $(".active.active-tag").removeClass("active active-tag");
      $(this).addClass("active-tag active");

      var tag = $(this).data("images-toggle");

      $(".gallery-item").each(function() {
        $(this)
          .parents(".item-column")
          .hide();
        if (tag === "all") {
          $(this)
            .parents(".item-column")
            .show(300);
        } else if ($(this).data("gallery-tag") === tag) {
          $(this)
            .parents(".item-column")
            .show(300);
        }
      });
    }
  };
})(jQuery);

Minified JavaScript Output
!function(a){a.fn.mauGallery=function(t){var t=a.extend(a.fn.mauGallery.defaults,t),e=[];return this.each(function(){a.fn.mauGallery.methods.createRowWrapper(a(this)),t.lightBox&&a.fn.mauGallery.methods.createLightBox(a(this),t.lightboxId,t.navigation),a.fn.mauGallery.listeners(t),a(this).children(".gallery-item").each(function(l){a.fn.mauGallery.methods.responsiveImageItem(a(this)),a.fn.mauGallery.methods.moveItemInRowWrapper(a(this)),a.fn.mauGallery.methods.wrapItemInColumn(a(this),t.columns);var i=a(this).data("gallery-tag");t.showTags&&void 0!==i&&-1===e.indexOf(i)&&e.push(i)}),t.showTags&&a.fn.mauGallery.methods.showItemTags(a(this),t.tagsPosition,e),a(this).fadeIn(500)})},a.fn.mauGallery.defaults={columns:3,lightBox:!0,lightboxId:null,showTags:!0,tagsPosition:"bottom",navigation:!0},a.fn.mauGallery.listeners=function(t){a(".gallery-item").on("click",function(){t.lightBox&&"IMG"===a(this).prop("tagName")&&a.fn.mauGallery.methods.openLightBox(a(this),t.lightboxId)}),a(".gallery").on("click",".nav-link",a.fn.mauGallery.methods.filterByTag),a(".gallery").on("click",".mg-prev",()=>a.fn.mauGallery.methods.prevImage(t.lightboxId)),a(".gallery").on("click",".mg-next",()=>a.fn.mauGallery.methods.nextImage(t.lightboxId))},a.fn.mauGallery.methods={createRowWrapper(a){a.children().first().hasClass("row")||a.append('<div class="gallery-items-row row"></div>')},wrapItemInColumn(a,t){if(t.constructor===Number)a.wrap(`<div class='item-column mb-4 col-${Math.ceil(12/t)}'></div>`);else if(t.constructor===Object){var e="";t.xs&&(e+=` col-${Math.ceil(12/t.xs)}`),t.sm&&(e+=` col-sm-${Math.ceil(12/t.sm)}`),t.md&&(e+=` col-md-${Math.ceil(12/t.md)}`),t.lg&&(e+=` col-lg-${Math.ceil(12/t.lg)}`),t.xl&&(e+=` col-xl-${Math.ceil(12/t.xl)}`),a.wrap(`<div class='item-column mb-4${e}'></div>`)}else console.error(`Columns should be defined as numbers or objects. ${typeof t} is not supported.`)},moveItemInRowWrapper(a){a.appendTo(".gallery-items-row")},responsiveImageItem(a){"IMG"===a.prop("tagName")&&a.addClass("img-fluid")},openLightBox(t,e){a(`#${e}`).find(".lightboxImage").attr("src",t.attr("src")),a(`#${e}`).modal("toggle")},prevImage(){let t=null;a("img.gallery-item").each(function(){a(this).attr("src")===a(".lightboxImage").attr("src")&&(t=a(this))});let e=a(".tags-bar span.active-tag").data("images-toggle"),l=[];"all"===e?a(".item-column").each(function(){a(this).children("img").length&&l.push(a(this).children("img"))}):a(".item-column").each(function(){a(this).children("img").data("gallery-tag")===e&&l.push(a(this).children("img"))});let i=0,s=null;a(l).each(function(e){a(t).attr("src")===a(this).attr("src")&&(i=e-1)}),s=l[i]||l[l.length-1],a(".lightboxImage").attr("src",a(s).attr("src"))},nextImage(){let t=null;a("img.gallery-item").each(function(){a(this).attr("src")===a(".lightboxImage").attr("src")&&(t=a(this))});let e=a(".tags-bar span.active-tag").data("images-toggle"),l=[];"all"===e?a(".item-column").each(function(){a(this).children("img").length&&l.push(a(this).children("img"))}):a(".item-column").each(function(){a(this).children("img").data("gallery-tag")===e&&l.push(a(this).children("img"))});let i=0,s=null;a(l).each(function(e){a(t).attr("src")===a(this).attr("src")&&(i=e+1)}),s=l[i]||l[0],a(".lightboxImage").attr("src",a(s).attr("src"))},createLightBox(a,t,e){a.append(`<div class="modal fade" id="${t||"galleryLightbox"}" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-body">
                            ${e?'<div class="mg-prev" style="cursor:pointer;position:absolute;top:50%;left:-15px;background:white;"><</div>':'<span style="display:none;" />'}
                            <img class="lightboxImage img-fluid" alt="Contenu de l'image affich\xe9e dans la modale au clique"/>
                            ${e?'<div class="mg-next" style="cursor:pointer;position:absolute;top:50%;right:-15px;background:white;}">></div>':'<span style="display:none;" />'}
                        </div>
                    </div>
                </div>
            </div>`)},showItemTags(t,e,l){var i='<li class="nav-item"><span class="nav-link active active-tag"  data-images-toggle="all">Tous</span></li>';a.each(l,function(a,t){i+=`<li class="nav-item active">
                <span class="nav-link"  data-images-toggle="${t}">${t}</span></li>`});var s=`<ul class="my-4 tags-bar nav nav-pills">${i}</ul>`;"bottom"===e?t.append(s):"top"===e?t.prepend(s):console.error(`Unknown tags position: ${e}`)},filterByTag(){if(!a(this).hasClass("active-tag")){a(".active.active-tag").removeClass("active active-tag"),a(this).addClass("active-tag active");var t=a(this).data("images-toggle");a(".gallery-item").each(function(){a(this).parents(".item-column").hide(),"all"===t?a(this).parents(".item-column").show(300):a(this).data("gallery-tag")===t&&a(this).parents(".item-column").show(300)})}}}}(jQuery);
JavaScript Minifier Tool Documentation
The API has changed, to see more please click here
To minify/compress your JavaScript, perform a POST request to

API https://www.toptal.com/developers/javascript-minifier/api/raw
with the input parameter set to the JavaScript you want to minify.

Hire the top 3% of freelance talent
Join the Toptal Network
Copyright 2010 - 2023 Toptal, LLC
Privacy Policy
Website terms
By continuing to use this site you agree to our Cookie Policy Privacy Policy, and Terms of Use.

Got it