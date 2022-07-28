import "./css/base.css";
import "./css/index.css";
import {
  formatDate,
  formatSize,
  addClass,
  removeClass,
  toggleClass,
  debounce,
  createQR,
  getUrlParent,
  getUrlName,
} from "./js/utils";
import Uploader from "./js/uploader";
import languages from "./js/i18n";

const _DATA = {
  breadcrumb: "下载",
  paths: [
    { path_type: "Dir", name: "云盘缓存", mtime: 1653566678972, size: null },
    {
      path_type: "File",
      name: "img.jpg",
      mtime: 1650321460582,
      size: 849051648,
    },
    {
      path_type: "File",
      name: "audio.mp3",
      mtime: 1650321460582,
      size: 849051648,
    },
    {
      path_type: "File",
      name: "movie.mp4",
      mtime: 1650321460582,
      size: 849051648,
    },
    {
      path_type: "File",
      name: "text.txt",
      mtime: 1650321460582,
      size: 849051648,
    },
    {
      path_type: "File",
      name: "file.bin",
      mtime: 1650321460582,
      size: 849051648,
    },
    {
      path_type: "File",
      name: "Edgeless_Beta_4.1.0.iso",
      mtime: 1650321460582,
      size: 849051648,
    },
    {
      path_type: "File",
      name: "Segurity House Survival (ByEuclides).zip",
      mtime: 1638011846809,
      size: 6326829,
    },
    {
      path_type: "File",
      name: "WePE64_V2.2.exe",
      mtime: 1635735140000,
      size: 247135000,
    },
    {
      path_type: "File",
      name: "boot.wim",
      mtime: 1648020494000,
      size: 720880721,
    },
  ],
  allow_upload: true,
  allow_delete: true,
};

// MYDATA.paths.push(...MYDATA.paths); // 滚动条测试
// if (!DATA) {}
// const DATA = DATA ? DATA : MYDATA;
// console.log(DATA);

// 默认配置选项
const config = getLocalConfig({
  // 界面标题
  title: "http web file server",
  // 界面语言
  language: "en",
  // 显示文件信息
  showInfo: true,
  // 显示目录树结构
  showTree: true,
  // 显示视图方式
  showView: "details",
  // 是否允许上传
  allow_upload: DATA.allow_upload || false,
});

window.addEventListener("load", () => {
  const control = {
    title: document.querySelector("#flowbar .label"),

    input_upload: document.querySelector("#upload input"),
    input_search: document.querySelector("#search input"),
    select_langs: document.querySelector("#langs"),
    view_info: document.querySelector("#info"),

    // 功能按钮
    button_upload: document.querySelector("#upload img"),
    button_search: document.querySelector("#search img"),

    // 界面布局按钮
    button_toggleToolbar: document.querySelector("#sidebar-toggle"),
    button_showInfo: document.querySelector("#view-info"),
    button_showTree: document.querySelector("#view-tree"),
    button_viewmodeChange: document.querySelector("#viewmode-size"),

    // 切换视图按钮
    button_viewmode_details: document.querySelector("#viewmode-details img"),
    button_viewmode_grid: document.querySelector("#viewmode-grid img"),
    button_viewmode_icons: document.querySelector("#viewmode-icons img"),

    // 排序按钮
    button_soltByName: document.querySelector(".header .label"),
    button_soltByDate: document.querySelector(".header .date"),
    button_soltBySize: document.querySelector(".header .size"),
  };
  const infoElement = {
    info: document.querySelector("#info"),
    content: document.querySelector("#info").querySelector(".content"),
    name: document.querySelector("#info").querySelector(".label"),
    time: document.querySelector("#info").querySelector(".time"),
    size: document.querySelector("#info").querySelector(".size"),
    icon: document.querySelector("#info").querySelector("img"),
    folders: document.querySelector("#info").querySelector(".folders"),
    files: document.querySelector("#info").querySelector(".files"),
    qrcode: document.querySelector("#info").querySelector(".qrcode"),
  };
  const li8nElement = {
    search: document.querySelector(".l10n_search"),
    name: document.querySelector(".l10n-name"),
    lastModified: document.querySelector(".l10n-lastModified"),
    size: document.querySelector(".l10n-size"),
    empty: document.querySelector(".l10n-empty"),
    view: document.querySelector(".l10n-view"),
    info: document.querySelector(".l10n-info"),
    language: document.querySelector(".l10n-language"),
    tree: document.querySelector(".l10n-tree"),
    folders: document.querySelector(".l10n-folders"),
    files: document.querySelector(".l10n-files"),
  };

  control.button_toggleToolbar.addEventListener("click", button_toggleToolbar);
  control.button_search.addEventListener("click", button_search);
  control.input_search.addEventListener("input", (e) => {
    input_search(e.target.value);
  });
  control.button_showInfo.addEventListener("click", button_showInfo);
  control.button_showTree.addEventListener("click", button_showTree);
  control.button_viewmodeChange.addEventListener("input", (e) =>
    button_viewmodeChange(e.target.value)
  );
  control.button_viewmode_details.addEventListener("click", (e) =>
    button_changeView("details")
  );
  control.button_viewmode_grid.addEventListener("click", (e) =>
    button_changeView("grid")
  );
  control.button_viewmode_icons.addEventListener("click", (e) =>
    button_changeView("icons")
  );
  control.input_upload.addEventListener("change", (e) => {
    uploadFile(e.target.files);
  });
  control.select_langs.addEventListener("change", (e) => {
    setLocalConfig("language", e.target.value);
    changeLanguage(languages[e.target.value]);
  });

  // 排序按钮-根据名称
  control.button_soltByName.addEventListener("click", (e) => {
    // const soltList = DATA.paths.filter((item) => {
    //   return item.name
    //     .toLocaleLowerCase()
    //     .includes(fileName.toLocaleLowerCase());
    // });
    // console.log(DATA.paths.sort());
    // loadFileList({
    //   ...DATA,
    //   paths: DATA.paths.sort(),
    // });
  });
  // 排序按钮-根据日期
  control.button_soltByDate.addEventListener("click", (e) => {});
  // 排序按钮-根据大小
  control.button_soltBySize.addEventListener("click", (e) => {});

  // 调试模式下删除占位符
  document.querySelector("text") && document.querySelector("text").remove();

  // 加载配置
  control.title.innerHTML = config.title;
  button_changeView(config.showView);
  button_showInfo(null, config.showInfo);
  button_showTree(null, config.showTree);
  // 隐藏上传按钮
  if (!config.allow_upload) control.button_upload.style.display = "none";
  // 切换语言
  changeLanguage(languages[config.language]);
  for (let i = 0; i < control.select_langs.options.length; i++) {
    if (control.select_langs.options[i].value == config.language) {
      control.select_langs.selectedIndex = i;
      break;
    }
  }

  // 显示根目录信息
  showInfo();

  // 加载文件列表
  loadFileList(DATA);

  // 加载目录树
  loadFileTree(DATA);

  // 显示文件列表
  function loadFileList(data) {
    const view_hint = document.querySelector("#view-hint");
    const itemList = document.querySelector("#view").querySelector("#items");

    // 清空文件列表
    for (let item of itemList.querySelectorAll(".item")) {
      itemList.removeChild(item);
    }

    // 创建返回上一级按钮
    const parentUrl = getUrlParent(location.href);
    if (parentUrl != location.href) {
      const itemList = document.querySelector("#view").querySelector("#items");
      const li = document.createElement("li");
      li.className = "item folder page folder-parent";
      li.innerHTML = `
            <a href="${parentUrl}">
              <span class="icon square">
                <img
                  src="${require("@/img/themes/default/folder-parent.svg")}"
                  alt="folder"/>
              </span>
              <span class="icon landscape">
                <img
                  src="${require("@/img/themes/default/folder-parent.svg")}"
                  alt="folder"
                />
              </span>
              <span class="label" title="${getUrlName(parentUrl)}">${getUrlName(
        parentUrl
      )}</span>
              <span class="date"></span>
              <span class="size"></span>
            </a>
            `;
      itemList.appendChild(li);
    }

    // 判断是否为空目录
    if (data.paths.length == 0) {
      removeClass(view_hint, "hidden");
      return;
    }
    addClass(view_hint, "hidden");

    // 遍历文件列表
    data.paths.forEach((info) => {
      const myInfo = parseInfo(info);
      const li = document.createElement("li");
      li.className = "item folder";
      li.innerHTML = `
    <a href="${myInfo.href}" ${myInfo.isDir ? "" : "download"}>
      <span class="icon square">
        <img src="${myInfo.icon}" alt="folder"/>
      </span>
      <span class="icon landscape">
        <img src="${myInfo.icon}" alt="folder"/>
      </span>
      <span class="label" title="${myInfo.name}">${myInfo.name}</span>
      <span class="date">${myInfo.date}</span>
      <span class="size">${myInfo.size}</span>
    </a>`;

      // 多选框
      // <span class="selector">
      //   <img src="${require("@/img/ui/selected.svg")}" alt="selected" />
      // </span>

      // 鼠标移入时自动显示文件右侧信息
      li.addEventListener("mouseenter", (event) => {
        infoElement.name.innerHTML = myInfo.name;
        infoElement.time.innerHTML = myInfo.date;
        infoElement.size.innerHTML = myInfo.size;
        infoElement.icon.src = myInfo.icon;
        addClass(infoElement.content, "hidden");

        // 创建二维码
        infoElement.qrcode.innerHTML = null;
        createQR(myInfo.href, infoElement.qrcode);
      });

      // 鼠标移出时自动显示根目录信息
      li.addEventListener("mouseleave", showInfo);

      // 处理右键菜单
      const menu = document.querySelector("#contextmenu");
      li.addEventListener("contextmenu", function (event) {
        menu.innerHTML = `
        <div class="contextmenu-item">
          <a href="${myInfo.href}" download>下载</a>
        </div>
      `;
        menu.style.left = `${event.clientX}px`;
        menu.style.top = `${event.clientY}px`;
        removeClass(menu, "hidden");
        event.preventDefault();
      });
      window.addEventListener("click", () => addClass(menu, "hidden"));

      // 点击预览事件
      li.addEventListener("click", function (event) {
        const fileType = myInfo.name.split(".").pop().toLocaleLowerCase();
        const type_text = [
          "txt",
          "md",
          "c",
          "cpp",
          "java",
          "json",
          "scala",
          "xml",
        ];
        const type_image = ["bmp", "gif", "ico", "jpg", "png"];
        const type_audio = ["mp3", "wav", "ogg", "aac"];
        const type_video = ["mp4", "avi", "flv", "mkv", "mov", "mpg", "webm"];

        const previewControl = {
          preview: document.querySelector("#pv-overlay"),
          preview_spinner: document.querySelector("#pv-spinner"),
          preview_container: document.querySelector("#pv-container"),

          // 底部工具栏
          bottombar: document.querySelector("#pv-bottombar"),
          bottombar_name: document.querySelector("#pv-bar-name"),
          bottombar_size: document.querySelector("#pv-bar-size"),
          bottombar_download: document.querySelector("#pv-bar-raw a"),
          bottombar_close: document.querySelector("#pv-bar-close"),
          bottombar_fullscreen: document.querySelector("#pv-bar-fullscreen"),
        };

        if (
          type_text
            .concat(type_image)
            .concat(type_audio)
            .concat(type_video)
            .includes(fileType)
        ) {
          // 停止超链接下载事件
          event.preventDefault();

          // 显示预览框、加载动画
          removeClass(previewControl.preview, "hidden");
          removeClass(previewControl.preview_spinner, "hidden");

          switch (true) {
            case type_text.includes(fileType):
              const element = document.createElement("pre");
              element.id = "pv-content-txt";
              // 请求文本信息
              const ajax = window.XMLHttpRequest
                ? new XMLHttpRequest()
                : new ActiveXObject("Microsoft.XMLHTTP");
              ajax.open("GET", myInfo.href);
              ajax.send();
              ajax.onreadystatechange = function () {
                if (ajax.readyState == 4) {
                  if (ajax.status == 200) {
                    element.innerHTML = ajax.responseText;
                  } else {
                    addClass(previewControl.preview, "hidden");
                    addClass(previewControl.preview_spinner, "hidden");
                    return;
                  }
                }
              };
              previewControl.preview_container.appendChild(element);
              break;
            case type_image.includes(fileType):
              const imgElement = document.createElement("img");
              imgElement.id = "pv-content-img";
              imgElement.src = myInfo.href;
              previewControl.preview_container.appendChild(imgElement);
              break;
            case type_audio.includes(fileType):
              const audioElement = document.createElement("audio");
              audioElement.id = "pv-content-aud";
              audioElement.controls = true;
              audioElement.autoplay = true;
              audioElement.src = myInfo.href;
              previewControl.preview_container.appendChild(audioElement);
              break;
            case type_video.includes(fileType):
              const videoElement = document.createElement("video");
              videoElement.id = "pv-content-vid";
              videoElement.controls = true;
              videoElement.autoplay = true;
              videoElement.src = myInfo.href;
              previewControl.preview_container.appendChild(videoElement);
              break;
            default:
              break;
          }

          const closePreview = function () {
            addClass(previewControl.preview, "hidden");
            previewControl.preview_container.innerHTML = "";
          };

          // 处理预览框底部工具栏
          previewControl.bottombar_name.innerHTML = myInfo.name;
          previewControl.bottombar_size.innerHTML = myInfo.size;
          previewControl.bottombar_download.href = myInfo.href;
          previewControl.bottombar_close.addEventListener("click", () => {
            closePreview();
          });
          previewControl.bottombar_fullscreen.addEventListener("click", () =>
            toggleClass(previewControl.preview, "fullscreen")
          );
          previewControl.preview_container.addEventListener(
            "click",
            (event) => {
              if (event.target.id == previewControl.preview_container.id) {
                closePreview();
              }
            }
          );

          // 显示预览、隐藏加载动画
          removeClass(previewControl.preview_container, "hidden");
          addClass(previewControl.preview_spinner, "hidden");
        }
      });

      itemList.appendChild(li);
    });
  }

  // 显示根目录信息
  function showInfo() {
    const dirCount = DATA.paths.filter((item) => {
      return item.path_type == "Dir";
    }).length;
    const fileCount = DATA.paths.filter((item) => {
      return item.path_type == "File";
    }).length;

    infoElement.name.innerHTML = DATA.breadcrumb;
    infoElement.folders.innerHTML = dirCount;
    infoElement.files.innerHTML = fileCount;
    infoElement.icon.src = require("@/img/themes/default/folder.svg");
    removeClass(infoElement.content, "hidden");

    // 创建二维码
    infoElement.qrcode.innerHTML = null;
    createQR(location.href, infoElement.qrcode);
  }

  // 加载文件树结构
  function loadFileTree(data) {
    const treeList = document.querySelector("#tree");
    // 当前目录
    const element = document.createElement("div");
    element.className = "item folder open";
    element.innerHTML = `
  <span class="indicator">
    <img src="${require("@/img/ui/tree-indicator.svg")}" />
  </span>
  <a href="/">
    <span class="icon"
      ><img src="${require("@/img/themes/default/folder-page.svg")}"
    /></span>
    <span class="label">${data.breadcrumb}</span>
  </a>
  `;
    treeList.appendChild(element);

    // 子目录
    const content = document.createElement("div");
    content.className = "content";
    for (let item of data.paths) {
      if (item.path_type.toLocaleLowerCase() != "dir") {
        continue;
      }
      const contentItem = document.createElement("div");
      contentItem.className = "item folder unknown";
      contentItem.innerHTML = `
    <div class="item folder unknown">
      <span class="indicator"></span>
      <a href="/${item.name}/">
        <span class="icon">
          <img src="${require("@/img/themes/default/folder.svg")}"/>
        </span>
        <span class="label">${item.name}</span>
      </a>
    </div>`;
      content.appendChild(contentItem);
    }
    treeList.appendChild(content);
  }

  // 解析JSONP配置
  function parseInfo(info) {
    const fileType = info.name.split(".").pop().toLocaleLowerCase();
    const type_text = ["txt", "md", "c", "cpp", "java", "json", "scala", "xml"];
    const type_bin = ["o", "exe", "class"];
    const type_archive = ["zip", "rar", "7z", "gz", "tar", "crx"];
    const type_image = ["bmp", "gif", "ico", "jpg", "png"];
    const type_audio = ["mp3", "wav", "ogg", "aac"];
    const type_video = ["mp4", "avi", "flv", "mkv", "mov", "mpg", "webm"];

    let icon;
    if (info.path_type == "Dir") {
      icon = "folder.svg";
    } else if (info.path_type == "File") {
      switch (true) {
        case type_text.includes(fileType):
          icon = "txt.svg";
          break;
        case type_bin.includes(fileType):
          icon = "bin.svg";
          break;
        case type_archive.includes(fileType):
          icon = "ar.svg";
          break;
        case type_image.includes(fileType):
          icon = "img.svg";
          break;
        case type_audio.includes(fileType):
          icon = "aud.svg";
          break;
        case type_video.includes(fileType):
          icon = "vid.svg";
          break;
        default:
          icon = "file.svg";
          break;
      }
    }

    let url = location.href;
    if (!url.endsWith("/")) url += "/";
    url = url + info.name;
    if (info.path_type == "Dir") url += "/";

    return {
      name: info.name,
      size: formatSize(info.size),
      date: formatDate(new Date(info.mtime), "yyyy-MM-dd hh-mm"),
      icon: require("@/img/themes/default/" + icon),
      href: url,
      isDir: info.path_type == "Dir",
    };
  }

  // 按钮_设置菜单
  function button_toggleToolbar() {
    const sidebar = document.querySelector("#sidebar");
    const sidebarToggle = document.querySelector("#sidebar-toggle");
    if (sidebar.className == "") {
      sidebar.className = "hidden";
      sidebarToggle.firstElementChild.src = require("./img/ui/sidebar.svg");
    } else {
      sidebar.className = "";
      sidebarToggle.firstElementChild.src = require("./img/ui/back.svg");
    }
  }

  // 按钮_搜索
  function button_search() {
    const search = document.querySelector("#search");
    const input = search.querySelector("input");
    if (toggleClass(search, "active")) {
      input.focus();
    }
  }

  // 输入_搜索框
  function input_search(value) {
    // 防抖处理
    const searchFileFun = debounce(searchFile, 300);
    searchFileFun(DATA, value);
  }

  // 搜索文件
  function searchFile(data, fileName) {
    const searchList = data.paths.filter((item) => {
      return item.name
        .toLocaleLowerCase()
        .includes(fileName.toLocaleLowerCase());
    });

    loadFileList({
      ...data,
      paths: searchList,
    });
  }

  /**
   * 按钮_改变视图
   * @param {String} type 类名后缀
   */
  function button_changeView(type) {
    const viewButton = document.querySelector(`#viewmode-${type}`);
    const view = document.querySelector("#view");
    const viewList = ["details", "grid", "icons"];

    viewList.forEach((item) => {
      removeClass(view, `view-${item}`);
      removeClass(document.querySelector(`#viewmode-${item}`), "active");
    });

    addClass(view, `view-${type}`);
    addClass(viewButton, "active");

    setLocalConfig("showView", type);
  }

  // 按钮_显示文件信息
  function button_showInfo(event, state = null) {
    if (event) {
      config.showInfo = !config.showInfo;
      setLocalConfig("showInfo", config.showInfo);
    }

    if (config.showInfo || state == true) {
      removeClass(control.view_info, "hidden");
      addClass(control.button_showInfo, "active");
    } else if (!config.showInfo || state == false) {
      addClass(control.view_info, "hidden");
      removeClass(control.button_showInfo, "active");
    }
  }

  // 按钮_显示目录树结构
  function button_showTree(event, state = null) {
    const treeView = document.querySelector("#tree");
    const button_treeView = document.querySelector("#view-tree");

    if (event) {
      config.showTree = !config.showTree;
      setLocalConfig("showTree", config.showTree);
    }

    if (config.showTree || state == true) {
      removeClass(treeView, "hidden");
      addClass(button_treeView, "active");
    } else if (!config.showTree || state == false) {
      addClass(treeView, "hidden");
      removeClass(button_treeView, "active");
    }
  }

  // 滑块_视图大小
  function button_viewmodeChange(value) {
    const size = [20, 40, 60, 80, 100, 150, 200, 250, 300, 350, 400];
    const view = document.querySelector("#view");

    size.forEach((item) => {
      removeClass(view, `view-size-${item}`);
    });
    addClass(view, `view-size-${size[value]}`);
  }

  // 按钮_隐藏上传列表
  function button_hiddenUpload() {
    removeClass(uploadControl.upbody, "upbody");
    addClass(uploadControl.upbody, "upbody-min");
    addClass(uploadControl.button_hidden, "hidden");
  }

  // 上传文件
  function uploadFile(files) {
    for (let file of files) {
      new Uploader(file, []).upload();
    }
  }

  // 显示加载框
  function showLoading(boolean) {
    const load = document.querySelector("#notification");
    if (boolean) {
      removeClass(load, "hidden");
    } else {
      addClass(load, "hidden");
    }
  }

  // 变更语言
  function changeLanguage(language) {
    for (const element in li8nElement) {
      li8nElement[element].innerHTML = language[element];
    }
  }
});

// 获取本地用户配置
function getLocalConfig(defaultConfig) {
  const config = localStorage.getItem("config")
    ? JSON.parse(localStorage.getItem("config"))
    : defaultConfig;
  return config;
}

/**
 * 设置配置
 */
function setLocalConfig(key, value) {
  config[key] = value;
  localStorage.setItem("config", JSON.stringify(config));
}
