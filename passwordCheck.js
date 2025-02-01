// GitHub API 配置
const apiURL = "https://api.github.com/repos/wxmsl/wxmsl/contents/baisima.json";
const token = "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"; // 替换为您的 Token

// 最大密码尝试次数
const maxAttempts = 3;
let attemptCount = 0;

// 获取 GitHub 上的内容
function fetchPassword() {
  return fetch(apiURL, {
    method: "GET",
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3+json"
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("无法访问 GitHub，请检查 Token 和 API 地址是否正确");
      }
      return response.json();
    })
    .then(data => {
      const decodedContent = atob(data.content); // 解码 base64 内容
      return JSON.parse(decodedContent).password; // 假设密码存储为 JSON 格式
    });
}

// 验证密码
function checkPassword() {
  document.getElementById("popupContainer").style.display = "none"; // 输入密码时隐藏主程序

  fetchPassword()
    .then(correctPassword => {
      // 密码验证循环
      function tryPassword() {
        const userPassword = prompt("请输入密码：", "");
        if (userPassword === null) {
          // 用户取消输入密码
          hideMainProgram();
          return;
        }
        if (userPassword === correctPassword) {
          alert("验证成功！");
          document.getElementById("popupContainer").style.display = "block"; // 恢复显示主程序
          loadFunctions(); // 加载功能代码
        } else {
          attemptCount++;
          alert(`此密码过期！还有 ${maxAttempts - attemptCount} 次尝试机会`);
          if (attemptCount < maxAttempts) {
            tryPassword(); // 如果还有机会，则继续提示输入密码
          } else {
            hideMainProgram(); // 超过最大尝试次数时，隐藏主程序
          }
        }
      }
      tryPassword();
    })
    .catch(error => {
      console.error("验证失败：", error);
      alert("验证失败，请购买密码！");
    });
}

// 隐藏主程序
function hideMainProgram() {
  document.getElementById("popupContainer").style.display = "none";
  alert("验证失败，请购买密码！");
}

// 动态加载 GitHub 上的 JavaScript 文件（1days.js）
function loadFunctions() {
  const jsURL = "https://api.github.com/repos/wxmsl/wxmsl/contents/CapybaraGO.js"; // GitHub 上的 1days.js 文件
  fetch(jsURL, {
    method: "GET",
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3+json"
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("无法加载 JavaScript 文件，请检查 Token 和 API 地址是否正确");
      }
      return response.json();
    })
    .then(data => {
      const decodedContent = atob(data.content); // 解码 base64 内容
      const scriptElement = document.createElement("script");
      scriptElement.type = "text/javascript";
      scriptElement.innerHTML = decodedContent; // 将解码的内容插入到脚本中
      document.body.appendChild(scriptElement); // 动态插入到页面中
    })
    .catch(error => {
      console.error("加载 JavaScript 文件失败：", error);
      alert("无法加载功能，请稍后再试！");
    });
}

// 页面加载时执行密码验证
window.onload = checkPassword;
