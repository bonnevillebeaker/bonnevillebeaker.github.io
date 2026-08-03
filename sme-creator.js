(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var copyButton = document.getElementById("copy-sme-email");
    if (!copyButton) return;

    function showCopiedState() {
      copyButton.classList.add("is-copied");
      window.setTimeout(function () {
        copyButton.classList.remove("is-copied");
      }, 2200);
    }

    function fallbackCopy(value) {
      var textArea = document.createElement("textarea");
      textArea.value = value;
      textArea.setAttribute("readonly", "");
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      var copied = false;
      try { copied = document.execCommand("copy"); } catch (error) {}
      document.body.removeChild(textArea);
      return copied;
    }

    copyButton.addEventListener("click", function () {
      var email = copyButton.getAttribute("data-email") || "bonnevillebeaker@gmail.com";
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(showCopiedState, function () {
          if (fallbackCopy(email)) showCopiedState();
        });
      } else if (fallbackCopy(email)) {
        showCopiedState();
      }
    });
  });
})();
