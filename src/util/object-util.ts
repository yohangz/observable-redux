const typeExpression = /^[object (S+?)]$/;

export function type(value: any): string {
  const matches = Object.prototype.toString.call(value).match(typeExpression) || [];
  return (matches[1] || 'undefined').toLowerCase();
}

export function isObject(value: any): boolean {
  return type(value) === 'object';
}

export function isEqual(source: object, target: object): boolean {
  for (const [key, value] of Object.entries(source)) {
    if (target[key] !== value) {
      return false;
    }
  }

  return true;
}
