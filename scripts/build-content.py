"""Regenerate content/playbook.html from the playbook source page.

Usage: python3 scripts/build-content.py <source-playbook.html>

Changes made to the copy (the source is only read):
  * wraps it as a standalone HTML document
  * points the videos and posters at the protected /media/ route
  * adds "Sign out" links (chapter rail and footer)
"""
import pathlib, sys

src_path = pathlib.Path(sys.argv[1])
out_path = pathlib.Path(__file__).resolve().parent.parent / "content" / "playbook.html"
page = src_path.read_text(encoding="utf-8")

def swap(text, old, new, count=1):
    found = text.count(old)
    if found != count:
        sys.exit(f"expected {count} x {old!r}, found {found}")
    return text.replace(old, new)

page = page.replace('<meta name="claude:viewport-fit-sides" content="cover">\n', "")

for name in ("welcome.mp4", "ending.mp4", "welcome-poster.jpg", "ending-poster.jpg", "sample.mp4", "sample-poster.jpg"):
    page = swap(page, f'"videos/{name}"', f'"/media/{name}"')

# bump when a cover image is replaced, so browsers don't keep showing the old one
page = swap(page, '"/media/sample-poster.jpg"', '"/media/sample-poster.jpg?v=2"')

page = swap(page, "footer{border-top:1px solid var(--line)}",
            ".signout{display:inline-block;margin-top:12px;font:700 12px/1 var(--body);letter-spacing:.12em;"
            "text-transform:uppercase;color:var(--muted);text-decoration:none}"
            ".signout:hover{color:var(--wine)}"
            ".signout-top{position:fixed;top:16px;right:20px;z-index:30;display:inline-flex;align-items:center;"
            "min-height:42px;padding:0 20px;border-radius:999px;background:var(--surface);border:1px solid var(--line);"
            "box-shadow:0 2px 10px rgba(58,14,28,.12);font:700 14px/1 var(--body);letter-spacing:.12em;"
            "text-transform:uppercase;color:var(--wine);text-decoration:none}"
            ".signout-top:hover{background:var(--wine);color:#FFFFFF;border-color:var(--wine)}"
            ".signout-bar{display:none}"
            "@media (max-width:980px){.signout-top{display:none}.signout-bar{display:inline-flex;align-items:center;"
            "min-height:44px;font:700 13px/1 var(--body);letter-spacing:.1em;text-transform:uppercase;"
            "color:var(--wine);text-decoration:none;white-space:nowrap}}"
            "\nfooter{border-top:1px solid var(--line)}")
page = swap(page,
            '<nav class="mobile-nav" aria-label="Chapters">',
            '<a class="signout-top" href="/sign-out">Sign out</a>\n<nav class="mobile-nav" aria-label="Chapters">')
page = swap(page,
            '<span class="mini" id="mini-progress">0%</span>',
            '<span class="mini" id="mini-progress">0%</span>\n    <a class="signout-bar" href="/sign-out">Sign out</a>')
page = swap(page,
            "<span>free247editor is a third-party open-source project (MIT license).</span></div></footer>",
            "<span>free247editor is a third-party open-source project (MIT license).</span>"
            '<a class="signout" style="margin-top:0" href="/sign-out">Sign out</a></div></footer>')

i = page.index("</style>") + len("</style>")
head, body = page[:i], page[i:]
doc = (
    '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
    '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
    '<meta name="robots" content="noindex,nofollow">\n'
    "<style>body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>\n"
    + head + "\n</head>\n<body>" + body.rstrip() + "\n</body>\n</html>\n"
)
out_path.write_text(doc, encoding="utf-8")
print(f"wrote {out_path} ({len(doc):,} chars)")
