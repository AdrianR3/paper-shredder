# Virtual Paper Shredder
[![Netlify Status](https://api.netlify.com/api/v1/badges/f44f7b94-cd4c-4893-a174-be4636f4330d/deploy-status)](https://app.netlify.com/sites/papershredder/deploys)
<br>

> "The unnecessary website you didn't know you needed." - Wise Person

<br>

![Virtual Paper Shredder Banner](https://raw.githubusercontent.com/AdrianR3/paper-shredder/20be33a82c1038b2b7e9d2eca4806c8aedc79a22/images/virtual_paper_shredder_banner.png)

## Live Website

**See the virtual paper shredder in action: https://papershredder.netlify.app/**

<br>

## Usage

Select or drag and drop a PNG, JPG, SVG, or PDF to shred. Depending on the resolution, better shredding may be achieved by changing one of the configuration sliders. See [shredder configuration](#shredder-configuration).

## Shredder Configuration

There are 7 configuration sliders available in the main form:

| Setting             | Usage                                                                                                                 |
|---------------------|-----------------------------------------------------------------------------------------------------------------------|
| Max Objects         | The maximum number of physics interacting objects created when shredding a file.                                      |
| X/Y Spacing         | How many pixels of space in the X/Y direction between each paper shred.                                               |
| Rows                | How many rows created in the grid when shredding a file.                                                              |
| Columns             | How many columns created in the grid when shredding a file.                                                           |
| Use Realistic Scale | Overrides <kbd>Scale</kbd> setting by trying to size the shreds accurately.                                           |
| Scale               | Changes the relative size of the paper shreds. This option is disabled if <kbd>Use Realistic Scale</kbd> is selected. |

<img src="https://raw.githubusercontent.com/AdrianR3/paper-shredder/8abdbf6b71bc4e92605e210aaa47686546a56e35/images/settings.png" width="300"></img>
## Images

![Before Shredding Example](https://raw.githubusercontent.com/AdrianR3/paper-shredder/8abdbf6b71bc4e92605e210aaa47686546a56e35/images/repository-open-graph-template.png)

**turns into**

![Shredded Image Example](https://raw.githubusercontent.com/AdrianR3/paper-shredder/8abdbf6b71bc4e92605e210aaa47686546a56e35/images/shredded_github_image.png)

## Developing

Run `npm install` to install depencencies.

Run `npm run dev` to have tailwind start watching for changes.

### Building

Run `npm run build` to parse the tailwind styles once.
