---
layout: post
title: "Porting Zelda Classic to the Web"
date: 2022-04-29
---

<style>
  .captioned-image {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 25px 0;
  }
  .captioned-image img {
    /* width: 50%; */
  }
  .captioned-image span {
    text-align: center;
  }

  .sticky {
    position: sticky;
    top: 0;
    font-size: 1.17em;
    font-weight: bold;
    z-index: 2;
  }
</style>
<script>
  const stickyEl = document.createElement('div');
  stickyEl.classList.add('sticky');
  document.querySelector('article').append(stickyEl);
  function updateSticky() {
    if (window.innerWidth < 900) {
      stickyEl.hidden = true;
      return;
    }
    stickyEl.hidden = false;

    const elements = [...document.querySelectorAll('h1, h2, h3')];
    const closest = elements.reduce((acc, cur) => {
      if (document.documentElement.scrollTop - cur.offsetTop + 70 < 0) return acc;
      return document.documentElement.scrollTop - cur.offsetTop > document.documentElement.scrollTop - acc.offsetTop ? acc : cur;
    });
    stickyEl.hidden = closest === elements[0];
    stickyEl.textContent = closest.textContent;
  }
  document.addEventListener('scroll', updateSticky);
  document.addEventListener('hashchange', updateSticky);
</script>

<div class="captioned-image">
  <img src="/images/zc/Mitchfork.png" alt="">
  <span>Mitchfork's winning screenshot from the <a href="https://www.purezc.net/forums/index.php?showtopic=77409" target="_blank">2021 Screenshot of the Year contest</a></span>
</div>

<!-- Excerpt Start -->

I ported Zelda Classic to the web. You can play it [here](https://hoten.cc/zc/play/)–grab a gamepad if you have one!

It's a PWA, so you can also install it.

<!-- Excerpt End -->

I've written some <a href="#zelda-classic">background information</a> on Zelda Classic, and chronicled <a href="#porting-zelda-classic-to-the-web">the technical process</a> of porting a large C++ codebase to the web using WebAssembly.

 ${toc}

# Zelda Classic

<a href="https://hoten.cc/zc/create/?quest=classic/1st.qst&map=0&screen=119" target="_blank">
  <div class="captioned-image">
    <img style="max-width: min(700px, 100%)" src="/images/zc/editor.png" alt="ZQuest editor opened to the starting screen of the original Zelda">
    <span>ZQuest, the Zelda Classic quest editor</span>
  </div>
</a>

[Zelda Classic](https://www.zeldaclassic.com/) is a 20+ year old game engine originally made to recreate and modify the original Legend of Zelda. The engine grew to support far more features than what was necessary to create the original game, and today there are [over 600](https://www.purezc.net/index.php?page=quests&sort=rating) custom games - the community calls them quests.

Many are spiritual successors to the original, perhaps with improved graphics, but very recognizable as a Zelda game. They range in complexity, quality and length. Fair warning, some are just awful, so be discerning and use the rating to guide you.

If you are a fan of the original 2D Zelda games, I believe you'll find many Zelda Classic quests to be well worth your time. Some are 20+ hour games with expansive overworlds and engaging, unique dungeons. The engine today supports scripting, and many have used that to push it to the limits: it's almost impossible to believe that some quests implemented character classes, online networking, or achievements in an engine meant to create the original Zelda.

However, the most recent version of Zelda Classic only supports Windows... until now!

## On the Web

I spent the last two months (roughly ~150 hours) porting Zelda Classic to run in a web browser.

There's a lot of quests to choose from, but here's just a small sampling!

<style>
.grid-col2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  align-items: baseline;
}
@media only screen and (max-width: 768px) {
  .grid-col2 {
    display: block;
  }
}
</style>

<div class="grid-col2">

<a href="https://hoten.cc/zc/play/?quest=bs3.1/NewBS+3.1+-+1st+Quest.qst" target="_blank">
  <div class="captioned-image">
    <img src="https://hoten.cc/quest-maker/play/zc_quests/bs3.1/image1.png" alt="" width="100%">
    <span>BS Zelda 1st Quest</span>
  </div>
</a>

<a href="https://hoten.cc/zc/play/?quest=373/Quest.qst" target="_blank">
  <div class="captioned-image">
    <img src="/images/zc/hookshot-title.png" alt="" width="100%">
    <span>Link's Quest for the Hookshot 2</span>
  </div>
</a>

<a href="https://hoten.cc/zc/play/?quest=139/HeroOfDreams.qst" target="_blank">
  <div class="captioned-image">
    <img src="/images/zc/hod.gif" alt="" width="100%">
    <span>Hero of Dreams</span>
  </div>
</a>

<a href="https://hoten.cc/zc/play/?quest=731/GoGollab_1_FunnyEdition.qst" target="_blank">
  <div class="captioned-image">
    <img src="/images/zc/gollab.png" alt="" width="100%">
    <span>Go Gollab: The Conflictions of Morality</span>
  </div>
</a>

<a href="https://hoten.cc/zc/play/?quest=751/LoL+New+Legacy.qst" target="_blank">
  <div class="captioned-image">
    <img src="/images/zc/new-legacy.png" alt="" width="100%">
    <span>Legend of Link: The New Legacy</span>
  </div>
</a>

<a href="https://hoten.cc/zc/play/?quest=152/cashaunt2.qst" target="_blank">
  <div class="captioned-image">
    <img src="https://hoten.cc/quest-maker/play/zc_quests/152/image0.gif" alt="" width="100%">
    <span>Castle Haunt II</span>
  </div>
</a>

</div>

I hope my efforts result in Zelda Classic reaching a larger audience. It's been challenging work, far outside my comfort zone of web development, and I've learned a lot about WebAssembly, CMake and multithreading. Along the way, I discovered bugs across multiple projects and did due diligence in fixing (or just reporting) them when I could, and even proposed a <a href="https://github.com/whatwg/html/issues/7838" target="_blank">change to the HTML spec</a>.

# Porting Zelda Classic to the Web

The rest of this article is an overview of the technical process of porting Zelda Classic to the web.

> If you're interested in the minutia, I've made [my daily notes](https://docs.google.com/document/d/1tOI1k9nSWDxmHXoW-yy4fk3_7AbS6vCk3UUG2iCwS_g) available. This was the first time I kept notes like this, and I found the process improved my working memory significantly... and it definitely helped me write this article.

## Getting it working

### Emscripten

[Emscripten](https://emscripten.org/) is a compiler toolchain for building C/C++ to WebAssembly. The very TL;DR of how it works is that it uses `clang` to transform the resultant LLVM bytecode to Wasm. It's not enough to just compile code to Wasm–Emscripten also provides Unix runtime capabilities by implementing them with JavaScript/Web APIs (ex: implementations for most syscalls; an in-memory or IndexedDB-backed filesystem; pthreads support via Web Workers). Because many C/C++ projects are built with Make and CMake, Emscripten also provides tooling for interoping with those tools: `emmake` and `emcmake`. For the most part, if a C/C++ program is portable, it can be built with Emscripten and run in a browser, although you'll like have to make changes to [accommodate the browser main loop](https://emscripten.org/docs/porting/emscripten-runtime-environment.html#emscripten-runtime-environment).

> If you are developing a Wasm application, the Chrome DevTools DWARF extension is essential. See [this article](https://developer.chrome.com/blog/wasm-debugging-2020/) for how to use it. When it works, it's excellent. You may need to drop any optimization for best results. Even with no optimization pass, I often ran into cases where some frames of the call stacktrace were obviously wrong, so I sometimes had to resort to printf-style debugging.

### Starting off

Zelda Classic is written in C++ and uses Allegro, a low-level cross platform library for window management, drawing to the screen, playing sounds, etc. Well, it actually uses Allegro 4, released circa 2007. Allegro 4 does not readily compile with Emscripten, but Allegro 5 does. The two versions are vastly different but fortunately there is an adapter library called Allegro Legacy which allows an Allegro 4 application to be built using Allegro 5.

So that's the first hurdle–Zelda Classic needs to be ported to Allegro 5, and its CMakeLists.txt needs to be modified to build allegro from source.

> Allegro 5 is able to support building with Emscripten because it can use [SDL](https://github.com/libsdl-org/SDL) as its backend, which Emscripten supports well.

Before working on any of that directly, I needed to address my lack of knowledge of CMake and Allegro.

### Learning CMake, Allegro, and Emscripten

Allegro claims to support Emscripten, but I wanted to confirm it for myself. Luckily they provided some [instructions](https://github.com/liballeg/allegro5/blob/master/README_sdl.txt#L30) on how to build with Emscripten. My first PRs were to Allegro to improve this documentation.

> I wasted a few hours here because of an [unfortunate difference](https://github.com/liballeg/allegro5/pull/1319) between bash and zsh.

Next I found an interesting example program showcasing palette swapping–encoding a bitmap as indices into an arbitrary set of colors, which can be swapped out at runtime. But, it didn't work when built with Emscripten. To get a little practice with Allegro, I worked on improving this example.

The fragment shader:

```glsl
uniform sampler2D al_tex;
uniform vec3 pal[256];
varying vec4 varying_color;
varying vec2 varying_texcoord;
void main()
{
  vec4 c = texture2D(al_tex, varying_texcoord);
  int index = int(c.r * 255.0);
  if (index != 0) {
    gl_FragColor = vec4(pal[index], 1);
  }
  else {
    gl_FragColor = vec4(0, 0, 0, 0);
  };
}
```

Allegro passes a bitmap's texture to the shader as `al_tex`, and in this program that bitmap is just a bunch of numbers 0-255. Attached to the shader as an input is a palette of colors `pal`, and at runtime the program swaps out the palette, changing the colors rendered by the shader. There were two things wrong here that results in this shader not working in WebGL:

1. It lacks a precision declaration. In WebGL, this is not optional. Very simple fix–just add `precision mediump float;`
2. It uses a non-constant expression to index an array. WebGL does not support that, so the entire shader needed to be redesigned. This was more involved, so I'll just link to the [PR](https://github.com/liballeg/allegro5/pull/1318)

The resulting program is hosted [here](https://tedious-porter.surge.sh/ex_palette.html).

> It turned out that none of this knowledge of how to do palette swapping in Allegro 5 would be necessary for upgrading Zelda Classic's Allegro, although
  initially I thought it might. Still, it was a nice introduction to the library.

Next I wanted to write a simple `CMakeLists.txt` that I could wrap my head around, one that builds Allegro from source and also supports building with Emscripten.

> Emscripten supports building projects configured with CMake via [`emcmake`](https://github.com/Emscripten-core/Emscripten/blob/main/emcmake.py), which is a small program that configures an Emscripten CMake [toolchain](https://github.com/Emscripten-core/Emscripten/blob/main/cmake/Modules/Platform/Emscripten.cmake). Essentially, running `emcmake cmake <path/to/source>` configures the build to use `emcc` as the compiler.

I spent some time reading many tutorials on CMake, going through real-world `CMakeLists.txt` and trying to understand it all line-by-line. The CMake [documentation](https://cmake.org/cmake/help/latest/) was excellent during this process. Eventually, I ended up with this:

[`https://github.com/connorjclark/allegro-project/blob/main/CMakeLists.txt`](https://github.com/connorjclark/allegro-project/blob/main/CMakeLists.txt)
```cmake
cmake_minimum_required(VERSION 3.5)
project (AllegroProject)
include(FetchContent)

FetchContent_Declare(
  allegro5
  GIT_REPOSITORY https://github.com/liballeg/allegro5.git
  GIT_TAG        5.2.7.0
)
FetchContent_GetProperties(allegro5)
if(NOT allegro5_POPULATED)
  FetchContent_Populate(allegro5)
	if (MSVC)
		set(SHARED ON)
	else()
		set(SHARED OFF)
	endif()
	set(WANT_TESTS OFF)
	set(WANT_EXAMPLES OFF)
	set(WANT_DEMO OFF)
  add_subdirectory(${allegro5_SOURCE_DIR} ${allegro5_BINARY_DIR} EXCLUDE_FROM_ALL)
endif()

add_executable(al_example src/main.c)
target_include_directories(al_example PUBLIC ${allegro5_SOURCE_DIR}/include)
target_include_directories(al_example PUBLIC ${allegro5_BINARY_DIR}/include)
target_link_libraries(al_example LINK_PUBLIC allegro allegro_main allegro_font allegro_primitives)

# These include files are typically copied into the correct places via allegro's install
# target, but we do it manually.
file(COPY ${allegro5_SOURCE_DIR}/addons/font/allegro5/allegro_font.h
	DESTINATION ${allegro5_SOURCE_DIR}/include/allegro5
)
file(COPY ${allegro5_SOURCE_DIR}/addons/primitives/allegro5/allegro_primitives.h
	DESTINATION ${allegro5_SOURCE_DIR}/include/allegro5
)
```

> This could have been simpler, but Allegro's `CMakeLists.txt` requires a [few modifications](https://github.com/liballeg/allegro5/issues/1328) for it to be easily consumed as a dependency.

Initally I tried using CMake's [`ExternalProject`](https://cmake.org/cmake/help/latest/module/ExternalProject.html) instead of [`FetchContent`](https://cmake.org/cmake/help/latest/module/FetchContent.html), but the former was problematic with Emscripten because it runs `cmake` under the hood, and it seemed like it was not aware of the toolchain that `emcmake` provides. I don't know why I couldn't get it to work, but I know `FetchContent` is the newer of the two and I had better luck with it.

### Allegro Legacy

Allegro 4 and 5 can be considered entirely different libraries:

- literally every API was rewritten, and not in a 1:1 way
- A4 uses polling for events while A5 uses event queues / loops
- A4 only supports software rendering, and directly supports palettes (which ZC makes heavy use of); while A5 supports shaders / GPU-accelerated rendering (but dropped palette manipulation)
- And most importantly for my concerns, only A5 can be compiled with Emscripten (trivially, because of its SDL support)

Replacing calls to A4's API with A5 essentially means a rewrite, and given the size of Zelda Classic that was not an option. Fortunately, this is where [Allegro Legacy](https://github.com/NewCreature/Allegro-Legacy) steps in.

To support multiple platforms, Allegro abstracts anything OS-specific to a "system driver". There is one for each supported platform that implements low-level operations like filesystem access, window management, etc. Allegro Legacy bridges the gap between A4 and A5 by creating a system driver _that uses A5_ to implement A4's system interfaces. In other words, Allegro Legacy is just A4 with A5 as its driver. All the files in [`src`](https://github.com/NewCreature/Allegro-Legacy/tree/master/src) are just A4 (with a few modifications), except for the `a5` folder which provides the A5 implementation.

This is the entire architecture of running Zelda Classic in a browser:

<div class="captioned-image">
  <img style="max-width: min(700px, 100%)" src="/images/zc/ascii-arch.png" alt="ASCII diagram of Zelda Classic running on the web">
  <span>🐢 I've fixed/worked-around bugs in every layer of this.</span>
</div>

I used my newly wrangled working knowledge of CMake to configure Zelda Classic's `CMakeLists.txt` to build Allegro 5 & Allegro Legacy from source. Allegro Legacy was very nearly a drop-in replacement. I struggled initially with an "unresolved symbol" linker error, for a function I was certain was being included in the compilation, but this turned out to be a simple [oversight](https://github.com/NewCreature/Allegro-Legacy/pull/23) in a header file. Not really being a C/C++ guy this took me _way_ too long to debug!

Once things actually linked and compilation was successful, Allegro Legacy _just worked_, although I fixed some minor bugs related to [sticky mouse input](https://github.com/NewCreature/Allegro-Legacy/pull/21) and [file paths](https://github.com/NewCreature/Allegro-Legacy/pull/24).

> I sent a [PR for upgrading to Allegro 5](https://github.com/ArmageddonGames/ZeldaClassic/pull/774) to the Zelda Classic repro, but I expect it will remain unmerged until a future major release.

### Starting to build Zelda Classic with Emscripten

Even though Zelda Classic was now on A5 and building it from source, there were still a few pre-built libraries being used for music. I didn't want to deal with this yet, so to start I stubbed out the music layer with dummy functions so everything would still link with Emscripten.

`zcmusic_fake.cpp`
```cpp
#include <stddef.h>
#include "zcmusic.h"

int32_t zcmusic_bufsz = 64;

bool zcmusic_init(int32_t flags) { return false; }
bool zcmusic_poll(int32_t flags) { return false; }
void zcmusic_exit() {}

ZCMUSIC const *zcmusic_load_file(char *filename) { return NULL; }
ZCMUSIC const *zcmusic_load_file_ex(char *filename) { return NULL; }
bool zcmusic_play(ZCMUSIC *zcm, int32_t vol) { return false; }
bool zcmusic_pause(ZCMUSIC *zcm, int32_t pause) { return false; }
bool zcmusic_stop(ZCMUSIC *zcm) { return false; }
void zcmusic_unload_file(ZCMUSIC *&zcm) {}
int32_t zcmusic_get_tracks(ZCMUSIC *zcm) { return 0; }
int32_t zcmusic_change_track(ZCMUSIC *zcm, int32_t tracknum) { return 0; }
int32_t zcmusic_get_curpos(ZCMUSIC *zcm) { return 0; }
void zcmusic_set_curpos(ZCMUSIC *zcm, int32_t value) {}
void zcmusic_set_speed(ZCMUSIC *zcm, int32_t value) {}
```

Zelda Classic reads various configuration files from disk, including data files containing large things like MIDIs. Emscripten can package such data alongside Wasm deployments via the [`--preload-data`](https://emscripten.org/docs/porting/files/packaging_files.html) flag. These files can be pretty large (`zc.data` is ~9 MB), so a long-term caching strategy is best: `--use-preload-cache` is a nice Emscripten feature that will cache this file in IndexedDB. However, the key it uses is unique to every build, so any deployment invalidates the cache of all users. That's no good, but there's a quick hack to make the hash content-based instead:

```bash
# See https://github.com/emscripten-core/emscripten/issues/11952
HASH=$(shasum -a 256 module.data | awk '{print $1}')
sed -i -e "s/\"package_uuid\": \"[^\"]*\"/\"package_uuid\":\"$HASH\"/" module.data.js
if ! grep -q "$HASH" module.data.js
then
  echo "failed to replace data hash"
  exit 1
fi
```

> I also sent a [PR to Emscripten](https://github.com/emscripten-core/emscripten/pull/16807) to fix the above

### Let there be threads

As soon as I got Zelda Classic building with Emscripten and running in a browser, I'm faced with a page that does nothing but busy-hangs the main thread. Pausing in DevTools shows the problem:

```cpp
static BITMAP * a5_display_init(int w, int h, int vw, int vh, int color_depth)
{
    BITMAP * bp;
    ALLEGRO_STATE old_state;
    int pixel_format;

    _a5_new_display_flags = al_get_new_display_flags();
    _a5_new_bitmap_flags = al_get_new_bitmap_flags();
    al_identity_transform(&_a5_transform);
    bp = create_bitmap(w, h);
    if(bp)
    {
      if(!_a5_disable_threaded_display)
      {
        _a5_display_creation_done = 0;
        _a5_display_width = w;
        _a5_display_height = h;
        _a5_screen_thread = al_create_thread(_a5_display_thread, NULL);
        al_start_thread(_a5_screen_thread);
        while(!_a5_display_creation_done); // <<<<<<<<<<<<<<<<<< Hanging here!
      }
      else
      {
        if(!_a5_setup_screen(w, h))
        {
          return NULL;
        }
      }
      gfx_driver->w = bp->w;
      gfx_driver->h = bp->h;
      return bp;
    }
    return NULL;
}
```

> The busy-wait while loop pattern is problematic because it spins the CPU and wastes cycles. However, in this case it's actually pretty OK because the initialization code is expected to finish quickly. In general, a [condition variable](https://www.ibm.com/docs/en/aix/7.1?topic=programming-using-condition-variables) is preferred to allow the thread to sleep until the state it cares about changes.

Emscripten can build multithreaded applications that work on the web by using Web Workers and `SharedArrayBuffer`, but by default it will not build with thread support, so everything happens on the main thread.

> For a deep dive on threads in Wasm, read [this](https://web.dev/webassembly-threads/)

> `SharedArrayBuffer` requires special response headers to be set, even for localhost. The simplest way to do this is to use Paul Irish's [`stattik`](https://github.com/paulirish/statikk): just run `npx statikk --port 8000 --coi`

In the above case, a thread is created which is expected to instantly set `_a5_display_creation_done`, but due to the lack of threads that never happens so the main thread is left hanging forever.

Clearly, I needed to enable [`pthread`](https://emscripten.org/docs/porting/pthreads.html) support.

I figured it'd be best to also enable `PROXY_TO_PTHREAD`, which moves the main application thread into a pthread AKA web worker (instead of the main browser thread), but that was a dead-end due to [various](https://github.com/emscripten-core/emscripten/issues/16492) [unexpected](https://github.com/libsdl-org/SDL/issues/5260) issues with SDL which means it does not support this setting.

> I got [close](https://github.com/emscripten-core/emscripten/issues/6009#issuecomment-1096131889) to getting `PROXY_TO_PTHREAD` to work, but not close enough.

In lieu of this, I had to add `rest(0)` to many places where Zelda Classic busy waits on the main application thread, otherwise Emscripten's [`ASYNCIFY`](https://web.dev/asyncify/) feature has no opportunity to yield the main thread back to the browser, resulting in the page hanging. For example, this code is problematic to run on the main thread:

```cpp
do
{
}
while(gui_mouse_b());
```

because mouse input can only be registered when the main browser thread is in control. Hence, a `rest(0)` fixes the hang by yielding back to the browser via `ASYNCIFY`:

```cpp
do
{
  // ASYNCIFY will save the stack, yield to the browser
  // (processing any user input or rendering), then restore
  // the stack and continue on.
  rest(0);
}
while(gui_mouse_b());
```

### Of mutexes and deadlocks

The most difficult problem I ran into during this entire project was debugging a deadlock. It took a few days of getting nowhere, logging when a lock was acquired/released and by what thread (big waste of time!)

Eventually I realized I should stop trying to debug the large mess of a program in front of me and try to build up a reproduction of the issue from scratch.

SDL provides an interface for mutexes that, on Unix, uses `pthread`. Apparently, some platforms do not support recursive mutexes - that is, allowing a thread to lock the same mutex multiple times, only releasing the lock when it matches with an equal number of unlocks. To support platforms without this functionality, SDL fakes it.

[`SDL_sysmutex.c`](https://github.com/libsdl-org/SDL/blob/c36bd78474c962119db2f5161be6b0d4f07d535e/src/thread/pthread/SDL_sysmutex.c#L91)
```cpp
/* Lock the mutex */
int
SDL_LockMutex(SDL_mutex * mutex)
{
#if FAKE_RECURSIVE_MUTEX
    pthread_t this_thread;
#endif

    if (mutex == NULL) {
        return SDL_InvalidParamError("mutex");
    }

#if FAKE_RECURSIVE_MUTEX
    this_thread = pthread_self();
    if (mutex->owner == this_thread) {
        ++mutex->recursive;
    } else {
        /* The order of operations is important.
           We set the locking thread id after we obtain the lock
           so unlocks from other threads will fail.
         */
        if (pthread_mutex_lock(&mutex->id) == 0) {
            mutex->owner = this_thread;
            mutex->recursive = 0;
        } else {
            return SDL_SetError("pthread_mutex_lock() failed");
        }
    }
#else
    if (pthread_mutex_lock(&mutex->id) != 0) {
        return SDL_SetError("pthread_mutex_lock() failed");
    }
#endif
    return 0;
}
```

Once I realized that the deadlock did not happen when condition variables were not used, I was able to create a small reproduction that resulted in a deadlock via Emscripten
but not when building for Mac. I reported the [bug](https://github.com/libsdl-org/SDL/issues/5428) to SDL, and even proposed a [patch](https://github.com/libsdl-org/SDL/pull/5479) to improve the fake recursive mutex code,
(at least, it fixed my deadlock) but it turns out that mixing condtion variables and recursive mutexes is a [very bad idea](https://pubs.opengroup.org/onlinepubs/9699919799/functions/pthread_mutexattr_settype.html#:~:text=It%20is%20advised%20that%20an%20application%20should%20not%20use), and in general is [impossible](https://github.com/libsdl-org/SDL/pull/5479#issuecomment-1090221325) to get right.

Eventually I realized it was odd that Emscripten doesn't support recursive mutexes. And sure enough, after writing a quick sample program, I determined [it actually does support them](https://github.com/libsdl-org/SDL/pull/5479#issuecomment-1089790046). Turns out the problem was in SDL's header configuration for Emscripten [not specifiying](https://github.com/libsdl-org/SDL/pull/5496) that recursive mutexes are supported.

## Getting it fully functional

### Playing MIDI with Timidity

Zelda Classic `.qst` files contain MIDIs, but browsers can't directly play MIDI files. In order to synthesize audio from a MIDI file you need:

- a sound sample database
- code to interpret the various MIDI commands, such as turning notes on and off

Emscripten supports various audio formats with [`SDL_mixer`](https://emscripten.org/docs/getting_started/FAQ.html#what-are-my-options-for-audio-playback), configured via [`SDL2_MIXER_FORMATS`](https://emsettings.surma.technology/#SDL2_MIXER_FORMATS). However, there was no support for MIDI. Luckily `SDL_mixer` already supports MIDI playback (it uses [Timidity](https://github.com/SDL-mirror/SDL_mixer/tree/master/src/codecs/timidity#readme)). It was [straightfoward to configure the Emscripten port system](https://github.com/emscripten-core/emscripten/pull/16556) to include Timidity support when requested.

As for the sound samples, I just grabbed some free ones called [freepats](https://www.npmjs.com/package/freepats). Initially I added them to the Wasm preload datafile, but it's actually pretty large at 30+ MB so a better solution is to load the individual samples from the network as requested. I knew of a Timidity [fork](https://github.com/feross/timidity) that did just that, so I studied how it worked there. When a MIDI file loads, that fork checks all the instruments a song will use and [logs which ones are missing](https://github.com/feross/timidity/commit/d1790eef24ff3b4067c536e45aa88c0863ad9676#diff-6ff6417493baaa56336d5c73f273ea180db9c16c2f4a37adf4f5abc380ffc6ccR207). Then the JS code checks that log, fetches the missing ones, and reloads the data. I basically did the same, but all within Timidity/`EM_JS`.

These fetches freeze the game (but not the browser main thread!) until they complete, which isn't too bad when starting a quest but can be especially jarring when reaching a new area that plays a song with new MIDI instruments. To make this a bit more bearable, I wrote a [`fetchWithProgress`](https://gist.github.com/connorjclark/6afb9fb588331a23a2d8fa57cfefe8f5) function to display a progress bar in the page header.

> While freepats is nice (free, small, and good quality), it is [missing many instruments](https://freepats.zenvoid.org/SoundSets/general-midi.html#FreePatsGM). I found some [90s-era GUS sound files](https://www.doomworld.com/idgames/music/dgguspat) on a DOOM modding site to fill the gaps. There's a comment on that page suggesting the PPL160 is even better quality, so I [located](https://github.com/chocolate-doom/chocolate-doom/issues/878) those too. I'm not too happy with the result of [meshing](https://github.com/connorjclark/ZeldaClassic/blob/wasm-web/timidity/make-cfg.js) these various instruments together. I'm sure this could be improved, but at least no MIDI files will have missing instruments.

### Music working, but no SFX?

Zelda Classic uses different output channels for music and SFX, which is pretty common in games. Especially because you may wish to sample the two at different rates, which means they can't use the same output channel. Music is typically sampled at a higher rate for quality purposes, which takes more processing time but that's OK because it is ok to buffer–latency isn't such a big deal, unless you're syncing music to video or something. SFX is typically sampled at a lower rate, because there is more urgency to play a sound effect in reaction to gameplay.

With MIDI support included, music was now playing on the title screen, but no SFX was playing. I compiled the Allegro sound example [`ex_saw`](https://allegro5.org/examples/examples/ex_saw.html), which I knew already worked with Emscripten because the hosted example Wasm worked. However, building locally nothing would play, so I had another bug in Allegro to fix.

I added some printf'ing to `SDL_SetError` and noticed that when Allegro called `SDL_Init(SDL_INIT_EVERYTHING)`, it would error with `"SDL not built with haptic support"` ... and then SDL would proceed to tear everything down! SDL failed to setup the haptic subsystem because it does not provide an Emscripten implementation for it. And since Allegro initialized SDL by requesting everything, SDL could not comply. That doesn't explain why it was working before but isn't today–to explain that, I `git blame`'d the `SDL_Init` function and saw that a change was made recently to shutdown everything if any subsystem errors. Mystery solved, and I sent a [PR](https://github.com/liballeg/allegro5/pull/1322) to Allegro to fix it.

```cpp
diff --git a/src/sdl/sdl_system.c b/src/sdl/sdl_system.c
--- a/src/sdl/sdl_system.c
+++ b/src/sdl/sdl_system.c
 static ALLEGRO_SYSTEM *sdl_initialize(int flags)
-   SDL_Init(SDL_INIT_EVERYTHING);
+   unsigned int sdl_flags = SDL_INIT_EVERYTHING;
+#ifdef __EMSCRIPTEN__
+   // SDL currently does not support haptic feedback for emscripten.
+   sdl_flags &= ~SDL_INIT_HAPTIC;
+#endif
+   if (SDL_Init(sdl_flags) < 0) {
+      ALLEGRO_ERROR("SDL_Init failed: %s", SDL_GetError());
+      return NULL;
+   }
```

> The Web does have a [Vibration API](https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API) (for vibrating a mobile device), and experimental support for [Gamepad haptic feedback](https://developer.mozilla.org/en-US/docs/Web/API/GamepadHapticActuator), so it's certainly possible for SDL to support.

Now the `ex_saw` example worked when built locally, but SFX still didn't play in Zelda Classic. After some more printf'ing, I noticed that SDL was failing to open a second audio channel for SFX. Weird... I opened up SDL's [audio implementation for Emscripten](https://github.com/libsdl-org/SDL/blob/55a4e1d336db0dd0af70bf22df8ec3ae0b38644a/src/audio/emscripten/SDL_emscriptenaudio.c#L347), and a variable named `OnlyHasDefaultOutputDevice` grabbed my attention:

```cpp
static SDL_bool
EMSCRIPTENAUDIO_Init(SDL_AudioDriverImpl * impl)
{
    SDL_bool available, capture_available;

    /* Set the function pointers */
    impl->OpenDevice = EMSCRIPTENAUDIO_OpenDevice;
    impl->CloseDevice = EMSCRIPTENAUDIO_CloseDevice;

    impl->OnlyHasDefaultOutputDevice = SDL_TRUE;
    // ...
```

Thinking "no way this will work", I set that to `SDL_FALSE` and ... it worked! I reported this as a bug [here](https://github.com/libsdl-org/SDL/issues/5485). It's not so obvious that this is the proper way to fix this, so this won't be actually resolved in SDL for a bit. Which leads me to the next topic...

### Build script hacking

When you fix a bug in a dependency, there is typically a waiting period before a new version of that dependency can be used normally. This is not a problem because there are other ways to use a non-official version of a dependency:

- package managers can be configured to point to a specific fork or commit
- you could vendor the dependency, making it part of your project's source control
- you could maintain a set of diff patches to apply on top of the official release

> Playwright has [nice infrastructure](https://github.com/microsoft/playwright/tree/main/browser_patches) for building browsers with custom patches that wouldn't be (pick one: appropriate, quick, or easy) to merge upstream. Brave [does something similar](https://github.com/brave/brave-core/tree/master/patches).

Then there's the lazy way: At first, I reached for the expediency of `sed` commands. I'd find a bug in a dependency, figure out how to use `sed` to fix it locally, plop it into my build script, and make a note to upstream the bug fix some time later.

```bash
# Temporary workarounds until various things are fixed upstream.

if [ ! -d "$EMCC_CACHE_DIR/ports/sdl2" ]
then
  # Ensure that the SDL source code has been downloaded.
  embuilder build sdl2
fi
# Must manually delete the SDL library to force Emscripten to rebuild it.
rm -rf "$EMCC_CACHE_LIB_DIR"/libSDL2.a "$EMCC_CACHE_LIB_DIR"/libSDL2-mt.a

# See https://github.com/libsdl-org/SDL/pull/5496
if ! grep -q SDL_THREAD_PTHREAD_RECURSIVE_MUTEX "$EMCC_CACHE_DIR/ports/sdl2/SDL-release-2.0.20/include/SDL_config_emscripten.h"; then
  echo "#define SDL_THREAD_PTHREAD_RECURSIVE_MUTEX 1" >> "$EMCC_CACHE_DIR/ports/sdl2/SDL-release-2.0.20/include/SDL_config_emscripten.h"
fi

# SDL's emscripten audio specifies only one default audio output device, but turns out
# that can be ignored and things will just work. Without this, only SFX will play and MIDIs
# will error on opening a handle to the audio device.
# See https://github.com/libsdl-org/SDL/issues/5485
sed -i -e 's/impl->OnlyHasDefaultOutputDevice = 1/impl->OnlyHasDefaultOutputDevice = 0/' "$EMCC_CACHE_DIR/ports/sdl2/SDL-release-2.0.20/src/audio/emscripten/SDL_emscriptenaudio.c"
```

And those are just the changes to SDL. I had more for Allegro...

Keeping it simple early helped keep things moving, but once the changes became larger than tweaking a line or two this process became unfeasible. Eventually I setup a simple system: a pretty straightforward application of `git diff` and `patch`. There's some annoying cache clearing that needs to be done in order for patches to Emscripten's ports to take effect, but it wasn't too bad. Here's the entirety of it:

```bash
#!/bin/bash

# A very basic patching system. Only supports a single patch per directory.
# To update a patch:
#   1) cd to the directory
#   2) make your changes
#   3) git add .
#   4) git diff --staged | pbcopy
#   5) overwrite existing patch file with new one

set -e

SCRIPT_DIR=` cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd `
EMCC_DIR="$(dirname $(which emcc))"
EMCC_CACHE_DIR="$EMCC_DIR/cache"

NO_GIT_CLEAN=false
GIT_CLEAN=true

# folder patch
function apply_patch {
  cd "$1"
  echo "Applying patch: $2"

  if [ -d .git ]; then
    git restore --staged .
    # Cleaning is the sensible thing to do, unless there are build-time generated
    # files (ex: allegro will create some header configuration files based on the environment).
    if $3 ; then
      git clean -fdq
    fi
    git checkout -- .
  else
    git init > /dev/null
    git add .
    git commit -m init
  fi

  patch -s -p1 < "$2"
  cd - > /dev/null
}

echo "Applying patches ..."

apply_patch "$EMCC_DIR" "$SCRIPT_DIR/emscripten.patch" $GIT_CLEAN

# Ensure that the SDL source code has been downloaded,
# otherwise the patches can't be applied.
if [ ! -d "$EMCC_CACHE_DIR/ports/sdl2" ]
then
  embuilder build sdl2
fi
if [ ! -d "$EMCC_CACHE_DIR/ports/sdl2_mixer/SDL_mixer-release-2.0.4" ]
then
  rm -rf "$EMCC_CACHE_DIR/ports/sdl2_mixer"
  embuilder build sdl2_mixer
fi

# Manually delete libraries from Emscripten cache to force a rebuild.
rm -rf "$EMCC_CACHE_LIB_DIR"/libSDL2-mt.a
rm -rf "$EMCC_CACHE_LIB_DIR"/libSDL2_mixer_gme_mid-mod-mp3-ogg.a

apply_patch "$EMCC_CACHE_DIR/ports/sdl2/SDL-4b8d69a41687e5f6f4b05f7fd9804dd9fcac0347" "$SCRIPT_DIR/sdl2.patch" $GIT_CLEAN
apply_patch "$EMCC_CACHE_DIR/ports/sdl2_mixer/SDL_mixer-release-2.0.4" "$SCRIPT_DIR/sdl2_mixer.patch" $GIT_CLEAN
apply_patch _deps/allegro5-src "$SCRIPT_DIR/allegro5.patch" $NO_GIT_CLEAN

echo "Done applying patches!"
```

## Making it awesome

### Quest List

Up until now only the built-in original Zelda was playable. Now that I had sound working, I wanted to be able to play custom quests. From my previous work on Quest Maker, I had scraped 600+ quests and their metadata from PureZC.com. Quests are just single `.qst` files, and I needed a way to get Zelda Classic their data. Adding them to the `--preload-data` is not an option, because in total they are about 2 GB! No, each file needs to be loaded only upon request.

> [Quest Maker](https://hoten.cc/quest-maker/play/) was my attempt at remaking Zelda Classic. Eventually I realized it would take 20 years to recreate a 20 year-old game engine, so I gave up.

When creating a new save file, you can select the quest file to use from a file selector dialog. In order to support that on the web, I needed to populate an empty file for every quest file so that the user could at least select it from this dialog. To do that, I used a metadata file of the [entire quest corpus](https://hoten.cc/quest-maker/play/quest-manifest.json) to seed the filesystem with empty files.

```js
// This function is called early on in main() setup.
EM_ASYNC_JS(void, em_init_fs_, (), {
  // Initialize the filesystem with 0-byte files for every quest.
  const quests = await ZC.fetch("https://hoten.cc/quest-maker/play/quest-manifest.json");
  FS.mkdir('/_quests');

  function writeFakeFile(path, url) {
    FS.writeFile(path, '');
    window.ZC.pathToUrl[path] = 'https://hoten.cc/quest-maker/play/' + url;
  }

  for (let i = 0; i < quests.length; i++) {
    const quest = quests[i];
    if (!quest.urls.length) continue;

    const url = quest.urls[0];
    const path = window.ZC.createPathFromUrl(url);
    writeFakeFile(path, url);
  }
});
```

<div class="captioned-image">
  <img style="max-width: min(700px, 100%)" src="/images/zc/filepicker.png" alt="">
  <span>The in-game file selector dialog. Quests are stored in their own folders such as: <code>_quests/1/OcarinaOfPower.qst</code>, requiring knowledge of where the quest you want is and multiple clicks to navigate to it</span>
</div>

Just before Zelda Classic actually opens a file, `em_fetch_file_` is called and the data will be fetched and written to the filesystem.

```js
EM_ASYNC_JS(void, em_fetch_file_, (const char *path), {
  try {
    path = UTF8ToString(path);
    if (FS.stat(path).size) return;

    const url = window.ZC.pathToUrl[path];
    if (!url) return;

    const data = await ZC.fetch(url);
    FS.writeFile(path, data);
  } catch (e) {
    // Fetch failed (could be offline) or path did not exist.
    console.error(`error loading ${path}`, e);
  }
});
```

There are also a few quests that come with external music files (mp3, ogg). They can be added to this "lazy" filesystem too:

```js
for (const extraResourceUrl of quest.extraResources || []) {
  writeFakeFile(window.ZC.createPathFromUrl(extraResourceUrl), extraResourceUrl);
}
```

But this file selector dialog is _really awkward_ to use. Let's leverage one of the web's superpowers here: the URL. I created a "Quest List" directory that presents a `Play!` link:

[https://hoten.cc/zc/play/?quest=731/GoGollab_1_FunnyEdition.qst](https://hoten.cc/zc/play/?quest=731/GoGollab_1_FunnyEdition.qst)

and in Zelda Classic I grabbed that query parameter and hacked away at the title screen code to either 1) start a new save file with the quest or 2) load an existing save file of that quest. This makes it simpler than ever to jump into a Zelda Classic quest.

Zelda Classic's editor has a testing feature that allows a quest editor to jump into the game at the current screen they are editing. Natively, that's done with command line arguments, but to do the same for the web we have our friend the URL. Click this URL and you'll find yourself at the end of the game!

[https://hoten.cc/zc/play/?quest=bs3.1/NewBS+3.1+-+1st+Quest.qst&dmap=9&screen=58](https://hoten.cc/zc/play/?quest=bs3.1/NewBS+3.1+-+1st+Quest.qst&dmap=9&screen=58)

You can also get a deep link to open a specific screen in the editor:

[https://hoten.cc/zc/create/?quest=bs3.1/NewBS+3.1+-+1st+Quest.qst&map=0&screen=55](https://hoten.cc/zc/create/?quest=bs3.1/NewBS+3.1+-+1st+Quest.qst&map=0&screen=55)

### MP3s, and OGGs and retro music

OK, so remember when I did all the fake `zcmusic` stuff, just to get things building and punt the prebuilt sound library stuff? Well, eventually I realized that SDL_mixer supports OGG and MP3 so it should be straight-forward to implement `zcmusic` using SDL_mixer. SDL_mixer and Emscripten have the know-how to synthesize these various audio formats, so I don't need to work out how to compile these audio libraries myself.

I should mention, Zelda Classic has two separate code paths for music: one is for MIDI, which I've already discussed, and the other is `"zcmusic"` which is just a wrapper around various audio libraries to support OGG, MP3, and various retro video-game specific formats:

- gbs (GameBoy Sound)
- nsf (NES Sound Format)
- spc (SNES Sound)
- vgm ([Video Game Music](https://en.wikipedia.org/wiki/VGM_(file_format)), a grab-bag of multiple game systems)

So Emscripten + SDL_mixer handles everything but these retro formats. For that, Zelda Classic uses the [Game Music Emulator](https://bitbucket.org/mpyne/game-music-emu/src/master/) (GME) library. Luckily I found a fork of SDL_mixer called [SDL_mixer X](https://github.com/WohlSoft/SDL-Mixer-X) which integrates GME into SDL. It was pretty straightforward to grab that and merge the changes into the port that Emscriten uses. I also needed to add GME to Emscripten's port system, which was pretty [straightforward](https://gist.github.com/connorjclark/b9e0986c518d0193031c71181c8e2fd3).

> I sent SDL_mixer a [PR](https://github.com/libsdl-org/SDL_mixer/pull/378) for adding GME. If that gets merged, I'll also add a `gme` option to Emscripten. But for now, I'm just fine with my patching workflow.

As for `zcmusic`, I just had to implement the small API surface using SDL_mixer directly. The native version of the library brings in format-specific audio handling libraries, so it's actually much simpler now because SDL_mixer handles all that format-specific logic.

### Persisting data

By default, all data written to Emscripten's filesystem is only held in memory, and is lost when refreshing the page. Emscripten provides a simple interface to [mount a folder backed by IndexedDB](https://emscripten.org/docs/api_reference/Filesystem-API.html#filesystem-api-idbfs), which solves the problem of persistence, but many other issues still exist:

1) Players of Zelda Classic have existing save files they may want to transfer into the browser
2) Players will want access to these files (either to make backups or share them), but browsers don't expose IndexedDB to non-technical users
3) Browsers avoid clearing data in IndexedDB if `navigator.storage.persist()` is called, but still: losing data such as save files (and especially a quest author's `.qst` file) is catastrophic, and I don't trust anything to live inside a browser forever

Using the real filesystem would avoid all these issues. Luckily, there's been a lot of progress on this front in the last year: The [Filesystem Access API](https://web.dev/file-system-access/) provides a way to prompt a user to share a folder with a page, even allowing the page to write back to it. Given `window.showDirectoryPicker()`, the browser opens a folder dialog prompt and the user's selection is given as a `FileSystemDirectoryHandle`.

> The only annoyance is that permission doesn't persist across multiple sessions, and even opening the permission prompt is (understandably) gated behind user interaction, so every subsequent visit I must show the user a permission flow. At the very least, the `FileSystemDirectoryHandle` can be cached in IndexedDB so the user doesn't need to specify which folder to use every time.

Unfortunately only Chromium browsers have implemented `window.showDirectoryPicker()`; Firefox has no plans to implement, and Safari currently only supports a [limited part of the API](https://webkit.org/blog/12257/the-file-system-access-api-with-origin-private-file-system/) called Origin Private Filesystem, which is not backed by real files on disk.

> [The Origin Private Filesystem](https://wicg.github.io/file-system-access/#sandboxed-filesystem) provides an origin-unique directory handle via `navigator.storage.getDirectory()`. The spec defines this folder to not necessarily map to real files on disk, so this is not viable for Zelda Classic

Emscripten did not provide an interface for mounting a `FileSystemDirectoryHandle` to its own filesystem, so I wrote one myself. The existing IndexedDB interface is very similar to what I needed, and handles the logic of syncing deltas both ways rather nicely, so I based my interface on that. This seems like it'd be really useful to others, so I sent a [patch to Emscripten](https://github.com/emscripten-core/emscripten/pull/16804).

While I'm happy I can provide an ideal persistence story in Chromium, I still had to do something for other browsers. IndexedDB + `navigator.storage.persist()` isn't the worst thing in the world, but I needed to solve issues 1 and 2 above. To that end, a user can:

1) download any individual file backed by IndexedDB
2) perform a one-way upload of a file or an entire folder into the browser ([`browser-fs-access`](https://web.dev/browser-fs-access/) helped here)

### Gamepads

Zelda Classic is certainly playable with the keyboard, but it also supports gamepads. And so does the web and Emscripten! I was hopeful that things would "just work" here. I bought myself a nice Xbox controller to test things out and... nada. I noticed that the gamepad would only connect if I actively twiddled with its inputs while the page loaded. The bug could have been anywhere: Emscripten, my controller, SDL, Allegro, Allegro Legacy... so the first task was to narrow down a repro.

I wrote a quick [SDL program](https://gist.github.com/connorjclark/0b7268acd6bfa324c4db38dde7928110) that prints when a joystick connects and disconnects. I compiled with Emscripten, loaded the page and it worked. So that just left Allegro/Allegro Legacy as the culprits. I did notice a difference between running when compiled for Mac vs for the web: On Mac, SDL detects a joystick immediately, but in the browser detection only happens after the first input on the controller. This is by design–the purpose is to [avoid a potential vector for fingerprinting](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API#:~:text=In%20Firefox%2C%20gamepads-,are%20only%20exposed,-to%20a%20page).

So that was a big clue–Allegro works only when twiddling the input at start up because it must be mishandling joysticks that are connected post-initialization. Pulling up [Allegro's SDL interface for joysticks](https://github.com/liballeg/allegro5/blob/668a0a35afd4132dfeb86325d8f3e3c10628b529/src/sdl/sdl_joystick.c), a variable `count` jumps out:

```cpp
void _al_sdl_joystick_event(SDL_Event *e)
{
   if (count <= 0)
      return;

  // ...
}

static bool sdl_init_joystick(void)
{
   count = SDL_NumJoysticks(); // <<<<<<<<<<<< Only ever set once!
   joysticks = calloc(count, sizeof * joysticks);

   // ...
}
```

For some unknown reason... all joystick events are ignored if there are no currently connected joysticks. The expectation in Allegro programs is to call  `al_reconfigure_joysticks` (which would call `sdl_init_joystick` again) when a joystick is added or removed to recreate the internal data structures, but a program never gets a chance to do so because Allegro's SDL joystick driver never forwards `SDL_JOYDEVICEADDED` events when no joysticks are present. [The fix](https://github.com/liballeg/allegro5/pull/1326) was straightforward: remove that unnecessary `count` guard, and fix a use-after-free bug from very unexpected behavior (to me, a web developer) of [`calloc`](https://en.cppreference.com/w/c/memory/calloc) when `0` is given as input.

> I found an unfortunate bug in Firefox where my Xbox controller is [improperly mapped](https://bugzilla.mozilla.org/show_bug.cgi?id=1763931).

After all that, connecting a gamepad was working. The default joystick button mappings happened to be OK too, but I wanted to improve the existing Zelda Classic settings menu for configuring the gamepad controls: currently it gave no indication of what button an action is mapped to, only providing a button number (not a name). I found that Allegro does support a joystick button name api, so I used it but that didn't help so much:

<div class="captioned-image">
  <img style="max-width: min(700px, 100%)" src="/images/zc/buttons.png" alt="">
  <span>button button button button, button button, button 🦬</span>
</div>

The problem was that Allegro's SDL joystick interface didn't know about SDL's API for getting a button name. [The fix](https://github.com/liballeg/allegro5/pull/1327) was simple:

```cpp
diff --git a/src/sdl/sdl_joystick.c b/src/sdl/sdl_joystick.c
--- a/src/sdl/sdl_joystick.c
+++ b/src/sdl/sdl_joystick.c
    static bool sdl_init_joystick(void)
       info->num_buttons = bn;
       int b;
       for (b = 0; b < bn; b++) {
-         info->button[b].name = "button";
+         info->button[b].name = SDL_IsGameController(i) ?
+            SDL_GameControllerGetStringForButton(b) : "button";
       }
    }
    SDL_JoystickEventState(SDL_ENABLE);
```

> I was curious how SDL could determine what the button names are, given that the Gamepad Web API has nothing for "give me the name of this button". Turns out, SDL uses the gamepad's device id (which the Web API does expose) to map known gamepads to a "standard" button layout. One such database can be found [here](https://github.com/gabomdq/SDL_GameControllerDB/blob/master/gamecontrollerdb.txt) (but I think SDL ships with a much smaller set). These configurations are meant for standardizing rando gamepads to a sensible layout (such that the "right-side bottom button" has the same value to SDL independent of the gamepad hardware), but it also doubles as a button name store.

### Mobile support

<div class="captioned-image">
  <img src="/images/zc/mobile.png" alt="" width="50%">
  <span>Very basic touch controls</span>
</div>

I thought it'd be cool to support mobile, but I didn't want to spend a lot of time on making touch controls feel good so the end result is a pretty subpar. The most tedious part was getting the browser `touch` events to work just-right. Actually fowarding them as events to Allegro was just a matter of exposing a C function to JavaScript that emitted a fake Allegro user event:

```cpp
bool has_init_fake_key_events = false;
ALLEGRO_EVENT_SOURCE fake_src;
extern "C" void create_synthetic_key_event(ALLEGRO_EVENT_TYPE type, int keycode)
{
  if (!has_init_fake_key_events)
  {
    al_init_user_event_source(&fake_src);
    a5_keyboard_queue_register_event_source(&fake_src);
    has_init_fake_key_events = true;
  }

  ALLEGRO_EVENT event;
  event.any.type = type;
  event.keyboard.keycode = keycode;
  al_emit_user_event(&fake_src, &event, NULL);
}
```

Luckily Gamepads work just fine on mobile devices. Here's me playing with a wireless Xbox controller on my phone:

<div class="captioned-image">
  <img src="/images/zc/gamepad.jpg" alt="" width="50%">
  <span>🥔📷 (had to use my webcam)</span>
</div>

### PWA

I used the following [Workbox](https://developers.google.com/web/tools/workbox) config to generate a service worker:

```js
module.exports = {
	runtimeCaching: [
		{
			urlPattern: /png|jpg|jpeg|svg|gif/,
			handler: 'CacheFirst',
		},
		{
			// Match everything except the wasm data file, which is cached in
			// IndexedDB by emscripten.
			urlPattern: ({ url }) => !url.pathname.endsWith('.data'),
			handler: 'NetworkFirst',
			options: {
				matchOptions: {
          // Otherwise the html page won't be cached (it can have query parameters).
					ignoreSearch: true,
				},
			},
		},
	],
	swDest: 'sw.js',
	skipWaiting: true,
	clientsClaim: true,
	offlineGoogleAnalytics: true,
};
```

This gets me offline support, although notably there is no precaching: I chose to avoid precaching because there's ~6GB of quest data which is fetched only when needed, so the user will need to load a particular quest while online at least once for it to work offline. So I didn't see the point in precaching any part of the webapp.

With a service worker, and a [manifest.json](https://hoten.cc/zc/manifest.json), the webapp can be installed as a PWA. I listen for the `beforeinstallprompt` event to display my own install prompt:

```js
const installEl = document.createElement('button');
installEl.textContent = 'Install as App';
installEl.classList.add('panel-button');
installEl.addEventListener('click', async () => {
  if (!deferredPrompt) return;

  const { outcome } = await deferredPrompt.prompt();
  if (outcome === 'accepted') {
    deferredPrompt = undefined;
    installEl.textContent = 'Installed! Open from home screen for better experience';
    setTimeout(() => installEl.remove(), 1000 * 5);
  }
});

let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;

  document.querySelector('.panel-buttons').append(installEl);
});
```

In Chrome, when a PWA is installed the view transitions to the fullscreen, standalone version of the app. Unfortunately on Android, when installed there is no such transition, which makes for an awkward flow (the user can choose to close the browser tab and hunt down the newly installed app, or they can continue in the current browser tab and on subsequent visits use the app entry).

> Chrome 102 just landed, which introduces [`file_handlers`](https://blog.chromium.org/2022/04/chrome-102-window-controls-overlay-host.html#:~:text=File%20Handlers%20Web%20App%20Manifest%20Member). Definitely something I'll eventually add to handle opening `.qst` files from the OS!

## Takeaways

- As soon as you run into what seems like an intractable bug, stop trying to debug it from the context of your application and try to make a minimial reproduction. It will become easier to reason about the problem, and if the bug belongs to a dependency you will have a ready-made repro to provide in bug report.
- File bug reports and upstream bug fixes when possible! But also, have _some way_ to tweak your dependencies, be it with hard forks or a patching system. You can't allow a bug in a dependency that you know how to resolve stall progress.
- Break down problems with unknown solutions. For example, my first attempt at porting Zelda Classic was over a year ago, and that failed miserably because I jumped right into the end task of "actually port it", without first taking the time to really learn the tools involved, which resulted in me spinning my wheels. This time around, I avoided that by making my first task to fully understand how to port the simplest Allegro program.
