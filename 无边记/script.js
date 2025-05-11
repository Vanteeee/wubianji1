let selectedElement = null;

let canvas = document.getElementById('canvas');

// 拖拽功能
function makeDraggable(el) {
    let isDragging = false;
    let isResizing = false;
    let offsetX, offsetY, startWidth, startHeight;
  
    el.addEventListener('mousedown', function (e) {
      // 如果是 textarea，允许打字，但不阻止任何默认事件
      const isTextArea = e.target.tagName.toLowerCase() === 'textarea';
  
      // 只在不是点击 textarea 时，才触发选中 + 拖动 + 缩放
      if (!isTextArea) {
        e.preventDefault();
  
        // 设置选中样式
        if (selectedElement) {
          selectedElement.classList.remove('selected');
        }
        selectedElement = el;
        selectedElement.classList.add('selected');
  
        // 拖动 or 缩放
        if (e.shiftKey) {
          isResizing = true;
          startWidth = el.offsetWidth;
          startHeight = el.offsetHeight;
          offsetX = e.pageX;
          offsetY = e.pageY;
          el.style.cursor = 'nwse-resize';
        } else {
          isDragging = true;
          offsetX = e.offsetX;
          offsetY = e.offsetY;
          el.style.cursor = 'move';
          el.style.zIndex = Date.now();
        }
      } else {
        // 如果点击的是 textarea，则设置选中样式但不阻止焦点获取
        if (selectedElement) {
          selectedElement.classList.remove('selected');
        }
        selectedElement = el;
        selectedElement.classList.add('selected');
      }
    });
  
    window.addEventListener('mousemove', function (e) {
      if (isDragging) {
        el.style.left = (e.pageX - offsetX) + 'px';
        el.style.top = (e.pageY - offsetY) + 'px';
      }
      if (isResizing) {
        const deltaX = e.pageX - offsetX;
        const deltaY = e.pageY - offsetY;
        el.style.width = (startWidth + deltaX) + 'px';
        el.style.height = (startHeight + deltaY) + 'px';
      }
    });
  
    window.addEventListener('mouseup', function () {
      isDragging = false;
      isResizing = false;
      el.style.cursor = 'default';
    });
  }
  
// 添加文字便签
function addTextNote() {
    const note = document.createElement('div');
    note.className = 'note';
    note.style.left = '100px';
    note.style.top = '100px';
    note.style.width = '200px';
    note.style.height = '100px';
  
    const display = document.createElement('div');
    display.className = 'text-display';
    display.textContent = '双击编辑文字...';
    display.style.padding = '10px';
    display.style.fontSize = '14px';
    display.style.width = '100%';
    display.style.height = '100%';
    display.style.overflow = 'auto';
    display.style.userSelect = 'none';
  
    const textarea = document.createElement('textarea');
    textarea.style.display = 'none';
    textarea.style.width = '100%';
    textarea.style.height = '100%';
    textarea.style.padding = '10px';
    textarea.style.fontSize = '14px';
    textarea.style.boxSizing = 'border-box';
  
    // 双击 note 进入编辑
    note.ondblclick = () => {
      textarea.value = display.textContent.trim();
      display.style.display = 'none';
      textarea.style.display = 'block';
      textarea.focus();
    };
  
    note.appendChild(display);
    note.appendChild(textarea);
    makeDraggable(note);
    canvas.appendChild(note);
  }
  

// 添加图片
function addImageBlock() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';
  
    input.addEventListener('change', function () {
      const file = input.files[0];
      if (!file) return;
  
      const reader = new FileReader();
      reader.onload = function (e) {
        const container = document.createElement('div');
        container.className = 'note';
        container.style.left = '150px';
        container.style.top = '150px';
        container.style.width = '200px';
        container.style.height = '200px';
  
        const img = document.createElement('img');
        img.src = e.target.result;
        img.className = 'image-block';
  
        // 双击容器触发替换图片
        container.ondblclick = () => {
          const replaceInput = document.createElement('input');
          replaceInput.type = 'file';
          replaceInput.accept = 'image/*';
          replaceInput.style.display = 'none';
  
          replaceInput.onchange = function () {
            const newFile = replaceInput.files[0];
            if (!newFile) return;
            const newReader = new FileReader();
            newReader.onload = function (ev) {
              img.src = ev.target.result;
            };
            newReader.readAsDataURL(newFile);
          };
  
          document.body.appendChild(replaceInput);
          replaceInput.click();
        };
  
        container.appendChild(img);
        makeDraggable(container);
        canvas.appendChild(container);
      };
  
      reader.readAsDataURL(file);
    });
  
    document.body.appendChild(input);
    input.click();
  }
  document.addEventListener('mousedown', (e) => {
    const editingTextareas = document.querySelectorAll('.note textarea');
  
    editingTextareas.forEach(textarea => {
      if (
        textarea.style.display === 'block' &&
        !textarea.contains(e.target) &&
        !textarea.parentNode.contains(e.target)
      ) {
        const display = textarea.previousElementSibling;
        display.textContent = textarea.value.trim() || '（空）';
        display.style.display = 'block';
        textarea.style.display = 'none';
      }
    });
  });
  