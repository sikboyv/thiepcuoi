(function ($) {
    "use strict";

    if (!$) return;

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();

    // Initiate WOW when the library is available.
    if (typeof WOW !== "undefined") {
        new WOW().init();
    }

    // Fixed Navbar
    $(window).on('scroll', function () {
        if ($(this).scrollTop() > 300) {
            $('.sticky-top').addClass('shadow-sm').css('top', '0px');
        } else {
            $('.sticky-top').removeClass('shadow-sm').css('top', '-300px');
        }
    });

    // Smooth scrolling on the navbar links
    $(".navbar-nav a").on('click', function (event) {
        if (this.hash !== "" && $(this.hash).length) {
            event.preventDefault();

            $('html, body').animate({
                scrollTop: $(this.hash).offset().top - 90
            }, 1500, 'easeInOutExpo');

            if ($(this).parents('.navbar-nav').length) {
                $('.navbar-nav .active').removeClass('active');
                $(this).closest('a').addClass('active');
            }
        }
    });

    // Back to top button
    $(window).on('scroll', function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });

    $('.back-to-top').on('click', function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });
})(window.jQuery);

(function () {
    "use strict";

    function setMusicButtonState(isPlaying) {
        var button = document.getElementById('music-toggle');
        if (!button) return;
        button.classList.toggle('playing', isPlaying);
        button.setAttribute('aria-pressed', String(isPlaying));
    }

    window.toggleMusic = function () {
        var music = document.getElementById('bg-music');
        if (!music) return;

        if (music.paused) {
            music.play()
                .then(function () { setMusicButtonState(true); })
                .catch(function () { setMusicButtonState(false); });
        } else {
            music.pause();
            setMusicButtonState(false);
        }
    };

    document.addEventListener('DOMContentLoaded', function () {
        var intro = document.getElementById('intro');
        var openButton = document.getElementById('openBtn');
        var music = document.getElementById('bg-music');

        if (!intro || !openButton) return;

        document.documentElement.classList.add('intro-locked');
        openButton.focus({preventScroll: true});

        openButton.addEventListener('click', function () {
            if (intro.classList.contains('is-opening')) return;

            openButton.disabled = true;
            intro.classList.add('is-opening');

            if (music) {
                music.play()
                    .then(function () { setMusicButtonState(true); })
                    .catch(function () { setMusicButtonState(false); });
            }

            if (typeof window.Sakura === 'function' && !window.weddingSakura) {
                window.weddingSakura = new window.Sakura('body', {
                    fallSpeed: 1.3,
                    maxSize: 18,
                    minSize: 10
                });
            }

            window.setTimeout(function () {
                intro.classList.add('is-leaving');
            }, 1650);

            window.setTimeout(function () {
                intro.remove();
                document.documentElement.classList.remove('intro-locked');
            }, 2400);
        }, {once: true});
    });

    // Optional gallery thumbnails. Only runs when this gallery variant exists.
    document.addEventListener('DOMContentLoaded', function () {
        var thumbs = document.querySelectorAll('.thumb');
        var mainImage = document.getElementById('mainGalleryImage');
        var mainLink = document.getElementById('mainGalleryLink');

        if (!thumbs.length || !mainImage || !mainLink) return;

        thumbs.forEach(function (thumb) {
            thumb.addEventListener('click', function () {
                var src = this.currentSrc || this.src;
                mainImage.src = src;
                mainLink.href = src;

                thumbs.forEach(function (item) {
                    item.classList.remove('active');
                });
                this.classList.add('active');
            });
        });
    });


    // Wedding gift envelope: opens the bride and groom account card.
    document.addEventListener('DOMContentLoaded', function () {
        var stage = document.getElementById('giftEnvelopeStage');
        var trigger = document.getElementById('giftEnvelopeButton');
        var modal = document.getElementById('giftAccountDetails');
        var closeButton = document.getElementById('giftEnvelopeClose');
        var backdrop = modal ? modal.querySelector('[data-gift-close]') : null;
        var openTimer;

        if (!stage || !trigger || !modal) return;

        function showGiftAccounts() {
            modal.classList.add('is-visible');
            modal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('gift-modal-open');

            if (closeButton) {
                window.setTimeout(function () {
                    closeButton.focus({ preventScroll: true });
                }, 80);
            }
        }

        function openGiftEnvelope() {
            if (stage.classList.contains('is-opening') || stage.classList.contains('is-open')) return;

            stage.classList.add('is-opening');
            trigger.setAttribute('aria-expanded', 'true');

            openTimer = window.setTimeout(function () {
                stage.classList.remove('is-opening');
                stage.classList.add('is-open');
                showGiftAccounts();
            }, 720);
        }

        function closeGiftEnvelope() {
            window.clearTimeout(openTimer);
            modal.classList.remove('is-visible');
            modal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('gift-modal-open');

            window.setTimeout(function () {
                stage.classList.remove('is-opening', 'is-open');
                trigger.setAttribute('aria-expanded', 'false');
                trigger.focus({ preventScroll: true });
            }, 360);
        }

        trigger.addEventListener('click', openGiftEnvelope);
        if (closeButton) closeButton.addEventListener('click', closeGiftEnvelope);
        if (backdrop) backdrop.addEventListener('click', closeGiftEnvelope);

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && modal.classList.contains('is-visible')) {
                closeGiftEnvelope();
            }
        });
    });

    window.copyText = function (id) {
        var element = document.getElementById(id);
        if (!element) return;

        var text = element.innerText.trim();

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text)
                .then(function () { alert('Đã sao chép số tài khoản'); })
                .catch(function () { alert('Không thể sao chép. Vui lòng sao chép thủ công.'); });
            return;
        }

        var textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();

        try {
            document.execCommand('copy');
            alert('Đã sao chép số tài khoản');
        } catch (error) {
            alert('Không thể sao chép. Vui lòng sao chép thủ công.');
        }

        textarea.remove();
    };
})();

(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {
        var viewer = document.getElementById("coupleImageViewer");
        var viewerPhoto = document.getElementById("coupleImageViewerPhoto");
        var viewerCaption = document.getElementById("coupleImageViewerCaption");
        var closeButton = document.getElementById("coupleImageViewerClose");
        var triggers = document.querySelectorAll("[data-couple-image]");
        var backdrop = viewer ? viewer.querySelector("[data-couple-close]") : null;
        var lastTrigger = null;

        if (!viewer || !viewerPhoto || !triggers.length) return;

        function openViewer(trigger) {
            var imageSrc = trigger.getAttribute("data-couple-image");
            var imageAlt = trigger.getAttribute("data-couple-alt") || "Ảnh phóng to";

            lastTrigger = trigger;
            viewerPhoto.src = imageSrc;
            viewerPhoto.alt = imageAlt;

            if (viewerCaption) {
                viewerCaption.textContent = imageAlt;
            }

            viewer.classList.add("is-visible");
            viewer.setAttribute("aria-hidden", "false");
            document.body.classList.add("couple-viewer-open");

            if (closeButton) {
                window.setTimeout(function () {
                    closeButton.focus({ preventScroll: true });
                }, 60);
            }
        }

        function closeViewer() {
            viewer.classList.remove("is-visible");
            viewer.setAttribute("aria-hidden", "true");
            document.body.classList.remove("couple-viewer-open");

            window.setTimeout(function () {
                viewerPhoto.src = "";
                if (lastTrigger) {
                    lastTrigger.focus({ preventScroll: true });
                }
            }, 320);
        }

        triggers.forEach(function (trigger) {
            trigger.addEventListener("click", function () {
                openViewer(trigger);
            });
        });

        if (closeButton) closeButton.addEventListener("click", closeViewer);
        if (backdrop) backdrop.addEventListener("click", closeViewer);

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && viewer.classList.contains("is-visible")) {
                closeViewer();
            }
        });
    });
})();

(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {
        var video = document.getElementById("weddingFilmVideo");
        var playButton = document.getElementById("weddingFilmPlay");
        var frame = document.getElementById("weddingFilmFrame");

        if (!video || !playButton || !frame) return;

        function markPlaying() {
            frame.classList.add("is-playing");
        }

        function markPaused() {
            if (video.paused || video.ended) {
                frame.classList.remove("is-playing");
            }
        }

        playButton.addEventListener("click", function () {
            video.play()
                .then(markPlaying)
                .catch(function () {
                    frame.classList.remove("is-playing");
                });
        });

        video.addEventListener("play", markPlaying);
        video.addEventListener("pause", markPaused);
        video.addEventListener("ended", markPaused);
    });
})();

(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {
        var form = document.getElementById("guestbookForm");
        var nameInput = document.getElementById("guestbookName");
        var messageInput = document.getElementById("guestbookMessage");
        var counter = document.getElementById("guestbookCounter");
        var entriesContainer = document.getElementById("guestbookEntries");
        var emptyState = document.getElementById("guestbookEmpty");
        var entryCount = document.getElementById("guestbookEntryCount");
        var status = document.getElementById("guestbookFormStatus");
        var submitButton = document.getElementById("guestbookSubmit");
        var emojiButton = document.getElementById("guestbookEmojiButton");
        var emojiPicker = document.getElementById("guestbookEmojiPicker");

        if (!form || !nameInput || !messageInput || !entriesContainer) return;

        var storageKey = "weddingGuestbookEntriesV1";
        var apiUrl = String(window.WEDDING_GUESTBOOK_API_URL || "").trim();

        var seedEntries = [
            {
                id: "seed-1",
                name: "Bạn Hoàng",
                message: "Chúc hai bạn mãi yêu thương, luôn đồng hành và cùng nhau xây dựng một mái ấm thật hạnh phúc 💖",
                timestamp: "2026-07-04T13:44:27+07:00"
            },
            {
                id: "seed-2",
                name: "Hoài Nam",
                message: "Chúc hai bạn luôn nắm tay nhau qua mọi chặng đường. Trăm năm hạnh phúc nhé! 💍",
                timestamp: "2026-07-04T13:43:31+07:00"
            },
            {
                id: "seed-3",
                name: "Bạn Linh",
                message: "Mừng ngày trọng đại! Chúc hai bạn thật nhiều tiếng cười, yêu thương và bình an.",
                timestamp: "2026-07-04T13:42:43+07:00"
            },
            {
                id: "seed-4",
                name: "Chị Huyền",
                message: "Chúc hai em trăm năm hạnh phúc, vợ chồng đồng lòng và gia đình luôn ngập tràn niềm vui ❤️",
                timestamp: "2026-07-04T13:42:15+07:00"
            },
            {
                id: "seed-5",
                name: "Cô My",
                message: "Chúc vợ chồng son mãi yêu thương, sớm có thật nhiều tin vui 😊",
                timestamp: "2026-07-04T13:41:50+07:00"
            }
        ];

        function readLocalEntries() {
            try {
                var stored = localStorage.getItem(storageKey);
                if (!stored) {
                    localStorage.setItem(storageKey, JSON.stringify(seedEntries));
                    return seedEntries.slice();
                }

                var parsed = JSON.parse(stored);
                return Array.isArray(parsed) ? parsed : seedEntries.slice();
            } catch (error) {
                return seedEntries.slice();
            }
        }

        function writeLocalEntries(entries) {
            try {
                localStorage.setItem(storageKey, JSON.stringify(entries.slice(0, 100)));
            } catch (error) {
                // Trang vẫn hoạt động nếu trình duyệt chặn localStorage.
            }
        }

        function formatDateTime(value) {
            var date = new Date(value);
            if (Number.isNaN(date.getTime())) return "";

            return new Intl.DateTimeFormat("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour12: false
            }).format(date);
        }

        function createEntryElement(entry) {
            var article = document.createElement("article");
            article.className = "guestbook-entry";

            var head = document.createElement("div");
            head.className = "guestbook-entry-head";

            var name = document.createElement("h3");
            name.className = "guestbook-entry-name";
            name.textContent = entry.name || "Khách mời";

            var time = document.createElement("time");
            time.className = "guestbook-entry-time";
            time.dateTime = entry.timestamp || "";
            time.textContent = formatDateTime(entry.timestamp);

            var message = document.createElement("p");
            message.className = "guestbook-entry-message";
            message.textContent = entry.message || "";

            head.appendChild(name);
            head.appendChild(time);
            article.appendChild(head);
            article.appendChild(message);

            return article;
        }

        function renderEntries(entries) {
            entriesContainer.innerHTML = "";

            if (!entries.length) {
                if (emptyState) emptyState.hidden = false;
                if (entryCount) entryCount.textContent = "0 lời chúc";
                return;
            }

            if (emptyState) emptyState.hidden = true;

            entries
                .slice()
                .sort(function (a, b) {
                    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
                })
                .forEach(function (entry) {
                    entriesContainer.appendChild(createEntryElement(entry));
                });

            if (entryCount) {
                entryCount.textContent = entries.length + " lời chúc";
            }
        }

        function setStatus(message, isError) {
            if (!status) return;
            status.textContent = message || "";
            status.classList.toggle("is-error", Boolean(isError));
        }

        function updateCounter() {
            if (!counter) return;
            counter.textContent = messageInput.value.length + " / 300";
        }

        function closeEmojiPicker() {
            if (!emojiPicker || !emojiButton) return;
            emojiPicker.classList.remove("is-visible");
            emojiPicker.setAttribute("aria-hidden", "true");
            emojiButton.setAttribute("aria-expanded", "false");
        }

        function toggleEmojiPicker() {
            if (!emojiPicker || !emojiButton) return;
            var willOpen = !emojiPicker.classList.contains("is-visible");
            emojiPicker.classList.toggle("is-visible", willOpen);
            emojiPicker.setAttribute("aria-hidden", String(!willOpen));
            emojiButton.setAttribute("aria-expanded", String(willOpen));
        }

        function insertEmoji(emoji) {
            var start = messageInput.selectionStart || messageInput.value.length;
            var end = messageInput.selectionEnd || messageInput.value.length;
            var before = messageInput.value.slice(0, start);
            var after = messageInput.value.slice(end);
            var nextValue = (before + emoji + after).slice(0, 300);

            messageInput.value = nextValue;
            messageInput.focus();

            var caret = Math.min(start + emoji.length, nextValue.length);
            messageInput.setSelectionRange(caret, caret);
            updateCounter();
        }

        async function fetchRemoteEntries() {
            if (!apiUrl) return null;

            try {
                var response = await fetch(apiUrl + (apiUrl.includes("?") ? "&" : "?") + "action=list", {
                    method: "GET",
                    cache: "no-store"
                });

                if (!response.ok) throw new Error("Không thể tải lưu bút.");

                var payload = await response.json();
                var entries = Array.isArray(payload) ? payload : payload.entries;

                if (!Array.isArray(entries)) throw new Error("Dữ liệu lưu bút không hợp lệ.");

                return entries;
            } catch (error) {
                return null;
            }
        }

        async function sendRemoteEntry(entry) {
            if (!apiUrl) return true;

            var body = new URLSearchParams();
            body.set("action", "add");
            body.set("name", entry.name);
            body.set("message", entry.message);
            body.set("timestamp", entry.timestamp);

            var response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
                },
                body: body.toString()
            });

            if (!response.ok) {
                throw new Error("Không thể đồng bộ lời chúc.");
            }

            return true;
        }

        var entries = readLocalEntries();
        renderEntries(entries);
        updateCounter();

        fetchRemoteEntries().then(function (remoteEntries) {
            if (!remoteEntries || !remoteEntries.length) return;
            entries = remoteEntries;
            writeLocalEntries(entries);
            renderEntries(entries);
        });

        messageInput.addEventListener("input", updateCounter);

        if (emojiButton) {
            emojiButton.addEventListener("click", function (event) {
                event.stopPropagation();
                toggleEmojiPicker();
            });
        }

        if (emojiPicker) {
            emojiPicker.addEventListener("click", function (event) {
                var target = event.target.closest("[data-emoji]");
                if (!target) return;
                insertEmoji(target.getAttribute("data-emoji") || "");
                closeEmojiPicker();
            });
        }

        document.addEventListener("click", function (event) {
            if (!emojiPicker || !emojiButton) return;
            if (emojiPicker.contains(event.target) || emojiButton.contains(event.target)) return;
            closeEmojiPicker();
        });

        form.addEventListener("submit", async function (event) {
            event.preventDefault();

            var name = nameInput.value.trim().replace(/\s+/g, " ");
            var message = messageInput.value.trim();

            if (name.length < 2) {
                setStatus("Vui lòng nhập tên của bạn.", true);
                nameInput.focus();
                return;
            }

            if (message.length < 3) {
                setStatus("Vui lòng nhập lời chúc dài hơn một chút.", true);
                messageInput.focus();
                return;
            }

            if (submitButton) submitButton.disabled = true;
            setStatus(apiUrl ? "Đang gửi lời chúc..." : "Đang lưu lời chúc...", false);

            var entry = {
                id: "entry-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8),
                name: name.slice(0, 50),
                message: message.slice(0, 300),
                timestamp: new Date().toISOString()
            };

            try {
                await sendRemoteEntry(entry);

                entries.unshift(entry);
                entries = entries.slice(0, 100);
                writeLocalEntries(entries);
                renderEntries(entries);

                form.reset();
                updateCounter();
                setStatus("Cảm ơn bạn! Lời chúc đã được lưu lại 💖", false);

                entriesContainer.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            } catch (error) {
                // Vẫn lưu cục bộ để khách không mất nội dung.
                entries.unshift(entry);
                entries = entries.slice(0, 100);
                writeLocalEntries(entries);
                renderEntries(entries);

                form.reset();
                updateCounter();
                setStatus("Lời chúc đã lưu trên thiết bị nhưng chưa đồng bộ được.", true);
            } finally {
                if (submitButton) submitButton.disabled = false;
            }
        });
    });
})();

(function () {
    "use strict";

    function startIntroLeaves() {
        var intro = document.getElementById("intro");
        if (!intro) return;

        var layer = document.getElementById("introLeaves");

        /* Tự tạo lớp lá nếu HTML bị thiếu. */
        if (!layer) {
            layer = document.createElement("div");
            layer.id = "introLeaves";
            layer.className = "intro-leaves";
            layer.setAttribute("aria-hidden", "true");

            var backdrop = intro.querySelector(".intro-backdrop");
            if (backdrop && backdrop.nextSibling) {
                intro.insertBefore(layer, backdrop.nextSibling);
            } else {
                intro.insertBefore(layer, intro.firstChild);
            }
        }

        layer.innerHTML = "";

        var mobile = window.matchMedia("(max-width: 576px)").matches;
        var reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        var leafCount = reducedMotion ? 6 : (mobile ? 15 : 24);
        var fragment = document.createDocumentFragment();

        function random(min, max) {
            return Math.random() * (max - min) + min;
        }

        for (var i = 0; i < leafCount; i++) {
            var leaf = document.createElement("span");
            leaf.className = "intro-leaf";

            if (i % 4 === 1) leaf.classList.add("is-gold");
            if (i % 4 === 2) leaf.classList.add("is-blush");
            if (i % 4 === 3) leaf.classList.add("is-light");

            leaf.style.setProperty(
                "--leaf-size",
                random(mobile ? 12 : 14, mobile ? 23 : 30).toFixed(1) + "px"
            );

            leaf.style.setProperty(
                "--leaf-x",
                random(-4, 98).toFixed(1) + "vw"
            );

            leaf.style.setProperty(
                "--leaf-drift",
                random(-120, 120).toFixed(0) + "px"
            );

            leaf.style.setProperty(
                "--leaf-duration",
                random(7.5, 13.5).toFixed(2) + "s"
            );

            /* Delay âm giúp lá hiện ngay khi tải trang. */
            leaf.style.setProperty(
                "--leaf-delay",
                (-random(0, 13)).toFixed(2) + "s"
            );

            leaf.style.setProperty(
                "--leaf-rotation",
                random(320, 820).toFixed(0) + "deg"
            );

            leaf.style.setProperty(
                "--leaf-opacity",
                random(.72, .96).toFixed(2)
            );

            fragment.appendChild(leaf);
        }

        layer.appendChild(fragment);
        intro.classList.add("intro-leaves-ready");
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            startIntroLeaves,
            { once: true }
        );
    } else {
        startIntroLeaves();
    }
})();
