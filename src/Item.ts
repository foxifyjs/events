class Item {
  constructor(
    public readonly listener: (...args: any[]) => void,
    public readonly context: any,
    public readonly once: boolean,
  ) {}
}

export default Item;
