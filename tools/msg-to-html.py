#!/usr/bin/env python3
"""
Extract the HTML body from an Outlook .msg file.

    python3 tools/msg-to-html.py email.msg > email.html
    node tools/parse-kdc-email.js email.html

Only needed when working from a saved .msg. If the email is forwarded
to a Gmail account, Apps Script reads the HTML body directly and this
step disappears.

Requires: pip install olefile
"""

import sys
import olefile

# MAPI property streams inside a .msg
HTML_BODY = '__substg1.0_10130102'   # PR_HTML
RTF_BODY  = '__substg1.0_10090102'   # PR_RTF_COMPRESSED (fallback, not decoded here)
SUBJECT   = '__substg1.0_0037001F'


def main():
    if len(sys.argv) < 2:
        sys.exit('Usage: python3 tools/msg-to-html.py <email.msg> > email.html')

    path = sys.argv[1]
    try:
        ole = olefile.OleFileIO(path)
    except Exception as exc:
        sys.exit(f'Not a readable .msg file: {exc}')

    streams = {'/'.join(s) for s in ole.listdir()}

    if HTML_BODY not in streams:
        sys.stderr.write(
            'No HTML body found in this .msg.\n'
            'If the message was sent as plain text or RTF only, open it in\n'
            'Outlook and use File > Save As > HTML instead.\n'
        )
        sys.exit(1)

    subject = ''
    if SUBJECT in streams:
        subject = ole.openstream(SUBJECT).read().decode('utf-16-le', errors='ignore').strip()
    if subject:
        sys.stderr.write(f'Subject: {subject}\n')

    html = ole.openstream(HTML_BODY).read().decode('utf-8', errors='ignore')
    sys.stdout.write(html)


if __name__ == '__main__':
    main()
