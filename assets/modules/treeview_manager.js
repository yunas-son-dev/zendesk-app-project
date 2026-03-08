const TreeViewManager = (function () {
  function renderTreeView(data, container) {
    container.innerHTML = "";
    const tree = document.createElement("ul");
    Object.entries(data).forEach(([key, value]) => {
      const node = createNode(key, value);
      tree.appendChild(node);
    });
    container.appendChild(tree);
  }

  function createNode(key, value) {
    const node = document.createElement("li");
    const keySpan = document.createElement("span");
    keySpan.textContent = key;
    keySpan.style.fontWeight = "bold";

    const valueSpan = document.createElement("span");

    if (Array.isArray(value) || (typeof value === "object" && value !== null)) {
      const toggle = document.createElement("span");
      toggle.textContent = "[+] ";
      toggle.style.cursor = "pointer";
      toggle.style.marginRight = "5px";
      toggle.addEventListener("click", () => {
        childList.style.display =
          childList.style.display === "none" ? "block" : "none";
        toggle.textContent =
          childList.style.display === "none" ? "[+] " : "[-] ";
      });

      node.appendChild(toggle);
      node.appendChild(keySpan);

      const childList = document.createElement("ul");
      childList.style.marginLeft = "20px";
      childList.style.display = "none";

      const entries = Array.isArray(value) ? value : Object.entries(value);
      entries.forEach((child) => {
        const childNode = Array.isArray(value)
          ? createNode("", child)
          : createNode(child[0], child[1]);
        childList.appendChild(childNode);
      });

      node.appendChild(childList);
    } else {
      valueSpan.textContent = value;
      valueSpan.style.marginLeft = "10px";
      valueSpan.style.cursor = "pointer";
      valueSpan.addEventListener("dblclick", () => {
        const textarea = document.createElement("textarea");
        textarea.value = value;

        if (node.contains(valueSpan)) {
          node.replaceChild(textarea, valueSpan);
        }

        let isSaved = false;

        const adjustTextareaHeight = () => {
          textarea.style.height = "auto";
          textarea.style.height = `${textarea.scrollHeight}px`;
        };

        adjustTextareaHeight();

        textarea.addEventListener("input", adjustTextareaHeight);

        textarea.addEventListener("keydown", (event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            isSaved = true;
            const newValue = textarea.value;
            valueSpan.textContent = newValue;
            if (node.contains(textarea)) {
              node.replaceChild(valueSpan, textarea);
            }
          }
        });

        textarea.addEventListener("blur", () => {
          if (!isSaved) {
            const newValue = textarea.value;
            valueSpan.textContent = newValue;
            if (node.contains(textarea)) {
              node.replaceChild(valueSpan, textarea);
            }
          }
        });

        textarea.focus();
        textarea.setSelectionRange(
          textarea.value.length,
          textarea.value.length
        );
      });
      node.appendChild(keySpan);
      node.appendChild(valueSpan);
    }

    return node;
  }

  return {
    renderTreeView,
  };
})();