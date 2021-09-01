export function inHgtoHpa(ingh: number): number {
  return Math.floor(33.865 * ingh);
}

export function matchExact(r: RegExp, str: string): boolean {
  const match = str.match(r);  
  if (!match) return false;
  return match && str === match[0];
}