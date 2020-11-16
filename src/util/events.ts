interface ChangeEventTarget extends EventTarget {
  value?: string,
}

export interface ChangeEvent extends Event {
  target: ChangeEventTarget,
}

MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

export const trackChange = function (element: Node) {
  var observer = new MutationObserver(function (mutations, observer) {
    if (mutations[0].attributeName == "value") {
      element.dispatchEvent(new Event("change"));
    }
  });
  observer.observe(element, {
    attributes: true
  });
}