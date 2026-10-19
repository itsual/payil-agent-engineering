# Licensing

Payil uses two licenses, one for the software and one for the learning material.

| What | License | File |
|---|---|---|
| **Code**: the app, tests, scripts, styles, build configuration, workflows and the logo mark | [MIT](https://opensource.org/license/mit) | [`LICENSE`](LICENSE) |
| **Lessons and documentation**: the curriculum, quizzes, glossary, Mermaid diagrams, docs and screenshots | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) | [`LICENSE-CONTENT.txt`](LICENSE-CONTENT.txt) |

## Which files are "content" (CC BY 4.0)

- `src/data/stages.json`, `src/data/glossary.json`, `src/data/roadmap.mmd` and `src/data/workflows/*.mmd`
- everything under `content/` (lab manifests, lab and example write-ups)
- everything under `docs/`, including `docs/screenshots/`
- `public/og-image.png`

**Everything else is code (MIT).** That includes `README.md` and `CONTRIBUTING.md`, which are repository documentation.

## Using the lessons (CC BY 4.0)

You may copy, adapt, translate and redistribute the lessons, including commercially, as long as you **give credit**, link to the
license, and say whether you changed anything. A suitable credit line:

> Lessons from *Payil (பயில்)* by Arockia Liborious, licensed under
> [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Source: https://github.com/itsual/payil-agent-engineering

The references the lessons link to are third-party documentation under their own terms and are not covered by this license.

## Using the code (MIT)

Keep the copyright and permission notice from [`LICENSE`](LICENSE) in copies or substantial portions of the code.
(`LICENSE` is deliberately the unmodified MIT text so tools such as GitHub recognise it. This file explains the split.)

## Third-party material

The site bundles fonts and libraries that keep their own licenses:

- **Fonts**: Inter, Manrope and Noto Sans Tamil, under the SIL Open Font License 1.1.
- **Libraries**: React and React DOM (MIT), Mermaid (MIT), Lucide icons (ISC, with portions MIT).

The deployed site serves the required notices at [`THIRD-PARTY-NOTICES.txt`](public/THIRD-PARTY-NOTICES.txt) (linked from the
footer). Transitive development and build dependencies are listed with their licenses in `package-lock.json`.

## Contributing

By contributing, you agree that your contribution is licensed under the same terms as the file it changes: MIT for code, CC BY 4.0
for content. Please only submit material you have the right to license, and do not include other people's text, figures or
diagrams without permission.
