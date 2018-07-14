---
title: "Speed up building a Monolithic app by skipping build steps"
---

Late Feburary of this year, I worked on improving the speed of Course Hero's frontend build process. I noted the impact of each improvement I made. I don't think the results are suprising, but I'd like to share anyways.

I'll also show how git can be leveraged to skip build steps when the input files haven't changed - this strategy can help keep build times down in a Monolithic app.

---

First, some details. At the time, it took about 12 minutes to build and deploy to our development environment. About 4.5 minutes of that time was from building a few dozen TypeScript projects.

There were a handful of obvious improvements to make - we were some major versions behind on some software central to the build process, and our Webpack projects were not using a single configuration.

For each change, I ran the build step a few times to get an average, and these are the results:

4m21s -> 1m56s (44.44% of original)

* (-1m9s) Upgrading webpack (2.6 -> 4.0), babelify (7.3 -> 8.0), and babel (6.24 -> 7.0) 
* (-34s) Consolidating webpack projects into one webpack build config 
* (-28s) Upgrading node (v6.10.0 -> v8.9.3) and yarn (v0.21.3 -> v1.3.2) 
* (-18s) Utilize docker volume to persist .yarn-cache, greatly speeding up package downloading and linking (`-v yarn-cache-monolith-<dev/prod/stage>:/usr/local/share/.cache/yarn/v1`)

However, the best improvement by far was _skipping the entire build step_. The frontend build process outputs to a folder that persists across builds, and if it can be determined that none of the input sources have changed, there is no need to build the TypeScript projects again.

Luckily, [git's internal object model](http://shafiulazam.com/gitbook/1_the_git_object_model.html) gives us exactly what we need. All of the source files for this build step are in the `js/` folder, so we just need to ask git about that folder.

```
> git ls-tree HEAD js | awk '{print $3}'
4bf1053ffb91970dcbd1425084062ef812c44ba6
```

That hash changes whenever anything under the `js/` folder changes. By simply saving this hash, we can determine if this build step can be skipped.

`js/compile-on-change`
```bash
#!/bin/bash

# this script is run from the "js/" folder
# this hash (the script argument) changes whenever anything in "js/" changes
# ./compile-on-change $(git ls-tree HEAD $PWD | awk '{print $3}')

# hash is passed in instead of calculated within script, since that is faster than
# using git in a docker container

hash=$1
echo "js/ hash: $hash"

if [ ! -d ./dist ] || [ ! -f ./hash ] || [[ $(cat ./hash) != "$hash" ]]; then
  echo "change in js/ detected - compiling frontend assets"
  
  yarn compile
  if [ $? -eq 0 ]; then
    echo $hash > ./hash
  else
    rm -f ./hash
    exit 1
  fi
else
  echo "no change in js/ detected - skipping compilation"
fi

```

Most pushs don't change any files in the `js/` folder, so this change greatly speeds up most builds. It takes about 2s to determine that the step can be skipped. So, after all these improvements, this build step takes between 0.7% and 44% of the original build time, give or take.

---

An obvious next step is to individually apply this hash checking for every TypeScript project. This requires determining if any changes occurred in a file that a project uses.

1. For each TypeScript project, determine the files that affect the output
2. Get the git hash for all these files and save to disk
3. Only build the project if there is a mismatch between the hashes on disk and the current hashes

One problem that complicates 1) is that, for a given project, there is no single folder that contains just that project's source files. Some projects import modules from other project folders. Manually keeping track of these dependencies is not a good solution - this must be automated.

Luckily, the TypeScript compiler provides a simple way to determine, given an entry point, all the files that are imported. Below is a sample implementation

`getDeps.js`
```js
/*
git ls-tree HEAD $(node getDeps.js src/dashboard/app.tsx)

This command will help generate a unique hash for a project's source files.
This can be used to check if a project needs to be recompiled.

If we can determine the source files are unchanged, we can skip compilation. As an example,
the dashboard app takes about 16 seconds to build. Determining if we can skip takes ~1-3 seconds.

> time bash -c 'git ls-tree HEAD $(node getDeps.js src/dashboard/app.tsx)'
0.8s
*/

const tsc = require('typescript')

function getTsSources(entry) {
  const options = {
    target: tsc.ScriptTarget.ES2015,
    jsx: tsc.JsxEmit.Preserve
  }

  const program = tsc.createProgram([entry], options)
  return program.getSourceFiles().filter(source => {
    const path = source.path
    return path.indexOf('node_modules') === -1 && path.indexOf('vendor') === -1
  }).map(source => source.path)
}

const deps = getTsSources(process.argv[2])

// changes in any of these files should rebuild everything
deps.push.apply(deps, [
  'yarn.lock',
  'package.json',
  'tsconfig.json',
  '.babelrc',
  'bower.json',
  'build/gulpfile.common.js',
  'build/shim.js'
])

console.log(deps.join("\n"))
```

Some files will trigger a rebuild for everything. For example, if `yarn.lock` changes, every project should rebuild.

example output from `git ls-tree HEAD $(node getDeps.js src/dashboard/app.tsx)` (filenames obfuscated):

```
100644 blob 8b379cdaf6d1eb9507b6ff4c46b75fb9fc612b69  .babelrc
100644 blob 4fd5eea6090476313cb2efebaa14c4ac23ec1e9c  bower.json
100644 blob 01b7ae4e7fbf8a30d460d617ccb1a2f95c36698d  build/gulpfile.common.js
100644 blob 197c437fa90f8f83cae9bd0c0d39880d19c16058  build/shim.js
100644 blob 2348e843f17ac18a11b6959f69a02bb3a5f70b56  package.json
100644 blob a8b7a3768dadec2e9b9caf75790220a11c1549a2  src/common/***.ts
.
.
.
100644 blob 165dd8ed955284685c3cd294b7924ad45cb01e81  src/user/store/model/***.ts
100644 blob 84dc7f9ffc788b1023c4c59e2b006166fd64222d  src/user/store/model/***.ts
100644 blob 6319765c2d88bc95a2227778ff338238ec8898d9  src/user/store/***.ts
100644 blob d86a154b7e3d2154ad5205c5a050b277b7d0ec5f  src/utils/***.ts
100644 blob c84a271666d50e5a948ae63979e7b99056af0e8e  src/utils/service/***.ts
100644 blob 9787db21be335b63cd85553f4e96cb4c07e27e03  src/utils/service/***.ts
100644 blob cc5574da824e0e3eff2e0d338e13be2e3a560407  src/utils/service/***.ts
100644 blob 4b5081da4b8af80a3b6f066e1d586f796eeb0c06  src/utils/service/***.ts
100644 blob d3af339a37eba53ade1b634e51c4a89908dae2c4  tsconfig.json
100644 blob 114bd1231b4464fb0023c9083f9f43a8f3637c10  yarn.lock
```

You could optionally `md5` the result. This output can be used to determine if the TypeScript project needs to be built at all. Course Hero's build process isn't doing this yet, but the next time we wish to increase build times, this should result in a good win.
