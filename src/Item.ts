class Item {
  constructor(
    public listener: (...args: any[]) => void,
    public context: any,
    public once: boolean,
  ) {}
}

export default Item;
