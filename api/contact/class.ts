export class Contact {
  public uuid: string;

  public lastname: string;
  public firstname: string;

  public insertion?: string;

  constructor(uuid: string, firstname: string, lastname: string, insertion?: string) {
    this.uuid = uuid;

    this.lastname = lastname;
    this.firstname = firstname;

    if (insertion) this.insertion;
  }

  get fullname(): string {
    return this.insertion ? `${this.firstname} ${this.insertion} ${this.lastname}` : `${this.firstname} ${this.lastname}`;
  }

  get keywords(): Array<String> {
    const array = [];

    array.push(this.firstname);
    array.push(this.lastname);

    if (this.insertion) array.push(this.insertion);

    return array;
  }
}