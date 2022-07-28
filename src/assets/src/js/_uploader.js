import { formatSize, formatDate, formatPercent, formatDuration } from "./utils";

export default class Uploader {
  /**
   * @type number
   */
  idx;
  /**
   * @type File
   */
  file;
  /**
   * @type string
   */
  name;
  /**
   * @type Element
   */
  uploadStatus;
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
  }

  upload() {
    const { file, idx, name } = this;

    let url = location.href;
    if (!url.endsWith("/")) url += "/";
    url = url + name;

    const uploadContent = document.querySelector(".upcontent");

    const upitem = document.createElement("div");
    upitem.id = `upitem${idx}`;
    upitem.className = "upitem";
    upitem.innerHTML = `
    <img class="icon" src="${require("@/img/themes/default/file.svg")}" alt="uploadimg" />
    <div class="upinfo">
      <div class="upname">${name}</div>
      <div id="uploadStatus${idx}" class="upstate"></div>
    </div>
    <img class="action" id="action${idx}" src="${require("@/img/ui/cancal.svg")}" alt="action" />
    <div class="upprogress"></div>
    `;
    // <img id="action" src="/src/img/ui/success.svg" alt="action" />
    uploadContent.appendChild(upitem);
    this.uploadStatus = document.getElementById(`uploadStatus${idx}`);

    document.getElementById(`action${idx}`).addEventListener("click", (e) => {
      document.querySelector(`#upitem${idx}`).remove();
    });

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

    console.log((event.total - event.loaded) / speed);

    const duration = formatDate(
      new Date((event.total - event.loaded) / speed),
      "mm:ss"
    );
    // const duration = formatDuration((event.total - event.loaded) / speed);
    // 118 MB / 19 MB 剩余 10分钟 00秒

    this.uploadStatus.innerHTML = `${speedText}/s  ${progress} 剩余: ${duration}`;
    this.uploaded = event.loaded;
    this.lastUptime = now;
  }

  // 上传完成
  complete() {
    console.log("上传完成");
    this.uploadStatus.innerHTML = "上传完成";
  }

  // 上传失败
  fail() {
    console.log("上传失败");
    this.uploadStatus.innerHTML = "上传失败";
  }
}
