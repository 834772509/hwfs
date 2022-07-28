import { formatSize, formatDate, formatPercent } from "./utils";

export default class Uploader {
  /**
   * @type number 上传ID
   */
  idx;
  /**
   * @type File
   */
  file;
  /**
   * @type String 文件名
   */
  name;
  /**
   * @type String 上传路径
   */
  url;
  /**
   * @type Element 超链接
   */
  uploadHref;
  /**
   * @type Element 上传状态
   */
  uploadStatus;
  /**
   * @type Element 上传进度条
   */
  upProgress;
  /**
   * @type number
   */
  uploaded = 0;
  /**
   * @type number
   */
  lastUptime = 0;
  static globalIdx = 0;
  constructor(file, dirs) {
    this.name = [...dirs, file.name].join("/");
    this.idx = Uploader.globalIdx++;
    this.file = file;

    const url = location.href;
    // const url = "http://127.0.0.1:5000/";
    if (!url.endsWith("/")) url += "/";
    this.url = url + this.name;
  }

  upload() {
    const { file, url, idx, name } = this;
    console.log(file);

    const itemList = document.querySelector("#view").querySelector("#items");

    const uploadLi = document.createElement("li");
    uploadLi.className = "item folder";
    uploadLi.id = `upitem${idx}`;
    uploadLi.innerHTML = `
      <a id="uploadHref${idx}" download>
        <span class="icon square">
          <img src="${require("@/img/themes/default/file.svg")}" alt="folder"/>
        </span>
        <span class="icon landscape">
          <img src="${require("@/img/themes/default/file.svg")}" alt="folder"/>
        </span>
        <span class="label" title="${name}">${name}</span>
        <span id="uploadStatus${idx}" class="date"></span>
        <span class="size">${formatSize(file.size)}</span>
        <div id="upProgress${idx}" class="upprogress"></div>
     </a>
    `;
    itemList.appendChild(uploadLi);
    this.uploadStatus = document.getElementById(`uploadStatus${idx}`);
    this.upProgress = document.getElementById(`upProgress${idx}`);
    this.uploadHref = document.getElementById(`uploadHref${idx}`);
    this.uploadHref.removeAttribute("href");
    this.lastUptime = Date.now();

    // 开始上传
    const ajax = window.XMLHttpRequest
      ? new XMLHttpRequest()
      : new ActiveXObject("Microsoft.XMLHTTP");
    ajax.upload.addEventListener("progress", (e) => this.progress(e), false);
    ajax.addEventListener("readystatechange", () => {
      if (ajax.readyState === 4) {
        if (ajax.status >= 200 && ajax.status < 300) {
          this.complete();
        } else {
          this.fail();
        }
      }
    });
    ajax.addEventListener("error", () => this.fail(), false);
    ajax.addEventListener("abort", () => this.fail(), false);
    ajax.open("PUT", url);
    ajax.send(file);
  }

  // 处理进度
  progress(event) {
    let now = Date.now();
    let speed =
      ((event.loaded - this.uploaded) / (now - this.lastUptime)) * 1000;

    const speedText = formatSize(speed).toLocaleLowerCase();
    const progress = formatPercent((event.loaded / event.total) * 100);
    const duration = formatDate(
      new Date(((event.total - event.loaded) / speed) * 1000),
      "mm:ss"
    );

    this.uploadStatus.innerHTML = `${speedText}/s  ${progress} ${duration}`;
    this.upProgress.style.width = progress;
    this.uploaded = event.loaded;
    this.lastUptime = now;
  }

  // 上传完成
  complete() {
    this.uploadStatus.innerHTML = formatDate(
      new Date(this.file.lastModified),
      "yyyy-MM-dd hh-mm"
    );
    this.upProgress.style.display = "none";
    this.upProgress.style.width = 0;
    this.uploadHref.href = this.url;
  }

  // 上传失败
  fail() {
    this.uploadStatus.innerHTML = "上传失败";
    this.upProgress.style.display = "none";
    this.upProgress.style.width = 0;
  }
}
