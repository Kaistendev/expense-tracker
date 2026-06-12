export class DateRange {
  private constructor(
    private readonly _start: Date,
    private readonly _end: Date
  ) {}

  static create(start: Date, end: Date): DateRange {
    if (isNaN(start.getTime())) {
      throw new Error("Start date is invalid");
    }
    if (isNaN(end.getTime())) {
      throw new Error("End date is invalid");
    }
    if (start > end) {
      throw new Error("Start date must be before or equal to end date");
    }
    return new DateRange(new Date(start), new Date(end));
  }

  static fromStrings(start: string, end: string): DateRange {
    return DateRange.create(new Date(start), new Date(end));
  }

  get start(): Date {
    return new Date(this._start);
  }

  get end(): Date {
    return new Date(this._end);
  }

  contains(date: Date): boolean {
    const d = new Date(date);
    return d >= this._start && d <= this._end;
  }

  overlaps(other: DateRange): boolean {
    return this._start <= other._end && this._end >= other._start;
  }

  equals(other: DateRange): boolean {
    return (
      this._start.getTime() === other._start.getTime() &&
      this._end.getTime() === other._end.getTime()
    );
  }

  toString(): string {
    return `${this._start.toISOString()} - ${this._end.toISOString()}`;
  }
}
