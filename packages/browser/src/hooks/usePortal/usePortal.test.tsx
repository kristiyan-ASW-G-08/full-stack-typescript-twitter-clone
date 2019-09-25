import React, { useRef } from 'react';
import { renderHook } from '@testing-library/react-hooks';
import usePortal, {
  createRootElement,
  appendRootElement,
  getRootElement,
} from './usePortal';

describe('usePortal', () => {
  it('createRootElement: create a div element and returns it', () => {
    expect.assertions(3);
    const id = 'portal';
    const rootElement = createRootElement('portal');
    expect(rootElement).toBeTruthy();
    expect(rootElement.id).toMatch(id);
    expect(rootElement.tagName).toMatch('DIV');
  });
  it('appendRootElement: append a rootElement to the document body', () => {
    expect.assertions(1);
    const rootElement = document.createElement('div');
    rootElement.id = 'portal';
    appendRootElement(rootElement);
    expect(document.body.firstChild).toEqual(rootElement);
  });
  it('getRootElement: returns the rootElement', () => {
    expect.assertions(1);
    const id = 'portal';
    const element = document.createElement('div');
    element.id = id;
    const { result } = renderHook(() => useRef(element));
    const rootElement = getRootElement(result.current);
    expect(rootElement).toEqual(element);
  });
  it('usePortal: returns the rootElement', () => {
    expect.assertions(1);
    const id = 'portal';
    const { result } = renderHook(() => usePortal(id));
    expect(result.current.tagName).toMatch('DIV');
  });
});
