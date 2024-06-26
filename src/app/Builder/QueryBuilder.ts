import { FilterQuery, Query } from "mongoose";

class QueryBuilder<T> {
  constructor(
    public modelQuery: Query<T[], T>,
    public query: Record<string, unknown>
  ) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  // methods
  search(searchAbleFields: string[]) {
    if (this?.query && typeof this?.query?.searchTerm === "string") {
      this.modelQuery = this?.modelQuery.find({
        $or: searchAbleFields.map(
          (item) =>
            ({
              [item]: { $regex: this?.query?.searchTerm, $options: "i" },
            }) as FilterQuery<T>
        ),
      });
    }

    return this;
  }

  filter() {
    const queryObj = { ...this.query };
    const excludeFields = ["searchTerm", "sort", "limit", "page", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);

    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);
    return this;
  }

  sort() {
    let sort = "-createdAt";
    if (this?.query && typeof this?.query?.sort === "string") {
      sort = (this?.query?.sort as string).split(",").join(" ");
    }

    this.modelQuery = this.modelQuery.sort(sort);
    return this;
  }

  paginate() {
    // limit section
    let limit = 10;
    if (this?.query?.limit) {
      limit = this?.query.limit as number;
    }
    // const limitQuery = sortQuery.limit(limit);

    // skip section
    const page = this?.query?.page;
    let skip = 0;
    if (this?.query?.page) {
      skip = (Number(page) - 1) * limit;
    }
    this.modelQuery = this.modelQuery.limit(limit).skip(skip);
    return this;
  }

  fields() {
    // it  should be get   ..fields:"name email gender"
    let fields = "-__v";
    if (this?.query?.fields) {
      fields = (this?.query?.fields as string).split(",").join(" ");
    }
    if (this?.modelQuery) {
      this.modelQuery.select(fields);
    }
    return this;
  }
}

export default QueryBuilder;
