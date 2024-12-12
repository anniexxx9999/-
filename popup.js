// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded');
  
  // 获取当前标签页信息
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    console.log('Got tab info:', tabs[0]);
    
    const tab = tabs[0];
    const url = tab.url;
    const title = tab.title;
    const favicon = tab.favIconUrl;

    // 显示网站标题
    document.getElementById('site-title').textContent = title;
    
    // 显示favicon
    if (favicon) {
      const faviconImg = document.getElementById('favicon');
      faviconImg.src = favicon;
      faviconImg.onerror = function() {
        this.style.display = 'none';
      };
    }

    // 清除已存在的二维码
    const qrcodeDiv = document.getElementById('qrcode');
    qrcodeDiv.innerHTML = '';

    // 生成二维码
    const qr = qrcode(0, 'H');
    qr.addData(url);
    qr.make();
    
    // 创建二维码图片
    const qrImg = new Image();
    qrImg.src = 'data:image/gif;base64,' + qr.createImgTag(4).match(/base64,([^"]*)/)[1];
    qrImg.width = 200;
    qrImg.height = 200;
    
    // 将二维码添加到页面
    qrcodeDiv.appendChild(qrImg);

    // 下载二维码
    const downloadBtn = document.getElementById('download-btn');
    console.log('Download button found:', downloadBtn);
    
    downloadBtn.addEventListener('click', function() {
      console.log('Download button clicked');
      
      try {
        // 创建文件名
        const filename = title.replace(/[\\/:*?"<>|]/g, '_') + '.png';
        
        // 使用chrome.downloads API下载
        chrome.downloads.download({
          url: qrImg.src,
          filename: filename,
          saveAs: false
        }, function(downloadId) {
          if (chrome.runtime.lastError) {
            console.error('Download failed:', chrome.runtime.lastError);
          } else {
            console.log('Download started:', downloadId);
          }
        });
      } catch (error) {
        console.error('Error during download:', error);
      }
    });
  });
}); 