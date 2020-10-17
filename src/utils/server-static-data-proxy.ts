export const setDocumentStaticData = (inputData: any) => {
  // server-side only
  const { data, toString } = createProxiedStaticData(inputData);

  addEventListener('DOMContentLoaded', () => {
    let staticDataElm = document.querySelector('[data-stencil-static="page.state"]') as HTMLScriptElement | null;
    if (!staticDataElm) {
      staticDataElm = document.createElement('script');
      staticDataElm.setAttribute('data-stencil-static', 'page.state');
      staticDataElm.setAttribute('type', 'application/json');
      document.body.appendChild(staticDataElm);
    }
    staticDataElm.textContent = toString();
  });

  return data;
};

export const createProxiedStaticData = (inputData: any) => {
  // server-side only
  const staticData = { root: null as any };

  const getterProxy = (obj: any, propName: any, propValue: any): any => {
    const valueType = typeof propValue;

    if (propValue == null || valueType === 'string' || valueType === 'number' || valueType === 'boolean') {
      return (obj[propName] = propValue);
    }

    if (valueType === 'function') {
      return (obj[propName] = Object.create(null));
    }

    if (Array.isArray(propValue)) {
      const childArr: any[] = [];
      obj[propName] = childArr;

      return propValue.map((arrValue, arrIndex) => {
        return getterProxy(childArr, arrIndex, arrValue);
      });
    }

    if (valueType === 'object') {
      const childObj: any = (obj[propName] = obj[propName] || Object.create(null));

      return new Proxy(propValue, {
        get(target, key, receiver) {
          const objValue = Reflect.get(target, key, receiver);
          return getterProxy(childObj, key, objValue);
        },
      });
    }

    return propValue;
  };

  const proxiedData = getterProxy(staticData, 'root', inputData);

  return {
    data: proxiedData,
    toString: () => JSON.stringify(staticData.root),
  };
};
