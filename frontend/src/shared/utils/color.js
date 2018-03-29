// @flow

export const validateColorHex = color => /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color);
