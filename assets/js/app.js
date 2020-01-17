var App = (function() {
  'use strict';

  let $_html, $_body, $_wrap, $_header, $_aside, $_container, $_footer;

  /*
   ********************************************************************************************
   *
   * BASE UI FUNCTIONALITY
   *
   * Functions which handle vital UI functionality such as main navigation and layout
   * They are auto initialized in every page
   *
   *********************************************************************************************
   */
  const init = () => {
    $_html = $('html');
    $_body = $('body');
    $_wrap = $('#wrapper');
    $_header = $('#header');
    $_aside = $('#aside');
    $_container = $('#container');
    $_footer = $('#footer');
  };

  const layout = {
    init: () => {
      if ($_header != undefined && $_header.length > 0) layout.header();
      if ($_aside != undefined && $_aside.length > 0) layout.aside();
      if ($_container != undefined && $_container.length > 0)
        layout.container();
      if ($_footer != undefined && $_footer.length > 0) layout.footer();
    },
    header: () => {
      $('.header-body .button').on('click', function() {
        console.log('click');
      });
    },
    aside: () => {
      $('.button__directory').on('click', function() {
        console.log('click');
        $(this)
          .parent()
          .toggleClass('list-item__nav--active');
      });
      function isNotEmpty(value) {
        return value != '';
      }

      const path = $_html.data('url').split('/').filter(isNotEmpty);
      const category = path[0];
      const currentpage = path[1];

      $('.button__directory').each(function(i) {
        const navurl = $(this).find('.text__nav').text();
        if (navurl === category) $(this).parent('.list-item__nav').addClass('list-item__nav--active');
	  });

      $('.list__nav-directory .list-item__nav').each(function(i) {
        const navurl = $(this).find('.link__nav').data('url').toString().split('/').filter(isNotEmpty)[1];
        if (navurl === currentpage) $(this).addClass('list-item__nav--active');
      });
    },
    container: () => {
      let hWindow = $(window).height();
      let hHeader = $_header.outerHeight();
      let hFooter = $_footer.outerHeight();
      $_wrap.hasClass('header-fixed')
        ? $_container.css('min-height', hWindow - hFooter)
        : $_container.css('min-height', hWindow - (hHeader + hFooter));
    },
    footer: () => {
      $('#top').on('click', function() {
        console.log('elevator');
      });
    }
  };

  const post = {
    init: () => {
      post.toc();
      post.CodeMirror();
    },
    toc: () => {
      var $markdown_toc = $('#markdown-toc');
      var $toc = $('#toc');
      var $list = $toc.children('ul');
      var headerHeight = $('#header').outerHeight();
      var bodyTop = $('.container-body').offset().top;

      var $headings = $(
        '.content h1, .content h2, .content h3, .content h4, .content h5'
      );

      if ($markdown_toc.length) {
        var html =
          '<button class="button breadcrumb-toc"><i class="fa fa-list-ol"></i><span class="for-a11y">Go to table of contents</span></button>';
        $('.container-header .pagination').prepend(html);
      }
      $('.breadcrumb-toc').click(function() {
        $markdown_toc.slideToggle(300);

        $('html, body').animate(
          {
            scrollTop: bodyTop - headerHeight
          },
          1000
        );
        return false;
      });

      // Create toc
      if ($headings.length) {
        $headings.each(function() {
          var $el = $(this);
          var id = $el.attr('id');
          if (id) {
            $list.append(
              $('<li />').append(
                $('<a />')
                  .addClass('test')
                  .text($el.text())
                  .attr('href', '#' + id)
              )
            );

            // headings에 링크를 표시하는 마크를 추가한다
            $el.prepend(
              $('<a />')
                .addClass('header-link')
                .attr('href', '#' + id)
                .html('#')
            );
            return;
          }
        });
      } else {
        $toc.hide();
      }
      $markdown_toc.find('a').click(function(e) {
        e.preventDefault();
        $('html, body').animate(
          {
            scrollTop: $($(this).attr('href')).offset().top - headerHeight
          },
          1000
        );
      });
      // Heading link Control
      $('.header-link').on('click', function(e) {
        e.preventDefault();
        // 헤더의 링크를 클릭했을 때, 언제나 toc를 표시하고(토글되지 않고) toc로 Scrooll한다
        if (!$markdown_toc.is(':visible')) {
          $markdown_toc.slideToggle(300);
        }

        $('html, body').animate(
          {
            scrollTop: bodyTop - headerHeight
          },
          1000
        );
      });
    },
    CodeMirror: () => {
      // CodeMirror
      CodeMirror.modeURL =
        '/pages/envyz710/reference/assets/vendor/codemirror/mode/%N/%N.js';
      var codeBlocks = document.querySelectorAll('pre > code');

      function parseMode(mode) {
        // switch (mode) {
        //   case 'js':
        //   case 'javascript':
        //     mode = 'jsx'
        // }
        let syntax = CodeMirror.findModeByName(mode);
        if (syntax == null) syntax = CodeMirror.findModeByName('Plain Text');
        return syntax;
      }

      _.forEach(codeBlocks, block => {
        var syntax = parseMode(block.className.substring(9));

        CodeMirror.requireMode(syntax.mode, () => {
          var value = _.unescape(block.innerHTML);
          block.innerHTML = '';

          // SET CODEMIRROR's THEME
          block.parentNode.className = 'cm-s-dracula CodeMirror';
          // block.parentNode.className = 'cm-s-default CodeMirror';

          CodeMirror.runMode(value, syntax.mime, block, {
            tabSize: 2
          });

          // CodeMirror theme css가 적용된 이후 표시하도록 한다.
          block.style.visibility = 'visible';
        });
      });
    }
  };

  return {
    init: function() {
      init();
      layout.init();
      post.init();
    }
  };
})();

$(function() {
  App.init();
});
