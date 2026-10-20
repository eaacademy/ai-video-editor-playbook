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

for name in ("welcome.mp4", "ending.mp4", "welcome-poster.jpg", "ending-poster.jpg"):
    page = swap(page, f'"videos/{name}"', f'"/media/{name}"')

page = swap(page, "footer{border-top:1px solid var(--line)}",
            ".signout{display:inline-block;margin-top:12px;font:700 12px/1 var(--body);letter-spacing:.12em;"
            "text-transform:uppercase;color:var(--muted);text-decoration:none}"
            ".signout:hover{color:var(--wine)}\nfooter{border-top:1px solid var(--line)}")
page = swap(page,
            "<small>Tick the checkpoints as you go. Your progress is saved in this browser.</small>\n    </div>",
            "<small>Tick the checkpoints as you go. Your progress is saved in this browser.</small>\n"
            '      <a class="signout" href="/sign-out">Sign out</a>\n    </div>')
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
