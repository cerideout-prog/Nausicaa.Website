# Nausicaa — logo assets

## Which file to use

| Need | File |
| --- | --- |
| Website (inline, inherits colour) | `nausicaa-mark-currentcolor.svg` |
| Anything print or vector | `nausicaa-mark-navy.svg` |
| On navy or any dark ground | `nausicaa-mark-reversed.svg` |
| One-colour print, stamps, signage, embroidery | `nausicaa-mark-black.svg` |
| Browser tab | `favicon.svg`, with `png/favicon-32.png` as fallback |
| Mark + name + tagline | `nausicaa-lockup-horizontal.svg` |
| Narrow spaces, cards, stamps | `nausicaa-lockup-stacked.svg` |
| Third-party platform that wants a raster upload | `png/` |

Prefer SVG everywhere it is accepted. The PNGs exist only for places that
refuse vector files.

## PNG set

All transparent unless noted.

```
png/nausicaa-mark-navy-{256,512,1024,2048}.png    #14243C, transparent
png/nausicaa-mark-white-{256,512,1024,2048}.png   #FFFFFF, transparent
png/nausicaa-mark-black-{256,512,1024,2048}.png   #000000, transparent
png/favicon-{16,32,48,180,192,512}.png            navy on paper ground
png/app-icon-1024-navy.png                        paper mark on navy
png/app-icon-1024-paper.png                       navy mark on paper
png/avatar-800-navy.png                           social profile picture
```

Sizes 16–48 use the heavier favicon stroke so the counter of the N stays open;
everything 180 and above uses the standard weight.

## Lockups and the font

The lockup SVGs set the wordmark as live text in **Jost**. They render correctly
anywhere Jost is available (the website, any machine with it installed). For a
platform that can't load the font, use a mark PNG or SVG and set the name in
HTML text instead. If you need a font-independent lockup file, have the wordmark
converted to outlines once and keep that as the locked master.

## Embroidery and one-colour marking

Supply `nausicaa-mark-black.svg` to the digitiser or engraver. Single colour,
satin stitch on the ring and the N, 12&nbsp;mm minimum diameter. No fill, no
second colour, no outline around the stroke.

## Colour

Navy `#14243C`, paper `#F7F5F0`. One-colour reproduction is 100% black or 100%
white — never a tint of navy. If the live site uses a different blue, that hex
replaces navy in every asset here.
