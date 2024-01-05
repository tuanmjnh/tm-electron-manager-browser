import browser from "webextension-polyfill";
// interface InjectObject {
//   action: any,
//   tab: any,
//   args: any,
//   config: any,
//   index,
//   callback?: any
// }
const CONSTANT = {
  ID: 'FmHx9pwZYTclt06d',
  VALUE: {
    config: {
      tab: 'tiktok-feed',
      browse: 'DivBrowserModeContainer',
      list: '[data-e2e="recommend-list-item-container"]',
      videos: '[data-e2e="feed-video"]',
      play: '[data-e2e="video-play"]',
      sound: '[data-e2e="video-sound"]',
      share: '[data-e2e="share-icon"]',
      shareX: '[aria-label="Share post"]'
    },
    feed: { //Tiktok Feed
      scrollRandom: { heightMin: 500, heightMax: 1200, intervalMin: 6000, intervalMax: 15000, loading: false },// random height
      scrollElement: { el: '[data-e2e="recommend-list-item-container"]', intervalMin: 6000, intervalMax: 15000, loading: false },//each element
      follow: { el: '[data-e2e="feed-follow"]', intervalMin: 6000, intervalMax: 20000, loading: false },
      like: { el: '[data-e2e="like-icon"]', intervalMin: 6000, intervalMax: 20000, loading: false },
      comment: { el: '[data-e2e="comment-icon"]', intervalMin: 6000, intervalMax: 20000, loading: false },
      favorite: { el: '[data-e2e="undefined-icon"]', intervalMin: 6000, intervalMax: 20000, loading: false },
      shareCopy: { parent: '[data-e2e="share-icon"]', el: '[data-e2e="video-share-copy"]', intervalMin: 6000, intervalMax: 20000, loading: false },
      shareEmbed: { parent: '[data-e2e="share-icon"]', el: '[data-e2e="video-share-embed"]', intervalMin: 6000, intervalMax: 20000, loading: false }
    },
    browse: { //Tiktok Browse
      scrollBack: { el: '[data-e2e="arrow-left"]', intervalMin: 6000, intervalMax: 15000, loading: false },
      scrollNext: { el: '[data-e2e="arrow-right"]', intervalMin: 6000, intervalMax: 15000, loading: false },
      follow: { el: '[data-e2e="browse-follow"]', intervalMin: 6000, intervalMax: 20000, loading: false },
      like: { el: '[data-e2e="browse-like-icon"]', intervalMin: 6000, intervalMax: 20000, loading: false },
      comment: { el: '[data-e2e="browse-comment-icon"]', intervalMin: 6000, intervalMax: 20000, loading: false },
      favorite: { el: '[data-e2e="undefined-icon"]', intervalMin: 6000, intervalMax: 20000, loading: false },
      shareCopy: { el: '[data-e2e="browse-copy"]', intervalMin: 6000, intervalMax: 20000, loading: false },
      shareEmbed: { el: '[data-e2e="video-share-embed"]', intervalMin: 6000, intervalMax: 20000, loading: false }
    },
    x: { // X(twitter)
      scrollRandom: { heightMin: 500, heightMax: 1200, intervalMin: 6000, intervalMax: 15000, loading: false },// random height
      scrollElement: { el: '[data-testid="cellInnerDiv"]', intervalMin: 6000, intervalMax: 15000, loading: false },//each element
      like: { el: '[data-testid="like"]', intervalMin: 6000, intervalMax: 20000, loading: false },
      comment: { el: '[data-e2e="comment-icon"]', intervalMin: 6000, intervalMax: 20000, loading: false },
      favorite: { el: '[data-testid="bookmark"]', intervalMin: 6000, intervalMax: 20000, loading: false },
      subscribe: { parent: '[data-testid="caret"]', el: '[data-testid="subscribe"]', intervalMin: 6000, intervalMax: 20000, loading: false },
      repost: { parent: '[data-testid="retweet"]', el: '[data-testid="retweetConfirm"]', intervalMin: 6000, intervalMax: 20000, loading: false },
      share: { parent: '[aria-label="Share post"]', el: '[data-testid="Dropdown"]', index: 0, intervalMin: 6000, intervalMax: 20000, loading: false },
      follow: { parent: '[data-testid="caret"]', el: '[data-testid="Dropdown"]', text: 'Follow', intervalMin: 6000, intervalMax: 20000, loading: false }
    }
    // scroll: {
    //   feed: {
    //     el: { intervalMin: 6000, intervalMax: 15000, loading: false }, //each element
    //     rd: { heightMin: 500, heightMax: 1200, intervalMin: 6000, intervalMax: 15000, loading: false }, // random height
    //   },
    //   browse: { next: '[data-e2e="arrow-right"]', back: '[data-e2e="arrow-left"]', intervalMin: 6000, intervalMax: 15000, loading: false }
    // },
    // follow: {
    //   feed: { el: '[data-e2e="feed-follow"]', intervalMin: 6000, intervalMax: 20000, loading: false },
    //   browse: { el: '[data-e2e="browse-follow"]', intervalMin: 6000, intervalMax: 20000, loading: false }
    // },
    // like: {
    //   feed: { el: '[data-e2e="like-icon"]', intervalMin: 6000, intervalMax: 20000, loading: false },
    //   browse: { el: '[data-e2e="browse-like-icon"]', intervalMin: 6000, intervalMax: 20000, loading: false }
    // },
    // comment: {
    //   feed: { el: '[data-e2e="comment-icon"]', intervalMin: 6000, intervalMax: 20000, loading: false },
    //   browse: { el: '[data-e2e="browse-comment-icon"]', intervalMin: 6000, intervalMax: 20000, loading: false }
    // },
    // favorite: {
    //   feed: { el: '[data-e2e="undefined-icon"]', intervalMin: 6000, intervalMax: 20000, loading: false },
    //   browse: { el: '[data-e2e="undefined-icon"]', intervalMin: 6000, intervalMax: 20000, loading: false }
    // },
    // share: {
    //   feed: { el: '[data-e2e="share-icon"]', copy: '[data-e2e="video-share-copy"]', embed: '[data-e2e="video-share-embed"]', intervalMin: 6000, intervalMax: 20000, loading: false },
    //   browse: { copy: '[data-e2e="browse-copy"]', embed: '[data-e2e="video-share-embed"]', intervalMin: 6000, intervalMax: 20000, loading: false }
    // },
  }
}

const randomIntMax = (max) => {
  return Math.floor(Math.random() * max)
}

const randomIntMinMax = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const getCurrentTab = async (options) => {
  options = { ...options, ...{ active: true, currentWindow: true } }
  const [tab] = await browser.tabs.query(options)
  return tab
}



const injectScroll1 = async (obj) => {
  // const tab = await getCurrentTab()
  // browser.runtime.sendMessage({ type: 'storage', data: tab.id })
  obj.args[3] = true
  // console.log(args)
  // if (typeof browser === 'object') {
  //   await browser.tabs.executeScript(tabId, { file });
  // } else {
  if (obj.args.intervalMin > obj.args.intervalMax) obj.args.intervalMin = obj.args.intervalMax
  // for (let x = 0; x < obj.config[0]; x++) {
  let x = 0
  while (obj.args[3]) {
    x++
    const rdTime = Math.floor(Math.random() * (obj.config[2] - obj.config[1] + 1)) + obj.config[1]
    console.log(`interval scroll ${x} - timeout: ${Math.floor(rdTime / 1000)}s`)
    const to = setTimeout(async (y) => {
      const time = Math.floor(Math.random() * (obj.args[2] - obj.args[1] + 1)) + obj.args[1]
      await browser.scripting.executeScript({
        target: { tabId: obj.tab.id || 0 },
        func: obj.action,
        args: [x, 0, time],
      }, (rs) => {
        clearTimeout(to)
        obj.args[3] = false
      })
    }, x * Math.floor(Math.random() * (obj.config[2] - obj.config[1] + 1)) + obj.config[1]) // we're passing x
  }
}

const injectAction2 = async (obj) => {//{ action:any, tab, args, config, callback }
  // console.log(obj)
  obj.args.loading = true
  if (obj.args.intervalMin > obj.args.intervalMax) obj.args.intervalMin = obj.args.intervalMax
  for (let x = 0; x < obj.config.intervalNumber; x++) {
    const rdTime = Math.floor(Math.random() * (obj.args.intervalMax - obj.args.intervalMin + 1)) + obj.args.intervalMin
    console.log(`interval action ${x} - timeout: ${Math.floor(rdTime / 1000)}s`)
    const to = setTimeout(async (y) => {
      const time = Math.floor(Math.random() * (obj.args.intervalMax - obj.args.intervalMin + 1)) + obj.args.intervalMin
      await browser.scripting.executeScript({
        target: { tabId: obj.tab.id || 0 },
        func: obj.action,
        args: [obj.args.el, time],
      }, (rs) => {
        clearTimeout(to)
        obj.args.loading = false
      })
    }, x * rdTime) // we're passing x
  }
}

const injectAction = async ({ action, tab, type, args, index }) => {
  if (args.intervalMin > args.intervalMax) args.intervalMin = args.intervalMax
  index = index + 1
  const rdTime = Math.floor(Math.random() * (args.intervalMax - args.intervalMin + 1)) + args.intervalMin
  console.log(`interval action ${type}: ${index} - ${Math.floor(rdTime / 1000)}s`)
  const to = setTimeout(y => {
    const time = Math.floor(Math.random() * (args.intervalMax - args.intervalMin + 1)) + args.intervalMin
    browser.scripting.executeScript({
      target: { tabId: tab.id || 0 },
      func: action,
      args: [type, args, time],
    }, (rs) => {
      clearTimeout(to)
      if (args.loading) injectAction({ action, tab, type, args, index })
    })
  }, index * rdTime) // we're passing x
}

const injectScrollY = async ({ action, tab, type, args, index }) => {
  // console.log("core: " + args.loading)
  if (args.intervalMin > args.intervalMax) args.intervalMin = args.intervalMax
  index = index + 1
  const rdTime = Math.floor(Math.random() * (args.intervalMax - args.intervalMin + 1)) + args.intervalMin
  console.log(`interval scroll Y ${index} - timeout: ${Math.floor(rdTime / 1000)}s`)
  const to = setTimeout(y => {
    const time = Math.floor(Math.random() * (args.intervalMax - args.intervalMin + 1)) + args.intervalMin
    browser.scripting.executeScript({
      target: { tabId: tab.id || 0 },
      func: action,
      args: [type, index, args, time],
    }, (rs) => {
      clearTimeout(to)
      // console.log("core: " + args.loading)
      if (args.loading) injectScrollY({ action, tab, type, args, index })
    })
  }, index * rdTime) // we're passing x
  // }
}

const injectScrollElement = async ({ action, tab, type, args, index }) => {
  if (args.intervalMin > args.intervalMax) args.intervalMin = args.intervalMax
  index = index + 1
  const rdTime = Math.floor(Math.random() * (args.intervalMax - args.intervalMin + 1)) + args.intervalMin
  console.log(`interval action ${type}: ${index} - ${Math.floor(rdTime / 1000)}s`)
  const to = setTimeout(y => {
    const time = Math.floor(Math.random() * (args.intervalMax - args.intervalMin + 1)) + args.intervalMin
    browser.scripting.executeScript({
      target: { tabId: tab.id || 0 },
      func: action,
      args: [type, args, index, time],
    }, (rs) => {
      clearTimeout(to)
      if (args.loading) injectScrollElement({ action, tab, type, args, index })
    })
  }, index * rdTime) // we're passing x
}

export { browser, CONSTANT, getCurrentTab, injectAction, injectScrollY, injectScrollElement, randomIntMax, randomIntMinMax }
